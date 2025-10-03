"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp,
  FileText,
  FolderOpen,
  Briefcase,
  Heart
} from "lucide-react";
import type { BlogPost, Experience, Project } from "@/lib/data";
import { StatCard } from "@/components/admin/AdminUIComponents";

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export default function OverviewPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [blogsData, projectsData, experiencesData] = await Promise.all([
          fetchJson<BlogPost[]>("/api/blogs"),
          fetchJson<Project[]>("/api/portfolio/projects"),
          fetchJson<Experience[]>("/api/portfolio/experiences"),
        ]);

        setBlogs(blogsData);
        setProjects(projectsData);
        setExperiences(experiencesData);
      } catch (error) {
        console.error("Failed to load overview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const totalLikes = useMemo(
    () => blogs.reduce((sum, blog) => sum + (blog.likes ?? 0), 0),
    [blogs]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-slate-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-teal-500" />
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          </div>
          <p className="text-slate-600">
            Track content health and manage your portfolio in one secure place.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Quick Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid gap-6 md:grid-cols-2"
        >
          <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Recent Blog Activity
            </h3>
            <div className="space-y-3">
              {blogs.slice(0, 3).map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{blog.title}</p>
                    <p className="text-xs text-slate-500">{blog.status === "published" ? "Published" : "Draft"}</p>
                  </div>
                  {blog.likes > 0 && (
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{blog.likes}</span>
                    </div>
                  )}
                </div>
              ))}
              {blogs.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No blog posts yet</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              Featured Projects
            </h3>
            <div className="space-y-3">
              {projects.filter(p => p.featured).slice(0, 3).map((project) => (
                <div key={project.id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <p className="text-sm font-medium text-slate-900 truncate">{project.title}</p>
                  <p className="text-xs text-slate-500 truncate">{project.technologies?.slice(0, 3).join(", ")}</p>
                </div>
              ))}
              {projects.filter(p => p.featured).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No featured projects yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
