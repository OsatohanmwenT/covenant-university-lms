import { z } from "zod";

const allowedDomains = ["stu.cu.edu.ng", "covenantuniversity.edu.ng"];

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name is too long"),

    email: z
      .string()
      .trim()
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number"
      ),

    role: z.enum(["student", "staff", "admin", "faculty"], {
      required_error: "User type is required",
    }),
  })
  .refine((data) => {
    const domain = data.email.split("@")[1];

    // 1. Must be a valid CU domain
    const isValidDomain = allowedDomains.some((allowed) =>
      domain.endsWith(allowed)
    );
    if (!isValidDomain) return false;

    // 2. Prevent staff/faculty from using student email
    if (
      (data.role === "staff" || data.role === "faculty") &&
      domain === "stu.cu.edu.ng"
    ) {
      return false;
    }

    return true;
  }, {
    message: "Role does not match email domain",
    path: ["email"], // shows the error under the email field
  });

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .refine((email) => {
      const domain = email.split("@")[1];
      return allowedDomains.some((allowed) => domain.endsWith(allowed));
    }, {
      message: "Only Covenant University emails are allowed",
    }),
     password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one letter and one number"),
});

export const resourceSchema = z.object({
  uniqueIdentifier: z.string().min(2),
  title: z.string().min(2),
  author: z.string().min(2),
  resourceImage: z.string().nonempty(),
  publicationDate: z.string().min(4),
  category: z.string().min(2),
  format: z.string().min(2),
  location: z.string().min(2),
});