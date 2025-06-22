import React from "react";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { getAcquisitionRequests } from "@/lib/admin/actions/request";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AcquisitionRequestActions from "@/components/admin/AcquisitionRequestActions";
import dayjs from "dayjs";

const AdminRequestsPage = async () => {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/sign-in?callbackUrl=/admin/requests");
  }

  const { success, requests, error } = await getAcquisitionRequests();

  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 text-lg">Error loading requests: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resource Acquisition Requests</h1>
        <p className="text-gray-500 mt-2">
          Review and manage resource acquisition requests from users
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-10">
          <p className="text-gray-500 text-lg">No acquisition requests found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Identifier</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.requestId}>
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell>{request.author || "—"}</TableCell>
                  <TableCell>{request.resourceIdentifier}</TableCell>
                  <TableCell>
                    <div>
                      <div>{request.requestedBy}</div>
                      <div className="text-xs text-gray-500">{request.requestedByEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(request.requestedDate).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell>
                    {request.isApproved ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <AcquisitionRequestActions
                      request={request}
                      adminId={parseInt(session.user.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminRequestsPage;
