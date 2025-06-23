import ResourceCardSkeleton from "@/components/resource/ResourceCardSkeleton";
import SearchContent from "@/components/shared/SearchPageClient";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="px-5 mx-auto max-w-[1440px] sm:px-16">
      <Suspense fallback={
        <div className="search-page_title">
          <p className="font-bebas-neue tracking-widest text-2xl text-center text-light-100 capitalize">
            Loading search...
          </p>
          <div className="grid grid-cols-2 mb-10 md:grid-cols-4 gap-6 mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
};

export default Page;
