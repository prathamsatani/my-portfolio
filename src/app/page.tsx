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
      const response = await fetch("/api/portfolio/user");

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = (await response.json()) as UserData;
      setUserData(data);
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserData(getUserData());
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