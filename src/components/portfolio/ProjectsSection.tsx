"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Project, getProjects } from "@/lib/data";
import SectionHeader from "./SectionHeader";

const categoryLabels: Record<Project["category"], string> = {
  machine_learning: "Machine learning",
  deep_learning: "Deep learning",
  data_science: "Data science",
  web_development: "Web",
  other: "GenAI · Agents",
};

// Featured first; Array.prototype.sort is stable so API order is kept otherwise.
const byFeatured = (projects: Project[]) => [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(() => byFeatured(getProjects()));

  useEffect(() => {
    fetch("/api/portfolio/projects")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
        return response.json() as Promise<Project[]>;
      })
      .then((data) => setProjects(byFeatured(data)))
      .catch((error) => console.error("Error loading projects:", error));
  }, []);

  return (
    <section id="work" className="shell section-y">
      <SectionHeader index="01" title="Selected work" />

      <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.id}>
            <article className="group relative">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-hairline">
                {project.image_url && (
                  <Image
                    src={project.image_url}
                    alt={`${project.title} preview`}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 600px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="label mt-6 flex gap-4">
                <span className="text-muted">P/{String(index + 1).padStart(2, "0")}</span>
                <span className="text-accent">{categoryLabels[project.category] ?? project.category}</span>
              </p>
              <h3 className="mt-3 font-serif text-display-m">
                {project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 group-hover:underline"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-3 text-body-m text-muted">{project.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label relative z-10 mt-5 inline-block text-accent hover:underline"
                >
                  Live demo ↗
                </a>
              )}
            </article>
          </li>
        ))}
      </ul>

      <a
        href="https://github.com/prathamsatani?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        className="label mt-16 inline-block underline underline-offset-4 hover:text-accent"
      >
        All projects on GitHub ↗
      </a>
    </section>
  );
}
