# 🚀 AI & Machine Learning Portfolio

A modern, feature-rich portfolio website built with Next.js 15, showcasing AI/ML projects with stunning 3D effects, smooth animations, and an immersive user experience.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Three.js](https://img.shields.io/badge/Three.js-3D-orange)

## ✨ Features

### 🎨 Visual Effects & Animations
### 🎨 Visual Effects & Animations
- **3D Particle System** - Interactive floating particles using Three.js
- **Scroll-Triggered Animations** - Smooth reveal animations using Intersection Observer
- **Projects Section** - Showcase of ML/AI projects with filtering and 3D effects
- **Education Section** - Academic background and achievements
- **Experience Section** - Professional experience timeline
- **Contact Section** - Get in touch form with validation
- **Blog** - Integrated blog system with dynamic content

### 🎯 User Experience
- **Dark/Light Mode Toggle** - Floating theme switcher with smooth transitions and persistence
- **Scroll Progress Indicator** - Visual feedback of reading progress
- **Back to Top Button** - Floating button with smooth scroll
- **Responsive Navigation** - Mobile-friendly menu with smooth transitions
- **Custom Scrollbar** - Gradient-themed scrollbar
- **Smooth Scroll** - Seamless navigation between sections
- **Loading States** - Skeleton loaders and spinners

### 🛠️ Technical Features
- **Server-Side Rendering** - Next.js 15 App Router
- **TypeScript** - Full type safety
- **Dynamic Imports** - Code splitting for optimal performance
- **Form Handling** - Contact form with email integration (Resend/Nodemailer)
- **Supabase-backed Blog** - Like counts and comments persisted via Supabase Postgres
- **Error Tracking** - Sentry integration for monitoring
- **SEO Optimized** - Meta tags and semantic HTML

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. **Set up environment variables**
   
  Create a `.env.local` file in the root directory:
  ```env
  # Email Configuration (choose one)
  RESEND_API_KEY=your_resend_api_key
  # OR
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_app_password

  # Supabase (Required in production)
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

  # Sentry (Optional)
  SENTRY_DSN=your_sentry_dsn
  ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
my-portfolio/
├── public/
│   ├── Pratham Satani.pdf    # Resume file
│   ├── pratham.jpg            # Profile image
│   └── vercel.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── blogs/
│   │   │   │   └── route.ts   # Supabase blog listing API
│   │   │   ├── blogs/[id]/like/
│   │   │   │   └── route.ts   # Supabase like endpoint
│   │   │   └── contact/
│   │   │       └── route.ts   # Contact form API
│   │   ├── blog/
│   │   │   └── page.tsx       # Blog page
│   │   ├── favicon.ico
│   │   ├── globals.css        # Global styles & animations
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── effects/
│   │   │   ├── AnimatedBackground.tsx  # Gradient backgrounds
│   │   │   ├── BackToTop.tsx           # Back to top button
│   │   │   ├── FloatingParticles.tsx   # 3D particles
│   │   │   ├── LoadingSpinner.tsx      # Loading animation
│   │   │   ├── ScrollReveal.tsx        # Scroll animations
│   │   │   └── TiltCard.tsx            # 3D tilt effect
│   │   ├── blog/
│   │   │   └── BlogForm.tsx            # Blog post form
│   │   ├── portfolio/
│   │   │   ├── AboutSection.tsx        # About section
│   │   │   ├── ContactSection.tsx      # Contact section
│   │   │   ├── EducationSection.tsx    # Education section
│   │   │   ├── ExperienceSection.tsx   # Experience section
│   │   │   ├── HeroSection.tsx         # Hero section
│   │   │   └── ProjectsSection.tsx     # Projects section
│   │   └── Navigation.tsx              # Main navigation
│   ├── data/
│   │   ├── blogs.json         # Blog posts data
│   │   ├── experiences.json   # Experience data
│   │   ├── projects.json      # Projects data
│   │   └── user.json          # User profile data
│   └── lib/
│       ├── data.ts            # Static data helpers & types
│       ├── supabaseClient.ts  # Browser Supabase client
│       └── supabaseServer.ts  # Server-side Supabase client
├── .env.local                 # Environment variables
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── ENHANCEMENTS.md            # Detailed feature documentation
└── README.md                  # This file
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

### Customize Colors & Animations

Edit `src/app/globals.css`:

```css
/* Change gradient colors */
.gradient-text {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

/* Adjust animation speed */
@keyframes gradient-shift {
  /* Modify duration in animation property */
}
```

### Modify 3D Particles

Edit `src/components/effects/FloatingParticles.tsx`:

```typescript
// Change particle count
const particleCount = 2000; // Adjust this number

// Change particle color
<PointMaterial
  color="#your-color" // Change this
  size={0.02}          // Adjust size
/>
```

## 🔧 Tech Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### Animation & 3D
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Three.js](https://threejs.org/)** - 3D graphics
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)** - React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Three.js helpers

### UI & Utilities
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Quill](https://github.com/zenoamaro/react-quill)** - Rich text editor
- **[React Intersection Observer](https://www.npmjs.com/package/react-intersection-observer)** - Scroll detection
- **[date-fns](https://date-fns.org/)** - Date formatting

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
     status text default 'draft',
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

   create index if not exists blog_comments_blog_id_idx on public.blog_comments(blog_id);
   ```
3. **Enable Row Level Security** for both tables and add policies:
   ```sql
   alter table public.blogs enable row level security;
   alter table public.blog_comments enable row level security;

   create policy "Public read blogs" on public.blogs
     for select using (true);

   create policy "Public read blog comments" on public.blog_comments
     for select using (true);
   ```
   Likes are incremented through the service role key, so no additional policy is required for updates.
4. **Seed your data** (optional) by importing the existing `src/data/blogs.json` content into the `blogs` table and adding matching rows in `blog_comments`.
5. **Configure environment variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) in both `.env.local` and your Vercel project settings. Keep the service role key server-side only—never expose it in client bundles.
6. **Deploy** – the API routes will fall back to the JSON files locally if Supabase variables are absent, but production deployments should provide them for persistence.

## 🎭 Animation System

The portfolio uses a sophisticated animation system:

### Scroll Animations
- Triggered by Intersection Observer
- Staggered delays for sequential reveals
- Configurable directions (up, down, left, right)

### Motion Physics
- Spring animations for natural movement
- Magnetic hover effects
- 3D transforms with parallax

### Performance
- GPU-accelerated transforms
- Dynamic imports for 3D components
- Optimized animation configurations
- Respects `prefers-reduced-motion`

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

### 3D Particles Not Showing

Ensure WebGL is enabled in your browser and that you're using a modern browser that supports Three.js.

### Animations Not Working

Check that JavaScript is enabled and that your browser supports ES6+ features.

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
- Three.js community for 3D examples
- Framer Motion for animation capabilities
- Next.js team for the amazing framework

## 📞 Contact

**Pratham Satani**
- Portfolio: [pratham-satani.vercel.app](https://pratham-satani.vercel.app)
- LinkedIn: [linkedin.com/in/prathamsatani](https://linkedin.com/in/prathamsatani)
- GitHub: [github.com/prathamsatani](https://github.com/prathamsatani)
- Email: [pratham.satani@outlook.com](mailto:pratham.satani@outlook.com)

---

## 📚 Additional Documentation

For detailed information about all the new features and enhancements, see [ENHANCEMENTS.md](./ENHANCEMENTS.md)

---

<div align="center">
  Made with ❤️ and ☕
  
  ⭐ Star this repo if you find it helpful!
</div>
