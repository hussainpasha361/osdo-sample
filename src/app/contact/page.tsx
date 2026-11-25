import type { Metadata } from "next";
import InquiryForm from "@/components/contact/InquiryForm";
import { RevealText } from "@/components/motion/Reveal";
import { Mark } from "@/components/brand/Logo";
import { site, PENDING } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const c = site.contact;
  const rows: { k: string; v: React.ReactNode }[] = [
    { k: "Email", v: c.email ? <a className="u-line" href={`mailto:${c.email}`}>{c.email}</a> : <span className="text-orange-ink">{PENDING}</span> },
    { k: "Phone", v: c.phone ? <a className="u-line" href={`tel:${c.phone}`}>{c.phone}</a> : <span className="text-orange-ink">{PENDING}</span> },
    { k: "WhatsApp", v: c.whatsapp ? <a className="u-line" href={`https://wa.me/${c.whatsapp}`}>Message the studio</a> : <span className="text-orange-ink">{PENDING}</span> },
    { k: "Studio", v: c.address ? c.address.map((l) => <span key={l} className="block">{l}</span>) : <span className="text-orange-ink">{PENDING}</span> },
    {
      k: "Instagram",
      v: (
        <a className="u-line" href={site.instagram.url} target="_blank" rel="noreferrer">
          @{site.instagram.handle}
        </a>
      ),
    },
  ];

  return (
    <div className="pt-[calc(var(--nav-h)+clamp(48px,9vw,140px))] pb-[var(--section)] relative overflow-clip" data-section="Contact">
      <Mark className="pointer-events-none absolute -right-[6vw] top-[8vh] h-[86vh] w-auto text-ivory-2" />
      <div className="grid-12 relative gap-y-16">
        <RevealText as="h1" className="t-xxl col-span-6 md:col-span-10 text-olive" text={["Tell us about", "your project"]} start="top 100%" />

        <dl className="col-span-6 md:col-span-4 grid content-start gap-6 md:mt-10">
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-[96px_1fr] items-baseline gap-4 border-t border-[var(--line)] pt-4">
              <dt className="t-note text-graphite">{r.k}</dt>
              <dd className="t-small">{r.v}</dd>
            </div>
          ))}
        </dl>

        <div className="col-span-6 md:col-start-6 md:col-span-7 md:mt-10">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
