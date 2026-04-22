import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "VisionAI — Machine Vision & AI Engineer",
    template: "%s | VisionAI",
  },
  description:
    "10 years of machine vision and AI expertise. Showcasing projects in industrial inspection, deep learning, 3D reconstruction, and mathematical foundations of computer vision.",
  keywords: ["machine vision", "computer vision", "AI", "deep learning", "OpenCV", "PyTorch"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "VisionAI — Machine Vision & AI Engineer",
    description: "10 years of machine vision and AI expertise.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
