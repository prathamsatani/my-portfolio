"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, Download, Mail, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { UserData } from "@/lib/data";

interface HeroSectionProps {
  userData: UserData | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function HeroSection({ userData }: HeroSectionProps) {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-white opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10 w-full">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content */}
          <div className="space-y-10">
            <motion.div className="space-y-6" variants={itemVariants}>
              <motion.div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Available for ML Engineer Roles
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 text-balance">
                Building intelligent systems with
                <span className="text-teal-600"> AI & ML</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg text-balance">
                {userData?.bio || "MS in AI student at Northeastern University. I craft scalable machine learning solutions to solve complex real-world problems."}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <button 
                onClick={scrollToProjects}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-slate-900 rounded-full overflow-hidden transition-all hover:bg-slate-800"
              >
                <span className="mr-2">View My Work</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </button>
              
              {userData?.resume_url && (
                <Link
                  href={userData.resume_url}
                  target="_blank"
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-900 bg-transparent border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
                >
                  <Download className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-1" />
                  Resume
                </Link>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div className="flex gap-6 pt-4" variants={itemVariants}>
              {[
                { href: userData?.email ? `mailto:${userData.email}` : null, icon: Mail, label: "Email" },
                { href: userData?.github_url, icon: Github, label: "GitHub" },
                { href: userData?.linkedin_url, icon: Linkedin, label: "LinkedIn" }
              ].map((social, index) => (
                social.href && (
                  <a 
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                )
              ))}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div 
            className="lg:order-last order-first flex justify-center lg:justify-end" 
            variants={itemVariants}
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-slate-100 rounded-full transform translate-x-4 translate-y-4" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={userData?.profile_image_url || "/pratham.jpg"}
                  alt={userData?.full_name ? `${userData.full_name} portrait` : "Profile"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 24rem, 80vw"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

