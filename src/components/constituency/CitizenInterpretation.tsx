import { Info, AlertTriangle, CheckCircle, BarChart2 } from "lucide-react";
import type { Representative, DistrictIndicator } from "@/types";
import { generateSummary } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";

interface Props {
  rep: Representative;
  indicators: DistrictIndicator[];
}

export function CitizenInterpretation({ rep, indicators }: Props) {
  const summary = generateSummary(rep);
  const hasAirData = indicators.find(
    (i) => i.icon === "wind" || i.metric_name.toLowerCase().includes("air")
  );
  const hasTransportData = indicators.find((i) => i.icon === "bus");

  return (
    <Card className="border-teal-200 bg-teal-50/30">
      <CardBody className="pt-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-semibold text-slate-800">What this means for citizens</h2>
        </div>

        <div className="space-y-3">
          {/* MLA context */}
          <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-3.5">
            {rep.criminal_cases === 0 ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            )}
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </div>

          {/* Transport context */}
          {hasTransportData && (
            <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-3.5">
              <span className="text-base mt-0.5">🚌</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {hasTransportData.trend === "up"
                  ? `${rep.district} district has seen more bus routes added recently, which is a positive sign for public transport access.`
                  : hasTransportData.trend === "down"
                  ? `Public transport route coverage in ${rep.district} has reduced. This may be worth raising with your MLA or local transport body.`
                  : `Public transport coverage in ${rep.district} has remained steady. Gaps in connectivity remain a common citizen concern.`}
              </p>
            </div>
          )}

          {/* Air quality context */}
          {hasAirData && (
            <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-3.5">
              <span className="text-base mt-0.5">🌬️</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {`Air quality in ${rep.district} is at ${hasAirData.metric_value} ${hasAirData.unit}. The WHO safe limit is 15 µg/m³. ${
                  parseFloat(hasAirData.metric_value) > 55
                    ? "This is above the threshold considered unhealthy for sensitive groups."
                    : "This is elevated but below the most severe pollution levels."
                }`}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl border border-amber-100 p-3.5">
            <BarChart2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              These indicators are for public understanding only. They should not be treated as
              official performance rankings or ratings of the MLA or government departments. Data
              comes from public affidavits and open government datasets which may have limitations.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
