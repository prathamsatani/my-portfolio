"use client";

import React, { useState, useEffect } from "react";
import { Calendar, GraduationCap, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/data";

export default function EducationSection() {
  const [educationItems, setEducationItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const response = await fetch("/api/portfolio/experiences");

      if (!response.ok) {
        throw new Error(`Failed to fetch education: ${response.status}`);
      }

      const data = (await response.json()) as Experience[];
      const education = data.filter(exp => exp.type === 'education');
      setEducationItems(education);
    } catch (error) {
      console.error('Error loading education:', error);
      try {
        const fallbackModule = await import("@/lib/data");
        const data = fallbackModule.getExperiences();
        const education = data.filter(exp => exp.type === 'education');
        setEducationItems(education);
      } catch (fallbackError) {
        console.error("Error loading fallback education data:", fallbackError);
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
    <section id="education" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Education
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            My academic journey in artificial intelligence and computer science.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-8">
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : educationItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              No education entries found.
            </p>
          </div>
        ) : (
          <div className="space-y-12 relative border-l border-slate-200 ml-3 md:ml-0 md:border-l-0">
            {educationItems.map((education, index) => (
              <motion.div 
                key={education.id} 
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
                      {formatDate(education.start_date)} — {formatDate(education.end_date)}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {education.title}
                    </h3>
                    <div className="text-base font-medium text-slate-700 mb-4">
                      {education.organization}
                    </div>
                    
                    {education.description && (
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {education.description}
                      </p>
                    )}
                    
                    {education.current && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        <BookOpen className="w-3 h-3" />
                        Currently Enrolled
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
