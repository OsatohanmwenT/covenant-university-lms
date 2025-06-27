import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import BookCover from "../shared/BookCover";
import { CalendarRange, Eye } from "lucide-react";
import { ResourceListItem } from "@/types";

const LoanResourceCard = ({ resource }: { resource: ResourceListItem }) => {
  return (
    <div className="flex last:mb-6 bg-light-300 p-4 rounded-xl items-start justify-between">
      <div className="flex items-center gap-2">
        <BookCover
          variant="small"
          title={resource?.title}
          resourceImage={resource.resourceImage as string}
        />
        <div>
          <p className="font-semibold text-lg text-dark-400">
            {resource.title}
          </p>
          <div className="flex items-center my-1 gap-1">
            <p className="text-xs text-dark-700">
              by <span>{resource.author}</span>
            </p>
            <span className="bg-dark-700 w-1 h-1 rounded-full"></span>
            <p className="text-xs text-dark-700">{resource.category}</p>
          </div>
          <div className="mt-1 flex gap-2">
            <p className="text-dark-700 text-sm font-medium">
              {resource.fullName}
            </p>
            <div className="flex items-center gap-2">
              <CalendarRange className="size-5 text-dark-700" />
              <p className="text-dark-700 text-sm">
                {dayjs(resource.borrowDate).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button className="p-2 bg-white hover:bg-light-100 transition-colors rounded-md">
        <Link href={`/admin/resources/${resource.resourceId}`}>
          <Eye className="size-5" />
        </Link>
      </button>
    </div>
  );
};
export default LoanResourceCard;
