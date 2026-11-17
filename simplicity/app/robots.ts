import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/write", "/library", "/settings", "/onboarding"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
