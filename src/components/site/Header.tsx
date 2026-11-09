"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

export function Header({ name, tagline, nav, cta, logoUrl }: { name: string; tagline: string; nav: NavItem[]; cta: string; logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.filter((n) => n.href.startsWith("#")).map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [nav]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-all", scrolled || open ? "bg-bg/90 backdrop-blur border-b border-line" : "bg-transparent")}>
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#home" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} className="h-7 w-auto" />
          ) : (
            <span className="font-extrabold tracking-[0.14em] text-sm">{name.toUpperCase()}</span>
          )}
          <span className="hidden sm:block text-[0.65rem] text-muted mt-1">{tagline}</span>
        </a>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={cn("relative text-sm py-1 transition-colors", active === n.href ? "text-ink font-semibold" : "text-muted hover:text-ink")}>
              {n.label}
              {active === n.href && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent" />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#contact" className="btn btn-dark !min-h-10 !px-5 hidden sm:inline-flex">{cta}</a>
          <button className="lg:hidden grid size-11 place-items-center rounded-full border border-line" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden bg-bg border-t border-line h-[calc(100dvh-4rem)] overflow-y-auto" aria-label="Mobile">
          <div className="container-x py-6 flex flex-col">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className={cn("py-4 text-2xl font-bold border-b border-line", active === n.href && "text-accent")}>
                {n.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-dark mt-6">{cta}</a>
          </div>
        </nav>
      )}
    </header>
  );
}
