import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ToastProvider } from "@/components/admin/Toast";
import { logoutAction } from "../actions";
import { resources } from "@/lib/admin-config";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/hero", label: resources.hero.label },
  { href: "/admin/profile", label: resources.profile.label },
  { href: "/admin/stats", label: resources.stats.label },
  { href: "/admin/skills", label: resources.skills.label },
  { href: "/admin/services", label: resources.services.label },
  { href: "/admin/projects", label: resources.projects.label },
  { href: "/admin/categories", label: resources.categories.label },
  { href: "/admin/brands", label: resources.brands.label },
  { href: "/admin/testimonials", label: resources.testimonials.label },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/social", label: resources.social.label },
  { href: "/admin/navigation", label: resources.navigation.label },
  { href: "/admin/sections", label: resources.sections.label },
  { href: "/admin/settings", label: resources.settings.label },
  { href: "/admin/account", label: "Account" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-[#f3f3f0] md:flex">
        <aside className="md:w-60 md:min-h-dvh md:sticky md:top-0 md:self-start md:h-dvh md:overflow-y-auto bg-white border-b md:border-b-0 md:border-r border-line">
          <div className="flex items-center justify-between px-4 py-3 md:block md:px-5 md:pt-6">
            <Link href="/admin" className="font-extrabold tracking-wide text-sm">FARUK HASAN <span className="text-accent">· CMS</span></Link>
            <Link href="/" target="_blank" className="text-xs text-muted md:block md:mt-1 hover:text-ink">View site ↗</Link>
          </div>
          <nav className="flex md:block overflow-x-auto px-2 pb-2 md:px-3 md:pb-4 gap-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-bg hover:text-ink md:block">
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <header className="flex items-center justify-end gap-4 border-b border-line bg-white px-5 py-3 text-sm">
            <span className="text-muted">{admin.email}</span>
            <form action={logoutAction}><button className="font-semibold hover:text-accent">Sign out</button></form>
          </header>
          <main className="p-5 md:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
