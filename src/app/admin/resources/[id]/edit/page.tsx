import React from "react";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResourceForm from "@/components/admin/ResourcesForm";

const EditResourcePage = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;
  const resourceId = Number(id);

  if (isNaN(resourceId) || resourceId <= 0) {
    redirect("/admin/resources");
  }

  const [resourceDetails] = await db
    .select()
    .from(resources)
    .where(eq(resources.resourceId, resourceId))
    .limit(1);

  if (!resourceDetails) {
    redirect("/admin/resources");
  }

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/resources">Go Back</Link>
      </Button>
      <section className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>
        <ResourceForm type="update" resource={resourceDetails} />
      </section>
    </>
  );
};

export default EditResourcePage;
