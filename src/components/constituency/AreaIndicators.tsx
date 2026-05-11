import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DistrictIndicator } from "@/types";
import { getTrendColor } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";

interface Props {
  indicators: DistrictIndicator[];
  district: string;
}

const iconMap: Record<string, string> = {
  bus: "🚌",
  car: "🚗",
  wind: "🌬️",
  "graduation-cap": "🎓",
  factory: "🏭",
  hospital: "🏥",
  leaf: "🌿",
  users: "👥",
  alert: "⚠️",
};

export function AreaIndicators({ indicators, district }: Props) {
  const core = indicators.filter((i) => i.type === "core");
  const highlights = indicators.filter((i) => i.type === "highlight");

  if (indicators.length === 0) {
    return (
      <Card>
        <CardBody className="pt-5">
          <h2 className="text-base font-semibold text-slate-800 mb-3">
            Local area indicators — {district}
          </h2>
          <div className="py-8 text-center">
            <p className="text-slate-400 text-sm">No indicators available for this area yet.</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Local area indicators — {district}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              District-level public data from Tamil Nadu open datasets
            </p>
          </div>
        </div>

        {/* Core indicators */}
        <div className="mb-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Core infrastructure &amp; services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {core.map((ind) => (
              <IndicatorCard key={ind.metric_name} ind={ind} />
            ))}
          </div>
        </div>

        {/* District highlights */}
        {highlights.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              District highlights
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((ind) => (
                <IndicatorCard key={ind.metric_name} ind={ind} accent />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-600">Data accuracy:</strong>{" "}
            <span className="text-amber-600 font-medium">est.</span> = indicative estimate, not yet verified against official source. {" "}
            <span className="text-blue-500 font-medium">approx.</span> = based on published report, district breakdown may vary ±5–10%. Unmarked = verified official data.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            These are district-level indicators, not constituency-specific. Sources: Census 2011, NFHS-5 (2019-21), NCRB 2022, MGNREGS MIS, TN Open Data Portal.
            Always verify with primary sources before citing.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

function IndicatorCard({
  ind,
  accent = false,
}: {
  ind: DistrictIndicator;
  accent?: boolean;
}) {
  const bg = accent
    ? "rounded-xl border border-amber-100 bg-amber-50/60 p-4 hover:bg-amber-50 hover:shadow-sm transition-all"
    : "rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-white hover:shadow-sm transition-all";

  return (
    <div className={bg}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            {iconMap[ind.icon] ?? (accent ? "🏷️" : "📊")}
          </span>
          <p className="text-xs font-semibold text-slate-700 leading-snug">{ind.metric_name}</p>
        </div>
        <TrendIndicator trend={ind.trend} metricName={ind.metric_name} />
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-xl font-bold text-slate-800">{ind.metric_value}</span>
        <span className="text-xs text-slate-400">{ind.unit}</span>
      </div>

      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
        {ind.explanation}
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200">
        <p
          className={`text-xs font-medium ${getTrendColor(ind.trend, ind.metric_name)} flex items-center gap-0.5`}
        >
          <TrendLabel trend={ind.trend} metricName={ind.metric_name} />
          {ind.trend_note}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          {ind.accuracy === "estimated" && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 leading-none">
              est.
            </span>
          )}
          {ind.accuracy === "approximate" && (
            <span className="text-xs text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-1.5 py-0.5 leading-none">
              approx.
            </span>
          )}
          <a
            href={ind.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-teal-600 flex items-center gap-0.5 transition-colors"
          >
            {ind.source_name.split(" ").slice(0, 2).join(" ")}
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function TrendIndicator({
  trend,
  metricName,
}: {
  trend: DistrictIndicator["trend"];
  metricName: string;
}) {
  const color = getTrendColor(trend, metricName);
  if (trend === "up") return <TrendingUp className={`w-4 h-4 ${color}`} />;
  if (trend === "down") return <TrendingDown className={`w-4 h-4 ${color}`} />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

function TrendLabel({
  trend,
  metricName,
}: {
  trend: DistrictIndicator["trend"];
  metricName: string;
}) {
  const isAir =
    metricName.toLowerCase().includes("pm2.5") || metricName.toLowerCase().includes("air");
  if (trend === "stable") return null;
  if (trend === "up") return isAir ? <span>Worsening · </span> : <span>Improving · </span>;
  return isAir ? <span>Improving · </span> : <span>Declining · </span>;
}
