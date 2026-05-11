import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle, GraduationCap, Briefcase } from "lucide-react";
import type { Representative } from "@/types";
import { getPartyColor, getCriminalBadgeColor } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { RepPhoto } from "@/components/ui/RepPhoto";

interface RepresentativeCardProps {
  rep: Representative;
  showCompareButton?: boolean;
  isSelected?: boolean;
  onCompareToggle?: (id: string) => void;
}

export function RepresentativeCard({
  rep,
  showCompareButton,
  isSelected,
  onCompareToggle,
}: RepresentativeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="pt-5">
        <div className="flex items-start gap-4">
          <RepPhoto
            name={rep.name}
            photoUrl={rep.photo_url}
            photoPlaceholder={rep.photo_placeholder}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h2 className="text-base font-semibold text-slate-800 leading-tight">{rep.name}</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {rep.constituency} · {rep.district}
                </p>
              </div>
              <Badge className={getPartyColor(rep.party_short)}>{rep.party_short}</Badge>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p
                  className={`text-sm font-semibold ${getCriminalBadgeColor(rep.criminal_cases)} rounded px-1`}
                >
                  {rep.criminal_cases === 0 ? (
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />0
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {rep.criminal_cases}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Criminal cases</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p className="text-sm font-semibold text-slate-800">{rep.assets}</p>
                <p className="text-xs text-slate-400 mt-0.5">Declared assets</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p className="text-sm font-semibold text-slate-800">{rep.liabilities}</p>
                <p className="text-xs text-slate-400 mt-0.5">Liabilities</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {rep.education}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {rep.profession}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Link
                href={`/constituency/${rep.id}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                View constituency
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {showCompareButton && onCompareToggle && (
                <button
                  onClick={() => onCompareToggle(rep.id)}
                  className={`flex-1 sm:flex-none text-sm font-medium px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    isSelected
                      ? "bg-teal-50 text-teal-700 border-teal-300"
                      : "bg-white text-slate-600 border-slate-300 hover:border-teal-300 hover:text-teal-700"
                  }`}
                >
                  {isSelected ? "✓ Selected" : "Compare"}
                </button>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
