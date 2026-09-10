import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Think Without Talking — Latent Reasoning Laboratory",
  description:
    "An interactive research laboratory exploring recurrent latent-space reasoning: can a model reason without generating natural-language tokens?",
  keywords: ["latent reasoning", "chain-of-thought", "recurrent neural networks", "BDH", "machine learning", "education"],
  openGraph: {
    title: "Think Without Talking",
    description:
      "Explore whether a model can reason without talking to itself — an interactive experiment.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='100' height='100' rx='10' fill='%230a0b0d'/%3E%3Ctext xmlns='http://www.w3.org/2000/svg' x='50' y='55' font-size='50' font-family='monospace' font-weight='bold' fill='%233b82f6' text-anchor='middle' dominant-baseline='central'%3Eh%3C/text%3E%3Ctext xmlns='http://www.w3.org/2000/svg' x='50' y='85' font-size='20' font-family='monospace' fill='%239ca3af' text-anchor='middle' dominant-baseline='central'%3ET%3C/text%3E%3C/svg%3E"
          type="image/svg+xml"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:text-sm"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}