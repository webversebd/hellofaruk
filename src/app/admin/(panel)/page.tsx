import Link from "next/link";
import { db } from "@/lib/db";

export default async function Dashboard() {
  const [inquiries, newCount, projects, brands, testimonials, recent, settings] = await Promise.all([
    db.contactInquiry.count(),
    db.contactInquiry.count({ where: { status: "NEW" } }),
    db.project.count(),
    db.brand.count(),
    db.testimonial.count(),
    db.contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.websiteSettings.findFirst({ select: { analyticsId: true } }),
  ]);
  const cards = [
    { label: "Inquiries", value: inquiries, sub: `${newCount} new`, href: "/admin/inquiries" },
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Brands", value: brands, href: "/admin/brands" },
    { label: "Testimonials", value: testimonials, href: "/admin/testimonials" },
  ];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-line bg-white p-5 hover:border-accent transition">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="text-3xl font-bold mt-1">{c.value}</p>
            {c.sub && <p className="text-xs text-accent mt-1">{c.sub}</p>}
          </Link>
        ))}
      </div>
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-semibold mb-4">Recent inquiries</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">No inquiries yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/inquiries/${r.id}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-accent">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted truncate flex-1">{r.message}</span>
                  <span className="text-xs text-muted">{r.createdAt.toLocaleDateString("en-GB")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-2xl border border-line bg-white p-5 text-sm">
        <h2 className="font-semibold mb-1">Website analytics</h2>
        {settings?.analyticsId ? (
          <p className="text-muted">Google Analytics ({settings.analyticsId}) is active. View reports in your GA4 dashboard.</p>
        ) : (
          <p className="text-muted">Not configured. Add a GA4 measurement ID under <Link href="/admin/settings" className="underline">Website settings</Link>.</p>
        )}
      </section>
    </div>
  );
}
