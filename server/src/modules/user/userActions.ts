import type { RequestHandler } from "express";
import userRepository from "./userRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname || null,
      lastname: req.body.lastname || null,
      role: req.body.role || "user",
    };

    const insertId = await userRepository.create(newUser);
    res.status(201).json({ insertId });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Duplicate")) {
        res.status(409).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Server error" });
      }
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

const readCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (user == null) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      res.status(200).json({ message: "Authorized" });
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, readCurrentUser };
