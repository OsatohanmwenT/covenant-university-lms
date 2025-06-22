// src/lib/services/fines.ts
import { db } from "@/database";
import { loan, fine, users, resources } from "@/database/schema";
import { eq, and, isNull, lt } from "drizzle-orm";
import dayjs from "dayjs";
import { queueEmail } from "../workflow";

const FINE_AMOUNT_PER_DAY = 100; // ₦100 per day

/**
 * Calculates fines for all overdue loans
 */
export const calculateFines = async () => {
  try {
    // Find all overdue loans
    const overdueLoans = await db
      .select({
        loanId: loan.loanId,
        userId: loan.userId,
        resourceId: loan.resourceId,
        dueDate: loan.dueDate,
        email: users.email,
        fullName: users.fullName,
        title: resources.title
      })
      .from(loan)
      .innerJoin(users, eq(loan.userId, users.userId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .where(
        and(
          isNull(loan.dateReturned),
          lt(loan.dueDate, dayjs().toDate())
        )
      );

    console.log(`Found ${overdueLoans.length} overdue loans for fine calculation`);

    for (const overdueLoan of overdueLoans) {
      const daysOverdue = dayjs().diff(dayjs(overdueLoan.dueDate), "day");
      if (daysOverdue <= 0) continue;

      // Check if fine already exists
      const existingFine = await db
        .select()
        .from(fine)
        .where(eq(fine.loanId, overdueLoan.loanId))
        .limit(1);      const totalAmount = (daysOverdue * FINE_AMOUNT_PER_DAY).toString();

      if (existingFine.length > 0) {
        // Update existing fine
        await db
          .update(fine)
          .set({
            daysOverdue,
            totalAmount,
          })
          .where(eq(fine.fineId, existingFine[0].fineId));
      } else {
        // Create new fine record
        await db.insert(fine).values({
          loanId: overdueLoan.loanId,
          amountPerDay: FINE_AMOUNT_PER_DAY,
          daysOverdue,
          totalAmount,
          isPaid: false,
        });
      }
    }

    return { success: true, count: overdueLoans.length };
  } catch (error) {
    console.error("Error calculating fines:", error);
    return { success: false, error: "Failed to calculate fines" };
  }
};

/**
 * Pays a fine for a specific record
 */
export const payFine = async (fineId: number) => {
  try {
    // Get fine details
    const [fineDetails] = await db
      .select({
        fineId: fine.fineId,
        loanId: fine.loanId,
        totalAmount: fine.totalAmount,
        userId: loan.userId,
        email: users.email,
        fullName: users.fullName,
        resourceTitle: resources.title
      })
      .from(fine)
      .innerJoin(loan, eq(fine.loanId, loan.loanId))
      .innerJoin(users, eq(loan.userId, users.userId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .where(eq(fine.fineId, fineId))
      .limit(1);

    if (!fineDetails) {
      return { success: false, error: "Fine not found" };
    }

    // Update fine to paid
    await db
      .update(fine)
      .set({
        isPaid: true,
        datePaid: new Date()
      })
      .where(eq(fine.fineId, fineId));

    // Send confirmation email
    await queueEmail({
      email: fineDetails.email,
      subject: "✅ Fine Payment Confirmation - CU LMS",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Fine Payment Confirmation</h2>
          <p>Dear ${fineDetails.fullName},</p>
          
          <p>We confirm receipt of your payment of <strong>₦${fineDetails.totalAmount}</strong> for overdue charges on "${fineDetails.resourceTitle}".</p>
          
          <p>Your account is now in good standing, and your borrowing privileges have been restored.</p>
          
          <p>Thank you for your prompt payment.</p>
          
          <hr style="margin: 24px 0;" />
          <p style="font-size: 12px; color: #888;">
            This is an automated message from CU Library Management System.<br />
            If you have any questions, please contact the library admin.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error paying fine:", error);
    return { success: false, error: "Failed to process fine payment" };
  }
};

/**
 * Gets all fines for a specific user
 */
export const getUserFines = async (userId: number) => {
  try {
    const userFines = await db
      .select({
        fineId: fine.fineId,
        loanId: fine.loanId, 
        amountPerDay: fine.amountPerDay,
        daysOverdue: fine.daysOverdue,
        totalAmount: fine.totalAmount,
        isPaid: fine.isPaid,
        datePaid: fine.datePaid,
        resourceId: loan.resourceId,
        resourceTitle: resources.title
      })
      .from(fine)
      .innerJoin(loan, eq(fine.loanId, loan.loanId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .where(eq(loan.userId, userId));

    return { success: true, fines: userFines };
  } catch (error) {
    console.error("Error getting user fines:", error);
    return { success: false, error: "Failed to get user fines" };
  }
};

/**
 * Gets all unpaid fines
 */
export const getAllUnpaidFines = async () => {
  try {
    const unpaidFines = await db
      .select({
        fineId: fine.fineId,
        loanId: fine.loanId, 
        amountPerDay: fine.amountPerDay,
        daysOverdue: fine.daysOverdue,
        totalAmount: fine.totalAmount,
        userId: loan.userId,
        userFullName: users.fullName,
        userEmail: users.email,
        resourceId: loan.resourceId,
        resourceTitle: resources.title
      })
      .from(fine)
      .innerJoin(loan, eq(fine.loanId, loan.loanId))
      .innerJoin(users, eq(loan.userId, users.userId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .where(eq(fine.isPaid, false));

    return { success: true, fines: unpaidFines };
  } catch (error) {
    console.error("Error getting unpaid fines:", error);
    return { success: false, error: "Failed to get unpaid fines" };
  }
};
