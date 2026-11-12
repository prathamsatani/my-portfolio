# Pratham Satani — ML Engineer Portfolio

Personal portfolio and blog for Pratham Satani, built with Next.js 15, React 19 and Tailwind CSS 4, backed by Supabase. Live at [pratham-satani.vercel.app](https://pratham-satani.vercel.app).

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

### 🎨 Design
- **Minimal editorial style** - Instrument Serif display type, Inter body text and JetBrains Mono labels, loaded with `next/font`
- **Light and dark themes** - Colour tokens in `src/app/globals.css` follow the OS `prefers-color-scheme` setting (there is no manual theme toggle)
- **No heavy effects** - No 3D particles, cursor trails or tilt cards on public pages; one subtle CSS fade-in that respects `prefers-reduced-motion`
- **Accessible** - Semantic headings, labelled form fields, visible `:focus-visible` outlines, WCAG AA text contrast in both themes

### 📄 Sections
- **Hero** - Headline, bio, résumé download, portrait and social links
- **About** - Short statement and headline numbers
- **Selected work** - Projects from Supabase (featured first) in a two-column grid
- **Experience & Education** - Two columns, newest first
- **Toolkit** - Grouped skills
- **Contact** - Validated form that emails via SMTP
- **Blog** - Posts with likes and comments; the nav link only appears once a post is published

### 🛠️ Technical Features
- **Next.js 15 App Router** with TypeScript
- **JSON fallbacks** - Public API routes fall back to `src/data/*.json` when Supabase is not configured
- **Contact form** - Server-side validation, rate limiting, honeypot and Nodemailer SMTP delivery
- **Supabase-backed Blog** - Like counts and comments persisted via Supabase Postgres
- **Secure Admin Portal** - Role-gated dashboard to manage blogs, projects, experiences, and profile data
- **Error Tracking** - Sentry integration for monitoring
- **SEO** - Metadata, Open Graph and Twitter cards in `layout.tsx`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
## 🗄️ Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) and copy the Project URL and keys from _Project Settings → API_.

2. **Link the project with the Supabase CLI.** The npm scripts rely on `npx` so you don't need a global install, but you must be signed in first:
  ```bash
  npx --yes supabase@latest login
  npx --yes supabase@latest link --project-ref your-project-ref
  ```

3. **Run the migrations** that live in `supabase/migrations/`:
  ```bash
  npm run supabase:migrate
  ```
  (equivalent to `supabase db push`). The initial migration (`0001_create_portfolio_schema.sql`) provisions tables, triggers, and Row Level Security policies that mirror the production schema.

4. **Seed starter content** so the UI renders with rich data:
  ```bash
  npm run supabase:seed
  ```
  (equivalent to `supabase db execute --file supabase/seed.sql`). The seed file matches the JSON fallbacks in `src/data/`, so local and remote environments stay consistent.
  > **Note:** the seed now *replaces* content rather than merging it. Each run deletes every row in `portfolio_profile`, `portfolio_experiences` and `portfolio_projects`, deletes the old sample blog posts (and, by cascade, their comments), then inserts the real content. It never touches auth users, `admin_audit_logs` or storage objects, and leaves blog posts written in the admin portal alone. Edits made to projects, experiences or the profile in the admin portal are overwritten on re-seed. Run `npm run supabase:refresh` to execute both steps sequentially.

5. **Configure environment variables** in `.env.local` and your Vercel project settings:
```
│   │   ├── projects.json      # Projects data
│   │   └── user.json          # User profile data
│   └── lib/
│       ├── data.ts            # Static data helpers & types
│       ├── supabaseClient.ts  # Browser Supabase client
│       └── supabaseServer.ts  # Server-side Supabase client
```

6. **Create an admin user** for the dashboard. In Supabase Studio go to _Authentication → Users_, add a new user (or invite yourself), then run the SQL below to assign the `admin` role:
```
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
```
   After updating metadata, the user can sign in at `/admin/login` and access the secure portal.

7. **Deploy** – API routes will fall back to the JSON files locally if Supabase variables are absent, but production deployments should provide the keys for persistence and admin management.

8. **Keep seeds in sync** – `npm run check:seed` (also runs automatically with `npm run lint`) validates that `supabase/seed.sql` still reflects the JSON fallbacks. Update / regenerate the seed file whenever you edit any entries in `src/data/`.
  > Tip: the Supabase CLI invoked via `npx` caches locally after the first run. If you prefer, you can still [install it globally](https://supabase.com/docs/reference/cli/installation) and the scripts will pick it up automatically.
```

## 🎨 Customization

### Update Personal Information

Edit the data files in `src/data/`:

**`user.json`** - Your profile information
```json
{
  "full_name": "Your Name",
  "email": "your.email@example.com",
  "bio": "Your bio...",
  "title": "Your Title",
  "location": "Your Location",
  "profile_image_url": "/your-image.jpg",
  "resume_url": "/Your-Resume.pdf",
  "github_url": "https://github.com/yourusername",
  "linkedin_url": "https://linkedin.com/in/yourusername"
}
```

**`projects.json`** - Your projects
```json
[
  {
    "id": "1",
    "title": "Project Title",
    "description": "Project description...",
    "category": "machine_learning",
    "technologies": ["Python", "TensorFlow"],
    "github_url": "https://github.com/...",
    "demo_url": "https://demo.com",
    "image_url": "/project-image.jpg"
  }
]
```

**`experiences.json`** - Your work experience

**`blogs.json`** - Your blog posts

### Customize Colors & Type

Edit the tokens at the top of `src/app/globals.css`. Light values live on `:root` and dark values under `@media (prefers-color-scheme: dark)`; they are exposed to Tailwind as `bg-page`, `bg-surface`, `text-ink`, `text-muted`, `border-hairline` and `text-accent`. The type scale (`text-display-xl` … `text-body-s`) is defined in the same file.

## 🔧 Tech Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### UI & Utilities
- **[Lucide React](https://lucide.dev/)**, **[Framer Motion](https://www.framer.com/motion/)** and **[Three.js](https://threejs.org/)** - Used by the admin portal only
- **[React Quill](https://github.com/zenoamaro/react-quill)** - Rich text editor

### Communication
- **[Resend](https://resend.com/)** - Modern email API
- **[Nodemailer](https://nodemailer.com/)** - Email sending (alternative)

### Monitoring
- **[Sentry](https://sentry.io/)** - Error tracking and monitoring

## 📧 Contact Form Setup

### Option 1: Using Resend (Recommended)

1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=your_api_key
   ```

### Option 2: Using Gmail/SMTP

1. Enable 2FA on your Gmail account
2. Generate an App Password
3. Add to `.env.local`:
   ```env
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password
   ```

## 🗄️ Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) and copy the Project URL and keys from _Project Settings → API_.
2. **Create the tables** using the SQL editor:
   ```sql
   create table if not exists public.blogs (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     slug text unique not null,
     content text,
     excerpt text,
     cover_image_url text,
     tags text[] default '{}',
     status text check (status in ('draft','published')) default 'draft',
     featured boolean default false,
     created_date timestamptz default now(),
     likes integer default 0
   );

   create table if not exists public.blog_comments (
     id uuid primary key default gen_random_uuid(),
     blog_id uuid references public.blogs(id) on delete cascade,
     author text not null,
     message text not null,
     created_at timestamptz default now()
   );

   create table if not exists public.portfolio_profile (
     id uuid primary key default gen_random_uuid(),
     full_name text,
     email text,
     bio text,
     title text,
     location text,
     profile_image_url text,
     github_url text,
     linkedin_url text,
     resume_url text,
     updated_at timestamptz default now()
   );

   create table if not exists public.portfolio_projects (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text not null,
     technologies text[] default '{}',
     github_url text,
     demo_url text,
     image_url text,
     category text check (category in ('machine_learning','deep_learning','data_science','web_development','other')) default 'other',
     featured boolean default false,
     created_date timestamptz default now()
   );

   create table if not exists public.portfolio_experiences (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     organization text not null,
     start_date timestamptz,
     end_date timestamptz,
     description text,
     type text check (type in ('education','work','research')) not null,
     current boolean default false
   );

   create index if not exists blog_comments_blog_id_idx on public.blog_comments(blog_id);
   create index if not exists portfolio_projects_category_idx on public.portfolio_projects(category);
   create index if not exists portfolio_experiences_type_idx on public.portfolio_experiences(type);
   ```
3. **Enable Row Level Security (RLS)** for every table and add read-only public policies:
   ```sql
   alter table public.blogs enable row level security;
   alter table public.blog_comments enable row level security;
   alter table public.portfolio_profile enable row level security;
   alter table public.portfolio_projects enable row level security;
   alter table public.portfolio_experiences enable row level security;

   create policy "Public read blogs" on public.blogs
     for select using (true);

   create policy "Public read blog comments" on public.blog_comments
     for select using (true);

   create policy "Public read profile" on public.portfolio_profile
     for select using (true);

   create policy "Public read projects" on public.portfolio_projects
     for select using (true);

   create policy "Public read experiences" on public.portfolio_experiences
     for select using (true);
   ```
   Writes are executed exclusively through server-side routes using the Supabase service-role key.
4. **Seed your data** (optional) by importing the existing JSON files in `src/data/` into the matching tables. You can also sign in to the admin portal and create entries manually once authentication is configured.
5. **Configure environment variables** in `.env.local` and your Vercel project settings:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # keep this server-side only!
   ```
6. **Create an admin user** for the dashboard. In Supabase Studio go to _Authentication → Users_, add a new user (or invite yourself), then run the SQL below to assign the `admin` role:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role','admin')
   where email = 'admin@example.com';
   ```
   After updating metadata, the user can sign in at `/admin/login` and access the secure portal.
7. **Deploy** – API routes will fall back to the JSON files locally if Supabase variables are absent, but production deployments should provide the keys for persistence and admin management.

## 🔐 Admin Portal

- Access the secure dashboard at [`/admin`](http://localhost:3000/admin) after signing in through [`/admin/login`](http://localhost:3000/admin/login).
- Only users with `app_metadata.role = "admin"` can authenticate; all protected routes are additionally enforced by middleware and server-side checks.
- Manage content end-to-end:
  - **Blogs** – create, update, publish/unpublish, and delete posts (with tag management).
  - **Projects & Experiences** – maintain portfolio entries without touching JSON files.
  - **Profile** – update headline, bio, social links, and resume URL.
- All mutations go through server-only API routes that validate payloads with Zod and execute using the Supabase service-role key. No credentials ever reach the browser.
- Sign out safely from the header; sessions are stored in secure cookies via Supabase Auth helpers.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-friendly interactions
- Adaptive layouts
- Optimized images

## 🔍 SEO

- Meta tags configured in `layout.tsx`
- Semantic HTML structure
- Open Graph tags
- Sitemap ready
- Performance optimized

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

## 🐛 Troubleshooting

### React Peer Dependency Warnings

If you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

## 📈 Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total Bundle Size: ~500KB (gzipped)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Next.js team for the amazing framework

## 📞 Contact

**Pratham Satani**
- Portfolio: [pratham-satani.vercel.app](https://pratham-satani.vercel.app)
- LinkedIn: [linkedin.com/in/prathamsatani](https://linkedin.com/in/prathamsatani)
- GitHub: [github.com/prathamsatani](https://github.com/prathamsatani)
- Email: [pratham.satani@outlook.com](mailto:pratham.satani@outlook.com)

---

<div align="center">
  Made with ❤️ and ☕
  
  ⭐ Star this repo if you find it helpful!
</div>
