import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new admin
 *     description: Registers an admin with a username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Missing username or password
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerAdmin);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login an admin
 *     description: Logs in an admin with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing username or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginAdmin);

export default router;
