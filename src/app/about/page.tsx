import type { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  Shield,
  Database,
  FileText,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  Info,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About & Data Sources",
  description:
    "About Namma Constituency — a public awareness tool for Tamil Nadu citizens. Full data source attribution, accuracy notes, and disclaimer.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Purpose banner */}
      <div className="mb-8 bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-teal-800 mb-1">
              About Namma Constituency
            </h1>
            <p className="text-sm text-teal-700 leading-relaxed">
              This tool is built for <strong>public awareness</strong> and{" "}
              <strong>ease of access</strong> to information that is already in the public domain.
              Everything shown here is sourced from publicly available government records and open
              datasets. Our goal is to help Tamil Nadu citizens, journalists, researchers, and
              civic organisations find and understand this information in one place — without
              needing to navigate multiple government portals.
            </p>
            <p className="text-sm text-teal-700 leading-relaxed mt-2">
              Namma Constituency is an independent civic tool. It is{" "}
              <strong>not affiliated</strong> with any government body, political party, election
              authority, or NGO.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Data sources */}
        <Card>
          <CardBody className="pt-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-semibold text-slate-800">Data sources</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "Election Commission of India — 2026 TN Assembly Results",
                  url: "https://results.eci.gov.in/ResultAcGenMay2026/index.htm",
                  what:
                    "Official 2026 Tamil Nadu Assembly election results: winner votes, runner-up votes, winning margin, NOTA votes, and total votes cast per constituency. Data sourced directly from ECI's constituency-wise results as declared by Returning Officers. 233 of 234 constituencies covered (THIRUVALLUR result pending on primary data source).",
                  type: "Official election results — May 2026",
                  accuracy: "official",
                },
                {
                  name: "MyNeta India (Association for Democratic Reforms)",
                  url: "https://www.myneta.info/TamilNadu2026/",
                  what:
                    "Criminal cases, assets, liabilities, education, age, profession, and party affiliation of elected MLAs — sourced from Form 26 affidavits filed with the Election Commission of India for the 2026 Tamil Nadu Legislative Assembly elections. Data is as declared by candidates.",
                  type: "Affidavit data — 2026 TN elections",
                  accuracy: "official",
                },
                {
                  name: "Census of India 2011",
                  url: "https://censusindia.gov.in",
                  what:
                    "District-level literacy rates and sex ratios (females per 1000 males). The 2011 Census is the last completed national census. Figures for newly carved districts (Kallakurichi, Ranipet, Tirupattur, Chengalpattu, Tenkasi, Mayiladuthurai) are estimated from their parent district data.",
                  type: "Official census data",
                  accuracy: "official",
                },
                {
                  name: "National Family Health Survey 5 (NFHS-5, 2019–21)",
                  url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=1150&lid=679",
                  what:
                    "Child vaccination coverage and anaemia in women figures. Tamil Nadu state averages are exact as published (73.3% vaccination, 44.6% anaemia). District-level figures are approximated from state and district factsheets and may vary ±5–10% from official district values.",
                  type: "Health survey data",
                  accuracy: "approximate",
                },
                {
                  name: "National Crime Records Bureau (NCRB 2022)",
                  url: "https://ncrb.gov.in",
                  what:
                    "Crimes against women per lakh population. Tamil Nadu state rate is based on published NCRB data. District-level figures are estimates derived from published state data and should be treated as indicative only.",
                  type: "Crime statistics",
                  accuracy: "approximate",
                },
                {
                  name: "MGNREGS Management Information System (2022–23)",
                  url: "https://nrega.nic.in",
                  what:
                    "MGNREGS person-days of employment generated per district in 2022–23. Figures are indicative estimates based on published state-level MIS reports. Not applicable to fully urban districts (Chennai).",
                  type: "Rural employment data",
                  accuracy: "approximate",
                },
                {
                  name: "Tamil Nadu Open Government Data Portal",
                  url: "https://tn.data.gov.in",
                  what:
                    "District-level transport, infrastructure, agriculture, and industry indicators (vehicle registrations, bus routes, air quality, schools, health centres, and sector-specific metrics). These figures are indicative estimates based on publicly known data and should be independently verified before citing.",
                  type: "Indicative estimates",
                  accuracy: "estimated",
                },
                {
                  name: "PRS Legislative Research — MLA Track",
                  url: "https://prsindia.org/mlatrack",
                  what:
                    "Starred questions raised by MLAs in the 16th Tamil Nadu Legislative Assembly (2021–2026). Data covers the period April 2023 to October 2025. Ministers, the Speaker, and the Deputy Speaker are excluded by PRS convention as they represent the government. Unstarred questions and data before April 2023 are not available publicly.",
                  type: "Legislative activity — 16th Assembly",
                  accuracy: "official",
                },
                {
                  name: "Tamil Nadu Legislature — NeVA (National eVidhan Application)",
                  url: "https://tnla.neva.gov.in",
                  what:
                    "Per-question details (question number, date, minister addressed, subject in Tamil) for starred questions raised by incumbent MLAs in the 16th Assembly. Data is sourced directly from the official TN Legislature portal maintained by the Legislature Secretariat.",
                  type: "Legislative questions — 16th Assembly",
                  accuracy: "official",
                },
              ].map((src) => (
                <div
                  key={src.name}
                  className="border border-slate-200 rounded-xl p-4 hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{src.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-block text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2 py-0.5">
                          {src.type}
                        </span>
                        {src.accuracy === "estimated" && (
                          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                            indicative — verify before citing
                          </span>
                        )}
                        {src.accuracy === "approximate" && (
                          <span className="text-xs text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                            approximate — ±5–10%
                          </span>
                        )}
                        {src.accuracy === "official" && (
                          <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                            official published data
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:underline flex items-center gap-1 shrink-0"
                    >
                      Primary source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{src.what}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Affidavit explained */}
        <Card>
          <CardBody className="pt-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-semibold text-slate-800">What is an election affidavit?</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Under the Representation of the People Act and Supreme Court directives, every
              candidate contesting an election in India must file a sworn affidavit (Form 26) with
              the Election Commission. This affidavit publicly discloses:
            </p>
            <ul className="space-y-2.5 mb-4">
              {[
                "Criminal cases — FIRs, charges, or pending court cases (not convictions)",
                "Total assets — immovable property, vehicles, cash, bank balances, investments",
                "Liabilities — outstanding loans, dues payable",
                "Educational qualifications",
                "Source of income and profession",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Important:</strong> Affidavit data is self-declared by candidates and not
                independently verified by the Election Commission at the time of filing. Criminal
                cases shown are registered FIRs or chargesheet filings — not convictions or proven
                guilt. Asset and liability values are as declared; actual figures may differ.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Accuracy levels */}
        <Card>
          <CardBody className="pt-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-semibold text-slate-800">How we label data accuracy</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Each area indicator on a constituency page carries one of three accuracy labels. We
              believe citizens deserve to know how reliable a figure is before acting on it.
            </p>
            <div className="space-y-3">
              {[
                {
                  badge: "official published data",
                  color: "text-emerald-600 bg-emerald-50 border-emerald-200",
                  desc: "Taken directly from a published government source (Census 2011, ECI affidavits). Values match the primary source.",
                },
                {
                  badge: "approx. — ±5–10%",
                  color: "text-blue-500 bg-blue-50 border-blue-100",
                  desc: "Based on a real published report (NFHS-5, NCRB, MGNREGS) but district figures are approximated from state-level data. State averages are exact; district breakdown may vary.",
                },
                {
                  badge: "est. — verify before citing",
                  color: "text-amber-600 bg-amber-50 border-amber-200",
                  desc: "Indicative estimate based on publicly known data ranges. Not yet cross-checked line-by-line against an official source. Treat as directional context only.",
                },
              ].map((row) => (
                <div key={row.badge} className="flex items-start gap-3">
                  <span
                    className={`text-xs font-medium border rounded-full px-2 py-0.5 shrink-0 mt-0.5 ${row.color}`}
                  >
                    {row.badge}
                  </span>
                  <p className="text-sm text-slate-600">{row.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Limitations */}
        <Card className="border-amber-200">
          <CardBody className="pt-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-semibold text-slate-800">Limitations &amp; disclaimer</h2>
            </div>
            <ul className="space-y-2.5">
              {[
                "This tool covers 233 of 234 TN constituencies for the 2026 elections. THIRUVALLUR result is pending on the primary data source (MyNeta).",
                "District-level indicators are not constituency-specific — they reflect the broader district context.",
                "Vote counts, victory margins, and voter turnout are not yet available from the primary data source for 2026.",
                "Some district indicator values (marked 'est.') are indicative estimates, not verified official figures. Do not cite them as official statistics.",
                "Affidavit data is self-declared and not independently audited by this app.",
                "Nothing on this site should be used as the basis for legal, electoral, or official proceedings without independent verification from primary sources.",
                "This tool is for public awareness only. It does not constitute electoral, legal, or financial advice.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-amber-400 mt-1 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* CTA */}
        <div className="text-center py-4">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Start exploring constituencies
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
