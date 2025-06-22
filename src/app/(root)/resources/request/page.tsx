import React from "react";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import ResourceRequestForm from "./ResourceRequestForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RequestResourcePage = async () => {
  const session = await auth();
  
  // Redirect to login if user is not authenticated
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/resources/request");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="outline">
          <Link href="/resources/search">
            <span>← Back to Search</span>
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Request New Resource</CardTitle>
          <CardDescription>
            Submit a request for the library to acquire a new resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Please provide as much information as possible about the resource you would like the library to acquire. 
              Your request will be reviewed by the Library Acquisition Committee.
            </p>
            <Separator className="my-4" />
          </div>
          
          <ResourceRequestForm userId={session.user.id} />
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="font-medium text-blue-800 mb-2">Need help finding resources?</h3>
        <p className="text-sm text-blue-700">
          Before requesting a new resource, consider checking our existing catalog or 
          speaking with a librarian who might help you locate similar materials that are already available.
        </p>
      </div>
    </div>
  );
};

export default RequestResourcePage;
