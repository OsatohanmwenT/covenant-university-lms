import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, AlertCircle } from "lucide-react";
import { db } from "@/database";
import { resources, loan, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import dayjs from "dayjs";
import BookCover from "@/components/shared/BookCover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Page = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);

  // Get resource details
  const [resourceDetail] = await db
    .select()
    .from(resources)
    .where(eq(resources.resourceId, id))
    .limit(1);
  // Get current loans for this resource
  const currentLoans = resourceDetail ? await db
    .select({
      loanId: loan.loanId,
      userId: loan.userId,
      dueDate: loan.dueDate,
      dateReturned: loan.dateReturned,
      status: loan.status,
      fullName: users.fullName,
      role: users.role
    })
    .from(loan)
    .innerJoin(users, eq(loan.userId, users.userId))
    .where(eq(loan.resourceId, id))
    .orderBy(loan.dueDate)
    .limit(5) : [];
  
  // Check if the resource is currently borrowed
  const isBorrowed = currentLoans.some(loan => !loan.dateReturned);

  if (!resourceDetail) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold">Resource Not Found</h2>
        <p className="text-gray-500">Please check the resource ID.</p>
      </div>
    );
  }
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/resources">
          <ArrowLeft className="size-5" /> Go Back
        </Link>
      </Button>

      <section className="w-full">
        <div className="flex items-center gap-5">
          <div className="py-5 px-20 flex items-center justify-center rounded-xl bg-gray-100">
            {resourceDetail.resourceImage ? (
              <BookCover
                variant="wide"
                title={resourceDetail.title}
                resourceImage={resourceDetail.resourceImage as string}
              />
            ) : (
              <div className="w-[140px] h-[180px] bg-gray-300 rounded-md" />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <p className="text-light-500">Added:</p>
              <Image
                src="/icons/admin/calendar.svg"
                alt="calendar"
                width={20}
                height={20}
              />
              <p className="text-light-500">
                {resourceDetail.publicationDate
                  ? dayjs(resourceDetail.publicationDate).format("DD/MM/YYYY")
                  : "N/A"}
              </p>
              
              {/* Availability Status Badge */}
              <Badge
                className="ml-3"
              >
                {isBorrowed ? "Borrowed" : "Available"}
              </Badge>
            </div>
            <p className="text-3xl text-dark-300 font-semibold">
              {resourceDetail.title}
            </p>
            {resourceDetail.author && (
              <p className="text-xl text-dark-300 font-semibold">
                By {resourceDetail.author}
              </p>
            )}
            <p className="text-dark-700 capitalize">
              {resourceDetail.category} | {resourceDetail.format}
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <p>Unique ID: {resourceDetail.uniqueIdentifier}</p>
              <p>Location: {resourceDetail.location}</p>
              <p>Status: {resourceDetail.status}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-2">
              <Button
                asChild
                className="bg-primary-admin py-3 text-white"
              >
                <Link href={`/admin/resources/edit/${resourceDetail.resourceId}`}>
                  <Image
                    src="/icons/admin/edit.svg"
                    alt="edit icon"
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                  <p className="text-white">Edit Resource</p>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="py-3"
                disabled={isBorrowed}
              >
                Mark for Inspection
              </Button>
            </div>
          </div>
        </div>

        {/* Resource Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" /> Borrowing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLoans.length === 0 ? (
                <p className="text-gray-500">No borrowing history available</p>
              ) : (
                <div className="space-y-4">
                  {currentLoans.map((loan) => (
                    <div key={loan.loanId} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{loan.fullName}</p>
                        <p className="text-sm text-gray-500">{loan.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          Due: {dayjs(loan.dueDate).format("MMM DD, YYYY")}
                        </p>
                        <p className="text-sm">
                          {loan.dateReturned 
                            ? `Returned: ${dayjs(loan.dateReturned).format("MMM DD, YYYY")}` 
                            : "Not returned yet"}
                        </p>
                        <Badge 
                          className="mt-1"
                        >
                          {!loan.dateReturned && dayjs().isAfter(loan.dueDate) ? "Overdue" : 
                           !loan.dateReturned ? "Borrowed" : "Returned"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5" /> Resource Policy Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Borrowing Duration:</p>
                  <ul className="list-disc ml-5 text-sm text-gray-500">
                    <li>Students: Maximum of 20 days</li>
                    <li>Faculty/Staff: Maximum of 28 days</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Late Return Policy:</p>
                  <p className="text-sm text-gray-500">₦100 per day, per book for overdue items.</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Resource Details:</p>
                  <ul className="list-disc ml-5 text-sm text-gray-500">
                    <li>Type: {resourceDetail.format || 'Not specified'}</li>
                    <li>Category: {resourceDetail.category || 'Not categorized'}</li>
                    <li>Location: {resourceDetail.location || 'Not specified'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 space-y-5">
          <h3 className="font-semibold text-xl">Notes</h3>
          <p className="text-light-500">
            {/* You can later include a `description` or `notes` field in the schema and show it here */}
            No description available for this resource.
          </p>
        </div>
      </section>
    </>
  );
};

export default Page;
