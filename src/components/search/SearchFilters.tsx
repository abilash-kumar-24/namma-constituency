"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";
import representatives from "@/data/representatives.json";
import type { Representative } from "@/types";

const all = representatives as Representative[];
const districts = Array.from(new Set(all.map((r) => r.district))).sort();
const parties = Array.from(new Set(all.map((r) => r.party_short))).sort();

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const district = params.get("district") ?? "";
  const party = params.get("party") ?? "";
  const hasFilters = district || party;

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      router.push(`/search?${next.toString()}`);
    },
    [params, router]
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete("district");
    next.delete("party");
    router.push(`/search?${next.toString()}`);
  }, [params, router]);

  return (
    <div className="flex items-center gap-2 flex-wrap mt-3">
      <select
        value={district}
        onChange={(e) => update("district", e.target.value)}
        className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        aria-label="Filter by district"
      >
        <option value="">All districts</option>
        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        value={party}
        onChange={(e) => update("party", e.target.value)}
        className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        aria-label="Filter by party"
      >
        <option value="">All parties</option>
        {parties.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 border border-slate-300 rounded-lg px-3 py-2 bg-white transition-colors"
          aria-label="Clear filters"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
