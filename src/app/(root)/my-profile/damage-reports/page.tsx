import React from "react";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { damageReport, resources } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wrench, X, CheckCircle, AlertCircle } from "lucide-react";

const DamageReportsPage = async () => {
  const session = await auth();
  
  // Redirect to login if user is not authenticated
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/my-profile/damage-reports");
  }

  const userId = parseInt(session.user.id);
  
  // Get all damage reports submitted by this user
  const userDamageReports = await db
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
    })
    .from(damageReport)
    .innerJoin(resources, eq(damageReport.resourceId, resources.resourceId))
    .where(eq(damageReport.reportedByUserId, userId))
    .orderBy(desc(damageReport.reportedDate));

  // Determine report status
  const getReportStatus = (report: typeof userDamageReports[0]) => {
    if (report.repairCompletedDate) {
      return {
        label: "Repaired",
        variant: "success" as const,
        icon: <CheckCircle className="h-4 w-4" />,
      };
    }
    
    if (report.repairDueDate) {
      const isOverdue = dayjs().isAfter(report.repairDueDate);
      if (isOverdue) {
        return {
          label: "Repair Overdue",
          variant: "destructive" as const,
          icon: <AlertCircle className="h-4 w-4" />,
        };
      } else {
        return {
          label: "Under Repair",
          variant: "warning" as const,
          icon: <Wrench className="h-4 w-4" />,
        };
      }
    }
    
    if (report.isReparable) {
      return {
        label: "Pending Repair",
        variant: "default" as const,
        icon: <Wrench className="h-4 w-4" />,
      };
    } else {
      return {
        label: "Not Repairable",
        variant: "destructive" as const,
        icon: <X className="h-4 w-4" />,
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-200">Damage Reports</h1>
        <p className="text-gray-500 mt-2">
          View your submitted damage reports and their current status
        </p>
      </div>
      
      {userDamageReports.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-lg">
          <p className="text-lg text-gray-600">
            You haven&apos;t submitted any damage reports yet
          </p>
          <p className="text-gray-500 mt-2">
            If you&apos;ve found a damaged resource, please report it to library staff
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Reported
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Damage Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userDamageReports.map((report) => {
                const status = getReportStatus(report);
                
                return (
                  <tr key={report.damageReportId}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-4">
                          {report.resourceImage ? (
                            <img 
                              className="h-10 w-10 rounded object-cover" 
                              src={report.resourceImage}
                              alt={report.title} 
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          <div className="text-sm text-gray-500">{report.author || "No author"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(report.reportedDate).format("MMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{report.damageDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="flex items-center gap-1">
                        {status.icon}
                        <span>{status.label}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/resources/${report.resourceId}`}>
                        <Button variant="ghost" size="sm">
                          View Resource
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DamageReportsPage;
