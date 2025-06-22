import React from "react";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";
import ResourceOverview from "@/components/resource/ResourceOverview";

const Page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;
  const session = await auth();

  const resourceId = Number(id);
  
  if (isNaN(resourceId) || resourceId <= 0) {
    return <div>Invalid resource ID</div>;
  }

  const [resourceDetails] = await db
    .select()
    .from(resources)
    .where(eq(resources.resourceId, resourceId))
    .limit(1);

  if (!resourceDetails) redirect("/404");   
  return (
    <div className="px-5 mx-auto max-w-[1440px] sm:px-16">
      <ResourceOverview
        {...resourceDetails}
        publicationDate={resourceDetails.publicationDate ?? new Date(0)}
        userId={session?.user?.id as string}
      />
      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              No description available for this resource.
            </div>
          </section>
          
          {/* Policy Information Section */}
          <section className="mt-10 flex flex-col gap-5">
            <h3 className="font-semibold text-xl">Borrowing Policy Information</h3>
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-lg border border-dark-200">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="text-light-100">
                    <strong className="text-primary">Borrowing Duration:</strong> Students can borrow for up to 20 days. Faculty and staff can borrow for up to 28 days.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="text-light-100">
                    <strong className="text-primary">Late Return Policy:</strong> ₦100 per day, per book for overdue items.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="text-light-100">
                    <strong className="text-primary">Notifications:</strong> You will receive email notifications two days before the due date and daily if your item becomes overdue.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="text-light-100">
                    <strong className="text-primary">Eligibility:</strong> Borrowing is restricted for users with unpaid fines.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default Page;
