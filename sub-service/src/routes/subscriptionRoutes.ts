import express from "express";
import { addSubscription, removeSubscription, getSubscriptions } from "../controllers/subscriptionController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getSubscriptions);
router.post("/", authenticateUser, addSubscription);
router.delete("/:id", authenticateUser, removeSubscription);

export default router;
