// src/lib/actions/fine.ts
import { db } from "@/database";
import { fine, loan, users, resources } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notifyUser } from "../services/notifications";

/**
 * Get all fines with joined user and resource data
 */
export async function getFines() {
  try {
    // Join the fine table with loan, user, and resource tables to get all needed information
    const fines = await db
      .select({
        fineId: fine.fineId,
        loanId: fine.loanId,
        amountPerDay: fine.amountPerDay,
        daysOverdue: fine.daysOverdue,
        totalAmount: fine.totalAmount,
        isPaid: fine.isPaid,
        datePaid: fine.datePaid,
        user: {
          userId: users.userId,
          fullName: users.fullName,
          email: users.email,
          role: users.role,
        },
        resource: {
          resourceId: resources.resourceId,
          title: resources.title,
          author: resources.author,
          uniqueIdentifier: resources.uniqueIdentifier,
        },
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        dateReturned: loan.dateReturned,
      })
      .from(fine)
      .innerJoin(loan, eq(fine.loanId, loan.loanId))
      .innerJoin(users, eq(loan.userId, users.userId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .orderBy(desc(fine.fineId));
    
    return fines;
  } catch (error) {
    console.error("Error fetching fines:", error);
    throw new Error("Failed to fetch fines");
  }
}

/**
 * Mark a fine as paid
 */
export async function markFineAsPaid(fineId) {
  try {
    // Update the fine record
    await db
      .update(fine)
      .set({
        isPaid: true,
        datePaid: new Date(),
      })
      .where(eq(fine.fineId, fineId));
    
    // Get the fine details after update
    const updatedFine = await db
      .select({
        fineId: fine.fineId,
        loanId: fine.loanId,
        userId: loan.userId,
        totalAmount: fine.totalAmount,
      })
      .from(fine)
      .innerJoin(loan, eq(fine.loanId, loan.loanId))
      .where(eq(fine.fineId, fineId))
      .limit(1);
    
    if (updatedFine.length > 0) {
      // Notify the user that their fine has been paid
      await notifyUser({
        userId: updatedFine[0].userId,
        loanId: updatedFine[0].loanId,
        type: "FINE_PAID",
        message: `Your fine of ₦${parseFloat(updatedFine[0].totalAmount).toFixed(2)} has been marked as paid.`,
      });
    }
    
    revalidatePath("/admin/fines");
    revalidatePath(`/my-profile/fines`);
    
    return { success: true };
  } catch (error) {
    console.error("Error marking fine as paid:", error);
    throw new Error("Failed to mark fine as paid");
  }
}

/**
 * Update fine details (for adjusting overdue days or amount)
 */
export async function updateFineDetails(fineId, data) {
  try {
    const { daysOverdue, amountPerDay } = data;
    const totalAmount = (daysOverdue * amountPerDay).toString();
    
    // Update the fine record
    await db
      .update(fine)
      .set({
        daysOverdue,
        amountPerDay,
        totalAmount,
      })
      .where(eq(fine.fineId, fineId));
    
    revalidatePath("/admin/fines");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating fine details:", error);
    throw new Error("Failed to update fine details");
  }
}
