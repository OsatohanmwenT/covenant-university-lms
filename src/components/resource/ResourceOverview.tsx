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
  // Validate and convert userId to number
  const userIdNum = parseInt(userId);
  const resourceIdNum = Number(resourceId);
  
  if (isNaN(userIdNum) || isNaN(resourceIdNum)) {
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">Please log in to borrow this resource.</p>
          </div>
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
  }

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
        eq(loan.userId, userIdNum),
        eq(loan.resourceId, resourceIdNum)
      )
    )
    .where(eq(users.userId, userIdNum))
    .limit(1);

    console.log("User Data:", user);

  const borrowingEligibility = {
    isEligible: user?.isActive || false,
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
        {borrowingEligibility.isEligible && user && (
          <BorrowResource
            isBorrowed={user?.isBorrowed === "1" ? "1" : "0"}
            resourceId={resourceIdNum}
            userId={userIdNum}
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
