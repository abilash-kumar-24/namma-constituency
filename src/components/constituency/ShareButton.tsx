"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  constituencyName: string;
}

export function ShareButton({ constituencyName }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-sm text-slate-600 border border-slate-300 hover:border-teal-300 hover:text-teal-700 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
      aria-label={`Copy link to ${constituencyName} page`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy link
        </>
      )}
    </button>
  );
}
