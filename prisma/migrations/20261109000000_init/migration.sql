-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Admin',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "aboutLabel" TEXT NOT NULL DEFAULT 'About Me',
    "aboutHeadline" TEXT NOT NULL DEFAULT 'Turning Ideas Into Meaningful Digital Experiences.',
    "aboutBody" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" UUID NOT NULL,
    "availability" TEXT NOT NULL DEFAULT 'Available for select projects',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "identity" TEXT NOT NULL,
    "portraitUrl" TEXT,
    "portraitAlt" TEXT,
    "primaryLabel" TEXT NOT NULL DEFAULT 'Let''s Work Together',
    "primaryHref" TEXT NOT NULL DEFAULT '#contact',
    "secondaryLabel" TEXT NOT NULL DEFAULT 'Explore My Work',
    "secondaryHref" TEXT NOT NULL DEFAULT '#projects',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "detailDesc" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'ShoppingBag',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "caseStudy" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "liveUrl" TEXT,
    "technologies" TEXT[],
    "categoryId" UUID,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT NOT NULL,
    "shortDesc" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" UUID NOT NULL,
    "clientName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "company" TEXT,
    "designation" TEXT,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "websiteUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "projectType" TEXT,
    "budget" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSettings" (
    "id" UUID NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Faruk Hasan',
    "tagline" TEXT NOT NULL DEFAULT 'E-commerce & Digital Experiences',
    "phone" TEXT,
    "whatsapp" TEXT,
    "whatsappMessage" TEXT NOT NULL DEFAULT 'Hi Faruk, I''d like to discuss a project.',
    "email" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "seoTitle" TEXT NOT NULL DEFAULT 'Faruk Hasan | Shopify Expert & E-commerce Developer',
    "seoDescription" TEXT NOT NULL DEFAULT 'Shopify expert and e-commerce developer helping brands build, optimize and grow high-performing online stores.',
    "seoKeywords" TEXT,
    "ogImageUrl" TEXT,
    "footerTagline" TEXT NOT NULL DEFAULT 'Building digital experiences that drive e-commerce growth.',
    "footerCopyright" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT '#A58B65',
    "contactHeadline" TEXT NOT NULL DEFAULT 'Have a Project in Mind? Let''s Build Something Great.',
    "contactText" TEXT NOT NULL DEFAULT 'Whether you''re launching a new Shopify store, improving an existing e-commerce business, or exploring a new digital project, I''d love to hear from you.',
    "analyticsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WebsiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionSetting" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "heading" TEXT,
    "subheading" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SectionSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX "Statistic_sortOrder_idx" ON "Statistic"("sortOrder");
CREATE INDEX "Skill_sortOrder_idx" ON "Skill"("sortOrder");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "Service_isPublished_sortOrder_idx" ON "Service"("isPublished", "sortOrder");
CREATE UNIQUE INDEX "ProjectCategory_slug_key" ON "ProjectCategory"("slug");
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_isPublished_sortOrder_idx" ON "Project"("isPublished", "sortOrder");
CREATE INDEX "Project_categoryId_idx" ON "Project"("categoryId");
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");
CREATE INDEX "Brand_isPublished_sortOrder_idx" ON "Brand"("isPublished", "sortOrder");
CREATE INDEX "Testimonial_isPublished_sortOrder_idx" ON "Testimonial"("isPublished", "sortOrder");
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");
CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");
CREATE UNIQUE INDEX "SocialLink_platform_key" ON "SocialLink"("platform");
CREATE INDEX "NavigationItem_sortOrder_idx" ON "NavigationItem"("sortOrder");
CREATE UNIQUE INDEX "SectionSetting_key_key" ON "SectionSetting"("key");
CREATE INDEX "SectionSetting_sortOrder_idx" ON "SectionSetting"("sortOrder");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProjectCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
