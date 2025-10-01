"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      setIsMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 z-[60] origin-left"
        style={{ scaleX }}
      />
      
  <nav className={`fixed top-0 w-full z-50 nav-blur bg-white/90 transition-all duration-300 ${isScrolled ? 'shadow-md border-b border-gray-100 mt-1' : 'border-b border-transparent mt-1'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="font-bold text-xl gradient-text cursor-pointer">
                Portfolio
              </Link>
            </motion.div>
          
          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/"
                className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/blog" 
                className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium flex items-center relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
            
            <motion.button 
              onClick={() => scrollToSection('projects')}
              className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('education')}
              className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Education
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('experience')}
              className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Experience
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
            </motion.button>
          </motion.div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-600 my-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
  <div className="md:hidden bg-white/95 nav-blur border-t border-gray-100">
          <div className="px-6 py-4 space-y-3">
            <Link 
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left py-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setIsMenuOpen(false)} 
              className="block w-full text-left py-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
            >
              Blog
            </Link>
            <button 
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left py-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('education')}
              className="block w-full text-left py-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
            >
              Education
            </button>
            <button 
              onClick={() => scrollToSection('experience')}
              className="block w-full text-left py-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
            >
              Experience
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
