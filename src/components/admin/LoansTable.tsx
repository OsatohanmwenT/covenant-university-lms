import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, FileText, ArrowDownToLine, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';

const LoansTable = ({ loans }) => {
  // Function to get status badge
  const getStatusBadge = (status, dueDate) => {
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    
    if (status === 'returned') {
      return <Badge variant="outline" className="bg-gray-100">Returned</Badge>;
    }
    
    if (now > dueDateObj && status === 'borrowed') {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Borrowed</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="py-3 px-4 text-left">Loan ID</th>
            <th className="py-3 px-4 text-left">Resource</th>
            <th className="py-3 px-4 text-left">User</th>
            <th className="py-3 px-4 text-left">Borrowed Date</th>
            <th className="py-3 px-4 text-left">Due Date</th>
            <th className="py-3 px-4 text-left">Return Date</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loans.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 text-center text-gray-500">
                No loans found.
              </td>
            </tr>
          ) : (
            loans.map((loan) => (
              <tr key={loan.loanId} className="hover:bg-gray-50">
                <td className="py-3 px-4">{loan.loanId}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {loan.resource?.resourceImage ? (
                      <img
                        src={loan.resource.resourceImage}
                        alt={loan.resource.title}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                    )}
                    <div>
                      <div className="font-medium">{loan.resource?.title}</div>
                      <div className="text-xs text-gray-500">{loan.resource?.uniqueIdentifier}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{loan.user?.fullName}</div>
                    <div className="text-xs text-gray-500">{loan.user?.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {formatDate(loan.dateBorrowed)}
                </td>
                <td className="py-3 px-4">
                  {formatDate(loan.dueDate)}
                </td>
                <td className="py-3 px-4">
                  {loan.dateReturned ? formatDate(loan.dateReturned) : '-'}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(loan.status, loan.dueDate)}
                </td>
                <td className="py-3 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      {loan.status === 'borrowed' && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <ArrowDownToLine className="h-4 w-4" />
                          <span>Mark as Returned</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoansTable;
