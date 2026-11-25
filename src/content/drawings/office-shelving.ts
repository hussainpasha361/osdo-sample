import type { Drawing } from "../types";
import { ellipse, frond, verticals } from "./helpers";

/** Traced over /media/studio/office-shelving.jpg (1179 × 1436). */
const posts = [42, 184, 326, 470, 612, 754];
const shelves = [62, 198, 342, 490, 636, 790];

export const officeShelvingDrawing: Drawing = {
  width: 1179,
  height: 1436,
  lines: [
    // steel shelving: front frame
    ...posts.map((x) => `M${x} ${shelves[0]} V${shelves[shelves.length - 1]}`),
    ...shelves.map((y) => `M${posts[0]} ${y} H${posts[posts.length - 1]}`),
    // oak cabinet
    "M34 797 H758",
    "M48 806 H752 V1102 H48 Z",
    "M48 1130 H758",
    ...[182, 326, 470, 612].map((x) => `M${x} 806 V1102`),
    "M300 828 V884 M336 828 V884 M598 828 V884 M630 828 V884",
    // woven pendant
    "M577 0 V412",
    "M470 498 Q577 382 684 498",
    ellipse(577, 498, 107, 22),
    // glazed partition beyond
    "M758 226 H862 V446 H758",
    "M862 446 V905",
    // books on the shelf
    "M392 545 L404 540 L418 632 L404 634 Z",
    "M430 548 H444 V632 H430 Z",
    // planter bench
    "M770 952 L842 936",
    "M770 952 L998 1436",
    "M842 936 L1179 1214",
  ],
  hidden: [
    // rear frame of the shelving, seen through the front
    ...[116, 258, 400, 542, 684].map((x) => `M${x} 128 V780`),
    ...[128, 268, 412, 560, 708].map((y) => `M116 ${y} H${742}`),
  ],
  soft: [
    // blossom tree
    ellipse(835, 640, 95, 120),
    ellipse(800, 760, 70, 80),
    ellipse(880, 780, 60, 70),
    "M822 940 Q812 850 806 760 M840 930 Q850 860 866 790",
    // bolster cushions along the bench
    ...[0, 1, 2, 3, 4, 5].map((i) => `M${800 + i * 46} ${990 + i * 62} q60 -6 110 26`),
    // palm in the foreground
    ...frond([1179, 980], [1040, 760], [960, 520], 60),
    ...frond([1179, 1120], [1010, 1000], [880, 960], 52),
    // fluted wall at the far left
    ...verticals(4, 34, 10, 390, 790),
  ],
  notes: [
    { x: 470, y: 268, label: "steel grid" },
    { x: 577, y: 498, label: "woven pendant" },
    { x: 400, y: 958, label: "oak joinery" },
    { x: 905, y: 1150, label: "planter bench" },
    { x: 810, y: 330, label: "glazing" },
  ],
};
