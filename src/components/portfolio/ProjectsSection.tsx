"use client";

import React, { useState, useEffect } from "react";
import { Github, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const categoryFilters = [
  { id: 'all', name: 'All Projects' },
  { id: 'machine_learning', name: 'Machine Learning' },
  { id: 'deep_learning', name: 'Deep Learning' },
  { id: 'data_science', name: 'Data Science' },
  { id: 'web_development', name: 'Web Development' },
  { id: 'other', name: 'Other' }
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [projects, activeFilter]);

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/portfolio/projects");

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = (await response.json()) as Project[];
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      try {
        const fallbackModule = await import("@/lib/data");
        const fallback = fallbackModule.getProjects();
        setProjects(fallback);
        setFilteredProjects(fallback);
      } catch (fallbackError) {
        console.error("Error loading fallback projects:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Featured Projects
          </h2>
          <div className="h-1 w-20 bg-teal-500 rounded-full" />
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 animate-pulse h-96"></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Github className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h3>
            <p className="text-slate-500">
              Projects will be showcased here soon.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="group flex flex-col bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Project Image */}
                  <div className="aspect-video bg-slate-200 overflow-hidden relative">
                    {project.image_url ? (
                      <motion.img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Github className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-white text-slate-600 text-xs rounded-md border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-slate-400 text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex gap-4 pt-4 border-t border-slate-200 mt-auto">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
