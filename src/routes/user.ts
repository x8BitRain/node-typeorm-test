import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJWT } from "../middleware/checkJWT";
import { checkRole } from "../middleware/checkRole";

const router = Router();

// Get all users
router.get("/", [checkJWT, checkRole(["admin"])], UserController.listAll);

// Get one user
router.get(
	"/:id",
	[checkJWT, checkRole(["admin", "normal"])],
	UserController.getUser
);

// Create a new user
router.post("/", UserController.createUser);

// Edit user
router.patch(
	"/:id",
	[checkJWT, checkRole(["admin", "normal"])],
	UserController.editUser
);

// Delete user
router.delete(
	"/:id",
	[checkJWT, checkRole(["admin", "normal"])],
	UserController.deleteUser
);

export default router;