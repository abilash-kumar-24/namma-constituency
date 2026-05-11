"use client";

import { useState } from "react";
import { GitCompare, ArrowRight } from "lucide-react";
import { ComparePanel } from "@/components/compare/ComparePanel";
import representatives from "@/data/representatives.json";
import districtIndicators from "@/data/districtIndicators.json";
import type { Representative, DistrictIndicator, DistrictIndicatorGroup } from "@/types";

const reps = representatives as Representative[];
const allDistrictIndicators = districtIndicators as DistrictIndicatorGroup[];

interface Props {
  initialA?: string;
  initialB?: string;
}

export function ComparePageClient({ initialA = "", initialB = "" }: Props) {
  const [selectedA, setSelectedA] = useState(initialA || "");
  const [selectedB, setSelectedB] = useState(initialB || "");

  const repA = reps.find((r) => r.id === selectedA);
  const repB = reps.find((r) => r.id === selectedB);
  const indicatorsA: DistrictIndicator[] =
    allDistrictIndicators.find((g) => g.district === repA?.district)?.indicators ?? [];
  const indicatorsB: DistrictIndicator[] =
    allDistrictIndicators.find((g) => g.district === repB?.district)?.indicators ?? [];

  const canCompare = repA && repB && selectedA !== selectedB;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Compare constituencies</h1>
        <p className="text-sm text-slate-500">
          Select two constituencies to compare their representatives side by side.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ConstituencySelector
          label="First constituency"
          value={selectedA}
          onChange={setSelectedA}
          excludeId={selectedB}
        />
        <ConstituencySelector
          label="Second constituency"
          value={selectedB}
          onChange={setSelectedB}
          excludeId={selectedA}
        />
      </div>

      {/* Compare action */}
      {!canCompare && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <GitCompare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-slate-600 mb-1">
            Choose two different constituencies
          </h2>
          <p className="text-sm text-slate-400">
            Use the selectors above to pick the constituencies you want to compare.
          </p>
        </div>
      )}

      {canCompare && (
        <ComparePanel
          repA={repA}
          repB={repB}
          indicatorsA={indicatorsA}
          indicatorsB={indicatorsB}
        />
      )}

      {/* Explore links */}
      <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <a
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          Browse all constituencies
        </a>
      </div>
    </div>
  );
}

interface SelectorProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  excludeId?: string;
}

function ConstituencySelector({ label, value, onChange, excludeId }: SelectorProps) {
  const options = reps.filter((r) => r.id !== excludeId);
  const selected = reps.find((r) => r.id === value);

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none cursor-pointer"
        aria-label={label}
      >
        <option value="">Select a constituency…</option>
        {options.map((r) => (
          <option key={r.id} value={r.id}>
            {r.constituency} — {r.name} ({r.party_short})
          </option>
        ))}
      </select>
      {selected && (
        <p className="text-xs text-slate-500 mt-1.5 pl-1">
          {selected.district} · {selected.party_short} · {selected.age} yrs
        </p>
      )}
    </div>
  );
}
