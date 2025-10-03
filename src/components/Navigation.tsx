"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
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
    { 
      label: 'Home', 
      href: '/', 
      type: 'link',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      label: 'Blog', 
      href: '/blog', 
      type: 'link',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      label: 'Projects', 
      section: 'projects', 
      type: 'scroll',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    { 
      label: 'Education', 
      section: 'education', 
      type: 'scroll',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    { 
      label: 'Experience', 
      section: 'experience', 
      type: 'scroll',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: 'Contact', 
      section: 'contact', 
      type: 'scroll',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Horizontal Navigation (Top) - Shows when not scrolled */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="nav-blur bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/50 px-6 py-3">
              <div className="flex items-center gap-8">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.type === 'link' ? (
                        <Link 
                          href={item.href!}
                          className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group text-sm"
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => scrollToSection(item.section!)}
                          className="text-gray-600 hover:text-slate-900 transition-colors duration-200 font-medium relative group text-sm"
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-gray-600 my-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden mt-2 bg-white/95 nav-blur backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
              >
                <div className="px-6 py-4 space-y-1">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      {item.type === 'link' ? (
                        <Link 
                          href={item.href!}
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full text-left py-2.5 px-4 text-gray-600 hover:text-slate-900 hover:bg-gray-50 rounded-xl transition-all font-medium text-sm"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button 
                          onClick={() => scrollToSection(item.section!)}
                          className="block w-full text-left py-2.5 px-4 text-gray-600 hover:text-slate-900 hover:bg-gray-50 rounded-xl transition-all font-medium text-sm"
                        >
                          {item.label}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Vertical Navigation (Left) - Shows when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.nav 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block"
          >
            <div className="nav-blur bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/50 px-3 py-4">
              <div className="flex flex-col items-center gap-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                    
                    {item.type === 'link' ? (
                      <Link 
                        href={item.href!}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-500 transition-all duration-300 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {item.icon}
                        </motion.div>
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.section!)}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-500 transition-all duration-300 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {item.icon}
                        </motion.div>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Floating Action Button - Shows when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Menu Modal - Shows when scrolled and menu is open */}
      <AnimatePresence>
        {isScrolled && isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-xl shadow-2xl z-50"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="mr-auto mb-8 p-2 rounded-full hover:bg-gray-100 transition-colors block"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="space-y-4">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.type === 'link' ? (
                        <Link 
                          href={item.href!}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-4 py-3 px-4 text-gray-600 hover:text-slate-900 hover:bg-gray-50 rounded-xl transition-all font-medium"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <button 
                          onClick={() => scrollToSection(item.section!)}
                          className="flex items-center gap-4 w-full py-3 px-4 text-gray-600 hover:text-slate-900 hover:bg-gray-50 rounded-xl transition-all font-medium"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}