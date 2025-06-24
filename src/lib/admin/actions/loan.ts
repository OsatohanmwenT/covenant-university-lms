"use server";

import { db } from "@/database";
import { loan } from "@/database/schema";
import { STATUS } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const changeLoanStatus = async (id: number, status: STATUS) => {
  try {
    const existingLoan = await db
      .select()
      .from(loan)
      .where(eq(loan.loanId, id))
      .limit(1);

    if (!existingLoan || existingLoan.length === 0) return null;

    console.log("Updating loan status:", id, status);

    await db
      .update(loan)
      .set({ status })
      .where(eq(loan.loanId, id));

    // Fetch the updated loan record
    const [result] = await db
      .select()
      .from(loan)
      .where(eq(loan.loanId, id))
      .limit(1);

    revalidatePath("/admin/loans");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while updating loan status.",
    };
  }
};
