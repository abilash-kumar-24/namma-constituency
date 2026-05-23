import { Vote, ExternalLink, Users, TrendingUp, Minus } from "lucide-react";
import type { ElectionResult, Representative } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";

interface Props {
  result: ElectionResult;
  rep: Representative;
}

function fmt(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("en-IN");
}

function pct(part: number | null, total: number | null) {
  if (!part || !total) return null;
  return ((part / total) * 100).toFixed(1);
}

export function ElectionResultsCard({ result, rep }: Props) {
  const winPct = pct(result.winner_votes, result.total_votes_cast);
  const runnerupPct = pct(result.runnerup_votes, result.total_votes_cast);
  const notaPct = pct(result.nota_votes, result.total_votes_cast);

  const barMax = Math.max(result.winner_votes ?? 0, result.runnerup_votes ?? 0, 1);
  const winBar = result.winner_votes ? Math.round((result.winner_votes / barMax) * 100) : 0;
  const runBar = result.runnerup_votes ? Math.round((result.runnerup_votes / barMax) * 100) : 0;

  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-semibold text-slate-800">2026 election result</h2>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
            Official ECI data
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Constituency {result.eci_no} — {result.rounds_completed}/{result.rounds_total} rounds counted
        </p>

        {/* Winner highlight */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-teal-600 font-medium mb-0.5">Elected MLA</p>
              <p className="text-base font-bold text-teal-800">{rep.name}</p>
              <p className="text-xs text-teal-600">{rep.party}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-800">{fmt(result.winner_votes)}</p>
              <p className="text-xs text-teal-600">votes{winPct ? ` · ${winPct}%` : ""}</p>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium truncate max-w-[55%]">{rep.name}</span>
              <span className="font-medium">{fmt(result.winner_votes)}{winPct ? ` (${winPct}%)` : ""}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${winBar}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span className="truncate max-w-[55%]">Runner-up</span>
              <span>{fmt(result.runnerup_votes)}{runnerupPct ? ` (${runnerupPct}%)` : ""}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-300 rounded-full" style={{ width: `${runBar}%` }} />
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <p className="text-lg font-bold text-slate-800">{fmt(result.margin)}</p>
            <p className="text-xs text-slate-500">Winning margin</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-800">{fmt(result.total_votes_cast)}</p>
            <p className="text-xs text-slate-500">Votes cast</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Minus className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-lg font-bold text-slate-800">{fmt(result.nota_votes)}</p>
            <p className="text-xs text-slate-500">NOTA{notaPct ? ` (${notaPct}%)` : ""}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
          <p className="text-xs text-slate-400">
            Source:{" "}
            <a
              href="https://results.eci.gov.in/ResultAcGenMay2026/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline inline-flex items-center gap-0.5"
            >
              Election Commission of India (May 2026) <ExternalLink className="w-2.5 h-2.5" />
            </a>
            {" "}· Final results as declared by Returning Officers.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
