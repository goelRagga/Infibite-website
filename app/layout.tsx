import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteCursorGlow } from "@/components/site/site-cursor-glow";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SITE } from "@/lib/constants";
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
  title: SITE.meta.title,
  description: SITE.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--infibite-hero-fallback)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SiteCursorGlow />
      </body>
    </html>
  );
}
