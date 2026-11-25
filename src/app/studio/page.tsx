import type { Metadata } from "next";
import InsideOsdo from "@/components/home/InsideOsdo";
import ContactBand from "@/components/home/ContactBand";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return (
    <div className="bg-olive">
      <InsideOsdo standalone />
      <ContactBand from="olive" />
    </div>
  );
}
