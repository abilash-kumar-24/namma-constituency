import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparePageClient } from "./ComparePageClient";

export const metadata: Metadata = {
  title: "Compare Constituencies",
  description: "Compare two Tamil Nadu MLAs or constituencies side by side.",
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { a = "", b = "" } = await searchParams;
  return (
    <Suspense>
      <ComparePageClient initialA={a} initialB={b} />
    </Suspense>
  );
}
