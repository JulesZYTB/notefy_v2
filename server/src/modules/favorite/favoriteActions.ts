import type { RequestHandler } from "express";
import favoriteRepository from "./favoriteRepository";

const add: RequestHandler = async (req, res, next) => {
    try {
        const userId = (req as any).auth.sub;
        const { noteId } = req.body;

        if (!noteId) {
            res.sendStatus(400);
            return;
        }

        await favoriteRepository.create(userId, noteId);
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
};

const browse: RequestHandler = async (req, res, next) => {
    try {
        const userId = (req as any).auth.sub;
        const favorites = await favoriteRepository.readAllByUser(userId);

        res.json(favorites);
    } catch (err) {
        next(err);
    }
};

const remove: RequestHandler = async (req, res, next) => {
    try {
        const userId = (req as any).auth.sub;
        const noteId = Number(req.params.id);

        const affectedRows = await favoriteRepository.delete(userId, noteId);

        if (affectedRows === 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    } catch (err) {
        next(err);
    }
};

export default { add, browse, remove };
