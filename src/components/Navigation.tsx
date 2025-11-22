"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BookOpen, Briefcase, GraduationCap, User, Mail, Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      setIsMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', href: '/', type: 'link', icon: Home },
    { label: 'About', section: 'about', type: 'scroll', icon: User },
    { label: 'Projects', section: 'projects', type: 'scroll', icon: Briefcase },
    { label: 'Education', section: 'education', type: 'scroll', icon: GraduationCap },
    { label: 'Blog', href: '/blog', type: 'link', icon: BookOpen },
    { label: 'Contact', section: 'contact', type: 'scroll', icon: Mail },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`mx-auto max-w-3xl rounded-full transition-all duration-300 ${
            isScrolled 
              ? "bg-white/80 backdrop-blur-md shadow-lg border border-slate-200/50 p-2" 
              : "bg-transparent p-2"
          }`}>
            <div className="flex items-center justify-between px-4">
              {/* Logo/Name for mobile or when scrolled */}
              <Link href="/" className={`font-bold text-lg tracking-tight ${isScrolled ? "opacity-100" : "opacity-0 lg:opacity-0"} transition-opacity`}>
                PS
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.type === 'link' ? (
                      <Link 
                        href={item.href!}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.section!)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.type === 'link' ? (
                    <Link 
                      href={item.href!}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 text-lg font-medium text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      <item.icon className="w-6 h-6 text-slate-400" />
                      {item.label}
                    </Link>
                  ) : (
                    <button 
                      onClick={() => scrollToSection(item.section!)}
                      className="flex items-center gap-4 w-full p-4 text-lg font-medium text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      <item.icon className="w-6 h-6 text-slate-400" />
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}