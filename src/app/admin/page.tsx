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

    // <div className="flex flex-col gap-8">
    //   {/* Stats */}
    //   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    //     {stats.map((stat) => (
    //       <Card key={stat.label} className="p-4">
    //         <CardHeader className="p-0 pb-2">
    //           <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
    //         </CardHeader>
    //         <CardContent className="p-0 flex justify-between items-end">
    //           <div className="text-2xl font-semibold">{stat.value}</div>
    //           <div
    //             className={cn(
    //               "text-sm font-medium",
    //               stat.positive ? "text-green-600" : "text-red-600"
    //             )}
    //           >
    //             {stat.change}
    //           </div>
    //         </CardContent>
    //       </Card>
    //     ))}
    //   </div>

    //   {/* Chart and Overdue History */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Check-out statistics</CardTitle>
    //       </CardHeader>
    //       <CardContent className="h-48 flex items-center justify-center text-gray-400">
    //         [Chart Placeholder]
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Overdue History</CardTitle>
    //       </CardHeader>
    //       <CardContent className="overflow-auto">
    //         <Table>
    //           <TableHeader>
    //             <TableRow>
    //               <TableHead>Member ID</TableHead>
    //               <TableHead>Title</TableHead>
    //               <TableHead>ISBN</TableHead>
    //               <TableHead>Due Date</TableHead>
    //               <TableHead>Fine</TableHead>
    //             </TableRow>
    //           </TableHeader>
    //           <TableBody>
    //             {/* Replace with dynamic data */}
    //             <TableRow>
    //               <TableCell>#48964</TableCell>
    //               <TableCell>Magnolia Palace</TableCell>
    //               <TableCell>3234</TableCell>
    //               <TableCell>June 25, 2025</TableCell>
    //               <TableCell>$10</TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>#49012</TableCell>
    //               <TableCell>Don Quixote</TableCell>
    //               <TableCell>9780142437230</TableCell>
    //               <TableCell>June 24, 2025</TableCell>
    //               <TableCell>$10</TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   {/* Recent Check-outs */}
    //   <Card>
    //     <CardHeader className="flex flex-row justify-between items-center">
    //       <CardTitle>Recent Check-outs</CardTitle>
    //       <button className="text-sm text-primary underline">View all</button>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="text-muted-foreground text-center">
    //         [Coming soon]
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>