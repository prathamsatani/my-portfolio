"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Hide navigation on admin pages (except login)
  const isAdminPage = pathname?.startsWith("/admin") && pathname !== "/admin/login";
  
  if (isAdminPage) {
    return null;
  }
  
  return <Navigation />;
}
