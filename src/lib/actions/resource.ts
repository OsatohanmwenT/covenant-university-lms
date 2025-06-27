"use server";
import { db } from "@/database";
import { users, loan, fine, resources } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import { queueEmail } from "../workflow";

export const borrowResource = async (params: {
  resourceId: number | undefined;
  userId: number | undefined;
}) => {
  const { resourceId, userId } = params;

  if (!resourceId || !userId) {
    return { success: false, error: "Resource ID and User ID are required" };
  }

  try {
    // Check if the resource is already borrowed
    const existingLoan = await db
      .select()
      .from(loan)
      .where(eq(loan.resourceId, resourceId))
      .limit(1);

    if (existingLoan.length > 0) {
      return { success: false, error: "Resource is already borrowed" };
    }

    // 1. Check user and type
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    if (!user) return { success: false, error: "User not found" };

    // 2. Check for unpaid fines
    const unpaidFines = await db
      .select()
      .from(fine)
      .innerJoin(loan, eq(fine.loanId, loan.loanId))
      .where(
        and(
          eq(loan.userId, userId), // filtering by the current user
          eq(fine.isPaid, false) // unpaid fines
        )
      );

    if (unpaidFines.length > 0) {
      return {
        success: false,
        error: "You have unpaid fines. Please settle them before borrowing.",
      };
    }

    // 3. Set due date based on user type
    const days = user.role === "student" ? 20 : 28;
    const dueDate = dayjs().add(days, "day").toDate();

    // Insert new loan record

    const resourceResult = await db
      .select({ title: resources.title })
      .from(resources)
      .where(eq(resources.resourceId, resourceId))
      .limit(1);

    const resource = resourceResult[0];
    const bookTitle = resource?.title || "Untitled Book";

    await db.insert(loan).values({
      resourceId,
      userId: userId,
      dateBorrowed: dayjs().toDate(),
      dueDate: dueDate,
      status: "borrowed",
    });

    // Try to send email, but don't fail the borrowing if email fails
    try {
      await queueEmail({
        email: user.email,
        subject: "📚 Book Borrowed Successfully – CU LMS",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
            <h2 style="color: #4CAF50;">Book Borrowed Successfully</h2>
            <p>Hi ${user.fullName},</p>

        <p>
          You have successfully borrowed the book titled 
          <strong>${bookTitle}</strong> from the Covenant University Library.
        </p>

        <p>
          <strong>Date Borrowed:</strong> ${dayjs().format("MMMM D, YYYY")}<br/>
          <strong>Due Date:</strong> ${dayjs(dueDate).format("MMMM D, YYYY")}
        </p>

        <p>
          Please make sure to return the book on or before the due date to avoid any penalties.
        </p>

        <p>Happy reading! 📖</p>

        <hr style="margin: 24px 0;" />
        <p style="font-size: 12px; color: #888;">
          This is an automated message from CU Library Management System.<br />
          If you have any questions, please contact the library admin.
        </p>
      </div>
    `,
      });
    } catch (emailError) {
      console.error("Failed to send borrowing email:", emailError);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
