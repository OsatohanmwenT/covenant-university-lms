// src/lib/actions/return-resource.ts
"use server";

import { db } from "@/database";
import { loan, resources, users, fine } from "@/database/schema";
import { eq, and, isNull } from "drizzle-orm";
import dayjs from "dayjs";
import { queueEmail } from "../workflow";

export const returnResource = async (loanId: number) => {
  try {
    // Get loan details
    const [loanDetails] = await db
      .select({
        loan: loan,
        resourceTitle: resources.title,
        resourceId: resources.resourceId,
        userName: users.fullName,
        userEmail: users.email,
      })
      .from(loan)
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .innerJoin(users, eq(loan.userId, users.userId))
      .where(
        and(
          eq(loan.loanId, loanId),
          isNull(loan.dateReturned)
        )
      )
      .limit(1);

    if (!loanDetails) {
      return { success: false, error: "Loan not found or already returned" };
    }

    const today = new Date();
    const dueDate = new Date(loanDetails.loan.dueDate);
    const isOverdue = today > dueDate;

    // Update loan as returned
    await db
      .update(loan)
      .set({
        dateReturned: today,
        status: "returned"
      })
      .where(eq(loan.loanId, loanId));

    // Update resource availability
    await db
      .update(resources)
      .set({
        status: "available"
      })
      .where(eq(resources.resourceId, loanDetails.resourceId));

    // If overdue, calculate the fine
    if (isOverdue) {
      const daysOverdue = dayjs().diff(dayjs(dueDate), "day");
      const amountPerDay = 100; // ₦100 per day
      const totalAmount = (daysOverdue * amountPerDay).toString();

      // Create/update fine record
      const [existingFine] = await db
        .select()
        .from(fine)
        .where(eq(fine.loanId, loanId))
        .limit(1);

      if (existingFine) {
        await db
          .update(fine)
          .set({
            daysOverdue,
            totalAmount
          })
          .where(eq(fine.loanId, loanId));
      } else {
        await db.insert(fine).values({
          loanId,
          amountPerDay,
          daysOverdue,
          totalAmount,
          isPaid: false
        });
      }
    }

    // Send return confirmation email
    await queueEmail({
      email: loanDetails.userEmail,
      subject: "📚 Resource Return Confirmation - CU LMS",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Resource Return Confirmation</h2>
          <p>Dear ${loanDetails.userName},</p>
          
          <p>We confirm that you have returned the following resource to the library:</p>
          
          <div style="padding: 15px; background-color: #f5f5f5; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Title:</strong> ${loanDetails.resourceTitle}</p>
            <p style="margin: 5px 0;"><strong>Return Date:</strong> ${dayjs().format("MMMM D, YYYY")}</p>
          </div>
          
          ${isOverdue ? `
          <div style="padding: 15px; background-color: #fff3cd; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 5px 0;"><strong>Notice:</strong> This resource was returned after the due date (${dayjs(dueDate).format("MMMM D, YYYY")}). A fine has been applied to your account.</p>
          </div>
          ` : `
          <p>Thank you for returning this resource on time!</p>
          `}
          
          <p>Thank you for using the Covenant University Center for Learning Resources.</p>
          
          <hr style="margin: 24px 0;" />
          <p style="font-size: 12px; color: #888;">
            This is an automated message from CU Library Management System.<br />
            If you have any questions, please contact the library admin.
          </p>
        </div>
      `,
    });

    return {
      success: true,
      isOverdue,
      daysLate: isOverdue ? dayjs().diff(dayjs(dueDate), "day") : 0
    };
  } catch (error) {
    console.error("Error returning resource:", error);
    return { success: false, error: "Failed to process resource return" };
  }
};

export const getDueSoonLoans = async () => {
  try {
    // Get loans due in the next 3 days
    const dueSoonLoans = await db
      .select({
        loanId: loan.loanId,
        resourceId: loan.resourceId,
        userId: loan.userId,
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        resourceTitle: resources.title,
        userName: users.fullName
      })
      .from(loan)
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .innerJoin(users, eq(loan.userId, users.userId))
      .where(
        and(
          isNull(loan.dateReturned),
          // Due within the next 3 days
          // This is a simplification and might need adjustment
          eq(loan.dueDate, dayjs().add(3, "day").toDate())
        )
      );

    return { success: true, loans: dueSoonLoans };
  } catch (error) {
    console.error("Error getting due soon loans:", error);
    return { success: false, error: "Failed to get loans due soon" };
  }
};

export const getOverdueLoans = async () => {
  try {
    // Get all overdue loans
    const overdueLoans = await db
      .select({
        loanId: loan.loanId,
        resourceId: loan.resourceId,
        userId: loan.userId,
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        resourceTitle: resources.title,
        userName: users.fullName,
        userRole: users.role,
        daysOverdue: fine.daysOverdue,
        totalFine: fine.totalAmount,
        isPaid: fine.isPaid
      })
      .from(loan)
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .innerJoin(users, eq(loan.userId, users.userId))
      .leftJoin(fine, eq(loan.loanId, fine.loanId))
      .where(
        and(
          isNull(loan.dateReturned),
          eq(loan.dueDate, dayjs().toDate())
        )
      );

    return { success: true, loans: overdueLoans };
  } catch (error) {
    console.error("Error getting overdue loans:", error);
    return { success: false, error: "Failed to get overdue loans" };
  }
};
