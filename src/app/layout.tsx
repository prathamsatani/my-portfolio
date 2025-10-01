import React from "react";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
        <Navigation />
        
        <main>
          {children}
        </main>

        <footer className="bg-gradient-to-br from-slate-50 to-slate-100 border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-gradient-to-r from-teal-500 to-blue-500"></span>
                <p className="text-gray-600 font-medium">Crafted with passion for AI and Machine Learning</p>
                <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </div>
              <p className="text-gray-500 text-sm">&copy; 2024 Portfolio. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}