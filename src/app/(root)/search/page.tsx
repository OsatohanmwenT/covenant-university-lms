"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useResources } from "@/hooks/useResources";
import SearchInput from "@/components/shared/SearchInput";
import ResourceList from "@/components/resource/ResourceList";
import ResourceCardSkeleton from "@/components/resource/ResourceCardSkeleton";
import ClearSearchButton from "@/components/shared/ClearButton";

const Page = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const format = searchParams.get("format") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  const { data, isLoading } = useResources({ query, format, page, limit });

  return (
    <div className="px-5 mx-auto max-w-[1440px] sm:px-16">
      <section className="search-page_title">
        <p className="font-bebas-neue tracking-widest text-2xl text-center text-light-100 capitalize">
          Discover Your Next Great Read:
        </p>
        <div className="w-full">
          <h1 className="text-white font-semibold text-4xl md:text-6xl">
            Explore and Search for{" "}
            <span className="text-light-200">Any Book</span> In Our Library
          </h1>
        </div>
        <SearchInput query={query} />
      </section>

      <section className="mt-10 md:mt-28 w-full">
        {isLoading ? (
          <div className="grid grid-cols-2 mb-10 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.data?.length > 0 ? (
          <ResourceList
            total={data.total}
            limit={limit}
            currentPage={page}
            format={format}
            resources={data.data}
            title={query ? `Search Result for "${query}"` : "Search Results"}
            type="BOOK LIST"
          />
        ) : (
          <div className="w-full mb-10">
            <div className="max-w-sm flex items-center mx-auto">
              <div className="flex flex-col gap-3 items-center">
                <Image src="/images/no-books.png" width={300} height={300} alt="not found" />
                <p className="text-xl text-white font-semibold">No Result Found</p>
                <p className="text-light-100 max-w-sm text-center font-light">
                  We couldn’t find any books matching your search. Try using
                  different keywords or check for typos.
                </p>
                <ClearSearchButton />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
