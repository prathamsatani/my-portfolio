"use client";

import React, { useState } from "react";
import { GraduationCap, Target, Code, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ScrollReveal from "@/components/effects/ScrollReveal";

interface UserData {
  full_name?: string;
  email?: string;
  bio?: string;
  title?: string;
  location?: string;
  profile_image_url?: string;
}

interface AboutSectionProps {
  userData: UserData | null;
}

const skills = [
  { name: "Python", level: 90 },
  { name: "TensorFlow/PyTorch", level: 85 },
  { name: "Machine Learning", level: 88 },
  { name: "Deep Learning", level: 80 },
  { name: "Data Analysis", level: 85 },
  { name: "SQL", level: 75 },
  { name: "Cloud Computing", level: 70 },
  { name: "Git/GitHub", level: 85 }
];

export default function AboutSection({ userData }: AboutSectionProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  return (
    <section id="about" className="relative py-24 bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              About Me
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="prose prose-lg text-gray-600">
              <p className="text-xl leading-relaxed">
                I&apos;m a passionate AI graduate student at <strong>Northeastern University</strong>, 
                pursuing my Master of Science in Artificial Intelligence. My journey in tech 
                combines research experience with practical software development skills.
              </p>
              <p className="leading-relaxed">
                I specialize in <strong>machine learning engineering</strong>, with hands-on 
                experience in deep learning, computer vision, and natural language processing. 
                My goal is to build scalable AI systems that solve real-world problems.
              </p>
            </div>

            {/* Key Points */}
            <div className="grid gap-6">
              <ScrollReveal delay={0.1}>
                <motion.div 
                  className="flex items-start gap-4 group p-4 rounded-xl hover:bg-teal-50/50 transition-all duration-300 cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GraduationCap className="w-6 h-6 text-teal-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">Education Focus</h3>
                    <p className="text-gray-600">Master of Science in AI at Northeastern University</p>
                  </div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <motion.div 
                  className="flex items-start gap-4 group p-4 rounded-xl hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Target className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Career Goal</h3>
                    <p className="text-gray-600">Aspiring ML Engineer building scalable AI solutions</p>
                  </div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <motion.div 
                  className="flex items-start gap-4 group p-4 rounded-xl hover:bg-purple-50/50 transition-all duration-300 cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Brain className="w-6 h-6 text-purple-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Specialization</h3>
                    <p className="text-gray-600">Deep Learning, Computer Vision, NLP</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-8" ref={ref}>
            <ScrollReveal delay={0.4}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="p-2 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Technical Skills
                </h3>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {skills.map((skill, index) => (
                <ScrollReveal key={skill.name} delay={0.5 + index * 0.1}>
                  <motion.div 
                    className="space-y-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">{skill.name}</span>
                      <motion.span 
                        className="text-sm font-semibold text-gray-500 group-hover:text-teal-600 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {skill.level}%
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-3 rounded-full relative overflow-hidden"
                        style={{
                          background: `linear-gradient(90deg, #14b8a6 0%, #3b82f6 ${skill.level}%, #8b5cf6 100%)`
                        }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{ 
                          duration: 1,
                          delay: 0.5 + index * 0.1,
                          ease: "easeOut"
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 shimmer"
                          animate={{ x: [-1000, 1000] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}