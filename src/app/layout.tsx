import React from "react";
import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import ConditionalFooter from "@/components/ConditionalFooter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

type LayoutProps = {
  children: React.ReactNode;
};

const title = "Pratham Satani — ML Engineer";
const description =
  "Pratham Satani is an ML engineer in Boston building production RAG and agentic systems, multimodal retrieval, and the evaluation pipelines that keep them honest.";

export const metadata: Metadata = {
  metadataBase: new URL("https://pratham-satani.vercel.app"),
  title,
  description,
  openGraph: { title, description, type: "website", url: "/" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased">
        <ConditionalNavigation />

        <main>{children}</main>

        <ConditionalFooter />
      </body>
    </html>
  );
}
