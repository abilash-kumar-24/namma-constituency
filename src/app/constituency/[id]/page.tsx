import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitCompare } from "lucide-react";
import { RepresentativeOverview } from "@/components/constituency/RepresentativeOverview";
import { AffidavitSnapshot } from "@/components/constituency/AffidavitSnapshot";
import { AreaIndicators } from "@/components/constituency/AreaIndicators";
import { CitizenInterpretation } from "@/components/constituency/CitizenInterpretation";
import { PublicActionSection } from "@/components/constituency/PublicActionSection";
import { LegislatureActivityCard } from "@/components/constituency/LegislatureActivity";
import { ElectionResultsCard } from "@/components/constituency/ElectionResults";
import { ShareButton } from "@/components/constituency/ShareButton";
import representatives from "@/data/representatives.json";
import districtIndicators from "@/data/districtIndicators.json";
import legislatureActivity from "@/data/legislatureActivity.json";
import mlaQuestions from "@/data/mlaQuestions.json";
import electionResults from "@/data/electionResults.json";
import type { Representative, DistrictIndicator, DistrictIndicatorGroup, LegislatureActivity, ElectionResult } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const reps = representatives as Representative[];
  return reps.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rep = (representatives as Representative[]).find((r) => r.id === id);
  if (!rep) return { title: "Constituency not found" };
  return {
    title: `${rep.constituency} — ${rep.name}`,
    description: `View public data for ${rep.name}, MLA of ${rep.constituency}, ${rep.district}. ${rep.criminal_cases} criminal cases declared. Assets: ${rep.assets}.`,
  };
}

export default async function ConstituencyPage({ params }: PageProps) {
  const { id } = await params;
  const rep = (representatives as Representative[]).find((r) => r.id === id);

  if (!rep) notFound();

  const districtGroup = (districtIndicators as DistrictIndicatorGroup[]).find(
    (g) => g.district === rep.district
  );
  const areaIndicators: DistrictIndicator[] = districtGroup?.indicators ?? [];

  const activity = (legislatureActivity as LegislatureActivity[]).find(
    (a) => a.constituency_id === rep.id
  );
  const questions = (mlaQuestions as Record<string, unknown[]>)[rep.id];
  const electionResult = (electionResults as Record<string, ElectionResult>)[rep.id];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Back nav */}
      <nav className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>
        <div className="flex items-center gap-2">
          <ShareButton constituencyName={rep.constituency} />
          <Link
            href={`/compare?a=${rep.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 border border-slate-300 hover:border-teal-300 hover:text-teal-700 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare
          </Link>
        </div>
      </nav>

      {/* Sections */}
      <div className="space-y-5">
        <RepresentativeOverview rep={rep} />
        {electionResult && <ElectionResultsCard result={electionResult} rep={rep} />}
        <AffidavitSnapshot rep={rep} />
        {activity && (
          <LegislatureActivityCard
            activity={activity}
            mlaName={rep.name}
            questions={questions as never}
          />
        )}
        <AreaIndicators indicators={areaIndicators} district={rep.district} />
        <CitizenInterpretation rep={rep} indicators={areaIndicators} />
        <PublicActionSection />
      </div>
    </div>
  );
}
