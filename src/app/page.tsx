import Link from "next/link";
import { ArrowRight, Shield, BarChart2, MessageSquare, Search } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import representatives from "@/data/representatives.json";
import type { Representative } from "@/types";

const reps = representatives as Representative[];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-xs font-medium mb-5">
          <Shield className="w-3 h-3" />
          Built from public data · Tamil Nadu
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight mb-4">
          Know your constituency
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Search your MLA or constituency to see public background information, local area
          indicators, and what to do if you need to raise a civic issue.
        </p>
      </section>

      {/* Search */}
      <section className="max-w-xl mx-auto mb-4" aria-label="Search constituencies">
        <SearchBar size="large" placeholder="Search by MLA name, constituency, or district…" />
        <p className="text-center text-xs text-slate-400 mt-2">
          Showing data for 5 Tamil Nadu constituencies · More coming soon
        </p>
      </section>

      {/* Quick picks */}
      <section className="mb-14" aria-label="Quick-pick constituencies">
        <p className="text-xs text-slate-500 text-center mb-3 font-medium uppercase tracking-wide">
          Or choose a constituency
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {reps.map((rep) => (
            <Link
              key={rep.id}
              href={`/constituency/${rep.id}`}
              className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:text-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span className="font-medium">{rep.constituency}</span>
              <span className="text-xs text-slate-400 group-hover:text-teal-500">
                {rep.district}
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* How it helps */}
      <section aria-labelledby="how-it-helps" className="mb-14">
        <h2
          id="how-it-helps"
          className="text-center text-xl font-semibold text-slate-800 mb-8"
        >
          What you can find here
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: <Search className="w-5 h-5 text-teal-600" />,
              title: "Your representative",
              desc: "See who represents your constituency, their party, age, education, and declared profession.",
            },
            {
              icon: <Shield className="w-5 h-5 text-teal-600" />,
              title: "Public affidavit data",
              desc: "View criminal cases declared, total assets, and liabilities from publicly filed election affidavits.",
            },
            {
              icon: <BarChart2 className="w-5 h-5 text-teal-600" />,
              title: "Local area indicators",
              desc: "See district-level data like public transport coverage, air quality, and vehicle registrations from TN open datasets.",
            },
            {
              icon: <MessageSquare className="w-5 h-5 text-teal-600" />,
              title: "Civic issue guidance",
              desc: "Find out which department handles roads, water, drainage, and other common issues in your area.",
            },
          ]
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
        </div>

        {/* 4th card full width on mobile */}
        <div className="mt-5 bg-white rounded-xl border border-slate-200 p-5 sm:hidden">
          <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1.5">Civic issue guidance</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Find out which department handles roads, water, drainage, and other common issues in
            your area.
          </p>
        </div>
        <div className="mt-5 hidden sm:block bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Civic issue guidance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find out which department handles roads, water, drainage, and other common issues in
                your area — and how to prepare before filing a complaint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-sm text-amber-800 leading-relaxed">
            Built for public awareness using publicly available data (MyNeta/ADR affidavits, TN open datasets and other public data sources). This is not an official government product — please verify with primary sources before citing or acting on any information.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1 mt-3 text-sm text-amber-700 font-medium hover:text-amber-900 underline underline-offset-2"
          >
            Learn more about our data sources
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
