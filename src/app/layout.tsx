import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-serif", display: "swap" });

const title = `${site.name} | ${site.fullName}`;
const description = "Ovais & Shahzad Design Office: architecture, interiors and landscape, drawn from the plan up.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  openGraph: { title, description, type: "website", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#ECE9E2", width: "device-width", initialScale: 1 };

// Before paint: opt into motion unless reduced motion is requested. Hidden
// pre-animation states only apply under html.motion, so nothing is lost
// without JavaScript. A 4s fail-safe drops motion if scripts never start.
const boot = `(function(d){d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},4000)}}catch(e){}})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
