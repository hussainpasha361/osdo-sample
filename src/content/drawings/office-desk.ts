import type { Drawing } from "../types";
import { ellipse, spray, verticals } from "./helpers";

/** Traced over /media/studio/office-desk.jpg (1179 × 1430). */
export const officeDeskDrawing: Drawing = {
  width: 1179,
  height: 1430,
  lines: [
    // timber shelf and basket
    "M0 322 L435 377 V410 L0 352",
    "M100 245 Q182 228 265 245 L258 345 L108 340 Z",
    // tall timber panel
    "M290 405 V1200",
    "M348 425 V800",
    // desk and steel frame
    "M290 800 L515 828 V848 L290 818",
    "M512 848 V1372 M478 862 V1345",
    "M290 1205 L478 1300 M290 1240 L478 1345",
    // planter pot
    "M450 1085 Q450 1250 585 1252 Q720 1250 718 1085",
    ellipse(584, 1085, 134, 14),
    // timber planter box
    "M665 952 L945 940 V1150 L770 1198 L700 1180 L665 1150 Z",
    "M665 952 L770 985 L945 975",
    "M770 985 V1198",
    // steel-framed partition and oak cabinet
    "M975 0 V745",
    "M985 300 L1179 286 M985 330 L1179 318",
    "M950 748 L1179 752",
    "M950 760 V1430",
    "M968 830 V960",
  ],
  hidden: ["M445 10 A55 55 0 0 0 555 10"],
  soft: [
    // vertical blinds
    ...verticals(700, 950, 26, 0, 935),
    // chair in the foreground
    "M0 625 Q230 610 285 700 L298 1150 Q300 1300 220 1360 L0 1390",
    ellipse(280, 1385, 15, 15),
    // dracaena
    ...spray([585, 1080], [
      [600, 450],
      [540, 500],
      [450, 560],
      [430, 650],
      [680, 560],
      [700, 640],
      [380, 820],
      [770, 760],
      [340, 960],
      [800, 1000],
      [520, 620],
      [640, 520],
    ]),
    // snake plant
    ...spray([780, 950], [
      [720, 720],
      [770, 690],
      [830, 770],
      [880, 770],
      [745, 800],
    ], 0.05),
    // cushion on the bench
    "M810 870 Q880 860 945 880 L945 940 L820 945 Z",
  ],
  notes: [
    { x: 830, y: 300, label: "vertical blinds" },
    { x: 400, y: 392, label: "timber shelf" },
    { x: 512, y: 960, label: "steel frame" },
    { x: 584, y: 1170, label: "planter" },
    { x: 790, y: 780, label: "snake plant" },
  ],
};
