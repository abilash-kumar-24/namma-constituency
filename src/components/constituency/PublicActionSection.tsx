"use client";

import { useState } from "react";
import {
  Construction,
  Droplets,
  Waves,
  Trash2,
  Bus,
  HeartHandshake,
  ChevronRight,
  X,
  ExternalLink,
  ClipboardList,
  CheckSquare,
} from "lucide-react";
import type { IssueGuidance } from "@/types";
import issueGuidanceData from "@/data/issueGuidance.json";
import { Card, CardBody } from "@/components/ui/Card";

const iconMap: Record<string, React.ReactNode> = {
  construction: <Construction className="w-5 h-5" />,
  droplets: <Droplets className="w-5 h-5" />,
  waves: <Waves className="w-5 h-5" />,
  "trash-2": <Trash2 className="w-5 h-5" />,
  bus: <Bus className="w-5 h-5" />,
  "heart-handshake": <HeartHandshake className="w-5 h-5" />,
};

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
  },
  gray: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    iconBg: "bg-slate-200",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    iconBg: "bg-teal-100",
  },
  purple: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
  },
};

export function PublicActionSection() {
  const [selected, setSelected] = useState<IssueGuidance | null>(null);
  const guidance = issueGuidanceData as IssueGuidance[];

  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-slate-800">Need to raise a local issue?</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Tap a category to see which department handles it and what you should prepare.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {guidance.map((item) => {
            const c = colorMap[item.color] ?? colorMap.gray;
            return (
              <button
                key={item.id}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  selected?.id === item.id
                    ? `${c.bg} ${c.border} ${c.text} shadow-sm`
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className={`${c.iconBg} ${c.text} p-2 rounded-lg shrink-0`} aria-hidden>
                  {iconMap[item.icon]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.category}</p>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto shrink-0 ${c.text} opacity-60`} />
              </button>
            );
          })}
        </div>

        {/* Guidance panel */}
        {selected && (
          <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50/50 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-slate-800">{selected.category}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close guidance"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <ClipboardList className="w-3.5 h-3.5" /> What to prepare
                </p>
                <ul className="space-y-1.5">
                  {selected.what_to_prepare.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckSquare className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Likely department</p>
                <p className="text-sm text-slate-700">{selected.likely_department}</p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Expected resolution</p>
                <p className="text-sm text-slate-700">{selected.expected_resolution_type}</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{selected.guidance_note}</p>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={selected.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  {selected.portal_name}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://cpgrams.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-300 hover:border-teal-300 hover:text-teal-700 px-3 py-2 rounded-lg transition-colors"
                >
                  CPGRAMS portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-400">
                This is guidance only. Complaint submission is not yet available in this app.
                Future versions may support complaint tracking inspired by CPGRAMS workflows.
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
