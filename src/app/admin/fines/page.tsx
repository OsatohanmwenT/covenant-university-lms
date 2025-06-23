import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import InfoSection from "@/components/admin/InfoSection";
import { db } from "@/database";
import { users, resources, fine, loan } from "@/database/schema";
import { eq } from "drizzle-orm";
import FinesTable from "@/components/admin/FinesTable";

const FinesPage = async () => {
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
        fullName: users.fullName,
        email: users.email,
      },
      resource: {
        title: resources.title,
        uniqueIdentifier: resources.uniqueIdentifier,
        resourceImage: resources.resourceImage,
      },
      dueDate: loan.dueDate,
    })
    .from(fine)
    .leftJoin(loan, eq(fine.loanId, loan.loanId))
    .leftJoin(users, eq(loan.userId, users.userId))
    .leftJoin(resources, eq(loan.resourceId, resources.resourceId));

  return (
    <InfoSection
      title="Fines Management"
      sortButton={
        <Button
          className="flex items-center border rounded-md text-dark-700 justify-center gap-1"
          variant="ghost"
        >
          <p>Oldest to Recent</p>
          <ArrowUpDown />
        </Button>
      }
    >
      <FinesTable fines={fines} />
    </InfoSection>
  );
};

export default FinesPage;