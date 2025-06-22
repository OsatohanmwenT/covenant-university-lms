"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatOptions } from "@/constants";
import ResourceCard from "./ResourceCard";
import { ResourceFilter } from "./ResourceFilter";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import BorrowCard from "../borrow/BorrowCard";

interface ResourceListProps {
  format: string;
  currentPage: number;
  total: number;
  limit: number;
  containerClass?: string;
  resources: any[];
  title: string;
  type: "BOOK LIST" | "BORROW LIST";
}

const ResourceList: React.FC<ResourceListProps> = ({
  format,
  currentPage,
  total,
  limit,
  resources,
  containerClass = "w-full",
  title,
  type = "BOOK LIST",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <section className={cn("py-6", containerClass)}>
      <div className="flex items-center justify-between">
        <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
        {type == "BOOK LIST" && (
          <ResourceFilter
            value={format}
            options={formatOptions}
            onChange={(val) => updateParams("format", val)}
          />
        )}
      </div>

      {type === "BOOK LIST" ? (<ul className="book-list">
        {resources.map((resource) => (
          <ResourceCard key={resource.resourceId} {...resource} />
        ))}
      </ul>) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-6">
          {resources.map((resource) => (
            <BorrowCard key={resource.resourceId} {...resource} />
          ))}
        </ul>
      )}

      <Separator className="bg-dark-400 my-4" />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => updateParams("page", String(idx + 1))}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-light-200 text-dark-400 font-bold"
                  : "bg-dark-400 text-white"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ResourceList;
