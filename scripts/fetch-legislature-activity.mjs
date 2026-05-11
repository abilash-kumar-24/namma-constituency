/**
 * Fetches PRS Legislative Research data for TN 16th Assembly MLAs and
 * matches it to our 17th Assembly (2026) representatives by MLA name
 * across ALL constituencies (not just the same seat).
 *
 * This correctly handles:
 *   - Re-elected MLAs who won the same seat
 *   - Experienced MLAs who switched constituencies (e.g. AIADMK → TVK defectors)
 *
 * Source: PRS Legislative Research — prsindia.org/mlatrack
 * Data window: Starred questions only, 05-Apr-2023 to 17-Oct-2025
 *
 * Run: node scripts/fetch-legislature-activity.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPS_PATH = join(__dirname, "../src/data/representatives.json");
const OUT_PATH = join(__dirname, "../src/data/legislatureActivity.json");

const PRS_16_URL =
  "https://prsindia.org/files/mlatrack/tamil-nadu/16/tamil-nadu_assembly_term_16.csv";

// Normalise a name for comparison:
// strip dots/commas, lowercase, keep only words longer than 1 char
function normWords(name) {
  return name
    .replace(/[.,\-]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

// Two names refer to the same person if ≥50% of meaningful words overlap
function samePerson(nameA, nameB) {
  const wA = normWords(nameA);
  const wB = normWords(nameB);
  if (!wA.length || !wB.length) return false;
  const setB = new Set(wB);
  const overlap = wA.filter((w) => setB.has(w)).length;
  return overlap / Math.max(wA.length, wB.length) >= 0.5;
}

function parseCSV(text) {
  const lines = text.replace(/^﻿/, "").split("\n").filter(Boolean);
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const fields = [];
    let cur = "";
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === "," && !inQuote) { fields.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    fields.push(cur.trim());
    return Object.fromEntries(headers.map((h, i) => [h, fields[i] ?? ""]));
  });
}

// ── Fetch PRS 16th Assembly CSV ──────────────────────────────────────────────
console.log("Fetching PRS 16th Assembly CSV…");
const res = await fetch(PRS_16_URL);
if (!res.ok) throw new Error(`HTTP ${res.status} from PRS`);
const prs16 = parseCSV(await res.text());
console.log(`  Parsed ${prs16.length} rows`);

// ── Load our 17th Assembly representatives ───────────────────────────────────
const reps = JSON.parse(readFileSync(REPS_PATH, "utf8"));

// ── Score each candidate match and enforce one-to-one matching ──────────────
// Each 16th Assembly MLA can only be claimed by one 17th Assembly MLA.
// We score all possible pairs and greedily assign best matches first.

function matchScore(name17, name16) {
  const wA = normWords(name17);
  const wB = normWords(name16);
  if (!wA.length || !wB.length) return 0;
  const setB = new Set(wB);
  const overlap = wA.filter((w) => setB.has(w)).length;
  return overlap / Math.max(wA.length, wB.length);
}

// Build scored candidate pairs
const THRESHOLD = 0.5;
const candidates = [];
for (const rep of reps) {
  for (const row of prs16) {
    const score = matchScore(rep.name, row["MLA Name"]);
    if (score >= THRESHOLD) {
      candidates.push({ rep, row, score });
    }
  }
}

// Sort by score descending — best matches claim their 16th Assembly MLA first
candidates.sort((a, b) => b.score - a.score);

const claimedReps = new Set();    // constituency_id
const claimedPrs16 = new Set();   // PRS 16th constituency (unique identifier)

const matchMap = new Map(); // constituency_id → prs16 row

for (const { rep, row, score } of candidates) {
  const prs16Key = row["Constituency"].trim().toUpperCase();
  if (claimedReps.has(rep.id) || claimedPrs16.has(prs16Key)) continue;
  claimedReps.add(rep.id);
  claimedPrs16.add(prs16Key);
  matchMap.set(rep.id, row);
}

// ── Build output ─────────────────────────────────────────────────────────────
const output = [];
let incumbents = 0;
let newMLAs = 0;

for (const rep of reps) {
  const match = matchMap.get(rep.id);

  if (!match) {
    newMLAs++;
    output.push({
      constituency_id: rep.id,
      has_prior_record: false,
      is_incumbent: false,
    });
    continue;
  }

  incumbents++;

  const questionsRaw = match["No. of Questions Asked"]?.trim();
  const questionsAsked = questionsRaw !== "" ? parseInt(questionsRaw, 10) : null;
  const noteRaw = match["Note"]?.trim() ?? "";
  const isMinister = questionsAsked === null && noteRaw.toLowerCase().includes("minister");
  const isSpeaker = questionsAsked === null && noteRaw.toLowerCase().includes("speaker");

  const prevConst = match["Constituency"]?.trim();
  const sameConst =
    prevConst.toUpperCase() === rep.constituency.trim().toUpperCase() ||
    prevConst.toUpperCase().replace(/\s+/g, "") ===
      rep.constituency.trim().toUpperCase().replace(/\s+/g, "");

  output.push({
    constituency_id: rep.id,
    has_prior_record: true,
    is_incumbent: true,
    prev_constituency: sameConst ? undefined : prevConst,
    questions_asked: questionsAsked,
    state_avg_questions: 2.87,
    is_minister_excluded: isMinister,
    is_speaker_excluded: isSpeaker,
    term: "16th Assembly (2021–2026)",
    data_window: "Apr 2023 – Oct 2025 (starred questions only)",
    source_name: "PRS Legislative Research",
    source_url: "https://prsindia.org/mlatrack",
  });
}

writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf8");

console.log(`\nDone. Written to src/data/legislatureActivity.json`);
console.log(`  Incumbents with prior 16th Assembly record: ${incumbents}`);
console.log(`  Genuinely new MLAs (no prior record):       ${newMLAs}`);
console.log(`  Total: ${incumbents + newMLAs}`);
