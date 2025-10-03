"use client";

import { type ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Briefcase, 
  User, 
  Menu, 
  X,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import { useSupabaseBrowserClient } from "@/lib/supabaseClient";
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(() => import('@/components/effects/AnimatedBackground'), { ssr: false });
const FloatingParticles = dynamic(() => import('@/components/effects/FloatingParticles'), { ssr: false });

interface AdminShellProps {
  adminEmail?: string | null;
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useSupabaseBrowserClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 overflow-hidden">
      {/* Animated Background Effects */}
      <AnimatedBackground variant="mesh" />
      <FloatingParticles />
      
      {/* Additional Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-200 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl z-50"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200/60">
          <motion.div 
            className="flex items-center gap-3"
            animate={{ justifyContent: sidebarCollapsed ? "center" : "flex-start" }}
          >
            <motion.div
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 shadow-lg shadow-teal-500/30 p-[2px] flex-shrink-0"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                <ShieldCheck className="h-6 w-6 text-teal-500" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-teal-400/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                      Admin Portal
                    </p>
                    <Sparkles className="h-3 w-3 text-teal-500" />
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-[150px]">{adminEmail ?? "Authenticated"}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "text-teal-600 font-semibold bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60 space-y-2">
          <motion.button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-2 border-red-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={sidebarCollapsed ? "Sign out" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoggingOut ? "Logging out..." : "Sign out"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:hidden border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg z-40"
        >
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 shadow-lg shadow-teal-500/30 p-[2px]"
              >
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                  <ShieldCheck className="h-5 w-5 text-teal-500" />
                </div>
              </motion.div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                    Admin Portal
                  </p>
                  <Sparkles className="h-3 w-3 text-teal-500" />
                </div>
                <p className="text-xs text-slate-600">{adminEmail ?? "Authenticated"}</p>
              </div>
            </div>

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border-2 border-slate-200 bg-white p-2 text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-md"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-200/60 bg-white/95 backdrop-blur-xl overflow-hidden"
              >
                <nav className="px-4 py-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          onClick={() => setMobileMenuOpen(false)}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all shadow-sm ${
                            isActive
                              ? "bg-gradient-to-br from-teal-50 to-blue-50 text-teal-600 border border-teal-200 font-semibold shadow-md"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </motion.div>
                      </Link>
                    );
                  })}
                  <motion.button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-2 border-red-200 transition-all shadow-sm disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-5 w-5" />
                    {isLoggingOut ? "Logging out..." : "Sign out"}
                  </motion.button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Main Content - No scrollbar, contained within viewport */}
        <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            main::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="h-full p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
