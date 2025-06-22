import React from "react";
import { db } from "@/database";
import { loan, resources } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ResourceList from "@/components/resource/ResourceList";
import UserTag from "@/components/shared/UserTag";
import { auth } from "@/lib/actions/auth";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) return redirect("/sign-in");

  const borrowedResources = await db
    .select({
      resourceId: resources.resourceId,
      title: resources.title,
      author: resources.author,
      genre: resources.category,
      resourceImage: resources.resourceImage,
      borrowDate: loan.dateBorrowed,
      dueDate: loan.dueDate,
    })
    .from(loan)
    .leftJoin(resources, eq(loan.resourceId, resources.resourceId))
    .where(eq(loan.userId, Number(session.user.id)));

  return (
    <div className="flex px-5 mx-auto max-w-[1440px] sm:px-16 flex-col gap-10 xl:flex-row xl:gap-20">
      <UserTag />
      <ResourceList
        resources={borrowedResources}
        type="BORROW LIST"
        title="Borrowed Books"
        containerClass="w-full"
        format={""}
        currentPage={0}
        total={0}
        limit={0}
      />
    </div>
  );
};

export default Page;
