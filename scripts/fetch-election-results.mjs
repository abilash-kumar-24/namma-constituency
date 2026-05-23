/**
 * Fetches 2026 TN Assembly election results from ECI results website.
 *
 * Source: Election Commission of India — results.eci.gov.in (May 2026)
 * Data: winner votes, runner-up votes, margin, NOTA, constituency no.
 *
 * Run: node scripts/fetch-election-results.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPS_PATH = join(__dirname, "../src/data/representatives.json");
const OUT_PATH = join(__dirname, "../src/data/electionResults.json");

const BASE = "https://results.eci.gov.in/ResultAcGenMay2026";
const DELAY_MS = 400;
const PARTY_PAGE = `${BASE}/partywiseresult-S22.htm`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function cleanText(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function normName(name) {
  return name.toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Fetch constituency list from ECI dropdown
console.log("Fetching constituency list from ECI…");
const partyRes = await fetch(PARTY_PAGE, { headers: { "User-Agent": "Mozilla/5.0" } });
const partyHtml = await partyRes.text();

// Extract dropdown options
const optionRe = /<option value="(S22\d+)">(.*?) - (\d+)<\/option>/g;
const constituencies = [];
let m;
while ((m = optionRe.exec(partyHtml)) !== null) {
  constituencies.push({ code: m[1], name: m[2].trim(), eci_no: parseInt(m[3]) });
}
console.log(`Found ${constituencies.length} constituencies`);

// Load our representatives
const reps = JSON.parse(readFileSync(REPS_PATH, "utf8"));

// Build name index from reps
const repIndex = new Map();
for (const rep of reps) {
  repIndex.set(normName(rep.constituency), rep.id);
}

// Match ECI constituencies to our reps by normalized name
function matchConstituency(eciName) {
  const norm = normName(eciName);
  if (repIndex.has(norm)) return repIndex.get(norm);
  // Try partial match — handle spelling differences like ARUPPUKKOTTAI vs ARUPPUKOTTAI
  for (const [key, id] of repIndex) {
    const a = norm.replace(/K+/g, "K").replace(/T+/g, "T").replace(/N+/g, "N");
    const b = key.replace(/K+/g, "K").replace(/T+/g, "T").replace(/N+/g, "N");
    if (a === b) return id;
  }
  return null;
}

// Parse individual constituency candidate page
function parseCandidatePage(html) {
  // Strip scripts/styles
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // Extract vote lines: "won NNNNN" or "lost NNNNN"
  const wonMatch = plain.match(/won (\d+)/);
  const lostMatches = [...plain.matchAll(/lost (\d+)/g)];
  const notaMatch = plain.match(/NOTA None of the Above\s*(?:Last Updated[^)]*)?(?:\s*(\d+))/) ||
    plain.match(/G\.RAMANAN Independent (\d+) \( -\d+\) NOTA/) ||
    // Try to find NOTA votes from the context: "G.SOMETHING Independent NNNNN ( -MMMM) NOTA"
    plain.match(/\) NOTA/);

  // Better NOTA extraction: look for the number just before "NOTA None of the Above"
  const notaVotesMatch = plain.match(/(\d+) \([^)]*\) NOTA None of the Above/);

  const winnerVotes = wonMatch ? parseInt(wonMatch[1]) : null;
  const runnerupVotes = lostMatches.length > 0 ? parseInt(lostMatches[0][1]) : null;
  const margin = winnerVotes && runnerupVotes ? winnerVotes - runnerupVotes : null;
  const notaVotes = notaVotesMatch ? parseInt(notaVotesMatch[1]) : null;

  // Extract rounds info
  const roundsMatch = plain.match(/Status of EVM Round:\s*(\d+)\s*\/(\d+)/);
  const roundsCompleted = roundsMatch ? parseInt(roundsMatch[1]) : null;
  const roundsTotal = roundsMatch ? parseInt(roundsMatch[2]) : null;

  // Total votes = sum of all candidates
  const allVoteMatches = [...plain.matchAll(/(won|lost) (\d+)/g)];
  let totalVotes = null;
  if (allVoteMatches.length > 0) {
    totalVotes = allVoteMatches.reduce((sum, m2) => sum + parseInt(m2[2]), 0);
    if (notaVotes) totalVotes += notaVotes;
  }

  return { winnerVotes, runnerupVotes, margin, notaVotes, totalVotes, roundsCompleted, roundsTotal };
}

// Fetch and parse each constituency
console.log(`\nFetching results for ${constituencies.length} constituencies…`);
const output = {};
let matched = 0;
let unmatched = [];

for (const con of constituencies) {
  const repId = matchConstituency(con.name);
  if (!repId) {
    unmatched.push(con.name);
    continue;
  }

  await sleep(DELAY_MS);

  try {
    const url = `${BASE}/candidateswise-${con.code}.htm`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.error(`  ✗ HTTP ${res.status} for ${con.name}`);
      continue;
    }
    const html = await res.text();
    const parsed = parseCandidatePage(html);

    output[repId] = {
      constituency_name: con.name,
      eci_no: con.eci_no,
      winner_votes: parsed.winnerVotes,
      runnerup_votes: parsed.runnerupVotes,
      margin: parsed.margin,
      nota_votes: parsed.notaVotes,
      total_votes_cast: parsed.totalVotes,
      rounds_completed: parsed.roundsCompleted,
      rounds_total: parsed.roundsTotal,
      source: "ECI — results.eci.gov.in (May 2026)",
    };

    matched++;
    const pct = parsed.winnerVotes && parsed.totalVotes
      ? ((parsed.winnerVotes / parsed.totalVotes) * 100).toFixed(1)
      : "?";
    process.stdout.write(
      `  ✓ ${con.name} (${con.eci_no}): winner=${parsed.winnerVotes?.toLocaleString() ?? "?"}, margin=${parsed.margin?.toLocaleString() ?? "?"}, NOTA=${parsed.notaVotes ?? "?"}\n`
    );
  } catch (err) {
    console.error(`  ✗ Error for ${con.name}:`, err.message);
  }
}

writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf8");

console.log(`\nDone. Written to src/data/electionResults.json`);
console.log(`  Matched: ${matched}/${constituencies.length}`);
if (unmatched.length > 0) {
  console.log(`  Unmatched ECI names (${unmatched.length}):`, unmatched.join(", "));
}
