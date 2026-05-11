import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Hash,
  ExternalLink,
} from "lucide-react";
import type { Representative } from "@/types";
import { getPartyColor } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { RepPhoto } from "@/components/ui/RepPhoto";

interface Props {
  rep: Representative;
}

export function RepresentativeOverview({ rep }: Props) {
  const infoRows = [
    { icon: MapPin, label: "Constituency", value: `${rep.constituency} (No. ${rep.constituency_no})` },
    { icon: MapPin, label: "District", value: rep.district },
    { icon: User, label: "Gender", value: rep.gender },
    { icon: Calendar, label: "Age", value: `${rep.age} years` },
    { icon: GraduationCap, label: "Education", value: rep.education },
    { icon: Briefcase, label: "Profession", value: rep.profession },
    { icon: Hash, label: "MLA since", value: rep.term_start.toString() },
    ...(rep.num_candidates
      ? [{ icon: Hash, label: "Candidates", value: `${rep.num_candidates} stood in 2026` }]
      : []),
  ];

  return (
    <Card>
      <CardBody className="pt-6">
        <div className="flex items-start gap-5">
          <RepPhoto
            name={rep.name}
            photoUrl={rep.photo_url}
            photoPlaceholder={rep.photo_placeholder}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800 leading-tight">{rep.name}</h1>
            <p className="text-slate-500 mt-0.5 text-sm">MLA, {rep.constituency}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge className={getPartyColor(rep.party_short)}>{rep.party_short}</Badge>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                {rep.party.length > 35 ? rep.party.slice(0, 35) + "…" : rep.party}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-teal-600 shrink-0" aria-hidden />
              <span className="text-xs text-slate-500 shrink-0 w-24">{label}</span>
              <span className="text-sm font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <span>Source:</span>
          <a
            href={rep.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline flex items-center gap-1 font-medium"
          >
            {rep.source_name}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
