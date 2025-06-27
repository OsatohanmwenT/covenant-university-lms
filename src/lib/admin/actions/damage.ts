import { db } from "@/database";
import { damageReport, resources, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export const getAllDamageReports = async () => {
  return await db
    .select({
      damageReportId: damageReport.damageReportId,
      resourceId: damageReport.resourceId,
      reportedDate: damageReport.reportedDate,
      damageDescription: damageReport.damageDescription,
      isReparable: damageReport.isReparable,
      repairDueDate: damageReport.repairDueDate,
      repairCompletedDate: damageReport.repairCompletedDate,
      title: resources.title,
      author: resources.author,
      resourceImage: resources.resourceImage,
      reportedBy: users.fullName,
      reportedByEmail: users.email,
    })
    .from(damageReport)
    .innerJoin(resources, eq(damageReport.resourceId, resources.resourceId))
    .innerJoin(users, eq(damageReport.reportedByUserId, users.userId))
    .orderBy(desc(damageReport.reportedDate));
};

export const updateDamageReportStatus = async (
  damageReportId: number,
  status: "under_repair" | "repaired" | "not_repairable",
  repairDueDate?: Date
) => {
  let updateFields: any = {};
  if (status === "under_repair") {
    updateFields.repairDueDate = repairDueDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  } else if (status === "repaired") {
    updateFields.repairCompletedDate = new Date();
  } else if (status === "not_repairable") {
    updateFields.isReparable = false;
  }
  await db.update(damageReport).set(updateFields).where(eq(damageReport.damageReportId, damageReportId));
  return { success: true };
}; 