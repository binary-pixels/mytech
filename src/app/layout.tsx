import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "VisionLab — Machine Vision Toolkit",
    template: "%s | VisionLab",
  },
  description:
    "VisionLab is an open-source machine vision toolkit for industrial inspection, deep learning, 3D reconstruction, and computer vision research.",
  keywords: ["machine vision", "computer vision", "AI", "deep learning", "OpenCV", "PyTorch", "VisionLab"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "VisionLab — Machine Vision Toolkit",
    description: "Open-source machine vision toolkit for industrial inspection and AI research.",
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
