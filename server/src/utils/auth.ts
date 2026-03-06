import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            res.sendStatus(400);
            return;
        }

        const hashedPassword = await argon2.hash(password, hashingOptions);

        req.body.password = hashedPassword;

        next();
    } catch (err) {
        next(err);
    }
};

const verifyToken: RequestHandler = (req, res, next) => {
    try {
        const authorization = req.get("Authorization");
        console.log(authorization)
        if (authorization == null) {
            throw new Error("Authorization header is missing");
        }

        const [type, token] = authorization.split(" ");

        if (type !== "Bearer") {
            throw new Error("Authorization type is not Bearer");
        }

        (req as any).auth = jwt.verify(token, process.env.APP_SECRET as string);

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.warn("JWT expired:", err.expiredAt);
        } else if (err instanceof jwt.JsonWebTokenError) {
            console.warn("Invalid JWT:", err.message);
        } else {
            console.error(err);
        }
        res.sendStatus(401);
    }
};

const optionalVerifyToken: RequestHandler = (req, res, next) => {
    try {
        const authorization = req.get("Authorization");

        if (authorization != null) {
            const [type, token] = authorization.split(" ");

            if (type === "Bearer") {
                (req as any).auth = jwt.verify(token, process.env.APP_SECRET as string);
            }
        }

        next();
    } catch (err) {
        // If the token is invalid or expired, we just ignore it in optional verification
        next();
    }
};

export default { hashPassword, verifyToken, optionalVerifyToken };
