import crypto from "node:crypto";
import argon2 from "argon2";
import type { RequestHandler } from "express";

import noteRepository from "./noteRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).auth?.sub;
    const notes = await noteRepository.readAll(userId);

    const safeNotes = notes.map(n => {
      const { password, ...noteWithoutPassword } = n;
      return { ...noteWithoutPassword, hasPassword: !!password };
    });

    res.json(safeNotes);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const noteId = Number(req.params.id);
    const note = await noteRepository.read(noteId);

    if (note == null) {
      res.sendStatus(404);
    } else {
      res.json(note);
    }
  } catch (err) {
    next(err);
  }
};

const readBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const note = await noteRepository.readBySlug(slug);

    if (note == null) {
      res.sendStatus(404);
    } else {
      const { password, ...noteWithoutPassword } = note;
      const hasPassword = !!password;

      // If there is a password and the user is NOT the owner (if owner exists)
      // For now, let's say if it has a password, we hide content until verified
      if (hasPassword) {
        res.json({ ...noteWithoutPassword, content: null, hasPassword: true });
      } else {
        res.json({ ...noteWithoutPassword, hasPassword: false });
      }
    }
  } catch (err) {
    next(err);
  }
};

const verifyPassword: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { password } = req.body;
    const note = await noteRepository.readBySlug(slug);

    if (note == null) {
      res.sendStatus(404);
      return;
    }

    if (!note.password) {
      res.json(note);
      return;
    }

    const verified = await argon2.verify(note.password, password);

    if (verified) {
      const { password: _, ...noteWithoutPassword } = note;
      res.json({ ...noteWithoutPassword, hasPassword: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { name, content, is_private, linkshare, password } = req.body;
    const userId = (req as any).auth?.sub;

    const slug = crypto.randomBytes(5).toString("hex");

    let hashedPassword = null;
    if (password) {
      hashedPassword = await argon2.hash(password);
    }

    const newNote = {
      name: name || "Untitled Note",
      slug: slug,
      is_private: is_private ?? false,
      linkshare: linkshare ?? false,
      password: hashedPassword,
      user_id: userId || null,
    };

    const insertId = await noteRepository.create(newNote, content || "");
    res.status(201).json({ insertId, slug });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const noteId = Number(req.params.id);
    const { name, content, is_private, linkshare, password } = req.body;

    let hashedPassword = undefined;
    if (password !== undefined) {
      hashedPassword = password ? await argon2.hash(password) : null;
    }

    const updatedNote = {
      name,
      content,
      is_private,
      linkshare,
      password: hashedPassword,
    };

    const affectedRows = await noteRepository.update(noteId, updatedNote);

    if (affectedRows) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

const remove: RequestHandler = async (req, res, next) => {
  try {
    const noteId = Number(req.params.id);
    const affectedRows = await noteRepository.delete(noteId);

    if (affectedRows) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, readBySlug, verifyPassword, add, edit, remove };
