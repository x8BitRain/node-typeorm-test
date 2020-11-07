import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJWT } from "../middleware/checkJWT";

const router = Router();

// Login Route
router.post("/login", AuthController.login);

// Change Password Route
router.post("/change-password", [checkJWT], AuthController.changePassword);

export default router;