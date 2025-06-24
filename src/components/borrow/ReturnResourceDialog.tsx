"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Check, AlertCircle } from "lucide-react";
import { returnResource } from "@/lib/actions/return-resource";
import { toast } from "sonner";
import dayjs from "dayjs";

interface ReturnResourceProps {
  loanId: number;
  resourceTitle: string;
  dueDate: Date;
  trigger?: React.ReactNode;
}

const ReturnResourceDialog = ({ loanId, resourceTitle, dueDate, trigger }: ReturnResourceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [returnResult, setReturnResult] = useState<any>(null);
  
  // Check if the resource is overdue
  const isOverdue = dayjs().isAfter(dueDate);
  const daysOverdue = isOverdue ? dayjs().diff(dueDate, 'day') : 0;
  const estimatedFine = daysOverdue * 100; // ₦100 per day
  
  const handleReturn = async () => {
    setIsProcessing(true);
    
    try {
      const result = await returnResource(loanId);
      
      if (result.success) {
        setReturnResult(result);
        toast.success("Resource returned successfully");
      } else {
        toast.error(result.error || "Failed to return resource");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error returning resource:", error);
      toast.error("An error occurred while processing your return");
      setIsOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Return Resource</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!returnResult ? (
          <>
            <DialogHeader>
              <DialogTitle>Return Resource</DialogTitle>
              <DialogDescription>
                You are returning: <strong>{resourceTitle}</strong>
              </DialogDescription>
            </DialogHeader>

            {isOverdue && (
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex gap-2">
                <AlertCircle className="text-amber-500 h-5 w-5 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    This resource is overdue by {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-sm text-amber-700">
                    Estimated fine: ₦{estimatedFine}
                  </p>
                </div>
              </div>
            )}

            <div className="py-4">
              <p className="text-sm text-gray-500">
                Please confirm that you want to return this resource. This action cannot be undone.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleReturn} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Confirm Return"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="text-green-500 h-5 w-5" />
                Return Successful
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="mb-4">
                <strong>{resourceTitle}</strong> has been successfully returned.
              </p>
              
              {returnResult.isOverdue && (
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="font-medium text-amber-800">
                    This resource was returned {returnResult.daysLate} {returnResult.daysLate === 1 ? 'day' : 'days'} late.
                  </p>
                  <p className="text-sm text-amber-700">
                    A fine of ₦{returnResult.daysLate * 100} has been applied to your account.
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    Please pay your fine at the circulation desk or through the payment portal.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReturnResourceDialog;
