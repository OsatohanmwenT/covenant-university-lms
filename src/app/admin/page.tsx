"use client";

import React from "react";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import AdminGrid from "@/components/admin/AdminGrid";

const stats = [
  { label: "Borrowed Books", value: 2405, change: "+23%", positive: true },
  { label: "Returned Books", value: 783, change: "-14%", positive: false },
  { label: "Overdue Books", value: 45, change: "+11%", positive: true },
  { label: "Missing Books", value: 12, change: "+11%", positive: true },
  { label: "Total Books", value: 32345, change: "+11%", positive: true },
  { label: "Visitors", value: 1504, change: "+3%", positive: true },
  { label: "New Members", value: 34, change: "-10%", positive: false },
  { label: "Pending Fees", value: "$765", change: "+56%", positive: true },
];

export default function Page() {
  return (
    <main>
      <AnalyticsSection />
      <AdminGrid />
    </main>
  );
}