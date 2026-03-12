
import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define auth-related routes
import authActions from "./modules/auth/authActions";
import userActions from "./modules/user/userActions";
import authService from "./middleware/auth";

router.post("/login", authActions.login);
router.post("/users", authService.hashPassword, userActions.add);
router.get("/me", authService.verifyToken, userActions.readCurrentUser);

// Define note-related routes
import noteActions from "./modules/note/noteActions";

router.get("/notes", authService.optionalVerifyToken, noteActions.browse);
router.get("/notes/:id(\\d+)", authService.optionalVerifyToken, noteActions.read);
router.get("/notes/:slug", authService.optionalVerifyToken, noteActions.readBySlug);
router.post("/notes/:slug/verify-password", authService.optionalVerifyToken, noteActions.verifyPassword);

// Protected routes
router.use(authService.verifyToken);

router.post("/notes", noteActions.add);
router.put("/notes/:id", noteActions.edit);
router.delete("/notes/:id", noteActions.remove);

router.get("/users", userActions.browse);
router.get("/users/:id", userActions.read);

// Favorite routes
import favoriteActions from "./modules/favorite/favoriteActions";
router.get("/favorites", favoriteActions.browse);
router.post("/favorites", favoriteActions.add);
router.delete("/favorites/:id", favoriteActions.remove);

/* ************************************************************************* */

export default router;
