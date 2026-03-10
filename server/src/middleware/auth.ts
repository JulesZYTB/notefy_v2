import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import userRepository from "../modules/user/userRepository";

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

const verifyToken: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.get("Authorization")?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Token manquant" });
            return;
        }

        const decoded = jwt.verify(token, process.env.APP_SECRET as string) as unknown as {
            sub: number;
            role: string;
            email: string
        };

        req.auth = decoded;

        const user = await userRepository.readByEmail(req.auth.email);

        if (user == null) {
            res.status(401).json({ message: "Utilisateur non trouvé" });
            return;
        }

        req.user = user;

        next();
    } catch (err) {
        // console.error("Erreur de token:", err);
        res.sendStatus(401);
    }
};


const optionalVerifyToken: RequestHandler = (req, res, next) => {
    try {
        const authorization = req.get("Authorization");

        if (authorization != null) {
            const [type, token] = authorization.split(" ");

            if (type === "Bearer") {
                req.auth = jwt.verify(token, process.env.APP_SECRET as string) as unknown as {
                    sub: number;
                    role: string;
                    email: string
                };
            }
        }

        next();
    } catch (err) {
        // If the token is invalid or expired, we just ignore it in optional verification
        next();
    }
};

export default { hashPassword, verifyToken, optionalVerifyToken };
