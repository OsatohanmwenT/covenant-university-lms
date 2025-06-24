import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import BookCover from "../shared/BookCover";
import { Receipt } from "lucide-react";
import ModeButton from "./ModeButton";

interface Loan {
  loanId: number;
  resourceId: number;
  userId: number;
  dateBorrowed: Date;
  dueDate: Date;
  dateReturned: Date | null;
  status: string | null;
  user: {
    fullName: string;
    email: string;
  } | null;
  resource: {
    title: string;
    uniqueIdentifier: string;
    resourceImage: string | null;
  } | null;
}

interface LoansTableProps {
  loans: Loan[]; // Pass the current user's role from parent
}

const LoansTable = ({ loans }: LoansTableProps) => {
  return (
    <Table>
      <TableHeader className="table-head">
        <TableRow>
          <TableHead className="max-xl:w-[200px]">Book</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Borrowed date</TableHead>
          <TableHead>Return date</TableHead>
          <TableHead>Due date</TableHead>
          <TableHead>Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="table-body hide-scrollbar">
        {loans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No loans found.
            </TableCell>
          </TableRow>
        ) : (
          loans.map((loan) => (
            <TableRow key={`loan.loanId-${loan.loanId}-${loan.userId}-${loan.resourceId}`}>
              <TableCell>
                <Link
                  className="flex items-center gap-2"
                  href={`/admin/resources/${loan.resourceId}`}
                >
                  <BookCover
                    variant="extraSmall"
                    title={loan?.resource?.title as string}
                    resourceImage={loan.resource?.resourceImage || ""}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium line-clamp-1">
                      {loan.resource?.title}
                    </p>
                    <p className="text-xs text-dark-400">
                      {loan.resource?.uniqueIdentifier}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-medium text-sm">{loan.user?.fullName}</p>
                  <p className="text-xs text-light-100">{loan.user?.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {/* Replace status badge with ModeButton for admins */}
                <ModeButton
                  initialMode={loan.status as any}
                  userId={loan.loanId}
                  type="STATUS"
                  currentUserRole={loan.status}
                />
              </TableCell>
              <TableCell className="font-semibold">
                {dayjs(loan.dateBorrowed).format("MMM DD, YYYY")}
              </TableCell>
              <TableCell className="font-semibold">
                {loan.dateReturned
                  ? dayjs(loan.dateReturned).format("MMM DD, YYYY")
                  : "-"}
              </TableCell>
              <TableCell className="font-semibold">
                {dayjs(loan.dueDate).format("MMM DD, YYYY")}
              </TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  className="bg-sky-50 shadow-none rounded-xl hover:bg-sky-100 text-blue-600"
                >
                  <Receipt color="fill-blue-600" />
                  <p>Generate</p>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LoansTable;
