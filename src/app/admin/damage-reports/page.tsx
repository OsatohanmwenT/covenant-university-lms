import React from "react";
import { getAllDamageReports, updateDamageReportStatus } from "@/lib/admin/actions/damage";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const DamageReportsAdminPage = async () => {
  const reports = await getAllDamageReports();

  async function handleAction(
    damageReportId: number,
    status: "under_repair" | "repaired" | "not_repairable"
  ) {
    "use server";
    await updateDamageReportStatus(damageReportId, status);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Damage Reports</h1>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-muted-foreground">No damage reports found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.damageReportId}>
                  <TableCell>
                    <div className="font-semibold">{report.title}</div>
                    <div className="text-xs text-muted-foreground">{report.author}</div>
                  </TableCell>
                  <TableCell>
                    <div>{report.reportedBy}</div>
                    <div className="text-xs text-muted-foreground">{report.reportedByEmail}</div>
                  </TableCell>
                  <TableCell>{dayjs(report.reportedDate).format("MMM D, YYYY")}</TableCell>
                  <TableCell className="max-w-xs truncate">{report.damageDescription}</TableCell>
                  <TableCell>
                    {report.repairCompletedDate ? (
                      <span className="text-green-600">Repaired</span>
                    ) : report.repairDueDate ? (
                      <span className="text-yellow-600">Under Repair</span>
                    ) : report.isReparable === false ? (
                      <span className="text-red-600">Not Repairable</span>
                    ) : (
                      <span className="text-gray-600">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    {!report.repairCompletedDate && report.isReparable !== false && (
                      <>
                        <form action={async () => { await handleAction(report.damageReportId, "under_repair"); }}>
                          <Button variant="outline" size="sm" type="submit">Under Repair</Button>
                        </form>
                        <form action={async () => { await handleAction(report.damageReportId, "repaired"); }}>
                          <Button variant="default" size="sm" type="submit">Mark Repaired</Button>
                        </form>
                        <form action={async () => { await handleAction(report.damageReportId, "not_repairable"); }}>
                          <Button variant="destructive" size="sm" type="submit">Not Repairable</Button>
                        </form>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DamageReportsAdminPage; 