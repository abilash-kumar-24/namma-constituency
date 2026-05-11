import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-sm">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-6">
          This constituency or page doesn&apos;t exist in our current dataset. We&apos;re starting
          with 5 constituencies — more coming soon.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="bg-white border border-slate-300 hover:border-teal-300 text-slate-700 hover:text-teal-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Search constituencies
          </Link>
        </div>
      </div>
    </div>
  );
}
