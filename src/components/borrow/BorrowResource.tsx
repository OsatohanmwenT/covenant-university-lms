"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowResource } from "@/lib/actions/resource";

interface Props {
  resourceId?: number;
  userId?: number;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
  isBorrowed: "1" | "0" ;
}

const BorrowResource = ({
  isBorrowed,
  resourceId,
  userId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  console.log("BorrowResource Props:", {
    isBorrowed,
    resourceId,
    userId,
    isEligible,
    message,
  });

  const handleBorrowBook = async () => {
    if (!isEligible) {
      return toast.error(message);
    }

    setBorrowing(true);

    try {
      const result = await borrowResource({ resourceId, userId });
      console.log(result)

      if (result?.success) {
        toast.success("Resource borrowed successfully");
        router.push("/my-profile");
      } else {
        toast.error(result?.error);
      }
    } catch (error) {
      toast.error("An error occurred while borrowing the book");
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      onClick={handleBorrowBook}
      disabled={borrowing || isBorrowed === "1"}
      className="book-overview_btn cursor-pointer"
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing
          ? "Borrowing..."
          : isBorrowed === "1"
          ? "You have this already"
          : "BORROW BOOK"}
      </p>
    </Button>
  );
};
export default BorrowResource;
