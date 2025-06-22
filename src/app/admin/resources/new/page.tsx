"use client";

import ResourceForm from "@/components/admin/ResourcesForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewResourcePage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-5">
        <div>
          <Link href="/admin/resources" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            <span>Back to Resources</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Add New Resource</h1>
      </div>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>
            Enter the details of the new resource to add to the library.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <ResourceForm type="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewResourcePage;
