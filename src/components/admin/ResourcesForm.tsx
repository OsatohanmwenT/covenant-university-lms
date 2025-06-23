"use client";

import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Resource } from "@/types";
import { createResource, updateResource } from "@/lib/admin/actions/resource";
import { resourceSchema } from "@/lib/validation";
import FileUpload from "./FileUpload";

interface Props extends Partial<Resource> {
  type: "create" | "update";
  resource?: Resource;
}

const ResourceForm = ({ type, resource }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      uniqueIdentifier: resource?.uniqueIdentifier || "",
      title: resource?.title || "",
      author: resource?.author || "",
      category: resource?.category || "",
      format: resource?.format || "",
      location: resource?.location || "",
      publicationDate:
        resource?.publicationDate?.toISOString().split("T")[0] || "",
      resourceImage: resource?.resourceImage || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resourceSchema>) => {
    setIsLoading(true);
    const preparedValues = {
      ...values,
      publicationDate: new Date(values.publicationDate),
      status: "available"
    };

    const result =
      type === "create"
        ? await createResource(preparedValues)
        : await updateResource(resource?.resourceId, preparedValues);

    setIsLoading(false);

    if (result?.success) {
      toast.success(
        type === "create"
          ? "Resource created successfully"
          : "Resource updated successfully"
      );
      router.push(`/admin/resources/${result.data.resourceId}`);
    } else {
      toast.error(
        result?.message || "An error occurred while processing the resource."
      );
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
          Loading...
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className="book-form_input"
                    required
                    placeholder="Resource title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uniqueIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input
                    className="book-form_input"
                    placeholder="Resource ISBN"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input
                    className="book-form_input"
                    placeholder="Resource author"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    className="book-form_input"
                    placeholder="e.g. Science, Fiction, Engineering"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format</FormLabel>
                <FormControl>
                  <Input
                    className="book-form_input"
                    placeholder="e.g. Book, PDF, DVD"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    className="book-form_input"
                    placeholder="Shelf location or storage path"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Date</FormLabel>
                <FormControl>
                  <Input className="book-form_input" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resourceImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Image</FormLabel>
                <FormControl>
                  <FileUpload
                    type="image"
                    variant="light"
                    accept="image/*"
                    placeholder="Upload a resource image"
                    folder="resources/images"
                    onFileChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-auto py-5 cursor-pointer">
            {isLoading
              ? "Saving..."
              : type === "create"
              ? "Add Resource"
              : "Update Resource"}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default ResourceForm;
