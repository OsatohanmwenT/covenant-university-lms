"use client";

import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ResourceCard from "@/components/resource/ResourceCard";
import { Resource } from "@/types";

interface Props {
  latestResources: Resource[];
}

const LatestArrivals = ({ latestResources }: Props) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="px-5 md:px-16 mb-10 relative">
      <h2 className="font-bebas-neue text-4xl text-light-100">
        Latest Arrivals
      </h2>

      <div className="relative mt-6">
        {/* Scroll Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute cursor-pointer hover:scale-125 transition-all left-0 sm:-left-8 top-1/3 z-10 -translate-y-1/2 bg-white/40 p-2 rounded-full text-white"
        >
          <ArrowLeft className="size-8" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute hover:scale-125 transition-all cursor-pointer right-0 sm:-right-8 top-1/3 z-10 -translate-y-1/2 bg-white/40 p-2 rounded-full text-white"
        >
          <ArrowRight className="size-8" />
        </button>

        {/* Scrollable List */}
        <div
          ref={scrollRef}
          className="overflow-x-auto hide-scrollbar scroll-smooth"
        >
          <ul className="flex gap-6 min-w-full pr-6">
            {latestResources.map((resource) => (
              <li key={resource.resourceId} className="min-w-[250px]">
                <ResourceCard variant="regular" {...resource} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LatestArrivals;
