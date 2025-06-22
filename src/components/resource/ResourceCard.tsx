import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Resource } from "@/types";
import { BookCoverVariant, variantStyles } from "@/constants";

interface ResourceCardProps
  extends Pick<
    Resource,
    "resourceId" | "title" | "category" | "author" | "resourceImage"
  > {
  isLoanedBook?: boolean;
  variant: BookCoverVariant;
}



const ResourceCard = ({
  resourceId,
  title,
  variant = "regular",
  category,
  author,
  resourceImage,
  isLoanedBook = false,
}: ResourceCardProps) => {
  return (
    <div className={cn(isLoanedBook ? "xs:w-52 h-fit w-full" : undefined)}>
      <Link
        className={cn(
          isLoanedBook ? "w-full flex flex-col items-center" : undefined
        )}
        href={`/resources/${resourceId}`}
      >
        <div
          className={cn(
            "relative transition-all duration-300",
            variantStyles[variant]
          )}
        >
          <Image
            src={resourceImage || "/images/no-books.png"}
            alt={title || "Book cover"}
            fill
            className="object-fill rounded-md"
          />
        </div>
        <div
          className={cn(
            "mt-4",
            !isLoanedBook ? "sm:max-w-40 max-w-28" : undefined
          )}
        >
          <p className="book-title">{title}</p>
          <p className="book-genre">{category}</p>
          {author && <p className="book-author line-clamp-1 text-light-200">by {author}</p>}
        </div>
        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">11 days left to return</p>
            </div>
            <Button className="book-btn">Download receipt</Button>
          </div>
        )}
      </Link>
    </div>
  );
};

export default ResourceCard;
