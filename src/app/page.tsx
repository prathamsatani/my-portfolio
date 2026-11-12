"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ToolkitSection from "@/components/portfolio/ToolkitSection";
import ContactSection from "@/components/portfolio/ContactSection";
import { UserData, getUserData } from "@/lib/data";

export default function Home() {
  const [userData, setUserData] = useState<UserData>(getUserData());

  useEffect(() => {
    fetch("/api/portfolio/user")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
        return response.json() as Promise<UserData>;
      })
      .then(setUserData)
      .catch((error) => console.error("Error loading user data:", error));
  }, []);

  return (
    <>
      <HeroSection userData={userData} />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <ToolkitSection />
      <ContactSection userData={userData} />
    </>
  );
}
