import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { TransitionProvider } from "@/components/layout/PageTransition";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/layout/Cursor";
import GridOverlay from "@/components/layout/GridOverlay";
import "./globals.css";

const display = Funnel_Display({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const sans = Funnel_Sans({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap", weight: ["400"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.fullName}`, template: `%s | ${site.name}` },
  description: `${site.fullName}. ${site.descriptor}.`,
  openGraph: { siteName: site.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#eae6db", width: "device-width", initialScale: 1 };

// Before paint: opt into motion unless reduced motion is requested. Hidden
// pre-animation states only apply under html.motion; a fail-safe removes it
// if scripts never start, so content is never stranded.
const boot = `(function(d){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},4000)}}catch(e){}})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <TransitionProvider>
          <SmoothScroll />
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <Cursor />
          <GridOverlay />
        </TransitionProvider>
      </body>
    </html>
  );
}
