import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Autonomous Business Platform | AI-Powered Business Automation",
  description:
    "End-to-end AI automation platform for campaigns, products, content, video, and more. Powered by multi-agent AI.",
  keywords: ["AI", "business automation", "marketing", "campaigns", "print-on-demand"],
  openGraph: {
    title: "Autonomous Business Platform",
    description: "AI-powered end-to-end business automation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0d1117] text-slate-100 antialiased font-sans">
        <SessionProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </SessionProvider>
      </body>
    </html>
  );
}
