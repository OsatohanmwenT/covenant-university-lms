import React from "react";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { desc } from "drizzle-orm";
import { CalendarRange, Plus } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import BookCover from "../shared/BookCover";

const RecentResourcesList = async () => {
  const recentResources = await db
    .select()
    .from(resources)
    .limit(10)
    .orderBy(desc(resources.resourceId));

  return (
    <div className="flex flex-col gap-5">
      {/* Add New Resource Button */}
      <Link
        href="/admin/resources/new"
        className="p-5 gap-5 font-medium rounded-xl bg-light-300 flex items-center"
      >
        <div className="flex items-center justify-center p-3 rounded-full bg-white">
          <Plus className="size-6" />
        </div>
        <span>Add New Resource</span>
      </Link>

      {/* Resource List */}
      <div className="hide-scrollbar flex flex-col gap-5 overflow-y-scroll h-[560px]">
        {recentResources.map((resource) => (
          <Link
            key={resource.resourceId}
            href={`/admin/resources/${resource.resourceId}`}
            className="last:mb-6"
          >
            <div className="flex items-center gap-3">
              <BookCover
                variant="small"
                resourceImage={resource.resourceImage as string}
                title={resource.title}
              />
              <div>
                <p className="font-semibold text-lg text-dark-400 line-clamp-1">
                  {resource.title}
                </p>
                <div className="flex items-center gap-1 text-xs text-dark-700 my-1">
                  <span>by {resource.author}</span>
                  <span className="bg-dark-700 w-1 h-1 rounded-full" />
                  <span>{resource.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-700">
                  <CalendarRange className="size-4" />
                  {/* <span>{dayjs(resource.createdAt).format("DD/MM/YYYY")}</span> */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentResourcesList;
