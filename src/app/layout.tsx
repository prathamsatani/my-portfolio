import React from "react";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import ConditionalFooter from "@/components/ConditionalFooter";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  title: 'Pratham Satani - AI & Machine Learning Graduate Student',
  description: 'Portfolio of Pratham Satani, an AI & Machine Learning Graduate Student and aspiring ML Engineer',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-navy: #1e293b;
              --primary-teal: #0891b2; 
              --text-gray: #374151;
              --bg-light: #f8fafc;
              --border-light: #e5e7eb;
            }
            
            .gradient-text {
              background: linear-gradient(135deg, var(--primary-navy), var(--primary-teal));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .nav-blur {
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }
            
            html {
              scroll-behavior: smooth;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-white">
        <ConditionalNavigation />
        
        <main>
          {children}
        </main>
        
        <ConditionalFooter />
      </body>
    </html>
  );
}