// Placeholder project list. Names, places and years are stand-ins until OSDO
// sends its real portfolio; `plate` picks the drawing used in place of photos.
export type PlateKind = "plan" | "section" | "elevation" | "axo" | "site" | "detail";

export type Project = {
  no: string;
  title: string;
  place: string;
  type: "Residential" | "Commercial" | "Interiors" | "Hospitality" | "Landscape";
  year: string;
  status: "Built" | "On site" | "In design";
  plate: PlateKind;
  tone: number; // 0–5, index into the plate tone scale
};

export const projects: Project[] = [
  { no: "01", title: "Courtyard House", place: "Karachi", type: "Residential", year: "TBC", status: "Built", plate: "plan", tone: 0 },
  { no: "02", title: "Brick Screen Offices", place: "Karachi", type: "Commercial", year: "TBC", status: "Built", plate: "elevation", tone: 3 },
  { no: "03", title: "House of Light Wells", place: "Lahore", type: "Residential", year: "TBC", status: "On site", plate: "section", tone: 1 },
  { no: "04", title: "Terrazzo Flagship", place: "Karachi", type: "Interiors", year: "TBC", status: "Built", plate: "detail", tone: 4 },
  { no: "05", title: "Garden Pavilion", place: "Islamabad", type: "Landscape", year: "TBC", status: "In design", plate: "site", tone: 2 },
  { no: "06", title: "Rooftop Restaurant", place: "Karachi", type: "Hospitality", year: "TBC", status: "Built", plate: "axo", tone: 5 },
  { no: "07", title: "Twin Family Residences", place: "Karachi", type: "Residential", year: "TBC", status: "In design", plate: "plan", tone: 3 },
];

export const featured = [
  { no: "01", title: "Courtyard House", line: "A plan turned inward, around shade, water and a single neem tree.", plate: "plan" as PlateKind, tone: 0 },
  { no: "02", title: "Brick Screen Offices", line: "A perforated brick skin that cools the façade and softens the afternoon.", plate: "elevation" as PlateKind, tone: 3 },
  { no: "03", title: "House of Light Wells", line: "Three light wells pull daylight down through a deep city plot.", plate: "section" as PlateKind, tone: 1 },
  { no: "04", title: "Terrazzo Flagship", line: "One material, poured and polished, carried from floor to counter.", plate: "detail" as PlateKind, tone: 4 },
];

export const services = [
  {
    no: "A",
    title: "Architecture",
    body: "Houses, workplaces and public buildings, from feasibility and concept through to drawings for site.",
    items: ["Feasibility & briefing", "Concept design", "Approvals", "Construction drawings", "Site supervision"],
  },
  {
    no: "B",
    title: "Interior architecture",
    body: "Interiors drawn as part of the building, not added after it: joinery, lighting, material and furniture.",
    items: ["Space planning", "Joinery & millwork", "Lighting design", "Material palettes", "Furniture"],
  },
  {
    no: "C",
    title: "Landscape",
    body: "Courtyards, gardens and roofs planted for the climate, with shade and water designed in from day one.",
    items: ["Courtyards & gardens", "Planting plans", "Hardscape", "Roof terraces"],
  },
  {
    no: "D",
    title: "Master planning",
    body: "Multi-building sites and communities, set out around movement, open space and phasing.",
    items: ["Site strategy", "Massing studies", "Phasing", "Design codes"],
  },
];

export const process = [
  { no: "01", title: "Listen", body: "We start on site and in conversation: how you live or work, the plot, the light, the budget." },
  { no: "02", title: "Draw", body: "Sketches, models and plans test the big moves before a single detail is fixed." },
  { no: "03", title: "Resolve", body: "Material, structure and services are drawn together into one coordinated set." },
  { no: "04", title: "Build", body: "We stay on site through construction, so what gets built is what was drawn." },
];
