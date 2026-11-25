import type { Metadata } from "next";
import PlanToSpace from "@/components/home/PlanToSpace";
import ContactBand from "@/components/home/ContactBand";

export const metadata: Metadata = { title: "Approach" };

export default function ApproachPage() {
  return (
    <>
      <PlanToSpace headingLevel="h1" />
      <ContactBand />
    </>
  );
}
