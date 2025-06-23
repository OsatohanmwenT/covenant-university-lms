import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

interface Fine {
  fineId: string;
  loanId: string;
  amountPerDay: number;
  daysOverdue: number;
  totalAmount: number;
  isPaid: boolean;
  datePaid: string | null;
  dueDate: string;
  user: {
    fullName: string;
    email: string;
  };
  resource: {
    title: string;
    uniqueIdentifier: string;
    resourceImage: string;
  };
}

const FinesTable = ({ fines }: { fines: Fine[] }) => {
  return (
    <Table>
      <TableHeader className="table-head">
        <TableRow>
          <TableHead className="max-xl:w-[200px]">Resource</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Days Overdue</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="table-body">
        {fines && fines.length > 0 ? (
          fines.map((fine) => (
            <TableRow key={fine.fineId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={fine.resource.resourceImage}
                    alt={fine.resource.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium line-clamp-1">
                      {fine.resource.title}
                    </p>
                    <p className="text-xs text-light-100">
                      {fine.resource.uniqueIdentifier}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-medium text-sm">{fine.user.fullName}</p>
                  <p className="text-xs text-light-100">{fine.user.email}</p>
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {dayjs(fine.dueDate).format("MMM DD, YYYY")}
              </TableCell>
              <TableCell className="font-semibold">{fine.daysOverdue}</TableCell>
              <TableCell className="font-semibold">₦{fine.totalAmount}</TableCell>
              <TableCell>
                {fine.isPaid ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="destructive">Unpaid</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="bg-sky-50 shadow-none rounded-xl hover:bg-sky-100 text-blue-600"
                >
                  <span>View Receipt</span>
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              No fines available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FinesTable;
