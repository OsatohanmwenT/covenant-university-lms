import { Suspense } from "react";
import SearchPageClient from "@/components/shared/SearchPageClient";

export default function Page() {
  return (
    <div className="px-5 mx-auto max-w-[1440px] sm:px-16">
      <Suspense fallback={<div className="text-white">Loading search...</div>}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}
