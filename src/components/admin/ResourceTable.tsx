"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit3, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import StatusDialog from "@/components/admin/StatusDialog";
import { toast } from "sonner";
import { Resource } from "@/types";
import BookCover from "../shared/BookCover";
import { deleteResource } from "@/lib/admin/actions/resource";

const ResourceTable = ({ resources }: { resources: Omit<Resource, "description">[] }) => {
  const handleDeleteResource = async (id: number) => {
    try {
      const result = await deleteResource(id);

      if (result.success) {
        toast.success("Resource deleted successfully");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting.");
    }
  };

  return (
    <div className="table">
      <Table>
        <TableHeader className="table-head">
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead className="w-[300px]">Author</TableHead>
            <TableHead className="w-[150px]">Category</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="table-body">
          {resources.map((resource) => (
            <TableRow key={resource.resourceId}>
              <TableCell>
                <Link
                  className="flex items-center gap-2"
                  href={`/admin/resources/${resource.resourceId}`}
                >
                  <BookCover
                    variant="extraSmall"
                    resourceImage={resource.resourceImage}
                    title={resource.title}
                  />
                  <p className="font-medium text-wrap">{resource.title}</p>
                </Link>
              </TableCell>
              <TableCell>{resource.author}</TableCell>
              <TableCell>{resource.category}</TableCell>
              <TableCell>
                {dayjs(resource.publicationDate).format("MMM DD, YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/resources/${resource.resourceId}`}>
                    <Edit3 className="size-5 text-blue-500" />
                  </Link>
                  <StatusDialog
                    type="error"
                    title="Delete Resource"
                    description="This action cannot be undone. This will permanently delete this resource."
                    buttonText="Delete Resource"
                    onAction={() => handleDeleteResource(resource.resourceId)}
                    trigger={
                      <button>
                        <Trash2 className="size-5 text-red-600" />
                      </button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResourceTable;
