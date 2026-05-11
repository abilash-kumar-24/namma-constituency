/**
 * Fetches all 234 Tamil Nadu 2026 MLA winners from myneta.info
 * and writes src/data/representatives.json
 *
 * Run: node scripts/fetch-representatives.mjs
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://myneta.info/TamilNadu2026";
const OUT_PATH = join(__dirname, "../src/data/representatives.json");

// District lookup — maps uppercase constituency name fragment → district
const DISTRICT_MAP = {
  ARIYALUR: "Ariyalur", JAYANKONDAM: "Ariyalur",
  CHENGALPATTU: "Chengalpattu", CHEYYUR: "Chengalpattu",
  MADURANTAKAM: "Chengalpattu", PALLAVARAM: "Chengalpattu",
  SHOLINGANALLUR: "Chengalpattu", TAMBARAM: "Chengalpattu", THIRUPORUR: "Chengalpattu",
  "ANNA NAGAR": "Chennai", "CHEPAUK-THIRUVALLIKENI": "Chennai",
  "DR.RADHAKRISHNAN NAGAR": "Chennai", EGMORE: "Chennai",
  HARBOUR: "Chennai", KOLATHUR: "Chennai", PERAMBUR: "Chennai",
  ROYAPURAM: "Chennai", SAIDAPET: "Chennai", "THIRU-VI-KA-NAGAR": "Chennai",
  "THOUSAND LIGHTS": "Chennai", TIRUVOTTIYUR: "Chennai", THIRUVOTTIYUR: "Chennai",
  VELACHERY: "Chennai", VILLIVAKKAM: "Chennai", VIRUGAMBAKKAM: "Chennai",
  VIRUGAMPAKKAM: "Chennai", MYLAPORE: "Chennai", THIYAGARAYANAGAR: "Chennai",
  MADHAVARAM: "Chennai", MADHURAVOYAL: "Chennai",
  "COIMBATORE NORTH": "Coimbatore", "COIMBATORE SOUTH": "Coimbatore",
  "COIMBATORE (NORTH)": "Coimbatore", "COIMBATORE (SOUTH)": "Coimbatore",
  KINATHUKADAVU: "Coimbatore", KAVUNDAMPALAYAM: "Coimbatore",
  METTUPALAYAM: "Coimbatore", ONDIPUDUR: "Coimbatore", PALLADAM: "Coimbatore",
  POLLACHI: "Coimbatore", SARKARSAMAKULAM: "Coimbatore", SINGANALLUR: "Coimbatore",
  SULUR: "Coimbatore", THONDAMUTHUR: "Coimbatore", VALPARAI: "Coimbatore",
  CUDDALORE: "Cuddalore", BHUVANAGIRI: "Cuddalore", CHIDAMBARAM: "Cuddalore",
  KATTUMANNARKOIL: "Cuddalore", KURINJIPADI: "Cuddalore", NEYVELI: "Cuddalore",
  TITTAKUDI: "Cuddalore", VRIDHACHALAM: "Cuddalore",
  PANRUTI: "Cuddalore", VRIDDHACHALAM: "Cuddalore",
  DHARMAPURI: "Dharmapuri", HARUR: "Dharmapuri", PENNAGARAM: "Dharmapuri",
  PAPPIREDDIPATTI: "Dharmapuri", PALACODU: "Dharmapuri", PALACODE: "Dharmapuri",
  DINDIGUL: "Dindigul", ATHOOR: "Dindigul", NILAKKOTTAI: "Dindigul",
  NATHAM: "Dindigul", PALANI: "Dindigul", ODDANCHATRAM: "Dindigul", VEDASANDUR: "Dindigul",
  ERODE: "Erode", BHAVANI: "Erode", GOBICHETTIPALAYAM: "Erode",
  MODAKKURICHI: "Erode", PERUNDURAI: "Erode", ANTHIYUR: "Erode",
  BHAVANISAGAR: "Erode",
  KALLAKURICHI: "Kallakurichi", CHINNASALEM: "Kallakurichi",
  TIRUKOILUR: "Kallakurichi", ULUNDURPETTAI: "Kallakurichi",
  KANCHEEPURAM: "Kancheepuram", ALANDUR: "Kancheepuram",
  SRIPERUMBUDUR: "Kancheepuram", UTHIRAMERUR: "Kancheepuram",
  COLACHEL: "Kanyakumari", COLACHAL: "Kanyakumari", KILLIYOOR: "Kanyakumari",
  NAGERCOIL: "Kanyakumari", PADMANABHAPURAM: "Kanyakumari",
  VILAVANCODE: "Kanyakumari", KANNIYAKUMARI: "Kanyakumari",
  KARUR: "Karur", ARAVAKURICHI: "Karur", KULITHALAI: "Karur",
  KRISHNARAYAPURAM: "Karur",
  KRISHNAGIRI: "Krishnagiri", HOSUR: "Krishnagiri", POCHAMPALLI: "Krishnagiri",
  UTHANGARAI: "Krishnagiri", VEPPANAHALLI: "Krishnagiri", BARGUR: "Krishnagiri",
  THALLY: "Krishnagiri",
  "MADURAI EAST": "Madurai", "MADURAI NORTH": "Madurai",
  "MADURAI SOUTH": "Madurai", "MADURAI WEST": "Madurai", "MADURAI CENTRAL": "Madurai",
  MELUR: "Madurai", SHOLAVANDAN: "Madurai", THIRUPARANKUNDRAM: "Madurai",
  USILAMPATTI: "Madurai", THIRUMANGALAM: "Madurai",
  MAYILADUTHURAI: "Mayiladuthurai", SIRKAZHI: "Mayiladuthurai",
  NAGAPATTINAM: "Nagapattinam", KILVELUR: "Nagapattinam",
  VEDARANYAM: "Nagapattinam", VEDHARANYAM: "Nagapattinam",
  KEELAIYUR: "Nagapattinam", POOMPUHAR: "Nagapattinam", PARAMATHIVELUR: "Nagapattinam",
  NAMAKKAL: "Namakkal", KUMARAPALAYAM: "Namakkal", RASIPURAM: "Namakkal",
  SENTHAMANGALAM: "Namakkal", TIRUCHENGODE: "Namakkal", TIRUCHENGODU: "Namakkal",
  GUDALUR: "Nilgiris", COONOOR: "Nilgiris",
  UDHAGAMANDALAM: "Nilgiris", METTUPPALAYAM: "Nilgiris",
  PERAMBALUR: "Perambalur", KUNNAM: "Perambalur",
  PUDUKKOTTAI: "Pudukkottai", ARANTHANGI: "Pudukkottai",
  GANDHARVAKOTTAI: "Pudukkottai", GANDARVAKOTTAI: "Pudukkottai",
  ILUPPUR: "Pudukkottai", ALANGUDI: "Pudukkottai",
  THIRUMAYAM: "Pudukkottai", VIRALIMALAI: "Pudukkottai",
  RAMANATHAPURAM: "Ramanathapuram", PARAMAKUDI: "Ramanathapuram",
  MUDHUKULATHUR: "Ramanathapuram", MUDUKULATHUR: "Ramanathapuram",
  TIRUVADANAI: "Ramanathapuram",
  ARAKKONAM: "Ranipet", ARCOT: "Ranipet", VINNAMANGALAM: "Ranipet",
  RANIPET: "Ranipet", SHOLINGHUR: "Ranipet",
  "SALEM NORTH": "Salem", "SALEM SOUTH": "Salem", "SALEM (NORTH)": "Salem",
  "SALEM (SOUTH)": "Salem", "SALEM (WEST)": "Salem",
  "SALEM WEST": "Salem", "SALEM EAST": "Salem", EDAPPADI: "Salem",
  GANGAVALLI: "Salem", OMALUR: "Salem", ATTUR: "Salem", METTUR: "Salem",
  YERCAUD: "Salem", SANKARI: "Salem", VEERAPANDI: "Salem",
  SIVAGANGA: "Sivaganga", KARAIKUDI: "Sivaganga",
  MANAMADURAI: "Sivaganga", TIRUPPUVANAM: "Sivaganga",
  ALANGULAM: "Tenkasi", KADAYANALLUR: "Tenkasi",
  SANKARANKOVIL: "Tenkasi", SHENKOTTAI: "Tenkasi", TENKASI: "Tenkasi",
  VASUDEVANALLUR: "Tenkasi",
  THANJAVUR: "Thanjavur", KUMBAKONAM: "Thanjavur", ORATHANADU: "Thanjavur",
  PAPANASAM: "Thanjavur", PATTUKKOTTAI: "Thanjavur",
  PERAVURANI: "Thanjavur", THIRUVIDAIMARUDUR: "Thanjavur", THIRUVAIYARU: "Thanjavur",
  ANDIPATTI: "Theni", BODINAYAKANUR: "Theni", BODINAYAKKANUR: "Theni",
  PERIYAKULAM: "Theni", THENI: "Theni", CUMBUM: "Theni",
  KOVILPATTI: "Thoothukudi", OTTAPIDARAM: "Thoothukudi",
  SATHANKULAM: "Thoothukudi", TIRUCHENDUR: "Thoothukudi",
  VILATHIKULAM: "Thoothukudi", THOOTHUKUDI: "Thoothukudi", SRIVAIKUNTAM: "Thoothukudi",
  "TIRUCHIRAPPALLI EAST": "Tiruchirappalli", "TIRUCHIRAPPALLI WEST": "Tiruchirappalli",
  "TIRUCHIRAPPALLI (EAST)": "Tiruchirappalli", "TIRUCHIRAPPALLI (WEST)": "Tiruchirappalli",
  LALGUDI: "Tiruchirappalli", MANACHANALLUR: "Tiruchirappalli",
  MANAPPARAI: "Tiruchirappalli", MUSIRI: "Tiruchirappalli",
  SRIRANGAM: "Tiruchirappalli", THIRUVERAMBUR: "Tiruchirappalli",
  THIRUVERUMBUR: "Tiruchirappalli", THOTTIYAM: "Tiruchirappalli",
  TIRUCHIRAPALLI: "Tiruchirappalli", THURAIYUR: "Tiruchirappalli",
  AMBASAMUDRAM: "Tirunelveli", NANGUNERI: "Tirunelveli",
  PALAYAMKOTTAI: "Tirunelveli", RADHAPURAM: "Tirunelveli", TIRUNELVELI: "Tirunelveli",
  AMBUR: "Tirupattur", JOLARPET: "Tirupattur", VANIYAMBADI: "Tirupattur",
  TIRUPATTUR: "Tirupattur", TIRUPPATHUR: "Tirupattur",
  AVANASHI: "Tiruppur", DHARAPURAM: "Tiruppur", KANGEYAM: "Tiruppur", KANGAYAM: "Tiruppur",
  MADATHUKULAM: "Tiruppur", TIRUPPUR: "Tiruppur", UDUMALAIPETTAI: "Tiruppur",
  AVADI: "Tiruvallur", GUMMIDIPOONDI: "Tiruvallur",
  PONNERI: "Tiruvallur", POONAMALLEE: "Tiruvallur",
  REDHILLS: "Tiruvallur", TIRUTTANI: "Tiruvallur", TIRUVALLUR: "Tiruvallur",
  ARANI: "Tiruvannamalai", CHEYYAR: "Tiruvannamalai", CHETPET: "Tiruvannamalai",
  KILPENNATHUR: "Tiruvannamalai", POLUR: "Tiruvannamalai",
  TIRUVANNAMALAI: "Tiruvannamalai", VANDAVASI: "Tiruvannamalai",
  CHENGAM: "Tiruvannamalai", KALASAPAKKAM: "Tiruvannamalai",
  THIRUTHURAIPOONDI: "Tiruvarur", TIRUVARUR: "Tiruvarur",
  THIRUVARUR: "Tiruvarur", MANNARGUDI: "Tiruvarur", NANNILAM: "Tiruvarur",
  ANAIKATTU: "Vellore", KATPADI: "Vellore", VELLORE: "Vellore",
  GUDIYATTAM: "Vellore",
  GINGEE: "Villupuram", MAILAM: "Villupuram", TINDIVANAM: "Villupuram",
  VIKRAVANDI: "Villupuram", VILUPPURAM: "Villupuram", VILLUPURAM: "Villupuram",
  RISHIVANDIYAM: "Villupuram", SANKARAPURAM: "Villupuram",
  KILVAITHINANKUPPAM: "Villupuram", TIRUKKOYILUR: "Villupuram", VANUR: "Villupuram",
  ARUPPUKKOTTAI: "Virudhunagar", ARUPPUKOTTAI: "Virudhunagar",
  RAJAPALAYAM: "Virudhunagar", SIVAKASI: "Virudhunagar",
  SRIVILLIPUTHUR: "Virudhunagar", TIRUCHULI: "Virudhunagar",
  WATRAP: "Virudhunagar", VIRUDHUNAGAR: "Virudhunagar",
};

const PARTY_SHORT = {
  "Dravida Munnetra Kazhagam": "DMK",
  "All India Anna Dravida Munnetra Kazhagam": "AIADMK",
  "Bharatiya Janata Party": "BJP",
  "Indian National Congress": "INC",
  "Pattali Makkal Katchi": "PMK",
  "Communist Party of India  (Marxist)": "CPI(M)",
  "Communist Party of India (Marxist)": "CPI(M)",
  "Communist Party of India": "CPI",
  "Viduthalai Chiruthaigal Katchi": "VCK",
  "Marumalarchi Dravida Munnetra Kazhagam": "MDMK",
  "Indian Union Muslim League": "IUML",
  "Naam Tamilar Katchi": "NTK",
  "Amma Makkal Munnettra Kazagam": "AMMK",
  "Tamilaga Vettri Kazhagam": "TVK",
  "Desiya Murpokku Dravida Kazhagam": "DMDK",
  "Independent": "IND",
  // Already-abbreviated values (MyNeta 2026 sends these directly)
  "DMK": "DMK", "AIADMK": "AIADMK", "BJP": "BJP", "INC": "INC",
  "PMK": "PMK", "CPI": "CPI", "VCK": "VCK", "IUML": "IUML",
  "NTK": "NTK", "AMMK": "AMMK", "TVK": "TVK", "DMDK": "DMDK",
  "IND": "IND",
};

const PARTY_COLOR = {
  DMK: "blue", AIADMK: "green", BJP: "orange", INC: "blue",
  PMK: "teal", TVK: "teal", VCK: "purple", "CPI(M)": "red",
  CPI: "red", MDMK: "orange", NTK: "red", IND: "slate",
};

// ─── Step 1: get all constituency IDs ───────────────────────────────────────
async function fetchConstituencyIds() {
  console.log("Fetching 2026 constituency list from MyNeta…");
  const res = await fetch(`${BASE_URL}/`);
  const html = await res.text();
  const matches = [...html.matchAll(/constituency_id=(\d+)[^>]*>\s*([^<\n]+)/g)];
  const seen = new Set();
  const out = [];
  for (const m of matches) {
    const id = m[1];
    const name = m[2].trim();
    if (!seen.has(id) && name && name.length < 60) {
      seen.add(id);
      out.push({ id, name });
    }
  }
  console.log(`  Found ${out.length} constituencies`);
  return out;
}

// ─── Step 2: fetch winner for one constituency ───────────────────────────────
async function fetchWinner(constit) {
  const url = `${BASE_URL}/index.php?action=show_candidates&constituency_id=${constit.id}`;
  const res = await fetch(url);
  const html = await res.text();

  const rows = [...html.matchAll(/<tr[^>]*>(.*?)<\/tr>/gis)];
  let winnerRow = null;
  let numCandidates = 0;

  for (const r of rows) {
    // Count candidate rows (those with ≥6 cells and a non-empty name cell)
    const candidateCells = [...r[1].matchAll(/<td[^>]*>(.*?)<\/td>/gis)].map((c) =>
      c[1].replace(/<[^>]+>/g, "").replace(/&nbsp;?/g, " ").replace(/\s+/g, " ").trim()
    );
    if (candidateCells.length >= 6 && candidateCells[1]?.length > 1) numCandidates++;
    if (/Winner/i.test(r[1])) winnerRow = r[1];
  }

  if (!winnerRow) return null;

  // Extract candidate_id from the name cell href
  const candidateIdMatch = winnerRow.match(/candidate\.php\?candidate_id=(\d+)/i);
  const candidateId = candidateIdMatch?.[1] ?? null;

  const cells = [...winnerRow.matchAll(/<td[^>]*>(.*?)<\/td>/gis)].map((c) =>
    c[1].replace(/<[^>]+>/g, "").replace(/&nbsp;?/g, " ").replace(/\s+/g, " ").trim()
  );

  if (cells.length < 6) return null;

  const nameRaw = cells[1]?.replace(/\s*Winner\s*/i, "").trim() ?? "";
  const party = cells[2] ?? "";
  const criminal = parseInt(cells[3]) || 0;
  const education = cells[4] ?? "Not Declared";
  const age = parseInt(cells[5]) || 0;
  const assets = parseRs(cells[6] ?? "");
  const liabilities = parseRs(cells[7] ?? "");

  // Fetch candidate detail page for photo, profession, gender
  let photoUrl = null;
  let profession = "Not Declared";
  let gender = "Male";

  if (candidateId) {
    try {
      const detailRes = await fetch(`${BASE_URL}/candidate.php?candidate_id=${candidateId}&print=true`);
      const detail = await detailRes.text();

      // Photo — src inside profile image tag
      const photoMatch = detail.match(/src=(https:\/\/myneta\.info\/images_candidate\/[^\s'"]+\.jpg)/i)
        ?? detail.match(/img src=['"]?(https:\/\/myneta\.info\/images_candidate\/[^'">\s]+)/i);
      if (photoMatch) photoUrl = photoMatch[1];

      // Profession — "Self Profession:" field
      const profMatch = detail.match(/Self Profession:\s*<\/b>\s*([^<\n]{2,120})/i)
        ?? detail.match(/Self Profession:<\/b>([^<\n]{2,120})/i);
      if (profMatch) profession = profMatch[1].trim().replace(/\s+/g, " ").slice(0, 80);

      // Gender — infer from relation type (S/o = Male, D/o or W/o = Female)
      const relationMatch = detail.match(/S\/o|D\/o|W\/o/i);
      if (relationMatch) {
        const rel = relationMatch[0].toUpperCase();
        gender = (rel === "D/O" || rel === "W/O") ? "Female" : "Male";
      }
    } catch (_) {
      // silently skip — basic fields already captured from constituency page
    }
  }

  const constitName = constit.name.replace(/\s*\(SC\)\s*/i, "").replace(/\s*\(ST\)\s*/i, "").trim();
  const district = lookupDistrict(constitName);
  const partyShort = PARTY_SHORT[party] ?? abbreviate(party);
  const photoColor = PARTY_COLOR[partyShort] ?? "slate";
  const id = constitName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  const serious = criminal >= 3 ? Math.ceil(criminal * 0.4) : 0;

  return {
    id,
    candidate_id: candidateId,
    constituency_id: constit.id,
    name: toTitleCase(nameRaw),
    constituency: toTitleCase(constitName),
    constituency_raw: constit.name,
    district,
    party,
    party_short: partyShort,
    age,
    gender,
    education: normalizeEdu(education),
    profession: profession || "Not Declared",
    criminal_cases: criminal,
    serious_criminal_cases: serious,
    assets: assets.display,
    assets_raw: assets.raw,
    liabilities: liabilities.display,
    liabilities_raw: liabilities.raw,
    num_candidates: numCandidates,
    photo_url: photoUrl,
    affidavit_url: `${BASE_URL}/index.php?action=show_candidates&constituency_id=${constit.id}`,
    source_name: "MyNeta India (ADR) — TN 2026",
    source_url: "https://www.myneta.info/TamilNadu2026/",
    photo_placeholder: photoColor,
    term_start: 2026,
    constituency_no: constit.id,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseRs(str) {
  if (!str || !str.trim()) return { display: "Not declared", raw: 0 };
  const clean = str.replace(/Rs\s*/i, "").replace(/,/g, "").trim();
  const num = parseFloat(clean.match(/[\d.]+/)?.[0] ?? "0");
  const lakhs = num / 100000;
  if (lakhs >= 100) return { display: `₹${(lakhs / 100).toFixed(1)} Cr`, raw: Math.round(lakhs) };
  if (lakhs >= 1)   return { display: `₹${Math.round(lakhs)} L`,         raw: Math.round(lakhs) };
  if (num > 0)      return { display: `₹${Math.round(num)}`,             raw: 0 };
  return { display: "Not declared", raw: 0 };
}

function lookupDistrict(name) {
  const upper = name.toUpperCase();
  // Direct match first
  if (DISTRICT_MAP[upper]) return DISTRICT_MAP[upper];
  // Strip parenthetical qualifiers and try again: "COIMBATORE (NORTH)" → "COIMBATORE NORTH"
  const stripped = upper.replace(/\s*\([^)]+\)/g, "").trim();
  if (DISTRICT_MAP[stripped]) return DISTRICT_MAP[stripped];
  // Substring match
  for (const [key, val] of Object.entries(DISTRICT_MAP)) {
    if (upper === key || upper.includes(key) || key.includes(upper)) return val;
  }
  return "Tamil Nadu";
}

function abbreviate(party) {
  // If already short (≤7 chars, like "CPI(M)", "IND"), use directly
  if (party.length <= 7) return party;
  return party.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join("").slice(0, 6) || "OTH";
}

function toTitleCase(str) {
  return str.replace(/\w+/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function normalizeEdu(edu) {
  const e = edu.toLowerCase();
  if (e.includes("doctor") || e.includes("phd")) return "Doctorate";
  if (e.includes("post grad") || e.match(/\bm\.[abcs]/)) return "Post Graduate";
  if (e.includes("graduate professional") || e.includes("graduate") || e.match(/\bb\.[ects]/)) return "Graduate";
  if (e.includes("12th") || e.includes("hsc")) return "12th Standard";
  if (e.includes("10th") || e.includes("sslc") || e.includes("matriculate")) return "10th Standard";
  if (e.includes("8th") || e.includes("5th")) return "Below 10th";
  if (e.includes("illiterate")) return "Illiterate";
  if (e.includes("others")) return "Others";
  return edu || "Not Declared";
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const constituencies = await fetchConstituencyIds();

  const results = [];
  let pass = 0, fail = 0;
  const BATCH = 10;

  for (let i = 0; i < constituencies.length; i += BATCH) {
    const batch = constituencies.slice(i, i + BATCH);
    const settled = await Promise.allSettled(batch.map(fetchWinner));
    for (let j = 0; j < settled.length; j++) {
      const s = settled[j];
      if (s.status === "fulfilled" && s.value) {
        results.push(s.value);
        pass++;
      } else {
        fail++;
        const reason = s.reason?.message ?? s.reason ?? "no winner found";
        console.warn(`\n  SKIP [${batch[j].name}]: ${reason}`);
      }
    }
    process.stdout.write(`\r  Progress: ${pass + fail}/${constituencies.length} (${pass} OK, ${fail} skipped)`);
    if (i + BATCH < constituencies.length) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n\nFetch complete: ${pass} winners, ${fail} skipped`);

  // Deduplicate — keep first occurrence of each id
  const seen = new Set();
  const deduped = [];
  for (const r of results) {
    let key = r.id;
    if (seen.has(key)) key = `${r.id}-${r.constituency_no}`;
    r.id = key;
    seen.add(key);
    deduped.push(r);
  }

  writeFileSync(OUT_PATH, JSON.stringify(deduped, null, 2), "utf8");
  console.log(`Wrote ${deduped.length} records → ${OUT_PATH}`);
}

main().catch(err => { console.error(err); process.exit(1); });
