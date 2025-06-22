"use server";

import { db } from "@/database";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { queueEmail } from "../workflow";

export const signUp = async (params: AuthCredentials) => {
  const {
    firstName,
    lastName,
    email,
    password,
    universityId,
    userType,
  } = params;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      universityIdCard: universityId, // match schema
      userType,
      isActive: true,
    });

    // Auto sign in after sign up
    // Send welcome email
    await queueEmail({
      email,
      subject: "🎓 Welcome to CU LMS",
      html: `<p>Hi ${firstName},</p><p>Your account was successfully created. You can now access CU Library LMS.</p>`,
    });

    return { success: true };
  } catch (error) {
    console.log(error, "Sign Up error");
    return { success: false, error: "Sign Up error" };
  }
};  

import { getServerSession } from "next-auth"; // or wherever you defined it
import { authOptions } from "@/auth";

export const auth = async () => getServerSession(authOptions);
