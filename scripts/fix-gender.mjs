/**
 * Post-processes representatives.json to set gender from name patterns.
 * Looks for known Tamil / Indian female first name tokens.
 * Run: node scripts/fix-gender.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PATH = join(__dirname, "../src/data/representatives.json");

// Unambiguously female Tamil/Indian first names (exact token match only)
const FEMALE_EXACT = new Set([
  "sowmiya","selvi","devi","latha","kavitha","geetha","anitha","meena",
  "meenakshi","hema","radha","nirmala","sumathi","vimala","premalatha",
  "premala","saritha","rekha","padma","lakshmi","saraswathi","parvathi",
  "durga","kamala","kokilam","vijayalakshmi","tamilselvi","bhuvana","nalini",
  "revathi","rajeswari","indira","sunitha","divya","priya","deepa","suganya",
  "mythili","valarmathi","chithra","chitra","malathi","amudha","thilagavathi",
  "usharani","kasthuri","ponmani","vasumathi","pushpam","karpagam",
  "muthulakshmi","meenalochani","amudhavalli","saroja","yamuna","cauvery",
  "kavery","jayanthi","malliga","ambika","gomathi","annalakshmi","rajalakshmi",
  "mahalakshmi","visalakshmi","krishnaveni","meera","rukmini","renuga","renu",
  "malar","malarvizhi","ponni","valli","thilaga","thilakam","parimala",
  "nallaselvi","marie","shanthi","usha","rani","santha","mangalam",
  "kulanthai","thangam",
]);

// Male-indicator tokens — override female match if present
const MALE_OVERRIDE = new Set([
  "kumar","raj","vel","bhaskar","swami","durai","muthu","arasu","thenarasu",
  "nathan","rajan","kannan","murugan","selvam","pandian","anandan","krishnan",
  "sundaram","mani","samy","swamy","dass","das","pillai","nadar","gounder",
]);

const data = JSON.parse(readFileSync(PATH, "utf8"));
let femaleCount = 0;

for (const rep of data) {
  // Reset everyone to Male first, then re-detect
  rep.gender = "Male";
  const tokens = rep.name.toLowerCase().replace(/[.\-_]/g, " ").split(/\s+/);
  const hasFemaleToken = tokens.some((t) => FEMALE_EXACT.has(t));
  const hasMaleOverride = tokens.some((t) => MALE_OVERRIDE.has(t))
    || tokens.some((t) =>
        t.endsWith("kumar") || t.endsWith("raj") || t.endsWith("vel") ||
        t.endsWith("bhaskar") || t.endsWith("arasu") || t.endsWith("durai") ||
        t.endsWith("nathan") || t.endsWith("kannan") || t.endsWith("thenarasu") ||
        t.endsWith("swami") || t.endsWith("swamy") || t.endsWith("dass")
    );
  if (hasFemaleToken && !hasMaleOverride) {
    rep.gender = "Female";
    femaleCount++;
  }
}

writeFileSync(PATH, JSON.stringify(data, null, 2), "utf8");
console.log(`Updated gender for ${femaleCount} MLAs → Female`);
console.log("Female MLAs now:", data.filter((r) => r.gender === "Female").map((r) => `${r.name} (${r.constituency})`).join("\n  "));
