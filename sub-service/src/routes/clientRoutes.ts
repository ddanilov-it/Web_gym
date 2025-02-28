import express from "express";
import { addClient, removeClient, getClients } from "../controllers/clientControllers";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getClients);
router.post("/", authenticateUser, addClient);
router.delete("/:id", authenticateUser, removeClient);

export default router;
