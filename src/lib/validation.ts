import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50, "First name is too long"),
  lastName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50, "Last name is too long"),
  middleName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50, "Last name is too long").optional(),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one letter and one number"),
  universityId: z.string().trim().min(1, "University ID is required"),
  userType: z.enum(["student", "teacher", "admin"], { required_error: "User type is required" }),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long"),
});