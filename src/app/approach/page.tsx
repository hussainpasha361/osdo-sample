import type { Metadata } from "next";
import Approach from "@/components/home/Approach";
import ContactBand from "@/components/home/ContactBand";

export const metadata: Metadata = { title: "Approach" };

export default function ApproachPage() {
  return (
    <>
      <Approach headingLevel="h1" />
      <ContactBand />
    </>
  );
}
