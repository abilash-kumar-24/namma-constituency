import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Namma Constituency — Know Your MLA, Tamil Nadu",
    template: "%s | Namma Constituency",
  },
  description:
    "A public transparency tool for Tamil Nadu citizens. Search your MLA, view public affidavit data, local indicators, and find out how to raise a civic issue.",
  keywords: ["Tamil Nadu", "MLA", "constituency", "transparency", "affidavit", "governance"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Namma Constituency",
    description: "Know your MLA. See public data. Raise a civic issue.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
