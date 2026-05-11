import type { Representative } from "@/types";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getPartyColor(party_short: string): string {
  const colors: Record<string, string> = {
    // Major 2026 alliance parties
    TVK: "bg-yellow-100 text-yellow-800 border-yellow-300",
    DMK: "bg-red-100 text-red-800 border-red-200",
    AIADMK: "bg-green-100 text-green-800 border-green-200",
    BJP: "bg-orange-100 text-orange-800 border-orange-200",
    INC: "bg-sky-100 text-sky-800 border-sky-200",
    VCK: "bg-blue-100 text-blue-800 border-blue-200",
    // Smaller parties
    DMDK: "bg-purple-100 text-purple-800 border-purple-200",
    IUML: "bg-emerald-100 text-emerald-800 border-emerald-200",
    AMMK: "bg-teal-100 text-teal-800 border-teal-200",
    NTK: "bg-rose-100 text-rose-800 border-rose-200",
    "CPI(M)": "bg-red-100 text-red-900 border-red-300",
    CPI: "bg-red-50 text-red-800 border-red-200",
    PMK: "bg-amber-100 text-amber-800 border-amber-200",
    MDMK: "bg-indigo-100 text-indigo-800 border-indigo-200",
    MNM: "bg-cyan-100 text-cyan-800 border-cyan-200",
    AIFB: "bg-pink-100 text-pink-800 border-pink-200",
    IND: "bg-slate-100 text-slate-700 border-slate-300",
  };
  return colors[party_short] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function getCriminalBadgeColor(count: number): string {
  if (count === 0) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (count <= 2) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function getAvatarBg(color: string): string {
  const map: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    red: "bg-red-600",
    teal: "bg-teal-600",
    orange: "bg-orange-600",
  };
  return map[color] ?? "bg-slate-600";
}

export function formatLakhs(value: number): string {
  if (value >= 100) return `₹${(value / 100).toFixed(1)} Cr`;
  return `₹${value} L`;
}

export function getTrendIcon(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
}

export function getTrendColor(trend: "up" | "down" | "stable", metric?: string): string {
  // For air quality, "up" is bad
  if (metric?.toLowerCase().includes("pm2.5") || metric?.toLowerCase().includes("air")) {
    if (trend === "up") return "text-red-600";
    if (trend === "down") return "text-emerald-600";
    return "text-slate-500";
  }
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-red-600";
  return "text-slate-500";
}

export function generateSummary(rep: Representative): string {
  const parts: string[] = [];
  if (rep.criminal_cases === 0) {
    parts.push("No criminal cases declared in the affidavit.");
  } else if (rep.serious_criminal_cases > 0) {
    parts.push(
      `${rep.criminal_cases} criminal case(s) declared, including ${rep.serious_criminal_cases} serious case(s). Review the affidavit for details.`
    );
  } else {
    parts.push(`${rep.criminal_cases} criminal case(s) declared in the affidavit.`);
  }

  if (rep.liabilities_raw === 0) {
    parts.push("No liabilities declared.");
  } else if (rep.liabilities_raw < rep.assets_raw * 0.1) {
    parts.push("Declared liabilities are low relative to assets.");
  } else {
    parts.push(`Liabilities of ${rep.liabilities} have been declared.`);
  }

  parts.push(
    "These indicators are based on public affidavit data and should not be used as an official performance ranking."
  );
  return parts.join(" ");
}
