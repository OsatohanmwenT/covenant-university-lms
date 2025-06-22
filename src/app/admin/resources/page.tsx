import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { ArrowUpDown } from "lucide-react";
import InfoSection from "@/components/admin/InfoSection";
import ResourceTable from "@/components/admin/ResourceTable";

const Page = async () => {
  const booklist = await db.select().from(resources).orderBy(resources.title);

  return (
    <InfoSection
      title="All Books"
      sortButton={
        <Button
          className="flex items-center border rounded-md text-dark-700 justify-center gap-1"
          variant="ghost"
        >
          <p>A - Z</p>
          <ArrowUpDown />
        </Button>
      }
      createButton={
        <Button className="bg-primary-admin" asChild>
          <Link className="text-white" href="/admin/books/new">
            + Create a new book
          </Link>
        </Button>
      }
    >
      <ResourceTable resources={booklist} />
    </InfoSection>
  );
};
export default Page;
