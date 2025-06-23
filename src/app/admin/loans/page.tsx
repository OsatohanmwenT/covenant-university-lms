import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import InfoSection from "@/components/admin/InfoSection";
import { db } from "@/database";
import { users, resources, loan } from "@/database/schema";
import { eq } from "drizzle-orm";
import LoansTable from "@/components/admin/LoansTable";

const Page = async () => {
  const loanList = await db
    .select({
      loanId: loan.userId,
      status: loan.status,
      dateBorrowed: loan.dateBorrowed,
      dueDate: loan.dueDate,
      dateReturned: loan.dateReturned,
      userId: loan.userId,
      resourceId: loan.resourceId,
      user: {
        fullName: users.fullName,
        email: users.email,
      },
      resource: {
        title: resources.title,
        uniqueIdentifier: resources.uniqueIdentifier,
        resourceImage: resources.resourceImage,
      },
    })
    .from(loan)
    .leftJoin(users, eq(users.userId, loan.userId))
    .leftJoin(resources, eq(resources.resourceId, loan.resourceId));

    console.log(loanList);

  return (
    <InfoSection
      title="Loan Records"
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
      <LoansTable loans={loanList} />
    </InfoSection>
  );
};

export default Page;
