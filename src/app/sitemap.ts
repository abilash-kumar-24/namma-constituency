import type { MetadataRoute } from "next";
import representatives from "@/data/representatives.json";
import type { Representative } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://namma-constituency.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/search`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const constituencyRoutes: MetadataRoute.Sitemap = (
    representatives as Representative[]
  ).map((rep) => ({
    url: `${BASE_URL}/constituency/${rep.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...constituencyRoutes];
}
