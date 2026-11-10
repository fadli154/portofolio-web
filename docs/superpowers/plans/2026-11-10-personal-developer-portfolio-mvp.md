# Personal Developer Portfolio & CMS Implementation Plan (v2.0)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Implementation plan for building **Fadli Hifziansyah's Personal Developer Portfolio & Private Admin CMS** based on [`PRD_Personal_Developer_Portfolio_Fadli_Hifziansyah.md`](file:///c:/fadli/portofolio-web/PRD_Personal_Developer_Portfolio_Fadli_Hifziansyah.md) (v2.0) and the SDLC recipe [`Website-Modern.md`](file:///c:/fadli/portofolio-web/.agents/recipe-Website-Modern.md).

---

## 🎯 Project Overview & Non-Negotiable Constraints

- **Persona:** Creative Full-Stack & AI Systems Engineer.
- **Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Supabase (PostgreSQL, Auth, Storage), Vercel.
- **X-Factor Features:**
  - **Dual-Lens Switcher:** Recruiter View (Swiss Editorial Light, metrics-first) $\leftrightarrow$ Creative/Engineer View (Obsidian Dark, deep-craft).
  - **Interactive Isometric System Rig (`anatomy`):** SVG/Canvas apparatus simulating live request flow (*Client $\rightarrow$ Next.js $\rightarrow$ Supabase $\rightarrow$ AI*).
  - **Power User Command Palette (`Cmd+K`):** Keyboard-driven instant navigation.
  - **Subtle Mechanical Audio Feedback:** Web Audio API micro-clicks with mute control.
  - **Bilingual i18n:** English default with instant toggle to Bahasa Indonesia.
  - **Smart Inquiry Modal:** Project Type selector + Cal.com meeting booking + one-click copy.
- **Operating Cost Target:** **Rp0 initial operating cost** strictly within eligible free tiers.
- **Security Invariant:** 100% database tables protected with Supabase Row Level Security (RLS). 0 secret leaks (`SUPABASE_SERVICE_ROLE_KEY` never sent to client).

---

## 🗺️ File & Directory Structure

```text
portofolio-web/
├── .agents/                               # Customizations, skills, and modular rules
│   ├── rules/                             # 01-skill-first, 02-matrix, 03-workflow, 04-security
│   └── skills/                            # awwwards, jury, last30days, anatomy, humanizer, etc.
├── docs/
│   ├── recipes/Website-Modern.md
│   └── superpowers/plans/
│       └── 2026-11-10-personal-developer-portfolio-mvp.md
├── supabase/
│   └── migrations/
│       ├── 20261110000001_init_schema.sql # Bilingual tables: profiles, projects, skills, etc.
│       ├── 20261110000002_rls_policies.sql# RLS policies for public & admin
│       └── 20261110000003_storage_buckets.sql # Storage buckets & policies
├── src/
│   ├── app/
│   │   ├── (public)/                      # Public Portfolio Route Group
│   │   │   ├── layout.tsx                 # Header/Navbar, LensSwitcher, AudioToggle, Footer
│   │   │   ├── page.tsx                   # Hero, Rig, Skills, Featured Projects, Contact
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx               # Projects List, Category Filters, Search
│   │   │   │   └── [slug]/page.tsx        # Deep-Dive Case Study (Architecture, Trade-offs, Media)
│   │   │   ├── certificates/page.tsx      # Certificates & Verification Credential
│   │   │   ├── sitemap.ts                 # Dynamic XML Sitemap
│   │   │   └── robots.ts                  # Robots.txt
│   │   ├── admin/                         # Private Admin CMS Route Group
│   │   │   ├── login/page.tsx             # Supabase Auth Login
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx             # Admin Sidebar, Header, Auth Guard
│   │   │       ├── page.tsx               # Analytics Overview & Quick Actions
│   │   │       ├── projects/              # Projects CRUD, Slug Generator, Media Picker
│   │   │       ├── profile/               # Bio & Avatar Management (Bilingual)
│   │   │       ├── skills/                # Skills Management
│   │   │       ├── experience/            # Experience & Education CRUD
│   │   │       ├── certificates/          # Certificates CRUD & Upload
│   │   │       ├── messages/              # Contact Inbox & Read status
│   │   │       └── media/                 # Storage Media Manager
│   │   ├── api/
│   │   │   └── contact/route.ts           # Rate-limited Contact Submission Handler
│   │   ├── globals.css                    # Swiss Editorial & Obsidian tokens, HSL variables
│   │   └── layout.tsx                     # Root layout, Fonts, Metadata
│   ├── components/
│   │   ├── ui/                            # shadcn components (Button, Card, Dialog, Badge, etc.)
│   │   ├── public/
│   │   │   ├── Navbar.tsx                 # Navigation, LensToggle, LocaleToggle, AudioToggle
│   │   │   ├── DualLensSwitcher.tsx       # Perspective Switcher (Recruiter vs Creative)
│   │   │   ├── ArchitectureRig.tsx        # Isometric System Rig (anatomy SVG/WebGL)
│   │   │   ├── CommandPalette.tsx         # Cmd+K Search & Action Modal
│   │   │   ├── HeroSection.tsx            # Hero with dual-lens adaptivity
│   │   │   ├── ProjectCard.tsx            # Bento/Card with hover depth
│   │   │   ├── SmartInquiryModal.tsx      # Inquiry Type Selector & Cal.com link
│   │   │   └── VideoEmbed.tsx             # YouTube Unlisted responsive player
│   │   └── admin/                         # DataTable, MediaUploader, ConfirmModal
│   ├── lib/
│   │   ├── audio/
│   │   │   └── sound-effects.ts           # Web Audio API subtle click generator
│   │   ├── i18n/
│   │   │   ├── context.tsx                # Locale Context (EN / ID)
│   │   │   └── dictionaries.ts            # UI Copy strings (EN & ID)
│   │   ├── supabase/
│   │   │   ├── client.ts                  # Browser Client
│   │   │   ├── server.ts                  # Server Component Client
│   │   │   └── middleware.ts              # Session refresh & Admin Guard
│   │   ├── validations/                   # Zod schemas for forms & entities
│   │   └── utils.ts                       # Helpers & formatters
│   └── middleware.ts                      # Next.js Route Middleware for auth protection
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📋 Task Decomposition

### Phase 1: Project Scaffolding, Tooling & Design Tokens

- [ ] **Task 1.1: Initialize Next.js 15 Project with TypeScript & Tailwind CSS**
  - **Action:** Scaffold Next.js 15 project with App Router, TypeScript, Tailwind CSS, ESLint, and PostCSS.
  - **Files:** `package.json`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/globals.css`, `tailwind.config.ts`.
  - **Verification:** Run `npm run build` and ensure zero errors.

- [ ] **Task 1.2: Install shadcn/ui, Lucide Icons, and cmdk**
  - **Action:** Configure shadcn/ui base (`button`, `dialog`, `badge`, `tabs`, `dropdown-menu`, `toast`, `input`, `textarea`), `lucide-react`, and `cmdk`.
  - **Files:** `components.json`, `src/components/ui/*`.
  - **Verification:** Import and render test components with passing build.

- [ ] **Task 1.3: Adaptive Dual-Theme Tokens (Swiss Editorial Light ⇄ Obsidian Dark)**
  - **Action:** Setup HSL token system in `globals.css` with distinct CSS variables for Swiss Editorial Light (paper white `#FFFFFF`, charcoal slate `#0F172A`) and Obsidian Dark (deep onyx `#09090B`, subtle telemetry cyan/amber).
  - **Files:** `src/app/globals.css`, `tailwind.config.ts`.
  - **Verification:** Verify WCAG 2.1 AA contrast compliance ($\ge 4.5:1$) on both light and dark modes.

- [ ] **Task 1.4: Locale (i18n) & Perspective (Lens) Context State**
  - **Action:** Create lightweight React context providers for:
    - Locale: `en` (default) $\leftrightarrow$ `id`
    - Lens: `recruiter` $\leftrightarrow$ `craft`
  - **Files:** `src/lib/i18n/context.tsx`, `src/lib/i18n/dictionaries.ts`.
  - **Verification:** Unit test switching locale and lens state triggers instant re-render without page reload.

---

### Phase 2: Database Schema, SQL Migrations & Supabase SSR Client

- [ ] **Task 2.1: Supabase SSR Client & Middleware Session Guard**
  - **Action:** Configure `@supabase/ssr` with separate server and browser helper clients, cookie store handling, and middleware session protection.
  - **Files:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`.
  - **Verification:** Mock environment variables in `.env.example` and verify client compilation.

- [ ] **Task 2.2: Bilingual SQL Migrations for Core Tables**
  - **Action:** Create `supabase/migrations/20261110000001_init_schema.sql` defining:
    - `profiles` (bilingual bio/headline, avatar, resume, available_for_hire)
    - `technologies` (name, slug, icon_name, category)
    - `projects` (bilingual title/summary/problem/architecture/trade_offs, impact_metrics, cover_url, video_url, github_url, demo_url, status, sort_order)
    - `project_technologies` (join table)
    - `experiences` & `educations` (bilingual role/description)
    - `certificates` (title, issuer, date, credential_url, file_url)
    - `contact_messages` (name, email, inquiry_type, message, is_read)
    - `media_assets` & `admin_users`.
  - **Files:** `supabase/migrations/20261110000001_init_schema.sql`.
  - **Verification:** SQL validation with foreign keys, indexes on `status` and `sort_order`, and unique constraints.

- [ ] **Task 2.3: Supabase Row Level Security (RLS) SQL Migration**
  - **Action:** Create `supabase/migrations/20261110000002_rls_policies.sql`:
    - Enable RLS on 100% of tables.
    - Public `SELECT` allowed ONLY on `published` projects and visible records.
    - Public `INSERT` allowed on `contact_messages`; `SELECT`/`UPDATE`/`DELETE` restricted to `admin_users`.
    - Full CRUD on content tables restricted to `admin_users`.
  - **Files:** `supabase/migrations/20261110000002_rls_policies.sql`.
  - **Verification:** Verify anonymous user cannot read drafts or contact messages in SQL policy assertions.

- [ ] **Task 2.4: Storage Buckets & Policies**
  - **Action:** Create `supabase/migrations/20261110000003_storage_buckets.sql` setting up buckets:
    - `project-media` (public read, admin write)
    - `profile-assets` (public read, admin write)
    - `certificates` (public read, admin write)
    - `short-videos` (public read, admin write, max size 5MB)
  - **Files:** `supabase/migrations/20261110000003_storage_buckets.sql`.
  - **Verification:** Verify only authenticated admins can write/delete files.

---

### Phase 3: Public Portfolio & Deep-Craft Signature Features

- [ ] **Task 3.1: Navbar with Dual-Lens Switcher, Locale Toggle & Audio Feedback**
  - **Action:** Build responsive navbar with:
    - Perspective toggle: `[Recruiter]` $\leftrightarrow$ `[Craft]`
    - Locale toggle: `EN` $\leftrightarrow$ `ID`
    - Audio mute toggle (Web Audio API click effects)
    - Resume download CTA & `Cmd+K` pill
  - **Files:** `src/components/public/Navbar.tsx`, `src/components/public/DualLensSwitcher.tsx`, `src/lib/audio/sound-effects.ts`.
  - **Verification:** Toggle switches lens mode, changes theme, and triggers audio click when unmuted.

- [ ] **Task 3.2: Hero Section (Adaptive Dual-Lens Presentation)**
  - **Action:** Implement Hero section:
    - In **Recruiter View**: Displays clean executive statement, key impact highlights (e.g., "+40% performance", "0 CVEs"), one-click CV download, and Cal.com meeting booking.
    - In **Craft View**: Displays kinetic typography, interactive telemetry badges, and direct trigger to Architecture Rig. Text curated with `humanizer`.
  - **Files:** `src/components/public/HeroSection.tsx`.
  - **Verification:** Verify text is free of AI cliches and layout adapts smoothly on lens switch.

- [ ] **Task 3.3: Interactive Isometric System Rig (`anatomy`)**
  - **Action:** Build isometric SVG/Canvas apparatus modeling the live system (*Browser $\rightarrow$ Next.js 15 Serverless $\rightarrow$ Supabase Database & Auth $\rightarrow$ AI Agent Engine*).
  - **Files:** `src/components/public/ArchitectureRig.tsx`.
  - **Verification:** Click "Simulate Request" triggers visual animated signal pulse across nodes; responsive on mobile.

- [ ] **Task 3.4: Power-User Command Palette (`Cmd+K`)**
  - **Action:** Implement keyboard-navigable command palette via `cmdk` allowing instant jump to Projects, Certificates, Experience, Contact, Download CV, and Toggle Theme/Lens.
  - **Files:** `src/components/public/CommandPalette.tsx`.
  - **Verification:** Pressing `Cmd+K` / `Ctrl+K` opens modal; keyboard arrow navigation and action triggers work.

- [ ] **Task 3.5: Featured Projects & Projects Showcase**
  - **Action:** Projects grid with category filters (Full-Stack, AI Systems, Frontend Craft), thumbnail hover depth, technology tags, and quick GitHub/Demo links.
  - **Files:** `src/components/public/ProjectCard.tsx`, `src/components/public/ProjectsShowcase.tsx`, `src/app/(public)/projects/page.tsx`.
  - **Verification:** Filter works without page reload, smooth hover animations via Framer Motion.

- [ ] **Task 3.6: Deep-Dive Architectural Case Study Page (`/projects/[slug]`)**
  - **Action:** Comprehensive case study page presenting:
    - Problem Statement
    - System Architecture & Data Flow
    - Technical Trade-offs ("Why X over Y")
    - Impact & Benchmark Metrics
    - Responsive Media Gallery & YouTube Unlisted Video Player
    - Repository & Live Demo links.
  - **Files:** `src/app/(public)/projects/[slug]/page.tsx`, `src/components/public/VideoEmbed.tsx`.
  - **Verification:** Dynamic metadata generation for SEO, responsive video player, 404 handler for invalid slugs.

- [ ] **Task 3.7: Experience Timeline, Education & Certificates**
  - **Action:** Chronological career timeline, education cards, and verified certificate cards with external credential verification links.
  - **Files:** `src/components/public/ExperienceTimeline.tsx`, `src/components/public/CertificatesSection.tsx`, `src/app/(public)/certificates/page.tsx`.
  - **Verification:** Correct bilingual rendering and responsive card layout.

- [ ] **Task 3.8: Smart Inquiry & Contact Modal**
  - **Action:** Contact modal with Project Type selector (`Full-Time Role`, `Contract Build`, `Technical Advisory`), message field with Zod validation, honeypot anti-spam, one-click copy email button, and Cal.com meeting booking embed/link.
  - **Files:** `src/components/public/SmartInquiryModal.tsx`, `src/app/api/contact/route.ts`, `src/lib/validations/contact.ts`.
  - **Verification:** Test valid and invalid submission; verify data is saved to `contact_messages`.

---

### Phase 4: Private Admin CMS & Command Center

- [ ] **Task 4.1: Admin Authentication & Route Protection**
  - **Action:** Build `/admin/login` page with Supabase Auth (email + password), middleware protection blocking unauthorized traffic, and session logout.
  - **Files:** `src/app/admin/login/page.tsx`, `src/app/admin/(dashboard)/layout.tsx`, `src/middleware.ts`.
  - **Verification:** Verify anonymous user attempting to access `/admin` is redirected to `/admin/login`.

- [ ] **Task 4.2: Admin Dashboard Overview**
  - **Action:** Summary metrics (total published projects, drafts, certificate count, unread contact messages) and quick navigation cards.
  - **Files:** `src/app/admin/(dashboard)/page.tsx`, `src/components/admin/StatsCard.tsx`.
  - **Verification:** Accurate aggregation query against Supabase.

- [ ] **Task 4.3: Projects CMS (CRUD & Draft/Publish Workflow)**
  - **Action:** Table listing all projects with status pills, create/edit modal with bilingual fields, slug auto-generator, technology selector, and cover upload.
  - **Files:** `src/app/admin/(dashboard)/projects/page.tsx`, `src/components/admin/ProjectForm.tsx`.
  - **Verification:** Create draft project, verify it does NOT appear on public page; toggle to published, verify it appears.

- [ ] **Task 4.4: Content CMS (Profile, Skills, Timeline & Certificates)**
  - **Action:** Admin management interfaces for:
    - Profile & Bio (`/admin/profile`)
    - Skills & Categories (`/admin/skills`)
    - Experiences & Education (`/admin/experience`)
    - Certificates (`/admin/certificates`)
    - Social Links & Site Settings (`/admin/settings`)
  - **Files:** `src/app/admin/(dashboard)/*`.
  - **Verification:** Full CRUD operations with instant optimistic UI or toast notifications.

- [ ] **Task 4.5: Storage Media Manager**
  - **Action:** Media library view showing uploaded files, WebP client-side compression before upload, file size guard, preview modal, and delete button.
  - **Files:** `src/app/admin/(dashboard)/media/page.tsx`, `src/components/admin/MediaUploader.tsx`.
  - **Verification:** Reject files exceeding size limit; verify uploaded file is stored in correct Supabase bucket.

- [ ] **Task 4.6: Contact Messages Inbox**
  - **Action:** Inbox table showing sender name, email, inquiry type, submission timestamp, message body, and read/unread toggle.
  - **Files:** `src/app/admin/(dashboard)/messages/page.tsx`.
  - **Verification:** Admin can mark message as read or delete spam entries.

---

### Phase 5: Security Gate, Blind Design QA & CI/CD Pipeline

- [ ] **Task 5.1: Security Audit Gate (`cloudflare-security-audit` & `security-predeploy-gate`)**
  - **Action:** Run source-first secret audit (ensure no service-role keys in repo), verify CSP headers in `next.config.ts`, check input sanitization, and confirm RLS completeness.
  - **Files:** `next.config.ts`, security audit report in `docs/security-audit-report.md`.
  - **Verification:** 0 confirmed vulnerabilities, 0 secret leaks, 0 critical CVEs.

- [ ] **Task 5.2: Blind Design QA Audit (`jury`)**
  - **Action:** Execute screenshot review and rubric scoring based on Awwwards criteria (Design, Usability, Creativity, Content).
  - **Files:** `docs/jury-audit-scorecard.md`.
  - **Verification:** Target score $\ge 8.0/10$ achieved on Design and Usability.

- [ ] **Task 5.3: Core Web Vitals & Performance Tuning (`ci-cd-release-ready`)**
  - **Action:** Audit Lighthouse metrics: LCP $\le 2.5s$, INP $\le 200ms$, CLS $\le 0.1$, accessibility score $\ge 90$.
  - **Verification:** Production build report confirms bundle size optimizations.

- [ ] **Task 5.4: GitHub Actions CI Pipeline Setup**
  - **Action:** Create `.github/workflows/ci.yml` running lint, typecheck, build validation on every push and PR.
  - **Files:** `.github/workflows/ci.yml`.
  - **Verification:** Pipeline syntax passes and runs successfully.
