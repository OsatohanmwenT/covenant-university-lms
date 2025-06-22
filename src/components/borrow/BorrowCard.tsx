"use client";

import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { variantStyles } from "@/constants";
import { cn } from "@/lib/utils";

interface BorrowCardProps {
  resourceImage?: string;
  title: string;
  author?: string;
  genre?: string;
  borrowDate: string;
  dueDate: string;
}

const BorrowCard = ({
  resourceImage,
  title,
  author,
  genre,
  borrowDate,
  dueDate,
}: BorrowCardProps) => {
  const daysLeft = dayjs(dueDate).diff(dayjs(), "day");

  return (
    <div className="bg-dark-100 flex flex-col justify-between gap-3 rounded-lg p-3">
      <div className="bg-dark-300 p-5 rounded-lg flex items-center justify-center">
        <div
          className={cn(
            "relative transition-all duration-300",
            variantStyles["regular"]
          )}
        >
          <Image
            src={resourceImage || "/images/no-books.png"}
            alt={title || "Book cover"}
            fill
            className="object-fill rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-white text-lg font-medium">
            {title} {author ? `- by ${author}` : ""}
          </p>
          {genre && <p className="text-light-100 text-sm">{genre}</p>}
        </div>

        <div className="flex items-center gap-1">
          <Image
            src="/icons/book-2.svg"
            alt="book icon"
            width={18}
            height={18}
          />
          <p className="text-xs text-light-100">
            Borrowed on {dayjs(borrowDate).format("MMM DD")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Image
              src="/icons/calendar.svg"
              alt="calendar icon"
              width={18}
              height={18}
            />
            <p className="text-xs text-light-100">
              {daysLeft > 0
                ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to due`
                : "Due today or overdue"}
            </p>
          </div>
          <button className="p-1 rounded-sm bg-dark-600">
            <Image
              src="/icons/receipt.svg"
              alt="receipt icon"
              width={18}
              height={18}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowCard;
