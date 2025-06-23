import React from "react";
import { getPendingAcquisitionRequests } from "@/lib/admin/actions/acquisition";
import ClientRequestActions from "@/components/admin/ClientRequestActions";


const RequestsPage = async () => {
  const requests = await getPendingAcquisitionRequests();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Acquisition Requests</h1>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-muted-foreground">No pending requests.</div>
        ) : (
          requests.map((req) => (
            <div
              key={req.requestId}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <div className="font-semibold">{req.title}</div>
                <div className="text-sm text-muted-foreground">{req.author}</div>
                <div className="text-xs">Requested by: {req.requestedBy}</div>
                <div className="text-xs">
                  Requested on: {new Date(req.requestedDate).toLocaleDateString()}
                </div>
              </div>
              <ClientRequestActions requestId={req.requestId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
