"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import EducationSection from "@/components/portfolio/EducationSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ContactSection from "@/components/portfolio/ContactSection";
import BackToTop from "@/components/effects/BackToTop";
import { UserData, getUserData } from "@/lib/data";

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setUserData(getUserData());
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection userData={userData} />
      <AboutSection userData={userData} />
      <ProjectsSection />
      <EducationSection />
      <ExperienceSection />
      <ContactSection />
      <BackToTop />
    </div>
  );
}