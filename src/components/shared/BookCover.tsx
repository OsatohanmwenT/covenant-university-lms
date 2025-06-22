import { BookCoverVariant, variantStyles } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  resourceImage: string | null;
  title: string | null;
  variant: BookCoverVariant;
}

const BookCover = ({ resourceImage, title, variant = "regular" }: Props) => {
  return (
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
  );
};

export default BookCover;
