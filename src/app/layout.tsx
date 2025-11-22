import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import ConditionalFooter from "@/components/ConditionalFooter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  title: 'Pratham Satani - AI & Machine Learning Graduate Student',
  description: 'Portfolio of Pratham Satani, an AI & Machine Learning Graduate Student and aspiring ML Engineer',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900">
        <ConditionalNavigation />
        
        <main>
          {children}
        </main>
        
        <ConditionalFooter />
      </body>
    </html>
  );
}