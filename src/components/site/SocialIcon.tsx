import { GitBranch, Globe } from "lucide-react";

// Lucide dropped brand logos, so these are small inline glyphs.
export function SocialIcon({ platform, className = "size-5" }: { platform: string; className?: string }) {
  const p = platform.toLowerCase();
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;
  if (p === "instagram")
    return (<svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" /></svg>);
  if (p === "youtube")
    return (<svg {...common}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" /></svg>);
  if (p === "github") return <GitBranch className={className} aria-hidden />;
  const text: Record<string, string> = { linkedin: "in", facebook: "f", behance: "Bē", dribbble: "Dr" };
  if (text[p])
    return (<svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><text x="12" y="16.2" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" stroke="none" fontFamily="sans-serif">{text[p]}</text></svg>);
  return <Globe className={className} aria-hidden />;
}

export const SOCIAL_NAMES: Record<string, string> = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram", github: "GitHub", behance: "Behance", dribbble: "Dribbble", youtube: "YouTube" };
