import type { ImageMedia, Media, Orientation, Project, VideoMedia } from "./types";

/**
 * PROJECTS
 *
 * Source: OSDO master asset package (metadata kept in /assets/source-metadata).
 * Only supplied facts are used. Dates, areas, clients and credits stay
 * undefined until OSDO confirms them. Order here is display order within each
 * group; `group` keeps concepts and design studies apart from completed work.
 */

const PLAN_PAPER = { residential: "#e2eae1", academy: "#efe6da", workspace: "#fbebe2" };

function img(slug: string, file: string, width: number, height: number, alt: string, extra: Partial<ImageMedia> = {}): ImageMedia {
  return { kind: "image", src: `/media/projects/${slug}/${file}`, width, height, alt, status: "final", ...extra };
}

/* ---------------------------------------------------------------- KAALIYAS */
const K = "kaaliyas-steakhouse";
const kaaliyas = {
  kitchen: img(K, "open-kitchen.webp", 1024, 1536, "KAALIYAS open kitchen: brushed steel counter under a terracotta wall and a steel mezzanine rail.", { focus: "50% 60%" }),
  entrance: img(K, "entrance-night.webp", 1086, 1448, "KAALIYAS entrance at night, a backlit sign above a dark ribbed façade and a glazed door."),
  dining: img(K, "dining-interior.webp", 830, 1800, "Dining room with banquette seating, green joinery and warm cove lighting."),
  nook: img(K, "dining-nook.webp", 1024, 1536, "A dining nook beneath a high window, pendant light over a timber table."),
  facade: img(K, "facade-dusk.webp", 1086, 1448, "KAALIYAS façade at dusk on a city street, planting along the frontage."),
};

/* ------------------------------------------------------------ Bella Pizzeria */
const B = "bella-pizzeria";
const bella = {
  b2: img(B, "bella-02.webp", 1179, 653, "Rooftop dining terrace with a lit Bella Pizzeria sign wall, timber bar and green banquettes."),
  b1: img(B, "bella-01.webp", 1054, 781, "Long rooftop banquette under a textured, backlit wall, lanterns along the parapet."),
  b3: img(B, "bella-03.webp", 1179, 787, "Tables beside a chalkboard menu wall beneath a pendant lamp at dusk."),
  b4: img(B, "bella-04.webp", 1179, 657, "Green seating along a sculpted plaster wall leading to the Bella sign."),
  b5: img(B, "bella-05.webp", 1027, 662, "The terrace at blue hour, warm light washing the textured wall."),
};
const bellaReel: VideoMedia = {
  kind: "video",
  src: `/media/projects/${B}/bella-reel.mp4`,
  poster: `/media/projects/${B}/bella-02.webp`,
  width: 380,
  height: 750,
  alt: "Short film moving through the Bella Pizzeria rooftop terrace.",
  autoplay: false,
  label: "Reel, preview cut",
  status: "provisional",
};

/* ------------------------------------------------- Residential Transformation */
const R = "residential-transformation";
const res = {
  planExisting: img(R, "01-existing-plan.webp", 709, 672, "Existing plan of the veranda.", { role: "plan", label: "Existing plan", paper: PLAN_PAPER.residential }),
  planProposed: img(R, "02-proposed-plan.webp", 709, 744, "Proposed plan of the veranda with new seating layout.", { role: "plan", label: "Proposed plan", paper: PLAN_PAPER.residential }),
  b1: img(R, "03-existing-entrance.webp", 709, 728, "Existing entrance before renovation.", { role: "before", label: "Existing entrance" }),
  b2: img(R, "04-existing-seating.webp", 709, 728, "Existing seating area before renovation.", { role: "before", label: "Existing seating" }),
  b3: img(R, "05-existing-veranda.webp", 709, 728, "Existing veranda before renovation.", { role: "before", label: "Existing veranda" }),
  a1: img(R, "06-renovated-entrance.webp", 709, 728, "Renovated entrance with timber screens, brick and wrought-iron gate.", { role: "after", label: "Renovated entrance" }),
  a2: img(R, "07-renovated-lounge.webp", 709, 728, "Renovated lounge with stone wall, timber battens and layered lighting.", { role: "after", label: "Renovated lounge" }),
  a3: img(R, "08-lighting-detail.webp", 709, 728, "Lantern wall light beside a timber-framed window.", { role: "after", label: "Lighting detail" }),
  a4: img(R, "09-timber-ceiling.webp", 709, 728, "Timber-lined ceiling with track lighting and a ceiling fan.", { role: "after", label: "Timber ceiling" }),
  a5: img(R, "10-brickwork-entry.webp", 709, 728, "Exposed brickwork beside a timber and glass door.", { role: "after", label: "Brickwork entry" }),
};

/* ------------------------------------------- Academy of Salon Science by Peng */
const A = "academy-of-salon-science-by-peng";
const academy = {
  receptionFront: img(A, "reception-front.webp", 709, 721, "Reception desk with sculpted stone front before arched display niches."),
  receptionAngle: img(A, "reception-angle.webp", 697, 802, "Reception seen at an angle beneath a slatted timber ceiling."),
  planA: img(A, "floor-plan-a.webp", 709, 676, "Floor plan, level A.", { role: "plan", label: "Plan A", paper: PLAN_PAPER.academy }),
  planB: img(A, "floor-plan-b.webp", 709, 675, "Floor plan, level B.", { role: "plan", label: "Plan B", paper: PLAN_PAPER.academy }),
  booths: img(A, "arched-booths.webp", 709, 720, "Arched glass booths with upholstered seating."),
  columnFront: img(A, "column-detail-front.webp", 709, 720, "Fluted columns flanking a planter before a wide window."),
  columnAngle: img(A, "column-detail-angle.webp", 709, 720, "Column detail with timber base and planter."),
  partition: img(A, "display-partition.webp", 709, 779, "Display partition with lit shelving and an arched niche."),
  manicure: img(A, "manicure-area.webp", 709, 779, "Manicure area below arched wall niches."),
  stone: img(A, "stone-and-greenery.webp", 709, 720, "Stone wall with a planted, carved planter."),
  styling: img(A, "styling-stations.webp", 709, 779, "Styling stations with mirrors and pendant lamps."),
  training: img(A, "training-and-staircase.webp", 709, 721, "Training area beside a floating staircase."),
  wash: img(A, "wash-stations.webp", 709, 720, "Row of wash stations under a stone splashback."),
};

/* ------------------------------------------------------- Creative Workspace */
const W = "creative-workspace";
const workspace = {
  main: img(W, "creative-workspace.webp", 1179, 1213, "Shared workspace with a long table, orange pendants and arched windows.", { role: "render" }),
  plan: img(W, "floor-plan.webp", 1179, 1466, "Floor plan of the workspace.", { role: "plan", label: "Plan", paper: PLAN_PAPER.workspace }),
  bench: img(W, "entry-bench.webp", 1179, 1212, "Entry bench with planting against timber slats.", { role: "render" }),
  meeting: img(W, "meeting-room.webp", 1179, 1235, "Meeting room with a pinboard wall and screen.", { role: "render" }),
  lounge: img(W, "studio-lounge.webp", 1179, 1212, "Lounge with a lettered feature wall and soft seating.", { role: "render" }),
};

const list: Project[] = [
  {
    slug: K,
    group: "completed",
    title: "KAALIYAS. Steakhouse",
    category: "Hospitality",
    mediaNote: "AI-enhanced imagery",
    featured: true,
    cover: kaaliyas.kitchen,
    media: [kaaliyas.kitchen, kaaliyas.facade, kaaliyas.entrance, kaaliyas.dining, kaaliyas.nook],
    blocks: [
      { type: "chapter", label: "Street" },
      { type: "pair", media: [kaaliyas.facade, kaaliyas.entrance] },
      { type: "chapter", label: "Dining" },
      { type: "pair", media: [kaaliyas.dining, kaaliyas.nook] },
    ],
  },
  {
    slug: B,
    group: "completed",
    title: "Bella Pizzeria",
    category: "Hospitality",
    summary: "A rooftop dining space framed by warm lighting, textured walls, timber and green seating.",
    featured: true,
    cover: bella.b2,
    media: [bella.b2, bella.b1, bella.b3, bella.b4, bella.b5, bellaReel],
    blocks: [
      { type: "text", text: "A rooftop dining space framed by warm lighting, textured walls, timber and green seating." },
      { type: "inset", media: bella.b1, align: "left" },
      { type: "inset", media: bella.b3, align: "right" },
      { type: "pair", media: [bella.b4, bella.b5] },
      { type: "video", media: bellaReel },
    ],
  },
  {
    slug: R,
    group: "completed",
    title: "Residential Transformation",
    titleNote: "Working title",
    category: "Residential renovation",
    location: "Karachi, Pakistan",
    summary: "An existing veranda reimagined as a warm seating area with timber detailing, exposed brick, stone and layered lighting.",
    featured: true,
    cover: res.a2,
    media: [res.a2, res.planExisting, res.planProposed, res.b1, res.b2, res.b3, res.a1, res.a3, res.a4, res.a5],
    transformation: {
      plans: [res.planExisting, res.planProposed],
      before: [res.b1, res.b2, res.b3],
      after: [res.a1, res.a2, res.a3, res.a4, res.a5],
    },
  },
  {
    slug: A,
    group: "study",
    title: "Academy of Salon Science by Peng",
    category: "Commercial interiors, education",
    location: "Karachi, Pakistan",
    status: "Completion to be confirmed",
    mediaNote: "Design visualisations",
    cover: academy.receptionFront,
    media: [
      academy.receptionFront,
      academy.planA,
      academy.planB,
      academy.receptionAngle,
      academy.booths,
      academy.columnFront,
      academy.columnAngle,
      academy.partition,
      academy.manicure,
      academy.stone,
      academy.styling,
      academy.training,
      academy.wash,
    ],
  },
  {
    slug: W,
    group: "study",
    title: "Creative Workspace",
    titleNote: "Working title",
    category: "Concept",
    status: "Sample render, not built work",
    mediaNote: "Rendered visualisations",
    cover: workspace.main,
    media: [workspace.main, workspace.plan, workspace.bench, workspace.meeting, workspace.lounge],
  },
];

/** Numbers run within each group: Completed 01–03, Studies 01–02. */
export const projects: Project[] = list.map((p) => {
  const group = list.filter((q) => q.group === p.group);
  return { ...p, number: p.number ?? String(group.indexOf(p) + 1).padStart(2, "0") };
});

export const completedProjects = projects.filter((p) => p.group === "completed");
export const studies = projects.filter((p) => p.group === "study");
export const featuredProjects = completedProjects.filter((p) => p.featured);
export const flagship = projects.find((p) => p.slug === K)!;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function groupOf(p: Project) {
  return p.group === "completed" ? completedProjects : studies;
}

/** Previous and next within the project's own group, wrapping around. */
export function getNeighbours(slug: string) {
  const p = getProject(slug)!;
  const g = groupOf(p);
  const i = g.indexOf(p);
  return { prev: g[(i - 1 + g.length) % g.length], next: g[(i + 1) % g.length] };
}

export function orientationOf(m: Media): Orientation {
  const r = m.width / m.height;
  if (r > 1.1) return "landscape";
  if (r < 0.9) return "portrait";
  return "square";
}

/** Media below this width is never shown edge to edge. */
export const FULL_BLEED_MIN = 1600;

export const residentialMedia = res;
