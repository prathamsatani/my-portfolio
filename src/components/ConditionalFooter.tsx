"use client";

import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on admin pages
  const isAdminPage = pathname?.startsWith("/admin");
  
  if (isAdminPage) {
    return null;
  }
  
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-sm text-slate-500">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
