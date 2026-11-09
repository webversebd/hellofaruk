import Image from "next/image";
import * as Lucide from "lucide-react";
import { ArrowUpRight, Mail, MessageCircle, Phone, Star, ArrowUp } from "lucide-react";
import type { SiteData } from "@/lib/data";
import { digits } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { ProjectsGrid } from "./ProjectsGrid";
import { ContactForm } from "./ContactForm";
import { SocialIcon, SOCIAL_NAMES } from "./SocialIcon";

type Sec = { label?: string | null; heading?: string | null; subheading?: string | null } | undefined;

function Heading({ sec, fallbackLabel, fallbackHeading, sub }: { sec: Sec; fallbackLabel: string; fallbackHeading: string; sub?: string | null }) {
  return (
    <Reveal className="max-w-3xl mb-12 md:mb-16">
      <p className="eyebrow">{sec?.label ?? fallbackLabel}</p>
      <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-[1.08] tracking-tight">{sec?.heading || fallbackHeading}</h2>
      {(sub ?? sec?.subheading) && <p className="mt-5 text-muted text-lg">{sub ?? sec?.subheading}</p>}
    </Reveal>
  );
}

export function Hero({ d }: { d: SiteData }) {
  const h = d.hero;
  if (!h) return null;
  const wa = d.settings?.whatsapp ? `https://wa.me/${digits(d.settings.whatsapp).replace("+", "")}?text=${encodeURIComponent(d.settings.whatsappMessage)}` : null;
  return (
    <section id="home" className="pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container-x grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          {h.isAvailable && (
            <p className="inline-flex items-center gap-2.5 eyebrow !text-ink/70">
              <span className="relative flex size-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" /></span>
              {h.availability}
            </p>
          )}
          <h1 className="mt-6 text-[2.5rem] sm:text-6xl xl:text-7xl font-extrabold leading-[1.02] tracking-tight text-balance">{h.heading}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">{h.description}</p>
          <p className="mt-5 text-sm font-semibold">{h.identity}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={h.primaryHref} className="btn btn-dark">{h.primaryLabel}</a>
            <a href={h.secondaryHref} className="btn btn-line">{h.secondaryLabel}</a>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-line"><MessageCircle className="size-4" />WhatsApp</a>}
          </div>
          {d.socials.length > 0 && (
            <ul className="mt-8 flex gap-2">
              {d.socials.map((s) => (
                <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAMES[s.platform] ?? s.platform} className="grid size-11 place-items-center rounded-full border border-line bg-white hover:border-accent hover:text-accent transition"><SocialIcon platform={s.platform} /></a></li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] border border-accent/40 translate-x-4 translate-y-4" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(23,23,23,0.35)]">
              {h.portraitUrl ? (
                <Image src={h.portraitUrl} alt={h.portraitAlt || d.profile?.name || "Portrait"} fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-muted">Upload your portrait in Admin → Hero.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats({ d }: { d: SiteData }) {
  if (!d.stats.length) return null;
  return (
    <section aria-label="Quick statistics" className="border-y border-line bg-white">
      <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-y-8 py-10">
        {d.stats.map((s) => (
          <div key={s.id} className="md:border-l first:border-l-0 border-line md:pl-8 first:pl-0">
            <p className="text-4xl md:text-5xl font-extrabold tracking-tight">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function About({ d, sec }: { d: SiteData; sec: Sec }) {
  const p = d.profile;
  if (!p) return null;
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container-x">
        <Heading sec={{ label: p.aboutLabel, heading: p.aboutHeadline, subheading: sec?.subheading }} fallbackLabel="About Me" fallbackHeading={p.aboutHeadline} />
        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-7 space-y-5 text-lg leading-relaxed text-ink/80">
            {p.aboutBody.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
            <div className="pt-4 border-t border-line">
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-3">My story</h3>
              {p.story.split(/\n{2,}/).map((para, i) => <p key={i} className="mb-4">{para}</p>)}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            {p.imageUrl && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-8">
                <Image src={p.imageUrl} alt={p.imageAlt || p.name} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </div>
            )}
            <p className="text-sm font-semibold mb-3">{p.experience}</p>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-3">Skills</h3>
            <ul className="flex flex-wrap gap-2">
              {d.skills.map((s) => <li key={s.id} className="rounded-full border border-line bg-white px-4 py-2 text-sm">{s.name}</li>)}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Services({ d, sec }: { d: SiteData; sec: Sec }) {
  if (!d.services.length) return null;
  const icons = Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return (
    <section id="services" className="py-20 md:py-28 bg-white border-y border-line">
      <div className="container-x">
        <Heading sec={sec} fallbackLabel="What I Do" fallbackHeading="Solutions That Help Businesses Grow." />
        <div className="grid md:grid-cols-2 border-t border-line">
          {d.services.map((s, i) => {
            const Icon = icons[s.icon] ?? Lucide.Layers;
            return (
              <Reveal key={s.id} delay={(i % 2) * 0.06} className="group flex gap-5 border-b border-line py-8 md:odd:pr-10 md:even:pl-10 md:odd:border-r">
                <Icon className="size-6 shrink-0 text-accent mt-1" />
                <div>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.shortDesc}</p>
                  {s.detailDesc && <p className="mt-2 text-sm text-muted/90">{s.detailDesc}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Projects({ d, sec }: { d: SiteData; sec: Sec }) {
  const items = d.projects.map((p) => ({
    id: p.id, title: p.title, brandName: p.brandName, shortDesc: p.shortDesc, imageUrl: p.imageUrl, imageAlt: p.imageAlt,
    liveUrl: p.liveUrl, technologies: p.technologies, categoryName: p.category?.name ?? null, isFeatured: p.isFeatured,
  }));
  const used = new Set(items.map((i) => i.categoryName).filter(Boolean) as string[]);
  const cats = d.categories.map((c) => c.name).filter((n) => used.has(n));
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="container-x">
        <Heading sec={sec} fallbackLabel="Selected Work" fallbackHeading="Some Projects I've Worked On." />
        <ProjectsGrid projects={items} categories={cats} />
      </div>
    </section>
  );
}

export function Brands({ d, sec }: { d: SiteData; sec: Sec }) {
  if (!d.brands.length) return null;
  return (
    <section id="brands" className="py-20 md:py-28 bg-white border-y border-line">
      <div className="container-x">
        <Heading sec={sec} fallbackLabel="Trusted Collaborations" fallbackHeading="Brands I've Worked With." />
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {d.brands.map((b) => (
            <li key={b.id} className="bg-white">
              <a href={b.websiteUrl} target="_blank" rel="noopener noreferrer" title={b.shortDesc ?? b.name} aria-label={`${b.name} (opens in new tab)`}
                className="group flex h-28 md:h-32 items-center justify-center p-6">
                {b.logoUrl ? (
                  <Image src={b.logoUrl} alt={`${b.name} logo`} width={160} height={64} className="max-h-12 w-auto object-contain grayscale opacity-60 transition duration-500 group-hover:grayscale-0 group-hover:opacity-100" />
                ) : (
                  <span className="font-bold text-muted group-hover:text-ink transition">{b.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Testimonials({ d, sec }: { d: SiteData; sec: Sec }) {
  if (!d.testimonials.length) return null;
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container-x">
        <Heading sec={sec} fallbackLabel="Client Feedback" fallbackHeading="What People Say About Working With Me." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {d.testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.07}>
              <figure className="h-full flex flex-col rounded-2xl border border-line bg-white p-7">
                <div className="flex gap-0.5 text-accent" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, n) => <Star key={n} className={`size-4 ${n < t.rating ? "fill-current" : "opacity-25"}`} />)}
                </div>
                <blockquote className="mt-5 flex-1 text-lg leading-relaxed">“{t.review}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  {t.photoUrl && <Image src={t.photoUrl} alt={t.clientName} width={44} height={44} className="size-11 rounded-full object-cover" />}
                  <div className="text-sm">
                    <p className="font-bold">{t.clientName}</p>
                    <p className="text-muted">
                      {[t.designation, t.company].filter(Boolean).join(", ")}
                      {t.websiteUrl && <> · <a href={t.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline">site</a></>}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({ d, sec }: { d: SiteData; sec: Sec }) {
  const s = d.settings;
  const wa = s?.whatsapp ? `https://wa.me/${digits(s.whatsapp).replace("+", "")}?text=${encodeURIComponent(s.whatsappMessage)}` : null;
  const options = [
    s?.phone && { href: `tel:${digits(s.phone)}`, icon: Phone, label: "Call Me", value: s.phone, ext: false },
    wa && { href: wa, icon: MessageCircle, label: "WhatsApp", value: "Chat now", ext: true },
    s?.email && { href: `mailto:${s.email}`, icon: Mail, label: "Email", value: s.email, ext: false },
  ].filter(Boolean) as { href: string; icon: React.ComponentType<{ className?: string }>; label: string; value: string; ext: boolean }[];

  return (
    <section id="contact" className="py-20 md:py-28 bg-white border-t border-line">
      <div className="container-x">
        <Heading sec={sec} fallbackLabel="Let's Work Together" fallbackHeading={s?.contactHeadline ?? ""} sub={s?.contactText} />
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            {options.map((o) => (
              <a key={o.label} href={o.href} {...(o.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-bg p-5 min-h-[4.5rem] hover:border-accent transition">
                <o.icon className="size-6 text-accent" />
                <div className="flex-1 min-w-0"><p className="font-bold">{o.label}</p><p className="text-sm text-muted truncate">{o.value}</p></div>
                <ArrowUpRight className="size-5 opacity-0 group-hover:opacity-100 transition" />
              </a>
            ))}
            {options.length === 0 && <p className="text-sm text-muted">Add phone, WhatsApp and email in Admin → Website settings.</p>}
          </div>
          <div className="lg:col-span-7"><ContactForm /></div>
        </div>
      </div>
    </section>
  );
}

export function Social({ d }: { d: SiteData }) {
  if (!d.socials.length) return null;
  return (
    <section aria-label="Social media" className="py-12 border-t border-line">
      <ul className="container-x flex flex-wrap justify-center gap-3">
        {d.socials.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 min-h-11 text-sm hover:border-accent hover:text-accent transition">
              <SocialIcon platform={s.platform} className="size-4" />{SOCIAL_NAMES[s.platform] ?? s.platform}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer({ d }: { d: SiteData }) {
  const s = d.settings;
  const name = s?.siteName ?? "Faruk Hasan";
  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-14 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-extrabold tracking-[0.14em]">{name.toUpperCase()}</p>
          <p className="mt-3 text-white/60 max-w-xs text-sm">{s?.footerTagline}</p>
          {s?.email && <a href={`mailto:${s.email}`} className="mt-4 inline-block text-sm underline underline-offset-4">{s.email}</a>}
        </div>
        <nav aria-label="Footer"><ul className="space-y-2 text-sm text-white/70">
          {d.nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-white">{n.label}</a></li>)}
        </ul></nav>
        <div className="md:text-right">
          <ul className="flex md:justify-end gap-2">
            {d.socials.map((x) => (
              <li key={x.id}><a href={x.url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAMES[x.platform] ?? x.platform} className="grid size-11 place-items-center rounded-full border border-white/20 hover:border-accent hover:text-accent transition"><SocialIcon platform={x.platform} /></a></li>
            ))}
          </ul>
          <a href="#home" className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowUp className="size-4" />Back to top</a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        {s?.footerCopyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}
      </div>
    </footer>
  );
}
