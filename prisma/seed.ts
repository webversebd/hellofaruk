import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) before seeding.");
  }

  await db.adminUser.upsert({
    where: { email },
    update: { passwordHash: await bcrypt.hash(password, 12) },
    create: { email, name: "Faruk Hasan", passwordHash: await bcrypt.hash(password, 12) },
  });

  if ((await db.profile.count()) === 0) {
    await db.profile.create({
      data: {
        name: "Faruk Hasan",
        title: "Shopify Expert & E-commerce Developer",
        aboutBody:
          "I'm an e-commerce professional who combines hands-on Shopify development with real business operations experience. I help brands launch, customize, and grow online stores that look refined and convert well.\n\nMy work spans e-commerce management, Shopify store development and theme customization, website development, UI/UX design, digital marketing, creative branding, and growth strategy.",
        story:
          "Edit this story from Admin → Profile. Tell visitors how you started in e-commerce and how you grew into building and managing online stores.",
        experience: "8+ years in e-commerce",
      },
    });
  }

  if ((await db.heroSection.count()) === 0) {
    await db.heroSection.create({
      data: {
        heading: "Building Digital Experiences That Drive E-commerce Growth.",
        description:
          "I'm Faruk Hasan, a Shopify Expert and E-commerce Developer helping brands build, optimize, and grow high-performing online stores through thoughtful design and smart e-commerce solutions.",
        identity: "Shopify Expert | E-commerce Developer | UI/UX Specialist",
      },
    });
  }

  if ((await db.statistic.count()) === 0) {
    // Only the years figure comes from the brief. Others stay hidden until you enter real numbers.
    await db.statistic.createMany({
      data: [
        { label: "Years of E-commerce Experience", value: "8+", sortOrder: 1, isVisible: true },
        { label: "Projects Completed", value: "", sortOrder: 2, isVisible: false },
        { label: "Brands Collaborated With", value: "", sortOrder: 3, isVisible: false },
        { label: "Shopify Stores Developed", value: "", sortOrder: 4, isVisible: false },
      ],
    });
  }

  if ((await db.skill.count()) === 0) {
    const skills = ["Shopify","WordPress","E-commerce Management","Shopify Theme Customization","UI/UX Design","Figma","Adobe Photoshop","Adobe Illustrator","Canva","Digital Marketing","GA4","Google Tag Manager","Meta Pixel"];
    await db.skill.createMany({ data: skills.map((name, i) => ({ name, sortOrder: i })) });
  }

  if ((await db.service.count()) === 0) {
    const services: [string, string, string][] = [
      ["Shopify Store Development", "ShoppingBag", "Custom Shopify stores built around your brand, products and customers."],
      ["Shopify Theme Customization", "Palette", "Tailored theme sections and layouts that go beyond what templates offer."],
      ["E-commerce Website Development", "Code2", "Fast, reliable online stores and web platforms built for growth."],
      ["UI/UX Design", "PenTool", "Clear, conversion-minded interfaces designed in Figma before a line of code."],
      ["E-commerce Store Optimization", "TrendingUp", "Improve speed, usability and conversion on stores you already run."],
      ["E-commerce Business Development", "Rocket", "Practical strategies to launch, scale and operate an online business."],
      ["Website Speed & Performance Optimization", "Gauge", "Faster load times, better Core Web Vitals, smoother shopping."],
      ["E-commerce Consultation", "MessageSquare", "Honest, experience-backed guidance on your store and next steps."],
    ];
    await db.service.createMany({
      data: services.map(([title, icon, shortDesc], i) => ({ title, slug: slug(title), icon, shortDesc, sortOrder: i })),
    });
  }

  if ((await db.projectCategory.count()) === 0) {
    const cats = ["Shopify Development","E-commerce Development","UI/UX Design","Website Development","Brand & Creative Design"];
    await db.projectCategory.createMany({ data: cats.map((name, i) => ({ name, slug: slug(name), sortOrder: i })) });
  }

  if ((await db.socialLink.count()) === 0) {
    const platforms = ["linkedin","facebook","instagram","github","behance","dribbble","youtube"];
    await db.socialLink.createMany({
      data: platforms.map((platform, i) => ({ platform, url: "", isEnabled: false, sortOrder: i })),
    });
  }

  if ((await db.navigationItem.count()) === 0) {
    const nav: [string, string][] = [["Home","#home"],["About","#about"],["Services","#services"],["Projects","#projects"],["Brands","#brands"],["Testimonials","#testimonials"],["Contact","#contact"]];
    await db.navigationItem.createMany({ data: nav.map(([label, href], i) => ({ label, href, sortOrder: i })) });
  }

  if ((await db.sectionSetting.count()) === 0) {
    const sections: [string, string, string, string?][] = [
      ["hero", "Hero", ""],
      ["stats", "Statistics", ""],
      ["about", "About", "Turning Ideas Into Meaningful Digital Experiences."],
      ["services", "Services", "Solutions That Help Businesses Grow."],
      ["projects", "Projects", "Some Projects I've Worked On."],
      ["brands", "Brands", "Brands I've Worked With."],
      ["testimonials", "Testimonials", "What People Say About Working With Me."],
      ["contact", "Contact", "Have a Project in Mind? Let's Build Something Great."],
      ["social", "Social", ""],
    ];
    const labels: Record<string, string> = { about: "About Me", services: "What I Do", projects: "Selected Work", brands: "Trusted Collaborations", testimonials: "Client Feedback" };
    await db.sectionSetting.createMany({
      data: sections.map(([key, label, heading], i) => ({ key, label: labels[key] ?? label, heading: heading || null, sortOrder: i })),
    });
  }

  if ((await db.websiteSettings.count()) === 0) await db.websiteSettings.create({ data: {} });

  console.log("Seed complete. Admin:", email);
}

main().finally(() => db.$disconnect());
