import "server-only";
import { db } from "./db";

export async function getSiteData() {
  const [settings, profile, hero, stats, skills, services, categories, projects, brands, testimonials, socials, nav, sections] = await Promise.all([
    db.websiteSettings.findFirst(),
    db.profile.findFirst(),
    db.heroSection.findFirst(),
    db.statistic.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
    db.skill.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
    db.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    db.projectCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }], include: { category: true } }),
    db.brand.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    db.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    db.socialLink.findMany({ where: { isEnabled: true, NOT: { url: "" } }, orderBy: { sortOrder: "asc" } }),
    db.navigationItem.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
    db.sectionSetting.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return { settings, profile, hero, stats: stats.filter((s) => s.value.trim() !== ""), skills, services, categories, projects, brands, testimonials, socials, nav, sections };
}

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;

export async function getSettings() {
  try {
    return await db.websiteSettings.findFirst();
  } catch {
    return null;
  }
}
