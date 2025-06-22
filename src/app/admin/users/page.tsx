import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { db } from "@/database";
import { loan, users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import InfoSection from "@/components/admin/InfoSection";
import UserTable from "@/components/admin/UserTable";

const Page = async () => {
  const userList = await db
    .select({
      userId: users.userId,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      registrationDate: users.registrationDate,
      borrowedBookCount: sql<number>`COUNT(${loan.loanId})`,
    })
    .from(users)
    .leftJoin(loan, eq(loan.userId, users.userId))
    .groupBy(users.userId);

  return (
    <InfoSection
      title="All Users"
      sortButton={
        <Button
          className="flex items-center border rounded-md text-dark-700 justify-center gap-1"
          variant="ghost"
        >
          <p>A - Z</p>
          <ArrowUpDown />
        </Button>
      }
    >
      <UserTable users={userList} />
    </InfoSection>
  );
};

export default Page;
