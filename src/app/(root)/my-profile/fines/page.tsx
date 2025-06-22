import React from "react";
import { auth } from "@/lib/actions/auth";
import { db } from "@/database";
import { fine, loan, resources } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, AlertCircle, Receipt, CheckCircle } from "lucide-react";

const PayFineButton = ({ fineId }: { fineId: number }) => {
  return (
    <form action={`/api/fines/pay?fineId=${fineId}`} method="POST">
      <Button className="w-full">Pay Fine</Button>
    </form>
  );
};

const FinesPage = async () => {
  const session = await auth();
  if (!session?.user) {
    return <div>Please sign in to view your fines.</div>;
  }

  const userId = parseInt(session.user.id);

  // Get all fines for this user
  const userFines = await db
    .select({
      fineId: fine.fineId,
      loanId: fine.loanId,
      amountPerDay: fine.amountPerDay,
      daysOverdue: fine.daysOverdue,
      totalAmount: fine.totalAmount,
      isPaid: fine.isPaid,
      datePaid: fine.datePaid,
      resourceId: loan.resourceId,
      title: resources.title,
      author: resources.author,
      dueDate: loan.dueDate,
      dateReturned: loan.dateReturned,
    })
    .from(fine)
    .innerJoin(loan, eq(fine.loanId, loan.loanId))
    .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
    .where(eq(loan.userId, userId))
    .orderBy(fine.isPaid, fine.datePaid);

  const unpaidFines = userFines.filter(fine => !fine.isPaid);
  const paidFines = userFines.filter(fine => fine.isPaid);
  
  const totalUnpaid = unpaidFines.reduce((acc, fine) => 
    acc + parseFloat(fine.totalAmount as string), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-light-200">My Fines</h1>
        <p className="text-light-100 mt-2">
          Manage your outstanding fines and payment history
        </p>
      </div>
      
      {/* Summary card */}
      {unpaidFines.length > 0 && (
        <Card className="mb-8 border-dark-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-light-200 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Outstanding Fines
            </CardTitle>
            <CardDescription className="text-light-100">
              You have {unpaidFines.length} unpaid {unpaidFines.length === 1 ? 'fine' : 'fines'} totaling ₦{totalUnpaid.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="text-sm">
              Please settle your fines to continue borrowing resources from the library.
              You can pay your fines at the library circulation desk or online through the payment portal.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Unpaid fines */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-light-200 font-semibold">Unpaid Fines</h2>
          {unpaidFines.length > 0 && (
            <Button>Pay All Fines</Button>
          )}
        </div>
        
        {unpaidFines.length === 0 ? (
          <div className="bg-light-100/10 backdrop-blur-3xl rounded-lg p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-light-200 font-semibold">You have no outstanding fines</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {unpaidFines.map((fine) => (
              <Card key={fine.fineId} className="overflow-hidden">
                <CardHeader className="bg-red-50 pb-3">
                  <div className="flex justify-between">
                    <CardTitle>{fine.title}</CardTitle>
                    <p className="text-xl font-bold text-red-600">₦{parseFloat(fine.totalAmount as string).toFixed(2)}</p>
                  </div>
                  <CardDescription>{fine.author || "No author"}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Overdue by:</span>
                      <span className="font-medium">{fine.daysOverdue} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due date:</span>
                      <span>{dayjs(fine.dueDate).format("MMM D, YYYY")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Returned:</span>
                      <span>
                        {fine.dateReturned 
                          ? dayjs(fine.dateReturned).format("MMM D, YYYY")
                          : "Not yet returned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate:</span>
                      <span>₦{fine.amountPerDay}/day</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50 border-t">
                  <Link href={`/resources/${fine.resourceId}`}>
                    <Button variant="ghost" size="sm">View Resource</Button>
                  </Link>
                  <PayFineButton fineId={fine.fineId} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Payment history */}
      <div>
        <h2 className="text-xl text-light-200 font-semibold mb-4">Payment History</h2>
        
        {paidFines.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 text-center">
            <p className="text-neutral-500">No payment history available</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Days
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Paid
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paidFines.map((fine) => (
                  <tr key={fine.fineId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{fine.title}</div>
                        <div className="text-sm text-gray-500">{fine.author || "No author"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        ₦{parseFloat(fine.totalAmount as string).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fine.daysOverdue} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(fine.datePaid).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinesPage;
