export type FieldType = "text" | "textarea" | "url" | "image" | "checkbox" | "number" | "select" | "tags" | "email";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[]; // select
  help?: string;
  max?: number;
};

export type Resource = {
  key: string;
  label: string;
  singular: string;
  model: string; // Prisma delegate name
  singleton?: boolean;
  orderField?: "sortOrder";
  publishField?: "isPublished" | "isVisible" | "isEnabled";
  slugFrom?: string; // auto-generate unique slug from this field
  titleField: string;
  fields: Field[];
  canCreate?: boolean;
  canDelete?: boolean;
  description?: string;
};

export const ICONS = ["ShoppingBag","Palette","Code2","PenTool","TrendingUp","Rocket","Gauge","MessageSquare","Layers","Search","Megaphone","BarChart3","Globe","Wrench","Sparkles","Store"];

export const resources: Record<string, Resource> = {
  profile: {
    key: "profile", label: "Profile & About", singular: "Profile", model: "profile", singleton: true, titleField: "name",
    description: "Your name, photo, and About section content.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "title", label: "Professional title", type: "text", required: true },
      { name: "imageUrl", label: "Profile image", type: "image" },
      { name: "imageAlt", label: "Image alt text", type: "text" },
      { name: "aboutLabel", label: "Section label", type: "text", required: true },
      { name: "aboutHeadline", label: "Section headline", type: "text", required: true },
      { name: "aboutBody", label: "About introduction", type: "textarea", required: true },
      { name: "story", label: "Professional story", type: "textarea", required: true },
      { name: "experience", label: "Experience summary", type: "text", required: true },
    ],
  },
  hero: {
    key: "hero", label: "Hero", singular: "Hero", model: "heroSection", singleton: true, titleField: "heading",
    description: "The first thing visitors see.",
    fields: [
      { name: "isAvailable", label: "Show availability indicator", type: "checkbox" },
      { name: "availability", label: "Availability label", type: "text", required: true },
      { name: "heading", label: "Headline", type: "textarea", required: true },
      { name: "description", label: "Supporting paragraph", type: "textarea", required: true },
      { name: "identity", label: "Professional identity line", type: "text", required: true },
      { name: "portraitUrl", label: "Portrait image", type: "image", help: "Upload your real photo. Portrait ratio (4:5) works best." },
      { name: "portraitAlt", label: "Portrait alt text", type: "text" },
      { name: "primaryLabel", label: "Primary button label", type: "text", required: true },
      { name: "primaryHref", label: "Primary button link", type: "text", required: true },
      { name: "secondaryLabel", label: "Secondary button label", type: "text", required: true },
      { name: "secondaryHref", label: "Secondary button link", type: "text", required: true },
    ],
  },
  stats: {
    key: "stats", label: "Statistics", singular: "Statistic", model: "statistic", orderField: "sortOrder", publishField: "isVisible", titleField: "label", canCreate: true, canDelete: true,
    description: "Hidden until you enter a real value and switch them on.",
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Value (e.g. 8+)", type: "text" },
      { name: "isVisible", label: "Visible on site", type: "checkbox" },
    ],
  },
  skills: {
    key: "skills", label: "Skills", singular: "Skill", model: "skill", orderField: "sortOrder", publishField: "isVisible", titleField: "name", canCreate: true, canDelete: true,
    fields: [
      { name: "name", label: "Skill", type: "text", required: true },
      { name: "isVisible", label: "Visible on site", type: "checkbox" },
    ],
  },
  services: {
    key: "services", label: "Services", singular: "Service", model: "service", orderField: "sortOrder", publishField: "isPublished", slugFrom: "title", titleField: "title", canCreate: true, canDelete: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "shortDesc", label: "Short description", type: "textarea", required: true },
      { name: "detailDesc", label: "Detailed description", type: "textarea" },
      { name: "icon", label: "Icon", type: "select", options: ICONS.map((i) => ({ value: i, label: i })) },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
  },
  categories: {
    key: "categories", label: "Project categories", singular: "Category", model: "projectCategory", orderField: "sortOrder", slugFrom: "name", titleField: "name", canCreate: true, canDelete: true,
    fields: [{ name: "name", label: "Name", type: "text", required: true }],
  },
  projects: {
    key: "projects", label: "Projects", singular: "Project", model: "project", orderField: "sortOrder", publishField: "isPublished", slugFrom: "title", titleField: "title", canCreate: true, canDelete: true,
    fields: [
      { name: "title", label: "Project title", type: "text", required: true },
      { name: "brandName", label: "Brand name", type: "text", required: true },
      { name: "categoryId", label: "Category", type: "select" }, // options injected at render time
      { name: "shortDesc", label: "Short description", type: "textarea", required: true },
      { name: "imageUrl", label: "Project image", type: "image", help: "Use a real screenshot or mockup of the project." },
      { name: "imageAlt", label: "Image alt text", type: "text" },
      { name: "technologies", label: "Technologies (comma separated)", type: "tags" },
      { name: "liveUrl", label: "Live website URL", type: "url" },
      { name: "caseStudy", label: "Case study (optional)", type: "textarea" },
      { name: "isFeatured", label: "Featured", type: "checkbox" },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
  },
  brands: {
    key: "brands", label: "Brands", singular: "Brand", model: "brand", orderField: "sortOrder", publishField: "isPublished", slugFrom: "name", titleField: "name", canCreate: true, canDelete: true,
    fields: [
      { name: "name", label: "Brand name", type: "text", required: true },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "websiteUrl", label: "Website URL", type: "url", required: true },
      { name: "shortDesc", label: "Short description", type: "text" },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
  },
  testimonials: {
    key: "testimonials", label: "Testimonials", singular: "Testimonial", model: "testimonial", orderField: "sortOrder", publishField: "isPublished", titleField: "clientName", canCreate: true, canDelete: true,
    fields: [
      { name: "clientName", label: "Client name", type: "text", required: true },
      { name: "photoUrl", label: "Client photo", type: "image" },
      { name: "company", label: "Company", type: "text" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "review", label: "Review", type: "textarea", required: true },
      { name: "rating", label: "Rating (1-5)", type: "number", required: true },
      { name: "websiteUrl", label: "Company website", type: "url" },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
  },
  social: {
    key: "social", label: "Social links", singular: "Social link", model: "socialLink", orderField: "sortOrder", publishField: "isEnabled", titleField: "platform", canCreate: false, canDelete: false,
    description: "Enable a profile once you've added its URL.",
    fields: [
      { name: "url", label: "Profile URL", type: "url" },
      { name: "isEnabled", label: "Enabled", type: "checkbox" },
    ],
  },
  navigation: {
    key: "navigation", label: "Navigation", singular: "Link", model: "navigationItem", orderField: "sortOrder", publishField: "isVisible", titleField: "label", canCreate: true, canDelete: true,
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Link (e.g. #about)", type: "text", required: true },
      { name: "isVisible", label: "Visible", type: "checkbox" },
    ],
  },
  sections: {
    key: "sections", label: "Sections", singular: "Section", model: "sectionSetting", orderField: "sortOrder", publishField: "isVisible", titleField: "label", canCreate: false, canDelete: false,
    description: "Show, hide, reorder and retitle homepage sections. Label = small text above the headline.",
    fields: [
      { name: "label", label: "Section label", type: "text", required: true },
      { name: "heading", label: "Headline", type: "text" },
      { name: "subheading", label: "Sub-text", type: "textarea" },
      { name: "isVisible", label: "Visible", type: "checkbox" },
    ],
  },
  settings: {
    key: "settings", label: "Website settings", singular: "Settings", model: "websiteSettings", singleton: true, titleField: "siteName",
    description: "Contact details, SEO, footer and branding.",
    fields: [
      { name: "siteName", label: "Site name", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "phone", label: "Phone number", type: "text" },
      { name: "whatsapp", label: "WhatsApp number (digits, with country code)", type: "text" },
      { name: "whatsappMessage", label: "WhatsApp pre-filled message", type: "text", required: true },
      { name: "email", label: "Email address", type: "email" },
      { name: "contactHeadline", label: "Contact headline", type: "text", required: true },
      { name: "contactText", label: "Contact supporting text", type: "textarea", required: true },
      { name: "logoUrl", label: "Website logo (optional)", type: "image" },
      { name: "faviconUrl", label: "Favicon", type: "image" },
      { name: "seoTitle", label: "SEO title", type: "text", required: true },
      { name: "seoDescription", label: "Meta description", type: "textarea", required: true, max: 320 },
      { name: "seoKeywords", label: "SEO keywords", type: "text" },
      { name: "ogImageUrl", label: "Open Graph image", type: "image" },
      { name: "footerTagline", label: "Footer tagline", type: "text", required: true },
      { name: "footerCopyright", label: "Footer copyright text (optional)", type: "text" },
      { name: "accentColor", label: "Accent color (hex)", type: "text", required: true },
      { name: "analyticsId", label: "Google Analytics ID (G-XXXX, optional)", type: "text" },
    ],
  },
};
