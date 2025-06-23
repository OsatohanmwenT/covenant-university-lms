"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResourceForm from "@/components/admin/ResourcesForm";

const NewResourcePage = () => (
  <>
    <Button asChild className="back-btn">
      <Link href="/admin/resources">Go Back</Link>
    </Button>
    <section className="w-full max-w-6xl">
      <ResourceForm type="create" />
    </section>
  </>
);

export default NewResourcePage;
