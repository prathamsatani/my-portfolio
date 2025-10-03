"use client";

import React, { useState, useEffect } from "react";
import { Calendar, GraduationCap, Briefcase, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/data";

const typeIcons = {
  education: GraduationCap,
  work: Briefcase,
  research: FlaskConical
};

const typeColors = {
  education: "bg-blue-50 text-blue-600 border-blue-200",
  work: "bg-green-50 text-green-600 border-green-200", 
  research: "bg-purple-50 text-purple-600 border-purple-200"
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring' as const, stiffness: 100 }
  }
};

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
    <section id="experience" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Work Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My professional journey in AI research and software development
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mt-6"></div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Work Experience Timeline</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Professional work experience and research positions will be displayed here.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-blue-500"></div>
              
              {experiences.map((experience) => {
                const IconComponent = typeIcons[experience.type] || Briefcase;
                return (
                  <motion.div 
                    key={experience.id} 
                    className="relative flex items-start gap-8 pb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={itemVariants}
                  >
                    <div className={`p-3 rounded-xl border-2 ${typeColors[experience.type] ?? "bg-slate-100 border-slate-200 text-slate-700"} z-10`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {experience.title}
                            </h3>
                            <p className="text-lg text-teal-600 font-semibold">
                              {experience.organization}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                            </span>
                          </div>
                        </div>
                        {experience.description && (
                          <p className="text-gray-600 leading-relaxed">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
