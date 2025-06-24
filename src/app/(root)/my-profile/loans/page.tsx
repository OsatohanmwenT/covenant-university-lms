import React from "react";
import { auth } from "@/lib/actions/auth";
import { db } from "@/database";
import { loan, resources } from "@/database/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import ResourceList from "@/components/resource/ResourceList";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BookCover from "@/components/shared/BookCover";

const Page = async () => {
  const session = await auth();
  if (!session?.user) {
    return <div>Please sign in to view your loans.</div>;
  }

  const userId = parseInt(session.user.id);

  const currentLoans = await db
    .select({
      loanId: loan.loanId,
      resourceId: loan.resourceId,
      dateBorrowed: loan.dateBorrowed,
      dueDate: loan.dueDate,
      status: loan.status,
      title: resources.title,
      author: resources.author,
      resourceImage: resources.resourceImage,
      category: resources.category,
    })
    .from(loan)
    .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
    .where(
      and(
        eq(loan.userId, userId),
        isNull(loan.dateReturned),
      )
    )
    .orderBy(loan.dueDate);

  // Past loans
  const pastLoans = await db
    .select({
      loanId: loan.loanId,
      resourceId: loan.resourceId,
      dateBorrowed: loan.dateBorrowed,
      dueDate: loan.dueDate,
      dateReturned: loan.dateReturned,
      status: loan.status,
      title: resources.title,
      author: resources.author,
      resourceImage: resources.resourceImage,
      category: resources.category,
    })
    .from(loan)
    .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
    .where(and(eq(loan.userId, userId), loan.dateReturned))
    .orderBy(desc(loan.dateReturned));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-light-200">My Loans</h1>
        <p className="text-light-100 mt-2">
          View and manage your borrowed resources
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="mb-8 bg-dark-300">
          <TabsTrigger
            className="data-[state=active]:bg-dark-100 text-white"
            value="current"
          >
            Current Loans ({currentLoans.length})
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-dark-100 text-white"
            value="past"
          >
            Past Loans ({pastLoans.length})
          </TabsTrigger>
        </TabsList>

        {/* Use ResourceList for Current Loans */}
        <TabsContent value="current">
          {currentLoans.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-lg">
              <p className="text-lg text-light-200">
                You have no current loans.
              </p>
              <Link href="/search">
                <Button className="mt-4 cursor-pointer">Browse Resources</Button>
              </Link>
            </div>
          ) : (
            <ResourceList
              format=""
              currentPage={1}
              total={currentLoans.length}
              limit={100}
              resources={currentLoans}
              title="Borrowed Resources"
              type="BORROW LIST"
            />
          )}
        </TabsContent>

        {/* Use a table for Past Loans */}
        <TabsContent value="past">
          {pastLoans.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-lg">
              <p className="text-lg text-light-200">
                You don't have any past loans.
              </p>
               <Link href="/search">
                <Button className="mt-4 cursor-pointer">Browse Resources</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Resource",
                      "Borrowed",
                      "Due Date",
                      "Returned",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white/5 backdrop-blur-lg divide-y divide-gray-200">
                  {pastLoans.map((item) => {
                    const wasOverdue = dayjs(item.dateReturned).isAfter(
                      dayjs(item.dueDate)
                    );

                    return (
                      <tr key={item.loanId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <BookCover
                                variant="small"
                                title={item.title}
                                resourceImage={item.resourceImage}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.author || "No author"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {dayjs(item.dateBorrowed).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {dayjs(item.dueDate).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {dayjs(item.dateReturned).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="text-xs">
                            {wasOverdue ? "Returned Late" : "Returned On Time"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/resources/${item.resourceId}`}>
                            <Button variant="ghost" size="sm">
                              Details
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
