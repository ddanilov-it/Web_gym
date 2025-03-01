import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createAdmin, getAdminByEmail, getAllAdmins as getAdminsFromRepo } from "../repositories/adminRepository";
import { hashPassword, comparePassword } from "../services/passwordService";
import { generateToken } from "../services/authServices";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const handleError = (res: Response, statusCode: number, message: string, details?: any) => {
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
      details,
    },
  });
};

export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    handleError(res, 400, "Validation error", validation.error.format());
    return;
  }

  const { username, password, firstName, lastName, email } = validation.data;

  const existingEmail = await getAdminByEmail(email);
  if (existingEmail) {
    handleError(res, 409, "Email is already registered");
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);
    const adminId = await createAdmin(username, hashedPassword, firstName, lastName, email);

    res.status(201).json({
      message: "Admin registered successfully",
      adminId,
    });
  } catch (error) {
    console.error("Error during admin registration:", error);
    handleError(res, 500, "Internal server error");
  }
});

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    handleError(res, 400, "Validation error", validation.error.format());
    return;
  }

  const { email, password } = validation.data;

  const admin = await getAdminByEmail(email);
  if (!admin) {
    handleError(res, 401, "Invalid credentials");
    return;
  }

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    handleError(res, 401, "Invalid credentials");
    return;
  }

  try {
    const token = generateToken(admin.id, admin.email);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    handleError(res, 500, "Internal server error");
  }
});

export const getAllAdmins = asyncHandler(async (req: Request, res: Response) => {
  try {
    const admins = await getAdminsFromRepo();
    res.json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    handleError(res, 500, "Internal server error");
  }
});
