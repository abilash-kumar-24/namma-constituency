/**
 * Scrapes per-question details from NeVA (tnla.neva.gov.in) for all
 * incumbents identified in legislatureActivity.json.
 *
 * Source: Tamil Nadu Legislative Assembly — NeVA (16th Assembly)
 * Questions are in Tamil. Starred questions only (Apr 2023 – Oct 2025).
 *
 * Run: node scripts/fetch-mla-questions.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ACTIVITY_PATH = join(__dirname, "../src/data/legislatureActivity.json");
const REPS_PATH = join(__dirname, "../src/data/representatives.json");
const OUT_PATH = join(__dirname, "../src/data/mlaQuestions.json");

const BASE = "https://tnla.neva.gov.in";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Referer": BASE + "/",
};
const DELAY_MS = 600; // be polite to the server

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Get session cookie ────────────────────────────────────────────────────────
console.log("Getting NeVA session cookie…");
const homeRes = await fetch(BASE + "/", { headers: HEADERS });
const rawCookies = homeRes.headers.getSetCookie?.() ?? [];
const sessionCookie = rawCookies
  .map(c => c.split(";")[0])
  .filter(c => c.includes("ASP.NET_SessionId") || c.includes("lang"))
  .join("; ");
console.log("  Cookie:", sessionCookie ? "obtained" : "MISSING");

const headersWithCookie = { ...HEADERS, Cookie: sessionCookie };

// ── Parse HTML helpers ────────────────────────────────────────────────────────
function extractText(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const matches = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
  }
  return matches;
}

function parseMembers(html) {
  // Extract member ID and name from card links
  const members = [];
  const linkRe = /href="\/Member\/Details\/(\d+)\?AssemblyID=16"[\s\S]*?<span>Thiru\s+(.*?)\s*<\/span>/g;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    members.push({ id: parseInt(m[1]), name: m[2].trim() });
  }
  return members;
}

function parseQuestions(html) {
  // Table rows: Sr | Q# | Type | Date | Minister | Subject | [Doc]
  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let tr;
  while ((tr = trRe.exec(html)) !== null) {
    const cells = extractText(tr[1], "td");
    if (cells.length >= 5 && /^\d+$/.test(cells[0])) {
      rows.push({
        sr: parseInt(cells[0]),
        question_no: cells[1],
        type: cells[2],       // "Starred" / "Unstarred"
        date: cells[3],       // DD/MM/YY
        minister: cells[4],
        subject_tamil: cells[5] ?? "",
      });
    }
  }
  return rows;
}

function normWords(name) {
  return name.replace(/[.,\-]/g, " ").toLowerCase().split(/\s+/).filter(w => w.length > 1);
}

function samePerson(a, b) {
  const wA = normWords(a);
  const wB = normWords(b);
  if (!wA.length || !wB.length) return false;
  const setB = new Set(wB);
  const overlap = wA.filter(w => setB.has(w)).length;
  return overlap / Math.max(wA.length, wB.length) >= 0.5;
}

// ── Fetch full member list from NeVA 16th Assembly ───────────────────────────
console.log("Fetching NeVA 16th Assembly member list…");
const membersRes = await fetch(
  `${BASE}/ContactDirectory/FetchMembersList?MLT=0&MSLT=0&Assemblyid=16`,
  { headers: headersWithCookie }
);
const membersHtml = await membersRes.text();
const nevaMembers = parseMembers(membersHtml);
console.log(`  Found ${nevaMembers.length} members on NeVA`);

// ── Load incumbents from our activity data ────────────────────────────────────
const activity = JSON.parse(readFileSync(ACTIVITY_PATH, "utf8"));
const reps = JSON.parse(readFileSync(REPS_PATH, "utf8"));

const incumbents = activity
  .filter(a => a.is_incumbent && !a.is_minister_excluded && !a.is_speaker_excluded)
  .map(a => {
    const rep = reps.find(r => r.id === a.constituency_id);
    return { ...a, rep };
  })
  .filter(a => a.rep);

console.log(`\nMatching ${incumbents.length} incumbents to NeVA member IDs…`);

// ── Match each incumbent to a NeVA member ID ─────────────────────────────────
const matched = [];
const unmatched = [];

for (const inc of incumbents) {
  const nevaMember = nevaMembers.find(m => samePerson(inc.rep.name, m.name));
  if (nevaMember) {
    matched.push({ ...inc, neva_id: nevaMember.id, neva_name: nevaMember.name });
  } else {
    unmatched.push(inc.rep.name);
  }
}

console.log(`  Matched: ${matched.length}, Unmatched: ${unmatched.length}`);
if (unmatched.length > 0) {
  console.log("  Unmatched names:", unmatched.join(", "));
}

// ── Fetch questions for each matched incumbent ────────────────────────────────
console.log(`\nFetching questions for ${matched.length} MLAs from NeVA…`);
const output = {};
let fetched = 0;
let noQuestions = 0;

for (const inc of matched) {
  await sleep(DELAY_MS);
  try {
    const url = `${BASE}/Member/Member_Question?MemberId=${inc.neva_id}&AssemblyID=16`;
    const res = await fetch(url, { headers: headersWithCookie });
    const html = await res.text();
    const questions = parseQuestions(html);

    if (questions.length > 0) {
      output[inc.constituency_id] = questions;
      fetched++;
      process.stdout.write(`  ✓ ${inc.rep.name} (${inc.rep.constituency}): ${questions.length} questions\n`);
    } else {
      noQuestions++;
      process.stdout.write(`  – ${inc.rep.name}: no questions found\n`);
    }
  } catch (err) {
    console.error(`  ✗ Error for ${inc.rep.name}:`, err.message);
  }
}

writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf8");

console.log(`\nDone. Written to src/data/mlaQuestions.json`);
console.log(`  MLAs with questions: ${fetched}`);
console.log(`  MLAs with no questions on NeVA: ${noQuestions}`);
console.log(`  Total constituency entries: ${Object.keys(output).length}`);
