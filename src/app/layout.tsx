import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { getSettings } from "@/lib/data";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hellofaruk.com";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s?.seoTitle ?? "Faruk Hasan | Shopify Expert & E-commerce Developer";
  const description = s?.seoDescription ?? "Shopify expert and e-commerce developer.";
  return {
    metadataBase: new URL(SITE),
    title: { default: title, template: `%s | ${s?.siteName ?? "Faruk Hasan"}` },
    description,
    keywords: s?.seoKeywords?.split(",").map((k) => k.trim()).filter(Boolean),
    alternates: { canonical: "/" },
    icons: s?.faviconUrl ? { icon: s.faviconUrl } : undefined,
    openGraph: { type: "website", url: SITE, siteName: s?.siteName ?? "Faruk Hasan", title, description, images: s?.ogImageUrl ? [{ url: s.ogImageUrl }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: s?.ogImageUrl ? [s.ogImageUrl] : undefined },
  };
}

export const viewport: Viewport = { themeColor: "#F8F8F5", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const accent = s?.accentColor && /^#[0-9a-fA-F]{6}$/.test(s.accentColor) ? s.accentColor : null;
  return (
    <html lang="en" className={manrope.variable}>
      <head>{accent && <style>{`:root{--color-accent:${accent}}`}</style>}</head>
      <body>
        {children}
        {s?.analyticsId && /^G-[A-Z0-9]+$/.test(s.analyticsId) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${s.analyticsId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.analyticsId}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
