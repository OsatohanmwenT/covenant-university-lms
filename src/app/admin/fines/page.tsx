"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle,
  CheckCircle,
  Search,
  Download,
  X
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFines, markFineAsPaid } from "@/lib/actions/fine";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

// Define the Fine type based on the return value of getFines
interface Fine {
  fineId: number;
  loanId: number;
  amountPerDay: number;
  daysOverdue: number;
  totalAmount: string;
  isPaid: boolean;
  datePaid: string | null;
  user: {
    userId: number;
    fullName: string;
    email: string;
    role: string;
  };
  resource: {
    resourceId: number;
    title: string;
    author: string;
    uniqueIdentifier: string;
  };
  dateBorrowed: string;
  dueDate: string;
  dateReturned: string | null;
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState<boolean>(false);
  
  // Fetch fines on component load
  useEffect(() => {
    const fetchFines = async () => {
      try {
        setLoading(true);
        const finesData = await getFines();
        setFines(finesData);
      } catch (error) {
        console.error("Failed to fetch fines:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFines();
  }, []);
  
  // Filter fines based on search and status
  const filteredFines = fines.filter((fine) => {
    // Status filter
    if (statusFilter === "paid" && !fine.isPaid) {
      return false;
    }
    if (statusFilter === "unpaid" && fine.isPaid) {
      return false;
    }
    
    // Search filter (check user name, resource title, or fine ID)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        fine.user?.fullName?.toLowerCase().includes(searchLower) ||
        fine.resource?.title?.toLowerCase().includes(searchLower) ||
        fine.fineId?.toString().includes(searchQuery)
      );
    }
    
    return true;
  });

  const totalUnpaidFines = filteredFines
    .filter((fine) => !fine.isPaid)
    .reduce((acc, fine) => acc + parseFloat(fine.totalAmount), 0);
  
  const handleMarkAsPaid = async (fineId: number) => {
    try {
      await markFineAsPaid(fineId);
      
      // Update the local state
      setFines((prevFines) =>
        prevFines.map((fine) =>
          fine.fineId === fineId
            ? { ...fine, isPaid: true, datePaid: new Date().toISOString() }
            : fine
        )
      );
      
      setIsPaymentDialogOpen(false);
      toast.success("Fine has been marked as paid");
    } catch (error) {
      console.error("Error marking fine as paid:", error);
      toast.error("Failed to mark fine as paid");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fines Management</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Unpaid Fines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalUnpaidFines)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredFines.filter(fine => !fine.isPaid).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collected This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(filteredFines
                .filter(fine => fine.isPaid && new Date(fine.datePaid).getMonth() === new Date().getMonth())
                .reduce((acc, fine) => acc + parseFloat(fine.totalAmount), 0))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, resource or fine ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fines</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Fines table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fine ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading fines data...
                  </TableCell>
                </TableRow>
              ) : filteredFines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No fines found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFines.map((fine) => (
                  <TableRow key={fine.fineId}>
                    <TableCell>{fine.fineId}</TableCell>
                    <TableCell>{fine.user?.fullName}</TableCell>
                    <TableCell>{fine.resource?.title}</TableCell>
                    <TableCell>{fine.daysOverdue}</TableCell>
                    <TableCell>₦{parseFloat(fine.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      {fine.isPaid ? (
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this fine as paid?
            </DialogDescription>
          </DialogHeader>
          
          {selectedFine && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{selectedFine.user?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resource</p>
                  <p className="font-medium">{selectedFine.resource?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">₦{parseFloat(selectedFine.totalAmount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Overdue</p>
                  <p className="font-medium">{selectedFine.daysOverdue}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleMarkAsPaid(selectedFine.fineId)}
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
