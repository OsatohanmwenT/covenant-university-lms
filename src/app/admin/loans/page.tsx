"use client";

import { useState, useEffect } from "react";
import { getAllLoans } from "@/lib/actions/loan";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch loans on component load
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const loansData = await getAllLoans();
        setLoans(loansData);
      } catch (error) {
        console.error("Failed to fetch loans:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoans();
  }, []);
  
  // Filter loans based on search and status
  const filteredLoans = loans.filter(loan => {
    // Status filter
    if (statusFilter !== "all" && loan !== statusFilter) {
      return false;
    }
    
    // Search filter (check user name, resource title, or loan ID)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        loan.user?.fullName?.toLowerCase().includes(searchLower) ||
        loan.resource?.title?.toLowerCase().includes(searchLower) ||
        loan.loanId?.toString().includes(searchQuery) ||
        loan.uniqueIdentifier?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="admin-container p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Manage Loans</h1>
        
        {/* Filters and search */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-72">
            <Input
              type="text"
              placeholder="Search by title, user or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Image
              src="/icons/admin/search.svg"
              alt="Search icon"
              width={18}
              height={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Image src="/icons/admin/calendar.svg" alt="Calendar" width={16} height={16} />
              <span>Date Range</span>
            </Button>
          </div>
        </div>
        
        {/* Loans table */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <p>Loading loans data...</p>
          </div>
        ) : (
          <LoansTable loans={filteredLoans} />
        )}
      </div>
    </div>
  );
}
