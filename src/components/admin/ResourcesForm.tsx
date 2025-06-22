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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Resource } from "@/types";
import FileUpload from "@/components/shared/FileUpload";
import { createResource, updateResource } from "@/lib/admin/actions/resource";
import { resourceSchema } from "@/lib/validation";

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
      title: resource?.title || "",
      author: resource?.author || "",
      category: resource?.category || "",
      format: resource?.format || "",
      location: resource?.location || "",
      publicationDate: resource?.publicationDate?.toISOString().split("T")[0] || "",
      resourceImage: resource?.resourceImage || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resourceSchema>) => {
    setIsLoading(true);
    let result;

    if (type === "create") {
      result = await createResource(values);
    } else {
      result = await updateResource(resource?.resourceId, values);
    }

    setIsLoading(false);

    if (result?.success) {
      toast({
        title: "Success",
        description: type === "create" ? "Resource created successfully" : "Resource updated successfully",
      });
      router.push(`/admin/resources/${result.data.resourceId}`);
    } else {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {isLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">Loading...</div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input required placeholder="Resource title" {...field} />
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
                  <Input placeholder="Resource author" {...field} />
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
                  <Input placeholder="e.g. Science, Fiction, Engineering" {...field} />
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
                  <Input placeholder="e.g. Book, PDF, DVD" {...field} />
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
                  <Input placeholder="Shelf location or storage path" {...field} />
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
                  <Input type="date" {...field} />
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

          <Button type="submit" className="w-full">
            {isLoading ? "Saving..." : type === "create" ? "Add Resource" : "Update Resource"}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default ResourceForm;
