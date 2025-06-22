"use server"

import { db } from "@/database";
import { resources } from "@/database/schema";
import { Resource } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createResource = async (params: Partial<Resource>) => {
  try {
    const result = await db.insert(resources).values({
      title: params.title || "",
      author: params.author || null,
      category: params.category || null,
      format: params.format || null,
      location: params.location || null,
      publicationDate: params.publicationDate ? new Date(params.publicationDate) : null,
      resourceImage: params.resourceImage || null,
      description: params.description || null,
      status: "available",
    }).returning();

    revalidatePath("/admin/resources");

    return {
      success: true,
      data: result.length ? JSON.parse(JSON.stringify(result[0])) : null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while creating the resource",
    };
  }
};

export const deleteResource = async (id: number) => {
  try {
    const resource = await db
      .select()
      .from(resources)
      .where(eq(resources.resourceId, id))
      .limit(1);

    if (!resource.length) {
      return {
        success: false,
        error: "Resource not found",
      };
    }

    await db.delete(resources).where(eq(resources.resourceId, id));

    revalidatePath("/admin/resources");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while deleting the resource",
    };
  }
};

export const updateResource = async (
  id: number | undefined,
  params: Resource
) => {
  if (!id || !params) return null;

  try {
    await db
      .update(resources)
      .set({
        ...params, // Optional: adapt this if not used
      })
      .where(eq(resources.resourceId, id));

    // Fetch the updated resource
    const updatedResource = await db
      .select()
      .from(resources)
      .where(eq(resources.resourceId, id))
      .limit(1);

    return {
      success: true,
      data: updatedResource.length ? JSON.parse(JSON.stringify(updatedResource[0])) : null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating the resource",
    };
  }
};