import React from "react";
import { db } from "@/database";
import { users, loan, resources } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import LoanResourceCard from "./LoanResourceCard";

const LoanList = async () => {
  const loanList = await db
    .select({
      loanId: loan.loanId,
      resourceId: loan.resourceId,
      title: resources.title,
      author: resources.author,
      category: resources.category,
      fullName: users.fullName,
      borrowDate: loan.dateBorrowed,
      dueDate: loan.dueDate, // ✅ Add this
      status: loan.status,
      resourceImage: resources.resourceImage,
    })
    .from(loan)
    .leftJoin(users, eq(loan.userId, users.userId))
    .leftJoin(resources, eq(loan.resourceId, resources.resourceId));

  if (!loanList.length) {
    return (
      <div className="flex items-center py-5 flex-col gap-2 justify-center">
        <Image
          src="/icons/no-account-illustration.svg"
          alt="no loans"
          height={100}
          width={200}
        />
        <p className="text-dark-600 font-semibold text-center">
          No Active Loans
        </p>
        <p className="text-light-500 text-sm text-center">
          There are currently no active or pending loaned books in the system.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex mt-6 flex-1 h-[350px] hide-scrollbar overflow-y-scroll flex-col gap-3">
      {loanList.map((loanItem) => (
        <LoanResourceCard key={loanItem.loanId} resource={loanItem} />
      ))}
    </ul>
  );
};

export default LoanList;
