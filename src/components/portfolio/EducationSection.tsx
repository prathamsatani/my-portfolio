"use client";

import React, { useState, useEffect } from "react";
import { Calendar, GraduationCap, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { getExperiences, type Experience } from "@/lib/data";

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring' as const, stiffness: 100 }
  }
};

export default function EducationSection() {
  const [educationItems, setEducationItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const data = getExperiences();
      const education = data.filter(exp => exp.type === 'education');
      setEducationItems(education);
    } catch (error) {
      console.error('Error loading education:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <section id="education" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My academic journey in artificial intelligence and computer science
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mt-6"></div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
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
        ) : educationItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Education Timeline</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Academic achievements and educational background will be displayed here.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-teal-500"></div>
              
              {educationItems.map((education) => (
                <motion.div 
                  key={education.id} 
                  className="relative flex items-start gap-8 pb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={itemVariants}
                >
                  <div className="p-3 rounded-xl border-2 bg-white text-blue-600 border-blue-200 z-10">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {education.title}
                          </h3>
                          <p className="text-lg text-blue-600 font-semibold">
                            {education.organization}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(education.start_date)} - {formatDate(education.end_date)}
                          </span>
                        </div>
                      </div>
                      {education.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {education.description}
                        </p>
                      )}
                      {education.current && (
                        <div className="mt-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                            <BookOpen className="w-3 h-3" />
                            Currently Enrolled
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
