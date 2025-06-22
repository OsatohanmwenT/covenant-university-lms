import React from "react";
import Image from "next/image";
import { db } from "@/database";
import { loan, users } from "@/database/schema";
import { and, eq, sql } from "drizzle-orm";
import { Resource } from "@/types";
import BorrowResource from "../borrow/BorrowResource";
import { cn } from "@/lib/utils";
import { variantStyles } from "@/constants";

interface Props extends Resource {
  userId: string;
}

const ResourceOverview = async ({
  resourceId,
  title,
  author,
  category,
  resourceImage,
  userId,
}: Props) => {
  const [user] = await db
    .select({
      userId: users.userId,
      isBorrowed: sql`IF(${loan.resourceId} IS NOT NULL, TRUE, FALSE)`,
      resourceId: loan.resourceId,
      isActive: users.isActive,
      role: users.role,
    })
    .from(users)
    .leftJoin(
      loan,
      and(
        eq(loan.userId, Number(userId)),
        eq(loan.resourceId, Number(resourceId))
      )
    )
    .where(eq(users.userId, Number(userId)))
    .limit(1);

  const borrowingEligibility = {
    isEligible: user.isActive,
    message: "You are not eligible to borrow this book.",
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>
        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{category}</span>
          </p>
        </div>
        {borrowingEligibility.isEligible && (
          <BorrowResource
            isBorrowed={user?.isBorrowed as "1" | "0"}
            resourceId={resourceId}
            userId={Number(userId)}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>
      <div
        className={cn(
          "relative transition-all duration-300",
          variantStyles["wide"]
        )}
      >
        <Image
          src={resourceImage || "/images/no-books.png"}
          alt={title || "Book cover"}
          fill
          className="object-fill rounded-md"
        />
      </div>
    </section>
  );
};
export default ResourceOverview;
