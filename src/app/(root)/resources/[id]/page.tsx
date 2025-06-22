import React from "react";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";
import ResourceOverview from "@/components/resource/ResourceOverview";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const [resourceDetails] = await db
    .select()
    .from(resources)
    .where(eq(resources.resourceId, Number(id)))
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
              {resourceDetails?.description?.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default Page;
