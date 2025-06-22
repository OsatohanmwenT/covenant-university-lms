"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { approveAcquisitionRequest, rejectAcquisitionRequest } from "@/lib/admin/actions/request";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type RequestType = {
  requestId: number;
  title: string;
  author: string | null;
  resourceIdentifier: string;
  publicationDate: Date | null;
  requestedDate: Date;
  isApproved: boolean;
  requestedByUserId: number;
  approvedByUserId: number | null;
  requestedBy: string;
  requestedByEmail: string;
};

interface AcquisitionRequestActionsProps {
  request: RequestType;
  adminId: number;
}

const AcquisitionRequestActions = ({ request, adminId }: AcquisitionRequestActionsProps) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const result = await approveAcquisitionRequest(request.requestId, adminId);
      
      if (result.success) {
        toast.success("The acquisition request has been approved successfully.");
        setIsApproveDialogOpen(false);
        // Force a page reload to get the updated data
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to approve request");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await rejectAcquisitionRequest(request.requestId, rejectionReason);
      
      if (result.success) {
        toast.error("The acquisition request has been rejected");
        setIsRejectDialogOpen(false);
        // Force a page reload to get the updated data
        window.location.reload();
      } else {
        toast.error("Failed to reject request");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (request.isApproved) {
    return (
      <div className="text-sm text-gray-500">
        Already approved
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          onClick={() => setIsApproveDialogOpen(true)}
        >
          <CheckCircle className="h-4 w-4 mr-1" /> Approve
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          onClick={() => setIsRejectDialogOpen(true)}
        >
          <XCircle className="h-4 w-4 mr-1" /> Reject
        </Button>
      </div>
      
      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Resource Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve the request for "{request.title}"? This will notify the user that their request has been approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Approving..." : "Approve Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Resource Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the request for "{request.title}". This information will be sent to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Reason for rejection:</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject} 
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              {isSubmitting ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AcquisitionRequestActions;
