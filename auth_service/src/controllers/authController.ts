import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createAdmin, getAdminByEmail, getAllAdmins as getAdminsFromRepo } from "../repositories/adminRepository";
import { hashPassword, comparePassword } from "../services/passwordService";
import { generateToken } from "../services/authServices";

/**
 * Register a new admin
 */
export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, email } = req.body;

  if (!username || !password || !email || !firstName || !lastName) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const hashedPassword = await hashPassword(password);
  const adminId = await createAdmin(username, hashedPassword, firstName, lastName, email);

  res.status(201).json({ message: "Admin registered", adminId });
});

/**
 * Login an admin using email
 */
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  console.log("GOOOOOOOOOOOOOOOOOD");
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await getAdminByEmail(email);
  if (!admin) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  console.log("GOOOOOOOOOOOOOOOOOD");
  const token = generateToken(admin.id, admin.email);
  console.log("GOOOOOOOOOOOOOOOOOD");
  res.json({ message: "Login successful", token });
});

/**
 * Get all admins
 */
export const getAllAdmins = asyncHandler(async (req: Request, res: Response) => {
  const admins = await getAdminsFromRepo();
  res.json({ admins });
});
