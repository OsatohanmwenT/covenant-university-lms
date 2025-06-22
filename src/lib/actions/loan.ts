"use server";

import { db } from "@/database";
import { loan, users, resources } from "@/database/schema";
import { eq, and, isNull, sql, like, desc } from "drizzle-orm";
import dayjs from "dayjs";

/**
 * Get all loans with user and resource details
 */
export const getAllLoans = async () => {
  try {
    const loans = await db
      .select({
        loanId: loan.loanId,
        resourceId: loan.resourceId,
        userId: loan.userId,
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        dateReturned: loan.dateReturned,
        status: loan.status,
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
          resourceImage: resources.resourceImage,
          category: resources.category,
        },
      })
      .from(loan)
      .innerJoin(users, eq(loan.userId, users.userId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .orderBy(desc(loan.loanId));

    // Calculate if any loans are overdue but not yet marked as such
    const enhancedLoans = loans.map(loan => {
      if (loan.status === 'borrowed' && !loan.dateReturned) {
        const now = new Date();
        const dueDate = new Date(loan.dueDate);
        
        if (now > dueDate) {
          return { ...loan, status: 'overdue' };
        }
      }
      return loan;
    });

    return enhancedLoans;
  } catch (error) {
    console.error("Error getting all loans:", error);
    throw new Error("Failed to get loans");
  }
};

/**
 * Get loans by user ID
 */
export const getLoansByUser = async (userId: number) => {
  try {
    const loans = await db
      .select({
        loanId: loan.loanId,
        resourceId: loan.resourceId,
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        dateReturned: loan.dateReturned,
        status: loan.status,
        resource: {
          resourceId: resources.resourceId,
          title: resources.title,
          author: resources.author,
          resourceImage: resources.resourceImage,
          category: resources.category,
        },
      })
      .from(loan)
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .where(eq(loan.userId, userId))
      .orderBy(desc(loan.loanId));

    return loans;
  } catch (error) {
    console.error("Error getting user loans:", error);
    throw new Error("Failed to get user loans");
  }
};

/**
 * Get loans by resource ID
 */
export const getLoansByResource = async (resourceId: number) => {
  try {
    const loans = await db
      .select({
        loanId: loan.loanId,
        userId: loan.userId,
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        dateReturned: loan.dateReturned,
        status: loan.status,
        user: {
          userId: users.userId,
          fullName: users.fullName,
          email: users.email,
          role: users.role,
        },
      })
      .from(loan)
      .innerJoin(users, eq(loan.userId, users.userId))
      .where(eq(loan.resourceId, resourceId))
      .orderBy(desc(loan.loanId));

    return loans;
  } catch (error) {
    console.error("Error getting resource loans:", error);
    throw new Error("Failed to get resource loans");
  }
};

/**
 * Mark a loan as returned
 */
export const markLoanAsReturned = async (loanId: number) => {
  try {
    // Get loan details first
    const [loanDetails] = await db
      .select({
        loanId: loan.loanId,
        resourceId: loan.resourceId,
        userId: loan.userId,
        dueDate: loan.dueDate,
      })
      .from(loan)
      .where(eq(loan.loanId, loanId))
      .limit(1);

    if (!loanDetails) {
      throw new Error("Loan not found");
    }

    // Update the loan record
    await db
      .update(loan)
      .set({
        dateReturned: new Date(),
        status: "returned",
      })
      .where(eq(loan.loanId, loanId));

    // Update resource status to available
    await db
      .update(resources)
      .set({
        status: "available",
      })
      .where(eq(resources.resourceId, loanDetails.resourceId));

    // Check if return was past due date
    const isOverdue = new Date() > new Date(loanDetails.dueDate);
    
    return {
      success: true,
      isOverdue,
    };
  } catch (error) {
    console.error("Error marking loan as returned:", error);
    throw new Error("Failed to process return");
  }
};

/**
 * Delete a loan record
 */
export const deleteLoan = async (loanId: number) => {
  try {
    await db
      .delete(loan)
      .where(eq(loan.loanId, loanId));
      
    return { success: true };
  } catch (error) {
    console.error("Error deleting loan:", error);
    throw new Error("Failed to delete loan");
  }
};

/**
 * Get overdue loans
 */
export const getOverdueLoans = async () => {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');
    
    const loans = await db
      .select({
        loanId: loan.loanId,
        resourceId: loan.resourceId,
        userId: loan.userId,
        dateBorrowed: loan.dateBorrowed,
        dueDate: loan.dueDate,
        status: loan.status,
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
      })
      .from(loan)
      .innerJoin(users, eq(loan.userId, users.userId))
      .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
      .where(
        and(
          isNull(loan.dateReturned),
          sql`${loan.dueDate} < ${currentDate}`
        )
      )
      .orderBy(loan.dueDate);

    return loans;
  } catch (error) {
    console.error("Error getting overdue loans:", error);
    throw new Error("Failed to get overdue loans");
  }
};
