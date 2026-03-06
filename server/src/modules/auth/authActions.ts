import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import userRepository from "../user/userRepository";


const login: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.readByEmail(email);

        if (user == null) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const verified = await argon2.verify(user.password as string, password);

        if (verified) {
            delete user.password;

            const token = jwt.sign(
                { sub: user.id, role: user.role, email: user.email },
                process.env.APP_SECRET as string,
                { expiresIn: "24h" },
            );

            res.cookie('token', `${token}`, {
                expires: new Date(Date.now() + 24 * 3600000)
            });
            res.status(200).json({ message: "Connexion reussi" });
            return;
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    } catch (err) {
        next(err);
    }
};

export default { login };
