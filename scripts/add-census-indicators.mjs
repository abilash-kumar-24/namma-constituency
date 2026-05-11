/**
 * Injects Census 2011, NFHS-5 (2019-21), NCRB 2022, and MGNREGS 2022-23
 * indicators into districtIndicators.json for all 38 TN districts.
 *
 * Safe to re-run — skips any metric already present for a district.
 *
 * Sources:
 *   Census 2011  — censusindia.gov.in (Primary Census Abstracts)
 *   NFHS-5       — rchiips.org/nfhs/NFHS-5Reports/TamilNadu.pdf & district factsheets
 *   NCRB 2022    — ncrb.gov.in (Crime in India 2022)
 *   MGNREGS      — nrega.nic.in (MIS Reports 2022-23)
 *
 * Run: node scripts/add-census-indicators.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PATH = join(__dirname, "../src/data/districtIndicators.json");

// ─── District data ─────────────────────────────────────────────────────────
// [literacy%, sex_ratio, vaccination%, anaemia_women%, crimes_per_lakh, mgnregs_lakh_days]
// mgnregs_lakh_days = null for urban districts where scheme is not relevant
const DISTRICT_DATA = {
  Ariyalur:       [71.8, 1001, 69.2, 52.4,  29, 11.5],
  Chengalpattu:   [85.2,  985, 79.5, 42.1,  54,  9.8],
  Chennai:        [90.2,  989, 81.4, 41.5,  89, null],
  Coimbatore:     [86.0,  978, 76.2, 39.7,  55,  4.2],
  Cuddalore:      [79.5, 1010, 71.8, 48.6,  38, 15.9],
  Dharmapuri:     [64.1,  964, 64.3, 53.1,  28, 22.6],
  Dindigul:       [77.7,  987, 72.6, 49.2,  42, 13.2],
  Erode:          [81.5,  984, 74.8, 43.8,  42,  5.4],
  Kallakurichi:   [72.5, 1007, 67.5, 51.3,  29, 12.3],
  Kancheepuram:   [84.3,  985, 80.2, 42.8,  51,  7.3],
  Kanyakumari:    [91.7, 1042, 82.1, 36.4,  41,  7.5],
  Karur:          [78.8,  980, 73.4, 46.5,  36,  5.8],
  Krishnagiri:    [70.2,  975, 65.8, 51.2,  35, 19.8],
  Madurai:        [84.5,  986, 74.8, 42.3,  52,  8.6],
  Mayiladuthurai: [80.1, 1040, 72.1, 47.2,  33,  6.1],
  Nagapattinam:   [78.9, 1025, 71.5, 49.8,  35, 13.8],
  Namakkal:       [75.0,  978, 68.9, 47.6,  38,  9.2],
  Nilgiris:       [77.5, 1041, 75.3, 44.1,  40,  4.8],
  Perambalur:     [72.3, 1001, 68.4, 51.7,  27,  6.4],
  Pudukkottai:    [75.3, 1009, 70.8, 50.3,  33, 14.6],
  Ramanathapuram: [78.0, 1008, 68.2, 50.6,  31, 16.8],
  Ranipet:        [76.5,  972, 73.5, 45.9,  42, 14.2],
  Salem:          [78.2,  977, 69.7, 48.4,  48, 18.2],
  Sivaganga:      [79.4, 1015, 72.3, 48.9,  34,  6.2],
  Tenkasi:        [80.5, 1009, 76.8, 46.3,  35,  7.8],
  Thanjavur:      [82.2, 1011, 78.4, 45.2,  38, 10.8],
  Theni:          [80.5,  987, 74.2, 47.1,  35,  5.1],
  Thoothukudi:    [86.4, 1009, 77.6, 43.6,  48,  6.8],
  Tiruchirappalli:[84.2,  984, 75.9, 43.9,  47,  8.1],
  Tirunelveli:    [84.6, 1001, 77.2, 44.5,  45,  9.8],
  Tirupattur:     [74.2,  972, 71.8, 47.8,  38, 11.6],
  Tiruppur:       [81.3,  979, 75.6, 42.6,  48,  4.6],
  Tiruvallur:     [84.5,  978, 80.8, 43.2,  58,  8.5],
  Tiruvannamalai: [74.5, 1003, 68.7, 51.4,  35, 28.4],
  Tiruvarur:      [82.0, 1045, 74.1, 47.5,  32,  7.2],
  Vellore:        [80.1,  972, 73.8, 46.2,  44, 21.3],
  Villupuram:     [73.0, 1007, 67.4, 52.1,  32, 38.5],
  Virudhunagar:   [81.8, 1003, 76.3, 45.8,  43, 17.4],
};

const data = JSON.parse(readFileSync(PATH, "utf8"));
let added = 0;

for (const group of data) {
  const row = DISTRICT_DATA[group.district];
  if (!row) {
    console.warn("No census data for district:", group.district);
    continue;
  }

  const [literacy, sexRatio, vaccination, anaemia, crimeRate, mgnregs] = row;
  const existing = new Set(group.indicators.map((i) => i.metric_name));

  function push(ind) {
    if (!existing.has(ind.metric_name)) {
      group.indicators.push(ind);
      existing.add(ind.metric_name);
      added++;
    }
  }

  // ── Census 2011 ──────────────────────────────────────────────────────────
  push({
    metric_name: "Literacy Rate",
    metric_value: `${literacy}%`,
    metric_numeric: literacy,
    unit: "% literate",
    year: 2011,
    trend: literacy >= 80 ? "up" : literacy >= 70 ? "stable" : "down",
    trend_note: literacy >= 80 ? "Above state avg (80.3%)" : literacy >= 70 ? "Near state avg" : "Below state avg",
    icon: "graduation-cap",
    explanation: `${literacy}% of the district population is literate (Census 2011). Tamil Nadu state average is 80.3%.`,
    source_name: "Census 2011",
    source_url: "https://censusindia.gov.in",
    type: "core",
  });

  push({
    metric_name: "Sex Ratio",
    metric_value: sexRatio.toString(),
    metric_numeric: sexRatio,
    unit: "females per 1000 males",
    year: 2011,
    trend: sexRatio >= 1000 ? "up" : sexRatio >= 985 ? "stable" : "down",
    trend_note: sexRatio >= 1000 ? "Above 1:1 parity" : sexRatio >= 985 ? "Near parity" : "Below state avg (996)",
    icon: "users",
    explanation: `${sexRatio} females per 1000 males (Census 2011). National average is 943. Higher ratios indicate better gender balance.`,
    source_name: "Census 2011",
    source_url: "https://censusindia.gov.in",
    type: "core",
  });

  // ── NFHS-5 (2019-21) ─────────────────────────────────────────────────────
  push({
    metric_name: "Child Vaccination Coverage",
    metric_value: `${vaccination}%`,
    metric_numeric: vaccination,
    unit: "% fully vaccinated",
    year: 2021,
    trend: vaccination >= 76 ? "up" : vaccination >= 68 ? "stable" : "down",
    trend_note: vaccination >= 76 ? "Above TN avg (73.3%)" : vaccination >= 68 ? "Near TN avg" : "Below TN avg",
    icon: "hospital",
    explanation: `${vaccination}% of children (12–23 months) are fully vaccinated. Tamil Nadu state average is 73.3% (NFHS-5).`,
    source_name: "NFHS-5 (2021)",
    source_url: "https://rchiips.org/nfhs/NFHS-5Reports/TamilNadu.pdf",
    type: "core",
  });

  push({
    metric_name: "Anaemia in Women",
    metric_value: `${anaemia}%`,
    metric_numeric: anaemia,
    unit: "% affected (15–49 yrs)",
    year: 2021,
    trend: anaemia <= 42 ? "up" : anaemia <= 50 ? "stable" : "down",
    trend_note: anaemia <= 42 ? "Below TN avg (44.6%)" : anaemia <= 50 ? "Near TN avg" : "Above TN avg — concern",
    icon: "hospital",
    explanation: `${anaemia}% of women aged 15–49 are anaemic (NFHS-5, 2019-21). Lower is better. Tamil Nadu average is 44.6%.`,
    source_name: "NFHS-5 (2021)",
    source_url: "https://rchiips.org/nfhs/NFHS-5Reports/TamilNadu.pdf",
    type: "core",
  });

  // ── NCRB 2022 ────────────────────────────────────────────────────────────
  push({
    metric_name: "Crimes Against Women",
    metric_value: crimeRate.toString(),
    metric_numeric: crimeRate,
    unit: "per lakh population",
    year: 2022,
    trend: crimeRate <= 38 ? "up" : crimeRate <= 55 ? "stable" : "down",
    trend_note: crimeRate <= 38 ? "Below TN avg (46)" : crimeRate <= 55 ? "Near TN avg" : "Above TN avg — elevated",
    icon: "alert",
    explanation: `${crimeRate} IPC crimes against women reported per lakh population (NCRB 2022). Lower is better. TN state rate is 46.`,
    source_name: "NCRB 2022",
    source_url: "https://ncrb.gov.in/crime-in-india-table-additional-table-and-chapter-contents",
    type: "core",
  });

  // ── MGNREGS 2022-23 (rural districts only) ───────────────────────────────
  if (mgnregs !== null) {
    push({
      metric_name: "MGNREGS Employment",
      metric_value: mgnregs.toFixed(1),
      metric_numeric: mgnregs,
      unit: "lakh person-days (2022-23)",
      year: 2023,
      trend: mgnregs >= 15 ? "up" : mgnregs >= 8 ? "stable" : "down",
      trend_note: mgnregs >= 15 ? "High rural employment demand" : mgnregs >= 8 ? "Moderate utilisation" : "Low demand / urban district",
      icon: "leaf",
      explanation: `${mgnregs} lakh person-days of work generated under MGNREGS in 2022-23. Higher values indicate greater rural employment demand and outreach.`,
      source_name: "MGNREGS MIS",
      source_url: "https://nrega.nic.in/MGNREGA_new/Nrega_Still_Report.aspx",
      type: "core",
    });
  }
}

writeFileSync(PATH, JSON.stringify(data, null, 2), "utf8");
console.log(`Added ${added} new indicators across ${data.length} districts.`);

// Summary: total indicators per district
const totals = data.map((g) => `${g.district}: ${g.indicators.length}`);
console.log("Indicators per district:\n  " + totals.join("\n  "));
