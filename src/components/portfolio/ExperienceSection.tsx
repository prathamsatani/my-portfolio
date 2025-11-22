"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/data";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await fetch("/api/portfolio/experiences");

      if (!response.ok) {
        throw new Error(`Failed to fetch experiences: ${response.status}`);
      }

      const data = (await response.json()) as Experience[];
      const workExperiences = data.filter(exp => exp.type === 'work' || exp.type === 'research');
      setExperiences(workExperiences);
    } catch (error) {
      console.error('Error loading experiences:', error);
      try {
        const fallbackModule = await import("@/lib/data");
        const data = fallbackModule.getExperiences();
        const workExperiences = data.filter(exp => exp.type === 'work' || exp.type === 'research');
        setExperiences(workExperiences);
      } catch (fallbackError) {
        console.error("Error loading fallback experiences:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <section id="experience" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Experience
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            My professional journey in AI research and software development.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-8">
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              No experience entries found.
            </p>
          </div>
        ) : (
          <div className="space-y-12 relative border-l border-slate-200 ml-3 md:ml-0 md:border-l-0">
            {experiences.map((experience, index) => {
              return (
                <motion.div 
                  key={experience.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 md:pl-0"
                >
                  {/* Mobile Timeline Dot */}
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white md:hidden"></div>

                  <div className="md:grid md:grid-cols-[200px_1fr] md:gap-8">
                    <div className="mb-2 md:mb-0">
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(experience.start_date)} — {formatDate(experience.end_date)}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {experience.title}
                        </h3>
                        {experience.type === 'research' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            Research
                          </span>
                        )}
                      </div>
                      
                      <div className="text-base font-medium text-slate-700 mb-4">
                        {experience.organization}
                      </div>
                      
                      {experience.description && (
                        <p className="text-slate-600 leading-relaxed">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
