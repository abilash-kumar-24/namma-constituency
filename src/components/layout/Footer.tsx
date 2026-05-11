import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-teal-600 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-slate-800 text-sm">Namma Constituency</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              A citizen-first governance transparency tool for Tamil Nadu. Built from publicly
              available data.
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-0.5 font-medium">
                Built from public data
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Navigate
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/search", label: "Search MLAs" },
                { href: "/compare", label: "Compare" },
                { href: "/about", label: "About & Data" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 hover:text-teal-700 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Data Sources
            </h3>
            <ul className="space-y-2">
              {[
                { href: "https://www.myneta.info", label: "MyNeta India" },
                { href: "https://tn.data.gov.in", label: "TN Open Data Portal" },
                { href: "https://www.tnpcb.gov.in", label: "TN Pollution Control Board" },
                { href: "https://cpgrams.gov.in", label: "CPGRAMS Grievance Portal" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1"
                  >
                    {l.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Data shown is from public affidavits and open government datasets. Not an official
            government product.
          </p>
          <p className="text-xs text-slate-400">Proof of Concept — Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
}
