import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ResourceCardSkeleton({ isLoanedBook = false }: { isLoanedBook?: boolean }) {
  return (
    <div className={cn(isLoanedBook ? "xs:w-52 w-full" : undefined)}>
      <div className="relative w-full h-64 mb-4">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
      <div className={cn("mt-4", !isLoanedBook ? "sm:max-w-40 max-w-28" : undefined)}>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      {isLoanedBook && (
        <div className="mt-3 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      )}
    </div>
  );
}