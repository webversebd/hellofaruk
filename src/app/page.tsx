import { getSiteData } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { About, Brands, Contact, Footer, Hero, Projects, Services, Social, Stats, Testimonials } from "@/components/site/Sections";

export const revalidate = 300; // also revalidated instantly after every admin save

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hellofaruk.com";

export default async function Home() {
  let d;
  try {
    d = await getSiteData();
  } catch (e) {
    console.error("getSiteData failed", e);
    return <main className="min-h-dvh grid place-items-center p-6 text-center"><p>Site content is being set up. Please check back shortly.</p></main>;
  }
  if (!d.settings || !d.hero) {
    return <main className="min-h-dvh grid place-items-center p-6 text-center"><p>Run <code>npm run db:seed</code> to create the initial content.</p></main>;
  }

  const sec = Object.fromEntries(d.sections.map((s) => [s.key, s]));
  const order = d.sections.filter((s) => s.isVisible).map((s) => s.key);

  const render: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" d={d} />,
    stats: <Stats key="stats" d={d} />,
    about: <About key="about" d={d} sec={sec.about} />,
    services: <Services key="services" d={d} sec={sec.services} />,
    projects: <Projects key="projects" d={d} sec={sec.projects} />,
    brands: <Brands key="brands" d={d} sec={sec.brands} />,
    testimonials: <Testimonials key="testimonials" d={d} sec={sec.testimonials} />,
    contact: <Contact key="contact" d={d} sec={sec.contact} />,
    social: <Social key="social" d={d} />,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: d.profile?.name ?? d.settings.siteName,
    jobTitle: d.profile?.title,
    url: SITE,
    image: d.hero.portraitUrl ?? undefined,
    email: d.settings.email ? `mailto:${d.settings.email}` : undefined,
    telephone: d.settings.phone ?? undefined,
    sameAs: d.socials.map((s) => s.url),
  };

  return (
    <>
      <Header name={d.settings.siteName} tagline={d.settings.tagline} nav={d.nav} cta="Let's Talk" logoUrl={d.settings.logoUrl} />
      <main>{order.map((k) => render[k] ?? null)}</main>
      <Footer d={d} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
