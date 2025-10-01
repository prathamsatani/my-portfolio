"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Github, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getProjects, getProjectsByCategory, type Project } from "@/lib/data";
import ScrollReveal from "@/components/effects/ScrollReveal";

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
      const data = getProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="relative py-24 bg-gray-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-200 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-12 h-12 text-teal-500 mx-auto" />
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A showcase of my work in AI, machine learning, and software development
            </p>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mt-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
        </ScrollReveal>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-200 ${
                activeFilter === filter.id 
                  ? "bg-slate-900 hover:bg-slate-800 text-white" 
                  : "border-2 border-slate-300 hover:border-slate-400 text-slate-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              {filter.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Github className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">No Projects Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Projects will be showcased here. Stay tuned for exciting AI and ML implementations!
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
              {filteredProjects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.1}>
                  <motion.div
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="relative group h-full"
                  >
                    <motion.div 
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col"
                      whileHover={{ y: -10 }}
                    >
                      {/* Shimmer Effect Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="shimmer absolute inset-0" />
                      </div>

                      {/* Project Image */}
                      <div className="aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 overflow-hidden relative">
                        {project.image_url ? (
                          <motion.img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                              <Github className="w-12 h-12 text-gray-400" />
                            </motion.div>
                          </div>
                        )}
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Project Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <motion.h3 
                          className="text-xl font-bold text-slate-900 mb-3 group-hover:gradient-text transition-all"
                          whileHover={{ x: 5 }}
                        >
                          {project.title}
                        </motion.h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {project.description}
                        </p>

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.slice(0, 4).map((tech, techIndex) => (
                              <motion.span 
                                key={techIndex}
                                className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-sm rounded-full font-medium border border-slate-200"
                                whileHover={{ scale: 1.1, y: -2 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-sm rounded-full">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Project Links */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          {project.github_url && (
                            <motion.a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:from-slate-800 hover:to-slate-600 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Github className="w-4 h-4" />
                              Code
                            </motion.a>
                          )}
                          {project.demo_url && (
                            <motion.a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-all text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              Demo
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
