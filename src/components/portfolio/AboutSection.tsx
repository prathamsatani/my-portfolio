"use client";

import React from "react";
import { GraduationCap, Target, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const displayName = userData?.full_name ?? "AI graduate student";
  const displayTitle = userData?.title ?? "Master of Science in Artificial Intelligence";
  const displayLocation = userData?.location ?? "Northeastern University";
  const displayBio = userData?.bio ?? "I'm a passionate AI graduate student pursuing my Master of Science in Artificial Intelligence. My journey in tech combines research experience with practical software development skills.";
  
  return (
    <section id="about" className="relative py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            About Me
          </h2>
          <div className="h-1 w-20 bg-teal-500 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start" ref={ref}>
          {/* Left Content */}
          <div className="space-y-10">
            <div className="prose prose-lg text-slate-600">
              <p className="text-xl leading-relaxed font-light">
                Hi, I&apos;m <strong className="font-semibold text-slate-900">{displayName}</strong>, an AI professional at <strong className="font-semibold text-slate-900">{displayLocation}</strong>.
                I&apos;m currently pursuing <strong className="font-semibold text-slate-900">{displayTitle}</strong>.
              </p>
              <p className="leading-relaxed">
                {displayBio}
              </p>
            </div>

            {/* Key Points */}
            <div className="grid gap-6">
              {[
                { icon: GraduationCap, title: "Education Focus", desc: "Master of Science in AI at Northeastern University", color: "text-teal-600" },
                { icon: Target, title: "Career Goal", desc: "Aspiring ML Engineer building scalable AI solutions", color: "text-blue-600" },
                { icon: Brain, title: "Specialization", desc: "Deep Learning, Computer Vision, NLP", color: "text-purple-600" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`p-3 rounded-xl bg-slate-50 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-teal-500" />
              <h3 className="text-2xl font-bold text-slate-900">
                Technical Skills
              </h3>
            </div>

            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    <span className="text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-slate-900 rounded-full"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}