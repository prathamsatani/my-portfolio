"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowDown, Download, Mail, Github, Linkedin, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { UserData } from "@/lib/data";
import dynamic from 'next/dynamic';

const FloatingParticles = dynamic(() => import('@/components/effects/FloatingParticles'), { ssr: false });
const AnimatedBackground = dynamic(() => import('@/components/effects/AnimatedBackground'), { ssr: false });

interface HeroSectionProps {
  userData: UserData | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function HeroSection({ userData }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Effects */}
      <AnimatedBackground variant="mesh" />
      <FloatingParticles />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content */}
          <div className="space-y-8">
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.div 
                className="inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200 inline-flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Available for ML Engineer Roles
                </span>
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
                <motion.span 
                  className="gradient-text inline-block"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  AI & Machine Learning
                </motion.span>
                <br />
                <span className="text-slate-900">Graduate Student</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                {userData?.bio || "MS in AI student at Northeastern University, passionate about building intelligent systems that solve real-world problems through machine learning and deep learning."}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <motion.button 
                onClick={scrollToProjects}
                className="magnetic-button bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/30 hover:scale-105 inline-flex items-center gap-2 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">View My Work</span>
                <ArrowDown className="w-5 h-5 relative group-hover:animate-bounce" />
              </motion.button>
              {userData?.resume_url && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={userData.resume_url}
                    target="_blank"
                    className="magnetic-button bg-white hover:bg-gray-50 text-slate-900 px-8 py-6 text-lg rounded-xl transition-all duration-300 border-2 border-slate-200 hover:border-teal-400 hover:shadow-2xl hover:shadow-blue-500/20 inline-flex items-center gap-2 group"
                  >
                    <Download className="w-5 h-5 group-hover:animate-pulse" />
                    Resume
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div className="flex gap-6 pt-4" variants={itemVariants}>
              {userData?.email && (
                <motion.a 
                  href={`mailto:${userData.email}`}
                  className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 hover:from-teal-50 hover:to-teal-100 transition-all duration-300 text-slate-600 hover:text-teal-600 shadow-md hover:shadow-xl hover:-translate-y-1"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              )}
              {userData?.github_url && (
                <motion.a 
                  href={userData.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 hover:from-purple-50 hover:to-purple-100 transition-all duration-300 text-slate-600 hover:text-purple-600 shadow-md hover:shadow-xl hover:-translate-y-1"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {userData?.linkedin_url && (
                <motion.a 
                  href={userData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 text-slate-600 hover:text-blue-600 shadow-md hover:shadow-xl hover:-translate-y-1"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div className="lg:order-last order-first" variants={itemVariants}>
            <div className="relative">
              <motion.div 
                className="w-80 h-80 lg:w-96 lg:h-96 mx-auto relative"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Animated Gradient Rings */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl transform rotate-6 opacity-20 blur-xl"
                  animate={{ 
                    rotate: [6, 12, 6],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl transform -rotate-6 opacity-20 blur-xl"
                  animate={{ 
                    rotate: [-6, -12, -6],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Main Image with Border Gradient */}
                <motion.div 
                  className="relative z-10 w-full h-full rounded-3xl p-1 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  <img 
                    src={userData?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl shadow-lg z-20 flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

