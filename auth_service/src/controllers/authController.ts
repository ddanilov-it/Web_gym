import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createAdmin, getAdminByUsername } from "../repositories/adminRepository";
import { hashPassword, comparePassword } from "../services/passwordService";
import { generateToken } from "../services/authServices";

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
export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }
  const hashedPassword = await hashPassword(password);
  const adminId = await createAdmin(username, hashedPassword);
  res.status(201).json({ message: "Admin registered", adminId });
});

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
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }
  const admin = await getAdminByUsername(username);
  if (!admin) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const token = generateToken(admin.id);
  res.json({ message: "Login successful", token });
});
