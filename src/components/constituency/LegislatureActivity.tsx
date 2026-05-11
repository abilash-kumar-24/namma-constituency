import { ExternalLink, MessageSquare, Info } from "lucide-react";
import type { LegislatureActivity } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";

interface MLAQuestion {
  sr: number;
  question_no: string;
  type: string;
  date: string;
  minister: string;
  subject_tamil: string;
}

interface Props {
  activity: LegislatureActivity;
  mlaName: string;
  questions?: MLAQuestion[];
}

export function LegislatureActivityCard({ activity, mlaName, questions }: Props) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-semibold text-slate-800">Assembly track record</h2>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
            {activity.term}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Starred questions raised in the TN Legislative Assembly
        </p>

        {!activity.has_prior_record ? (
          <NoRecord activity={activity} mlaName={mlaName} />
        ) : activity.is_minister_excluded || activity.is_speaker_excluded ? (
          <MinisterNote activity={activity} mlaName={mlaName} />
        ) : (
          <QuestionRecord activity={activity} mlaName={mlaName} questions={questions} />
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            {activity.data_window}. Unstarred questions and older data not available publicly.
            Ministers and the Speaker are excluded from question counts.{" "}
            <a
              href={activity.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline inline-flex items-center gap-0.5"
            >
              {activity.source_name} <ExternalLink className="w-2.5 h-2.5" />
            </a>
            {questions && questions.length > 0 && (
              <>
                {" · "}
                <a
                  href="https://tnla.neva.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline inline-flex items-center gap-0.5"
                >
                  NeVA (TN Legislature) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </>
            )}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

function QuestionRecord({
  activity,
  mlaName,
  questions,
}: {
  activity: LegislatureActivity;
  mlaName: string;
  questions?: MLAQuestion[];
}) {
  const q = activity.questions_asked ?? 0;
  const avg = activity.state_avg_questions;
  const aboveAvg = q > avg;
  const barMax = Math.max(q, Math.ceil(avg), 5);
  const qPct = Math.round((q / barMax) * 100);
  const avgPct = Math.round((avg / barMax) * 100);

  return (
    <div>
      {activity.prev_constituency && (
        <p className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 mb-3">
          Previously represented{" "}
          <span className="font-medium text-slate-600">{activity.prev_constituency}</span>{" "}
          constituency in the 16th Assembly
        </p>
      )}

      <div className="flex items-end gap-3 mb-3">
        <div>
          <p className="text-3xl font-bold text-slate-800">{q}</p>
          <p className="text-xs text-slate-500">starred questions raised</p>
        </div>
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full mb-1 ${
            aboveAvg
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : q === 0
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          {aboveAvg ? "Above avg" : q === 0 ? "None on record" : "Below avg"}
        </div>
      </div>

      {/* Bar comparison */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-0.5">
            <span>{mlaName.split(" ").slice(0, 2).join(" ")}</span>
            <span>{q}</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${qPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-0.5">
            <span>TN state average</span>
            <span>{avg}</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 rounded-full" style={{ width: `${avgPct}%` }} />
          </div>
        </div>
      </div>

      {/* Questions list */}
      {questions && questions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Questions raised
          </p>
          <div className="space-y-2">
            {questions.map((qn) => (
              <div
                key={qn.sr}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
              >
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {qn.subject_tamil}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs text-slate-400">Q#{qn.question_no}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{qn.date}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">
                    To: {toTitleCase(qn.minister)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function toTitleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function NoRecord({
  activity,
  mlaName,
}: {
  activity: LegislatureActivity;
  mlaName: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="text-sm font-medium text-slate-700 mb-1">First-time MLA</p>
      <p className="text-sm text-slate-500 leading-relaxed">
        {mlaName.split(" ").slice(0, 2).join(" ")} was not an MLA in the 16th Assembly
        (2021–2026). This is their first term — no prior legislative record exists.
      </p>
    </div>
  );
}

function MinisterNote({
  activity,
  mlaName,
}: {
  activity: LegislatureActivity;
  mlaName: string;
}) {
  const role = activity.is_speaker_excluded ? "Speaker / Deputy Speaker" : "Minister";
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
      <p className="text-sm font-medium text-slate-700 mb-1">Served as {role}</p>
      <p className="text-sm text-slate-500 leading-relaxed">
        {mlaName.split(" ").slice(0, 2).join(" ")} held a ministerial or Speaker role during the
        16th Assembly. Ministers represent the government in debates and do not raise questions —
        PRS excludes them from question counts by convention.
      </p>
    </div>
  );
}
