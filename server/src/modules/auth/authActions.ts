import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import userRepository from "../user/userRepository";

const login: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.readByEmail(email);

        if (user == null) {
            res.sendStatus(422);
            return;
        }

        const verified = await argon2.verify(user.password as string, password);

        if (verified) {
            delete user.password;

            const token = jwt.sign(
                { sub: user.id, role: user.role },
                process.env.APP_SECRET as string,
                { expiresIn: "24h" },
            );

            res.json({ token, user });
        } else {
            res.sendStatus(422);
        }
    } catch (err) {
        next(err);
    }
};

export default { login };
