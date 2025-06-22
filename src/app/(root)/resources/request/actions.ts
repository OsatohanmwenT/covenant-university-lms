"use server";

import { db } from "@/database";
import { acquisitionRequest } from "@/database/schema";
import { queueEmail } from "@/lib/workflow";

export const createAcquisitionRequest = async ({
  title,
  author,
  resourceIdentifier,
  publicationDate,
  reason,
  userId,
}: {
  title: string;
  author?: string;
  resourceIdentifier: string;
  publicationDate?: Date;
  reason: string;
  userId: number;
}) => {
  try {
    // Insert the acquisition request
    await db.insert(acquisitionRequest).values({
      title,
      author: author || null,
      resourceIdentifier,
      publicationDate: publicationDate || null,
      requestedDate: new Date(),
      requestedByUserId: userId,
      isApproved: false,
    });

    // Queue notification email to admins about the new request
    // This would typically go to designated library staff
    // Placeholder for actual implementation
    
    return { success: true };
  } catch (error) {
    console.error("Error creating acquisition request:", error);
    return {
      success: false,
      error: "Failed to submit acquisition request",
    };
  }
};
