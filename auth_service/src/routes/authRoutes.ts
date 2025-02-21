import express, { Request, Response } from "express";
import { registerAdmin, loginAdmin, getAllAdmins } from "../controllers/authController";  // Path to controller
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();  // Proper initialization of the router

// Define routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/admins", authenticateUser, getAllAdmins);

router.get("/protected", authenticateUser, (req: Request, res: Response) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default router;
