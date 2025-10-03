"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, 
  Save, 
  FileText,
  FolderOpen,
  Briefcase,
  User as UserIcon,
  TrendingUp,
  Heart
} from "lucide-react";
import type { BlogPost, Experience, Project, UserData } from "@/lib/data";
import {
  SectionHeader,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  SecondaryButton,
  ListCard,
  Alert,
  StatCard,
} from "./AdminUIComponents";

interface BlogFormState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string;
  status: "draft" | "published";
  featured: boolean;
}

interface ProjectFormState {
  id?: string;
  title: string;
  description: string;
  technologies: string;
  github_url: string;
  demo_url: string;
  image_url: string;
  category: Project["category"];
  featured: boolean;
}

interface ExperienceFormState {
  id?: string;
  title: string;
  organization: string;
  start_date: string;
  end_date: string;
  description: string;
  type: Experience["type"];
  current: boolean;
}

const emptyBlogForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  tags: "",
  status: "draft",
  featured: false,
};

const emptyProjectForm: ProjectFormState = {
  title: "",
  description: "",
  technologies: "",
  github_url: "",
  demo_url: "",
  image_url: "",
  category: "other",
  featured: false,
};

const emptyExperienceForm: ExperienceFormState = {
  title: "",
  organization: "",
  start_date: "",
  end_date: "",
  description: "",
  type: "work",
  current: false,
};

const defaultProfileState: UserData = {
  full_name: "",
  email: "",
  bio: "",
  title: "",
  location: "",
  profile_image_url: "",
  github_url: "",
  linkedin_url: "",
  resume_url: "",
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [profile, setProfile] = useState<UserData>(defaultProfileState);

  const [blogForm, setBlogForm] = useState<BlogFormState>(emptyBlogForm);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(emptyProjectForm);
  const [experienceForm, setExperienceForm] = useState<ExperienceFormState>(emptyExperienceForm);
  const [profileForm, setProfileForm] = useState<UserData>(defaultProfileState);

  const [blogMessage, setBlogMessage] = useState<string | null>(null);
  const [projectMessage, setProjectMessage] = useState<string | null>(null);
  const [experienceMessage, setExperienceMessage] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [blogsData, projectsData, experiencesData, profileData] = await Promise.all([
        fetchJson<BlogPost[]>("/api/blogs"),
        fetchJson<Project[]>("/api/portfolio/projects"),
        fetchJson<Experience[]>("/api/portfolio/experiences"),
        fetchJson<UserData>("/api/portfolio/user"),
      ]);

      setBlogs(blogsData);
      setProjects(projectsData);
      setExperiences(experiencesData);
      setProfile(profileData);
      setProfileForm(profileData ?? defaultProfileState);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const totalLikes = useMemo(
    () => blogs.reduce((sum, blog) => sum + (blog.likes ?? 0), 0),
    [blogs]
  );

  const resetBlogForm = () => {
    setBlogForm(emptyBlogForm);
  };

  const resetProjectForm = () => {
    setProjectForm(emptyProjectForm);
  };

  const resetExperienceForm = () => {
    setExperienceForm(emptyExperienceForm);
  };

  const convertTagsToString = (tags?: string[]) => (tags ?? []).join(", ");

  const handleBlogSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBlogMessage(null);

    const payload = {
      title: blogForm.title,
      slug: blogForm.slug,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      cover_image_url: blogForm.cover_image_url,
      tags: blogForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: blogForm.status,
      featured: blogForm.featured,
    };

    try {
      const response = await fetch(
        blogForm.id ? `/api/admin/blogs/${blogForm.id}` : "/api/admin/blogs",
        {
          method: blogForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save blog");
      }

      setBlogMessage(blogForm.id ? "Blog updated" : "Blog created");
      resetBlogForm();
      await loadData();
    } catch (error) {
      console.error(error);
      setBlogMessage(error instanceof Error ? error.message : "Failed to save blog");
    }
  };

  const startBlogEdit = (blog: BlogPost) => {
    setBlogForm({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? "",
      content: blog.content ?? "",
      cover_image_url: blog.cover_image_url ?? "",
      tags: convertTagsToString(blog.tags),
      status: blog.status,
      featured: blog.featured,
    });
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;

    const response = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setBlogMessage(data.error ?? "Failed to delete blog");
      return;
    }

    setBlogMessage("Blog deleted");
    await loadData();
  };

  const handleProjectSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProjectMessage(null);

    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      technologies: projectForm.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      github_url: projectForm.github_url,
      demo_url: projectForm.demo_url,
      image_url: projectForm.image_url,
      category: projectForm.category,
      featured: projectForm.featured,
    };

    try {
      const response = await fetch(
        projectForm.id ? `/api/admin/projects/${projectForm.id}` : "/api/admin/projects",
        {
          method: projectForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save project");
      }

      setProjectMessage(projectForm.id ? "Project updated" : "Project created");
      resetProjectForm();
      await loadData();
    } catch (error) {
      console.error(error);
      setProjectMessage(error instanceof Error ? error.message : "Failed to save project");
    }
  };

  const startProjectEdit = (project: Project) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: (project.technologies ?? []).join(", "),
      github_url: project.github_url ?? "",
      demo_url: project.demo_url ?? "",
      image_url: project.image_url ?? "",
      category: project.category,
      featured: project.featured,
    });
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setProjectMessage(data.error ?? "Failed to delete project");
      return;
    }

    setProjectMessage("Project deleted");
    await loadData();
  };

  const handleExperienceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setExperienceMessage(null);

    const payload = {
      title: experienceForm.title,
      organization: experienceForm.organization,
      start_date: experienceForm.start_date,
      end_date: experienceForm.current ? null : experienceForm.end_date,
      description: experienceForm.description,
      type: experienceForm.type,
      current: experienceForm.current,
    };

    try {
      const response = await fetch(
        experienceForm.id
          ? `/api/admin/experiences/${experienceForm.id}`
          : "/api/admin/experiences",
        {
          method: experienceForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save experience");
      }

      setExperienceMessage(
        experienceForm.id ? "Experience updated" : "Experience created"
      );
      resetExperienceForm();
      await loadData();
    } catch (error) {
      console.error(error);
      setExperienceMessage(
        error instanceof Error ? error.message : "Failed to save experience"
      );
    }
  };

  const startExperienceEdit = (experience: Experience) => {
    setExperienceForm({
      id: experience.id,
      title: experience.title,
      organization: experience.organization,
      start_date: experience.start_date ?? "",
      end_date: experience.end_date ?? "",
      description: experience.description ?? "",
      type: experience.type,
      current: experience.current,
    });
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this experience?")) return;

    const response = await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setExperienceMessage(data.error ?? "Failed to delete experience");
      return;
    }

    setExperienceMessage("Experience deleted");
    await loadData();
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileMessage(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update profile");
      }

      setProfileMessage("Profile updated");
      await loadData();
    } catch (error) {
      console.error(error);
      setProfileMessage(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  return (
    <div className="space-y-16">
      <section id="dashboard" className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <TrendingUp className="h-8 w-8 text-teal-500" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
            <p className="text-sm text-slate-600">
              Track content health and manage your AI portfolio in one secure place.
            </p>
          </div>
        </motion.div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Published Blogs" 
            value={blogs.filter((blog) => blog.status === "published").length}
            total={blogs.length}
            icon={FileText}
            color="emerald"
            delay={0}
          />
          <StatCard 
            label="Projects" 
            value={projects.length}
            icon={FolderOpen}
            color="blue"
            delay={0.1}
          />
          <StatCard 
            label="Experiences" 
            value={experiences.length}
            icon={Briefcase}
            color="purple"
            delay={0.2}
          />
          <StatCard 
            label="Total Likes" 
            value={totalLikes}
            icon={Heart}
            color="red"
            delay={0.3}
          />
        </div>
      </section>

      <section id="blogs" className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
        <SectionHeader 
          title="Blogs" 
          description="Create, update, and curate your long-form content." 
          icon={FileText}
        />
        <AnimatePresence mode="wait">
          {blogMessage && (
            <Alert 
              message={blogMessage} 
              onClose={() => setBlogMessage("")} 
            />
          )}
        </AnimatePresence>
        <form onSubmit={handleBlogSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={blogForm.title}
              onChange={(value) => setBlogForm((prev) => ({ ...prev, title: value }))}
              required
            />
            <Input
              label="Slug"
              helperText="Lowercase with hyphens (e.g. supabase-integration-guide)"
              value={blogForm.slug}
              onChange={(value) => setBlogForm((prev) => ({ ...prev, slug: value }))}
              required
            />
          </div>
          <Input
            label="Excerpt"
            value={blogForm.excerpt}
            onChange={(value) => setBlogForm((prev) => ({ ...prev, excerpt: value }))}
            placeholder="Short summary displayed in the blog list"
          />
          <Textarea
            label="Content"
            value={blogForm.content}
            onChange={(value) => setBlogForm((prev) => ({ ...prev, content: value }))}
            rows={8}
          />
          <Input
            label="Cover Image URL"
            value={blogForm.cover_image_url}
            onChange={(value) => setBlogForm((prev) => ({ ...prev, cover_image_url: value }))}
            placeholder="https://example.com/cover.jpg"
          />
          <Input
            label="Tags"
            value={blogForm.tags}
            onChange={(value) => setBlogForm((prev) => ({ ...prev, tags: value }))}
            placeholder="Comma separated (e.g. nextjs, supabase)"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Status"
              value={blogForm.status}
              onChange={(value) =>
                setBlogForm((prev) => ({ ...prev, status: value as "draft" | "published" }))
              }
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
            <Checkbox
              label="Featured"
              checked={blogForm.featured}
              onChange={(checked) =>
                setBlogForm((prev) => ({ ...prev, featured: checked }))
              }
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" icon={<Save className="h-4 w-4" />}>
              {blogForm.id ? "Update Blog" : "Create Blog"}
            </Button>
            <SecondaryButton
              type="button"
              icon={<RefreshCcw className="h-4 w-4" />}
              onClick={resetBlogForm}
            >
              Reset
            </SecondaryButton>
          </div>
        </form>

        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Existing blogs</h3>
          <div className="space-y-3">
            {blogs.length === 0 ? (
              <p className="text-sm text-slate-500">No blog posts yet.</p>
            ) : (
              blogs.map((blog, index) => (
                <ListCard
                  key={blog.id}
                  title={blog.title}
                  subtitle={`${blog.status === "published" ? "Published" : "Draft"} · ${blog.slug}`}
                  badges={blog.featured ? ["Featured"] : []}
                  onEdit={() => startBlogEdit(blog)}
                  onDelete={() => deleteBlog(blog.id)}
                  delay={index * 0.05}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section id="projects" className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
        <SectionHeader 
          title="Projects" 
          description="Maintain your project portfolio records." 
          icon={FolderOpen}
        />
        <AnimatePresence mode="wait">
          {projectMessage && (
            <Alert 
              message={projectMessage} 
              onClose={() => setProjectMessage("")} 
            />
          )}
        </AnimatePresence>
        <form onSubmit={handleProjectSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={projectForm.title}
              onChange={(value) => setProjectForm((prev) => ({ ...prev, title: value }))}
              required
            />
            <Select
              label="Category"
              value={projectForm.category}
              onChange={(value) =>
                setProjectForm((prev) => ({ ...prev, category: value as Project["category"] }))
              }
              options={[
                { value: "machine_learning", label: "Machine Learning" },
                { value: "deep_learning", label: "Deep Learning" },
                { value: "data_science", label: "Data Science" },
                { value: "web_development", label: "Web Development" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
          <Textarea
            label="Description"
            value={projectForm.description}
            onChange={(value) => setProjectForm((prev) => ({ ...prev, description: value }))}
            rows={5}
            required
          />
          <Input
            label="Technologies"
            value={projectForm.technologies}
            onChange={(value) => setProjectForm((prev) => ({ ...prev, technologies: value }))}
            placeholder="Comma separated (e.g. Next.js, Supabase, Tailwind)"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="GitHub URL"
              value={projectForm.github_url}
              onChange={(value) => setProjectForm((prev) => ({ ...prev, github_url: value }))}
              placeholder="https://github.com/..."
            />
            <Input
              label="Demo URL"
              value={projectForm.demo_url}
              onChange={(value) => setProjectForm((prev) => ({ ...prev, demo_url: value }))}
              placeholder="https://project-demo.com"
            />
            <Input
              label="Image URL"
              value={projectForm.image_url}
              onChange={(value) => setProjectForm((prev) => ({ ...prev, image_url: value }))}
              placeholder="https://cdn.com/project.png"
            />
          </div>
          <Checkbox
            label="Featured"
            checked={projectForm.featured}
            onChange={(checked) =>
              setProjectForm((prev) => ({ ...prev, featured: checked }))
            }
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" icon={<Save className="h-4 w-4" />}>
              {projectForm.id ? "Update Project" : "Create Project"}
            </Button>
            <SecondaryButton
              type="button"
              icon={<RefreshCcw className="h-4 w-4" />}
              onClick={resetProjectForm}
            >
              Reset
            </SecondaryButton>
          </div>
        </form>

        <div className="mt-10 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Existing projects</h3>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">No projects yet.</p>
          ) : (
            projects.map((project, index) => (
              <ListCard
                key={project.id}
                title={project.title}
                subtitle={`${project.category.replace(/_/g, " ")} · ${project.technologies?.slice(0, 3).join(", ") ?? ""}`}
                badges={project.featured ? ["Featured"] : []}
                onEdit={() => startProjectEdit(project)}
                onDelete={() => deleteProject(project.id)}
                delay={index * 0.05}
              />
            ))
          )}
        </div>
      </section>

      <section id="experiences" className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
        <SectionHeader 
          title="Experiences" 
          description="Document work, research, and education milestones." 
          icon={Briefcase}
        />
        <AnimatePresence mode="wait">
          {experienceMessage && (
            <Alert 
              message={experienceMessage} 
              onClose={() => setExperienceMessage("")} 
            />
          )}
        </AnimatePresence>
        <form onSubmit={handleExperienceSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={experienceForm.title}
              onChange={(value) => setExperienceForm((prev) => ({ ...prev, title: value }))}
              required
            />
            <Input
              label="Organization"
              value={experienceForm.organization}
              onChange={(value) =>
                setExperienceForm((prev) => ({ ...prev, organization: value }))
              }
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Start date"
              type="date"
              value={experienceForm.start_date}
              onChange={(value) =>
                setExperienceForm((prev) => ({ ...prev, start_date: value }))
              }
              required
            />
            <Input
              label="End date"
              type="date"
              value={experienceForm.end_date}
              onChange={(value) =>
                setExperienceForm((prev) => ({ ...prev, end_date: value }))
              }
              disabled={experienceForm.current}
            />
            <Select
              label="Type"
              value={experienceForm.type}
              onChange={(value) =>
                setExperienceForm((prev) => ({ ...prev, type: value as Experience["type"] }))
              }
              options={[
                { value: "work", label: "Work" },
                { value: "research", label: "Research" },
                { value: "education", label: "Education" },
              ]}
            />
          </div>
          <Textarea
            label="Description"
            value={experienceForm.description}
            onChange={(value) =>
              setExperienceForm((prev) => ({ ...prev, description: value }))
            }
            rows={4}
          />
          <Checkbox
            label="Currently active"
            checked={experienceForm.current}
            onChange={(checked) =>
              setExperienceForm((prev) => ({ ...prev, current: checked, end_date: checked ? "" : prev.end_date }))
            }
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" icon={<Save className="h-4 w-4" />}>
              {experienceForm.id ? "Update Experience" : "Create Experience"}
            </Button>
            <SecondaryButton
              type="button"
              icon={<RefreshCcw className="h-4 w-4" />}
              onClick={resetExperienceForm}
            >
              Reset
            </SecondaryButton>
          </div>
        </form>

        <div className="mt-10 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Existing experiences</h3>
          {experiences.length === 0 ? (
            <p className="text-sm text-slate-500">No experience entries yet.</p>
          ) : (
            experiences.map((experience, index) => (
              <ListCard
                key={experience.id}
                title={`${experience.title} — ${experience.organization}`}
                subtitle={`${experience.type.toUpperCase()} · ${experience.start_date ?? ""}`}
                badges={experience.current ? ["Active"] : []}
                onEdit={() => startExperienceEdit(experience)}
                onDelete={() => deleteExperience(experience.id)}
                delay={index * 0.05}
              />
            ))
          )}
        </div>
      </section>

      <section id="profile" className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
        <SectionHeader 
          title="Profile" 
          description="Update your personal information and outbound links." 
          icon={UserIcon}
        />
        <AnimatePresence mode="wait">
          {profileMessage && (
            <Alert 
              message={profileMessage} 
              onClose={() => setProfileMessage("")} 
            />
          )}
        </AnimatePresence>
        <form onSubmit={handleProfileSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full name"
              value={profileForm.full_name ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, full_name: value }))}
            />
            <Input
              label="Professional title"
              value={profileForm.title ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, title: value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Email"
              value={profileForm.email ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, email: value }))}
            />
            <Input
              label="Location"
              value={profileForm.location ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, location: value }))}
            />
          </div>
          <Textarea
            label="Bio"
            rows={5}
            value={profileForm.bio ?? ""}
            onChange={(value) => setProfileForm((prev) => ({ ...prev, bio: value }))}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Profile image URL"
              value={profileForm.profile_image_url ?? ""}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, profile_image_url: value }))
              }
            />
            <Input
              label="Resume URL"
              value={profileForm.resume_url ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, resume_url: value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="GitHub URL"
              value={profileForm.github_url ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, github_url: value }))}
            />
            <Input
              label="LinkedIn URL"
              value={profileForm.linkedin_url ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, linkedin_url: value }))}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" icon={<Save className="h-4 w-4" />}>Save profile</Button>
            <SecondaryButton
              type="button"
              icon={<RefreshCcw className="h-4 w-4" />}
              onClick={() => setProfileForm(profile ?? defaultProfileState)}
            >
              Reset
            </SecondaryButton>
          </div>
        </form>
      </section>
    </div>
  );
}
