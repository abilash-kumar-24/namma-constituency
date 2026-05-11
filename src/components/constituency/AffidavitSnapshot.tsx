import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, ExternalLink, Info } from "lucide-react";
import type { Representative } from "@/types";
import { getCriminalBadgeColor } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";

interface Props {
  rep: Representative;
}

export function AffidavitSnapshot({ rep }: Props) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Affidavit snapshot</h2>
          <a
            href={rep.affidavit_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-teal-600 hover:underline flex items-center gap-1"
          >
            View full affidavit <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Criminal cases */}
          <div
            className={`rounded-xl border p-3 ${getCriminalBadgeColor(rep.criminal_cases)}`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              {rep.criminal_cases === 0 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                Cases
              </span>
            </div>
            <p className="text-2xl font-bold">{rep.criminal_cases}</p>
            <p className="text-xs mt-0.5 opacity-70">Criminal cases</p>
          </div>

          {/* Serious cases */}
          <div
            className={`rounded-xl border p-3 ${
              rep.serious_criminal_cases > 0
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                Serious
              </span>
            </div>
            <p className="text-2xl font-bold">{rep.serious_criminal_cases}</p>
            <p className="text-xs mt-0.5 opacity-70">IPC 10+ yr cases</p>
          </div>

          {/* Assets */}
          <div className="rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">Assets</span>
            </div>
            <p className="text-xl font-bold leading-tight">{rep.assets}</p>
            <p className="text-xs mt-0.5 opacity-70">Declared total</p>
          </div>

          {/* Liabilities */}
          <div className="rounded-xl border bg-amber-50 border-amber-200 text-amber-800 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                Liabilities
              </span>
            </div>
            <p className="text-xl font-bold leading-tight">{rep.liabilities}</p>
            <p className="text-xs mt-0.5 opacity-70">Declared total</p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 bg-slate-50 rounded-lg p-3">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            This data comes from the candidate&apos;s self-declared election affidavit filed with the
            Election Commission of India. Criminal cases are those registered — not convictions.
            Accuracy depends on what was declared.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
