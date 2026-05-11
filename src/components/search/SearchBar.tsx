"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Representative } from "@/types";
import representatives from "@/data/representatives.json";

interface SearchBarProps {
  initialQuery?: string;
  size?: "large" | "default";
  placeholder?: string;
}

export function SearchBar({
  initialQuery = "",
  size = "default",
  placeholder = "Search by MLA name, constituency, or district…",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Representative[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = value.toLowerCase();
    const matches = (representatives as Representative[]).filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.constituency.toLowerCase().includes(lower) ||
        r.district.toLowerCase().includes(lower) ||
        r.party_short.toLowerCase().includes(lower)
    );
    setSuggestions(matches.slice(0, 6));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(val);
      setShowSuggestions(true);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (rep: Representative) => {
    setQuery(rep.constituency);
    setShowSuggestions(false);
    router.push(`/constituency/${rep.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLarge = size === "large";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${
              isLarge ? "w-5 h-5" : "w-4 h-4"
            }`}
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder={placeholder}
            aria-label="Search constituencies or MLAs"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            className={`w-full bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition
              ${isLarge ? "pl-12 pr-12 py-4 text-base sm:text-lg" : "pl-10 pr-10 py-3 text-sm"}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50"
        >
          {suggestions.map((rep, i) => (
            <li
              key={rep.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(rep)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                i === activeIndex ? "bg-teal-50" : "hover:bg-slate-50"
              } ${i > 0 ? "border-t border-slate-100" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {rep.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{rep.name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {rep.constituency} · {rep.district} ·{" "}
                  <span className="font-medium">{rep.party_short}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && query.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-6 text-center z-50">
          <p className="text-sm text-slate-500">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-slate-400 mt-1">
            Try a constituency name, MLA name, or district.
          </p>
        </div>
      )}
    </div>
  );
}
