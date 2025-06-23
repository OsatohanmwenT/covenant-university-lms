"use server";
import { db } from "@/database";
import { acquisitionRequest, resources, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export async function getPendingAcquisitionRequests() {
  return db
    .select({
      requestId: acquisitionRequest.requestId,
      resourceIdentifier: acquisitionRequest.resourceIdentifier,
      title: acquisitionRequest.title,
      author: acquisitionRequest.author,
      publicationDate: acquisitionRequest.publicationDate,
      requestedDate: acquisitionRequest.requestedDate,
      requestedByUserId: acquisitionRequest.requestedByUserId,
      isApproved: acquisitionRequest.isApproved,
      approvedByUserId: acquisitionRequest.approvedByUserId,
      requestedBy: users.fullName,
    })
    .from(acquisitionRequest)
    .leftJoin(users, eq(acquisitionRequest.requestedByUserId, users.userId))
    .where(eq(acquisitionRequest.isApproved, false));
}

export async function approveAcquisitionRequest(requestId: number, adminId: number) {
  // Mark as approved
  await db
    .update(acquisitionRequest)
    .set({ isApproved: true, approvedByUserId: adminId })
    .where(eq(acquisitionRequest.requestId, requestId));
}

export async function rejectAcquisitionRequest(requestId: number) {
  await db.delete(acquisitionRequest).where(eq(acquisitionRequest.requestId, requestId));
}

export async function createResourceFromRequest(requestId: number) {
  // Find the request
  const [request] = await db
    .select()
    .from(acquisitionRequest)
    .where(eq(acquisitionRequest.requestId, requestId));
  if (!request) throw new Error("Request not found");
  // Create resource
  const result = await db.insert(resources).values({
    uniqueIdentifier: request.resourceIdentifier,
    title: request.title,
    author: request.author,
    publicationDate: request.publicationDate,
    status: "available",
  });
  return result;
}
