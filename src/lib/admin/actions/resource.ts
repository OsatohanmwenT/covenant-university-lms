"use server"

import { db } from "@/database";
import { resources, inventoryAction } from "@/database/schema";
import { Resource } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

export const createResource = async (params: Partial<Resource>) => {
  try {
    if (!params.uniqueIdentifier) {
      throw new Error("uniqueIdentifier is required");
    }
    await db.insert(resources).values({
      uniqueIdentifier: params.uniqueIdentifier as string,
      title: params.title || "",
      author: params.author || null,
      category: params.category || null,
      format: params.format || null,
      location: params.location || null,
      publicationDate: params.publicationDate ? new Date(params.publicationDate) : null,
      resourceImage: params.resourceImage || null,
      status: "available",
    });

    // Fetch the newly created resource
    const created = await db
      .select()
      .from(resources)
      .where(eq(resources.uniqueIdentifier, params.uniqueIdentifier as string))
      .limit(1);

    revalidatePath("/admin/resources");

    return {
      success: true,
      data: created.length ? created[0] : null,
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
  params:  Partial<Resource>
) => {
  if (!id || !params) return null;

  try {
    // Destructure and filter uniqueIdentifier
    const {
      uniqueIdentifier,
      ...rest
    } = params;
    await db
      .update(resources)
      .set({
        ...rest,
        uniqueIdentifier: typeof uniqueIdentifier === "string" ? uniqueIdentifier : undefined,
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

/**
 * Record an inventory action (add, remove, relocate, etc.)
 */
export async function recordInventoryAction({
  resourceId,
  actionType,
  notes,
  performedByUserId,
  approvedByUserId,
}: {
  resourceId: number;
  actionType: string;
  notes?: string;
  performedByUserId: number;
  approvedByUserId?: number;
}) {
  try {
    await db.insert(inventoryAction).values({
      resourceId,
      actionType,
      actionDate: dayjs().toDate(),
      notes: notes || null,
      performedByUserId,
      approvedByUserId: approvedByUserId || null,
    });
    return { success: true };
  } catch (error) {
    console.error("Error recording inventory action:", error);
    return { success: false, error: "Failed to record inventory action" };
  }
}