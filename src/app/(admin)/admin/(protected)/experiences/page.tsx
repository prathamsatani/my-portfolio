"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, 
  Save,
  Briefcase
} from "lucide-react";
import type { Experience } from "@/lib/data";
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

const emptyExperienceForm: ExperienceFormState = {
  title: "",
  organization: "",
  start_date: "",
  end_date: "",
  description: "",
  type: "work",
  current: false,
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experienceForm, setExperienceForm] = useState<ExperienceFormState>(emptyExperienceForm);
  const [experienceMessage, setExperienceMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const experiencesData = await fetchJson<Experience[]>("/api/portfolio/experiences");
      setExperiences(experiencesData);
    } catch (error) {
      console.error("Failed to load experiences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetExperienceForm = () => {
    setExperienceForm(emptyExperienceForm);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-slate-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
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

        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg mb-6">
          <form onSubmit={handleExperienceSubmit} className="space-y-6">
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
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Existing experiences</h3>
          <div className="space-y-3">
            {experiences.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No experience entries yet.</p>
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
        </div>
      </div>
    </div>
  );
}
