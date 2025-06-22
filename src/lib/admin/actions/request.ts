"use server";

import { db } from "@/database";
import { acquisitionRequest, notification, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { queueEmail } from "@/lib/workflow";

export const getAcquisitionRequests = async () => {
  try {
    const requests = await db
      .select({
        requestId: acquisitionRequest.requestId,
        title: acquisitionRequest.title,
        author: acquisitionRequest.author,
        resourceIdentifier: acquisitionRequest.resourceIdentifier,
        publicationDate: acquisitionRequest.publicationDate,
        requestedDate: acquisitionRequest.requestedDate,
        isApproved: acquisitionRequest.isApproved,
        requestedByUserId: acquisitionRequest.requestedByUserId,
        approvedByUserId: acquisitionRequest.approvedByUserId,
        requestedBy: users.fullName,
        requestedByEmail: users.email,
      })
      .from(acquisitionRequest)
      .leftJoin(users, eq(acquisitionRequest.requestedByUserId, users.userId))
      .orderBy(desc(acquisitionRequest.requestedDate));
    
    return { success: true, requests };
  } catch (error) {
    console.error("Error fetching acquisition requests:", error);
    return { success: false, error: "Failed to fetch acquisition requests" };
  }
};

export const approveAcquisitionRequest = async (
  requestId: number,
  adminId: number
) => {
  try {
    // Get the request details first
    const [request] = await db
      .select()
      .from(acquisitionRequest)
      .where(eq(acquisitionRequest.requestId, requestId));

    if (!request) {
      return { success: false, error: "Acquisition request not found" };
    }
    
    // Update the request status
    await db
      .update(acquisitionRequest)
      .set({
        isApproved: true,
        approvedByUserId: adminId,
      })
      .where(eq(acquisitionRequest.requestId, requestId));
    
    // Get user information to send notification
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, request.requestedByUserId));
    
    if (user) {
      // Create a notification for the user
      await db.insert(notification).values({
        loanId: 0, // Placeholder as notifications are currently linked to loans
        notificationType: "REQUEST_APPROVED",
        dateSent: new Date(),
        isResolved: false,
        sentToUserId: user.userId,
      });
      
      // Send email notification to user
      await queueEmail({
        to: user.email,
        subject: "Your Resource Request Has Been Approved",
        text: `Your request for "${request.title}" has been approved and will be added to our collection soon.`,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error approving acquisition request:", error);
    return { success: false, error: "Failed to approve request" };
  }
};

export const rejectAcquisitionRequest = async (
  requestId: number,
  reason: string
) => {
  try {
    // Get the request details first
    const [request] = await db
      .select()
      .from(acquisitionRequest)
      .where(eq(acquisitionRequest.requestId, requestId));
    
    if (!request) {
      return { success: false, error: "Acquisition request not found" };
    }
    
    // Delete the request
    await db
      .delete(acquisitionRequest)
      .where(eq(acquisitionRequest.requestId, requestId));
    
    // Get user information to send notification
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, request.requestedByUserId));
    
    if (user) {
      // Create a notification for the user
      await db.insert(notification).values({
        loanId: 0, // Placeholder as notifications are currently linked to loans
        notificationType: "REQUEST_REJECTED",
        dateSent: new Date(),
        isResolved: false,
        sentToUserId: user.userId,
      });
      
      // Send email notification to user
      await queueEmail({
        to: user.email,
        subject: "Update on Your Resource Request",
        text: `Your request for "${request.title}" could not be approved at this time. Reason: ${reason}`,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error rejecting acquisition request:", error);
    return { success: false, error: "Failed to reject request" };
  }
};
