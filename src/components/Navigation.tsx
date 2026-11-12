"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserData } from "@/lib/data";
import type { BlogPost, UserData } from "@/lib/data";

const sectionLinks = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(getUserData().resume_url);
  const [hasBlog, setHasBlog] = useState(false);

  useEffect(() => {
    fetch("/api/portfolio/user")
      .then((res) => (res.ok ? (res.json() as Promise<UserData>) : null))
      .then((user) => {
        if (user?.resume_url) setResumeUrl(user.resume_url);
      })
      .catch(() => {});
    // The blog link only appears once at least one post is published.
    fetch("/api/blogs")
      .then((res) => (res.ok ? (res.json() as Promise<BlogPost[]>) : []))
      .then((posts) => setHasBlog(Array.isArray(posts) && posts.length > 0))
      .catch(() => {});
  }, []);

  const links = hasBlog ? [...sectionLinks, { label: "Blog", href: "/blog" }] : sectionLinks;
  const close = () => setIsMenuOpen(false);

  const renderLinks = (className: string) => (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} onClick={close} className="hover:text-accent">
            {link.label}
          </Link>
        </li>
      ))}
      {resumeUrl && (
        <li>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Résumé ↗
          </a>
        </li>
      )}
    </ul>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-page">
      <nav aria-label="Main" className="shell">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" onClick={close} className="font-serif text-2xl">
            Pratham Satani
          </Link>

          {renderLinks("label hidden items-center gap-8 md:flex")}

          <button
            type="button"
            className="label py-2 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="border-t border-hairline py-6 md:hidden">
            {renderLinks("label flex flex-col gap-5")}
          </div>
        )}
      </nav>
    </header>
  );
}
