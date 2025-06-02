import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { FontLoader } from "../components/font-loader";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Jiwon's Dev Blog",
  description: "개발자 지원의 기술 블로그",
  keywords: ["개발", "블로그", "프로그래밍", "웹개발", "Next.js", "React"],
  authors: [{ name: "지원" }],
  creator: "지원",
  publisher: "지원",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.jiwon.me",
    title: "지원의 개발 블로그",
    description: "개발하면서 배운 것들과 경험을 기록하고 공유합니다.",
    siteName: "지원의 개발 블로그",
  },
  twitter: {
    card: "summary_large_image",
    title: "지원의 개발 블로그",
    description: "개발하면서 배운 것들과 경험을 기록하고 공유합니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <FontLoader />
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © 2024 Jiwon&apos;s Dev Blog. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://github.com/jiwonme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:contact@jiwon.dev"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
