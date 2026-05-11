"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { RepresentativeCard } from "@/components/search/RepresentativeCard";
import representatives from "@/data/representatives.json";
import type { Representative } from "@/types";

const all = representatives as Representative[];
const PAGE_SIZE = 30;

export function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const district = params.get("district") ?? "";
  const party = params.get("party") ?? "";

  const [showCount, setShowCount] = useState(PAGE_SIZE);

  // Reset to first page whenever filters change
  useEffect(() => {
    setShowCount(PAGE_SIZE);
  }, [query, district, party]);

  let results = all;

  if (query.trim()) {
    const lower = query.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.constituency.toLowerCase().includes(lower) ||
        r.district.toLowerCase().includes(lower) ||
        r.party.toLowerCase().includes(lower) ||
        r.party_short.toLowerCase().includes(lower)
    );
  }

  if (district) {
    results = results.filter((r) => r.district === district);
  }

  if (party) {
    results = results.filter((r) => r.party_short === party);
  }

  const hasActiveFilters = query.trim() || district || party;
  const visible = results.slice(0, showCount);
  const remaining = results.length - showCount;

  if (results.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">No results found</h2>
        <p className="text-sm text-slate-500 mb-6">
          {query.trim()
            ? `No match for "${query}".`
            : "No constituencies match the selected filters."}{" "}
          Try adjusting your search or filters.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 font-medium hover:underline"
        >
          <ArrowRight className="w-4 h-4" />
          Browse all constituencies
        </Link>
      </div>
    );
  }

  const label = hasActiveFilters
    ? `${results.length} constituency${results.length !== 1 ? " results" : ""}`
    : "All constituencies";

  return (
    <div>
      <p className="text-sm font-medium text-slate-600 mb-4">
        {label}
        {district && <span className="font-normal text-slate-400"> · {district} district</span>}
        {party && <span className="font-normal text-slate-400"> · {party}</span>}
      </p>

      <div className="space-y-4">
        {visible.map((rep) => (
          <RepresentativeCard key={rep.id} rep={rep} showCompareButton={false} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-300 hover:border-teal-400 hover:text-teal-700 bg-white px-5 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <ChevronDown className="w-4 h-4" />
            Load {Math.min(remaining, PAGE_SIZE)} more
            <span className="text-slate-400 font-normal">({remaining} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
