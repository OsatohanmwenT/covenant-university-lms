"use client";
import React, { useState } from "react";
import {
  approveAcquisitionRequest,
  rejectAcquisitionRequest,
  createResourceFromRequest,
} from "@/lib/admin/actions/acquisition";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ClientRequestActions = ({ requestId }: { requestId: number }) => {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handleApprove = async () => {
    setLoading("approve");
    try {
      await approveAcquisitionRequest(requestId, 1); // Replace `1` with actual admin ID if available
      await createResourceFromRequest(requestId);
      toast.success("Resource approved and added to inventory");
    } catch {
      toast.error("Failed to approve request");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    setLoading("reject");
    try {
      await rejectAcquisitionRequest(requestId);
      toast.success("Request rejected");
    } catch {
      toast.error("Failed to reject request");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        disabled={loading !== null}
        onClick={handleApprove}
      >
        {loading === "approve" ? "Approving..." : "Approve"}
      </Button>
      <Button
        variant="destructive"
        disabled={loading !== null}
        onClick={handleReject}
      >
        {loading === "reject" ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
};

export default ClientRequestActions;
