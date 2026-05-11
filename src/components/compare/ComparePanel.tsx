import { AlertTriangle, CheckCircle, TrendingUp, GraduationCap, Briefcase } from "lucide-react";
import type { Representative, DistrictIndicator } from "@/types";
import {
  getPartyColor,
  getCriminalBadgeColor,
  getInitials,
  getAvatarBg,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  repA: Representative;
  repB: Representative;
  indicatorsA: DistrictIndicator[];
  indicatorsB: DistrictIndicator[];
}

export function ComparePanel({ repA, repB, indicatorsA, indicatorsB }: Props) {
  const rows: {
    label: string;
    a: React.ReactNode;
    b: React.ReactNode;
  }[] = [
    {
      label: "Party",
      a: <Badge className={getPartyColor(repA.party_short)}>{repA.party_short}</Badge>,
      b: <Badge className={getPartyColor(repB.party_short)}>{repB.party_short}</Badge>,
    },
    {
      label: "District",
      a: <span className="text-sm text-slate-700">{repA.district}</span>,
      b: <span className="text-sm text-slate-700">{repB.district}</span>,
    },
    {
      label: "Age",
      a: <span className="text-sm text-slate-700">{repA.age} yrs</span>,
      b: <span className="text-sm text-slate-700">{repB.age} yrs</span>,
    },
    {
      label: "Criminal cases",
      a: (
        <span
          className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded ${getCriminalBadgeColor(repA.criminal_cases)}`}
        >
          {repA.criminal_cases === 0 ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          {repA.criminal_cases}
        </span>
      ),
      b: (
        <span
          className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded ${getCriminalBadgeColor(repB.criminal_cases)}`}
        >
          {repB.criminal_cases === 0 ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          {repB.criminal_cases}
        </span>
      ),
    },
    {
      label: "Serious cases",
      a: (
        <span
          className={`text-sm font-semibold ${repA.serious_criminal_cases > 0 ? "text-red-600" : "text-emerald-600"}`}
        >
          {repA.serious_criminal_cases}
        </span>
      ),
      b: (
        <span
          className={`text-sm font-semibold ${repB.serious_criminal_cases > 0 ? "text-red-600" : "text-emerald-600"}`}
        >
          {repB.serious_criminal_cases}
        </span>
      ),
    },
    {
      label: "Declared assets",
      a: (
        <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {repA.assets}
        </span>
      ),
      b: (
        <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {repB.assets}
        </span>
      ),
    },
    {
      label: "Liabilities",
      a: <span className="text-sm text-slate-700">{repA.liabilities}</span>,
      b: <span className="text-sm text-slate-700">{repB.liabilities}</span>,
    },
    {
      label: "Education",
      a: (
        <span className="text-sm text-slate-700 flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
          {repA.education}
        </span>
      ),
      b: (
        <span className="text-sm text-slate-700 flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
          {repB.education}
        </span>
      ),
    },
    {
      label: "Profession",
      a: (
        <span className="text-sm text-slate-700 flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          {repA.profession}
        </span>
      ),
      b: (
        <span className="text-sm text-slate-700 flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          {repB.profession}
        </span>
      ),
    },
  ];

  // shared indicators
  const indicatorLabels = [...new Set([...indicatorsA, ...indicatorsB].map((i) => i.metric_name))];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-slate-200">
        <div className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide" />
        <div className="px-4 py-4 border-l border-slate-100">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full ${getAvatarBg(repA.photo_placeholder)} text-white text-sm font-bold flex items-center justify-center shrink-0`}
            >
              {getInitials(repA.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{repA.name}</p>
              <p className="text-xs text-slate-500 truncate">{repA.constituency}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 border-l border-slate-100">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full ${getAvatarBg(repB.photo_placeholder)} text-white text-sm font-bold flex items-center justify-center shrink-0`}
            >
              {getInitials(repB.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{repB.name}</p>
              <p className="text-xs text-slate-500 truncate">{repB.constituency}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
        >
          <div className="px-4 py-3 text-xs font-medium text-slate-500">{row.label}</div>
          <div className="px-4 py-3 border-l border-slate-100">{row.a}</div>
          <div className="px-4 py-3 border-l border-slate-100">{row.b}</div>
        </div>
      ))}

      {/* Indicators */}
      {indicatorLabels.length > 0 && (
        <>
          <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              District indicators (latest year)
            </p>
          </div>
          {indicatorLabels.slice(0, 4).map((label, i) => {
            const a = indicatorsA.find((ind) => ind.metric_name === label);
            const b = indicatorsB.find((ind) => ind.metric_name === label);
            return (
              <div
                key={label}
                className={`grid grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
              >
                <div className="px-4 py-3 text-xs font-medium text-slate-500 leading-snug">
                  {label}
                </div>
                <div className="px-4 py-3 border-l border-slate-100">
                  {a ? (
                    <span className="text-sm font-semibold text-slate-800">
                      {a.metric_value}{" "}
                      <span className="text-xs text-slate-400 font-normal">{a.unit}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
                <div className="px-4 py-3 border-l border-slate-100">
                  {b ? (
                    <span className="text-sm font-semibold text-slate-800">
                      {b.metric_value}{" "}
                      <span className="text-xs text-slate-400 font-normal">{b.unit}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      <div className="bg-amber-50 border-t border-amber-100 px-4 py-3">
        <p className="text-xs text-amber-700">
          Data is from public affidavits and open government datasets. This comparison is for
          informational purposes and should not be used as an official ranking.
        </p>
      </div>
    </div>
  );
}
