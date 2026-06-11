import type { MetadataRoute } from "next";
import { ROLES, WORKFLOWS } from "@/lib/marketplace/seed";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/roles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/book`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/tools/roi-calculator`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const rolePages: MetadataRoute.Sitemap = ROLES.map((role) => ({
    url: `${SITE_URL}/for/${role.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const workflowPages: MetadataRoute.Sitemap = WORKFLOWS.map((w) => ({
    url: `${SITE_URL}/for/${w.roleSlug}/${w.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...rolePages, ...workflowPages];
}
