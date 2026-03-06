import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define auth-related routes
import authActions from "./modules/auth/authActions";
import userActions from "./modules/user/userActions";
import authService from "./utils/auth";

router.post("/api/login", authActions.login);
router.post("/api/users", authService.hashPassword, userActions.add);

// Define note-related routes
import noteActions from "./modules/note/noteActions";

router.get("/api/notes", authService.optionalVerifyToken, noteActions.browse);
router.get("/api/notes/:id(\\d+)", noteActions.read);
router.get("/api/notes/:slug", noteActions.readBySlug);
router.post("/api/notes/:slug/verify-password", noteActions.verifyPassword);

// Protected routes
router.use(authService.verifyToken);

router.post("/api/notes", noteActions.add);
router.put("/api/notes/:id", noteActions.edit);
router.delete("/api/notes/:id", noteActions.remove);

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);

// Favorite routes
import favoriteActions from "./modules/favorite/favoriteActions";
router.get("/api/favorites", favoriteActions.browse);
router.post("/api/favorites", favoriteActions.add);
router.delete("/api/favorites/:id", favoriteActions.remove);

/* ************************************************************************* */

export default router;
