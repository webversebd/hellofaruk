import "server-only";
import { db } from "./db";

export async function getOptions(resourceKey: string): Promise<Record<string, { value: string; label: string }[]>> {
  if (resourceKey !== "projects") return {};
  const cats = await db.projectCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return { categoryId: cats.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name })) };
}
