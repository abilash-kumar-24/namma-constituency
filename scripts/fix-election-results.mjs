/**
 * Fetches missing election result entries — run after fetch-election-results.mjs
 * Applies manual name overrides for ECI ↔ our-data spelling differences.
 *
 * Run: node scripts/fix-election-results.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/electionResults.json");

const BASE = "https://results.eci.gov.in/ResultAcGenMay2026";
const DELAY_MS = 600;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ECI constituency name → our rep ID (manual overrides for spelling mismatches)
// Format: [eciCode, eciName, ourRepId]
const OVERRIDES = [
  ["S22178", "GANDHARVAKOTTAI",  "gandarvakottai"],
  ["S229",   "MADAVARAM",        "madhavaram"],
  ["S227",   "MADURAVOYAL",      "madhuravoyal"],
  ["S22111", "METTUPPALAYAM",    "mettupalayam"],
  ["S22212", "MUDHUKULATHUR",    "mudukulathur"],
  ["S2257",  "PALACODU",         "palacode"],
  ["S2295",  "PARAMATHI-VELUR",  "paramathivelur"],
  ["S2239",  "SHOLINGUR",        "sholinghur"],
  ["S2227",  "SHOZHINGANALLUR",  "sholinganallur"],
  ["S2256",  "THALLI",           "thally"],
  // THIRUVALLUR (S224) is pending on MyNeta — skip
  ["S2250",  "TIRUPPATTUR-50",   "tiruppathur"],    // Tirupattur district AC
  ["S22185", "TIRUPPATTUR-185",  "tirupattur"],     // Second Tirupattur AC
  ["S22165", "VEDARANYAM",       "vedharanyam"],
  ["S2274",  "VILUPPURAM",       "villupuram"],
  ["S22152", "VRIDDHACHALAM",    "vridhachalam"],
];

function parseCandidatePage(html) {
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wonMatch = text.match(/won (\d+)/);
  const lostMatches = [...text.matchAll(/lost (\d+)/g)];
  const notaVotesMatch = text.match(/(\d+) \([^)]*\) NOTA None of the Above/);
  const roundsMatch = text.match(/Status of EVM Round:\s*(\d+)\s*\/(\d+)/);

  const winnerVotes = wonMatch ? parseInt(wonMatch[1]) : null;
  const runnerupVotes = lostMatches.length > 0 ? parseInt(lostMatches[0][1]) : null;
  const margin = winnerVotes && runnerupVotes ? winnerVotes - runnerupVotes : null;
  const notaVotes = notaVotesMatch ? parseInt(notaVotesMatch[1]) : null;

  const allVoteMatches = [...text.matchAll(/(won|lost) (\d+)/g)];
  let totalVotes = allVoteMatches.length > 0
    ? allVoteMatches.reduce((s, m) => s + parseInt(m[2]), 0) + (notaVotes ?? 0)
    : null;

  return {
    winnerVotes,
    runnerupVotes,
    margin,
    notaVotes,
    totalVotes,
    roundsCompleted: roundsMatch ? parseInt(roundsMatch[1]) : null,
    roundsTotal: roundsMatch ? parseInt(roundsMatch[2]) : null,
  };
}

const existing = JSON.parse(readFileSync(OUT_PATH, "utf8"));
console.log(`Existing entries: ${Object.keys(existing).length}`);

for (const [eciCode, eciName, repId] of OVERRIDES) {
  if (existing[repId]) {
    console.log(`  SKIP (already present): ${repId}`);
    continue;
  }

  await sleep(DELAY_MS);

  const url = `${BASE}/candidateswise-${eciCode}.htm`;
  console.log(`Fetching ${eciName} (${eciCode}) → ${repId}…`);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Referer": BASE + "/index.htm",
      },
    });
    if (!res.ok) {
      console.error(`  HTTP ${res.status} for ${eciCode}`);
      continue;
    }
    const html = await res.text();
    const parsed = parseCandidatePage(html);

    existing[repId] = {
      constituency_name: eciName,
      eci_no: parseInt(eciCode.replace("S22", "").replace("S2", "")),
      winner_votes: parsed.winnerVotes,
      runnerup_votes: parsed.runnerupVotes,
      margin: parsed.margin,
      nota_votes: parsed.notaVotes,
      total_votes_cast: parsed.totalVotes,
      rounds_completed: parsed.roundsCompleted,
      rounds_total: parsed.roundsTotal,
      source: "ECI — results.eci.gov.in (May 2026)",
    };

    console.log(`  ✓ ${eciName}: winner=${parsed.winnerVotes?.toLocaleString() ?? "?"}, margin=${parsed.margin?.toLocaleString() ?? "?"}, NOTA=${parsed.notaVotes ?? "?"}`);
  } catch (err) {
    console.error(`  ✗ Error for ${eciName}:`, err.message);
  }
}

writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2), "utf8");
console.log(`\nDone. Total entries: ${Object.keys(existing).length}`);
