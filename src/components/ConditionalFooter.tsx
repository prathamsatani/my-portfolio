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
    <footer className="bg-gradient-to-br from-slate-50 to-slate-100 border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-gradient-to-r from-teal-500 to-blue-500"></span>
            <p className="text-gray-600 font-medium">Crafted with passion for AI and Machine Learning</p>
            <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
