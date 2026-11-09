"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectItem = {
  id: string; title: string; brandName: string; shortDesc: string; imageUrl: string | null; imageAlt: string | null;
  liveUrl: string | null; technologies: string[]; categoryName: string | null; isFeatured: boolean;
};

export function ProjectsGrid({ projects, categories }: { projects: ProjectItem[]; categories: string[] }) {
  const [filter, setFilter] = useState("All");
  const shown = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.categoryName === filter)), [projects, filter]);

  if (projects.length === 0) return <p className="text-muted">Projects will appear here once they are added from the admin dashboard.</p>;

  return (
    <div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Project categories">
          {["All", ...categories].map((c) => (
            <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)}
              className={cn("rounded-full border px-4 min-h-10 text-sm transition", filter === c ? "bg-ink text-white border-ink" : "border-line bg-white hover:border-ink")}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-12 gap-x-6 gap-y-12">
        {shown.map((p, i) => {
          const wide = i % 3 === 0;
          const Card = p.liveUrl ? "a" : "div";
          return (
            <Card key={p.id} {...(p.liveUrl ? { href: p.liveUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn("group block", wide ? "md:col-span-7" : "md:col-span-5", i % 3 === 2 && "md:mt-16")}>
              <div className="relative overflow-hidden rounded-2xl bg-white border border-line aspect-[4/3]">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.imageAlt || `${p.title} for ${p.brandName}`} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-muted text-sm">{p.brandName}</div>
                )}
                {p.liveUrl && (
                  <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/90 opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0">
                    <ArrowUpRight className="size-5" />
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-sm text-muted mt-0.5">{p.brandName}{p.categoryName ? ` · ${p.categoryName}` : ""}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted max-w-xl">{p.shortDesc}</p>
              {p.technologies.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{t}</li>)}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
