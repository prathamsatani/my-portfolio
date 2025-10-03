"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, 
  Save,
  FolderOpen
} from "lucide-react";
import type { Project } from "@/lib/data";
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
} from "@/components/admin/AdminUIComponents";

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

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(emptyProjectForm);
  const [projectMessage, setProjectMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const projectsData = await fetchJson<Project[]>("/api/portfolio/projects");
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetProjectForm = () => {
    setProjectForm(emptyProjectForm);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-slate-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
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

        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg mb-6">
          <form onSubmit={handleProjectSubmit} className="space-y-6">
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
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Existing projects</h3>
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No projects yet.</p>
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
        </div>
      </div>
    </div>
  );
}
