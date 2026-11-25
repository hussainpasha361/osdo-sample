/**
 * Studio information. Anything not yet confirmed by OSDO is `null` and the
 * interface hides or marks it; nothing here is invented.
 */
export const site = {
  name: "OSDO",
  fullName: "Ovais & Shahzad Design Office",
  /** How the name breaks in the hero. */
  nameLines: ["Ovais & Shahzad", "Design Office"],
  descriptor: "Architecture and interior design",
  url: "https://osdo.example", // TODO: real domain
  instagram: {
    handle: "ovaisandshahzaddesignoffice",
    url: "https://www.instagram.com/ovaisandshahzaddesignoffice/",
  },
  contact: {
    email: null as string | null, // TODO
    phone: null as string | null, // TODO
    whatsapp: null as string | null, // TODO (international format, digits only)
    address: null as string[] | null, // TODO
    mapUrl: null as string | null, // TODO
  },
  /** City and time zone power the small studio clock; hidden until confirmed. */
  location: null as { city: string; timeZone: string } | null,
  credit: { name: "AXERO Design", url: null as string | null },
};

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/approach", label: "Approach" },
  { href: "/contact", label: "Contact" },
] as const;

/** Shown wherever a contact field is still missing. */
export const PENDING = "To be confirmed";
