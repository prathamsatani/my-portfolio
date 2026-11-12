"use client";

import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-hairline">
      <div className="shell label flex flex-col gap-2 py-8 text-muted md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Pratham Satani</p>
        <p>Boston, MA · Built with Next.js</p>
      </div>
    </footer>
  );
}
