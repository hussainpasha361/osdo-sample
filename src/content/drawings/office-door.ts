import type { Drawing } from "../types";
import { ellipse, spray, verticals } from "./helpers";

/** Traced over /media/studio/office-door.jpg (1179 × 1437). One-point perspective down the corridor. */
const grooves = [342, 395, 448, 500, 553, 606, 660, 713, 766, 818, 870];

export const officeDoorDrawing: Drawing = {
  width: 1179,
  height: 1437,
  lines: [
    // door architrave and leaf
    "M458 932 V278 H810 V932",
    "M480 930 V300 H790 V930",
    "M458 932 H810",
    // panel grooves
    "M522 342 V870 M692 342 V870",
    ...grooves.map((y) => `M522 ${y} H742`),
    "M742 342 V870",
    // ironmongery
    "M758 582 H770 V652 H758 Z",
    "M736 820 H790 V848 H736 Z",
    // bulkhead and corridor edges
    "M405 176 H830",
    "M458 192 H812",
    "M405 176 V890",
    "M405 176 L330 0",
    "M830 180 L905 0",
    // floor lines converging on the door
    "M470 934 L382 1437",
    "M845 940 L1110 1437",
    // switch plates
    "M808 570 H836 V596 H808 Z M808 601 H836 V627 H808 Z M808 632 H836 V658 H808 Z",
    // steel glazed partition
    ...[850, 906, 952, 1012, 1052, 1102, 1150].map((x) => `M${x} 0 V${Math.min(1437, 940 + (x - 845) * 1.9)}`),
    "M848 320 L1179 -105",
    "M848 540 L1179 449",
    "M848 760 L1179 1003",
  ],
  hidden: ["M628 58 L520 280 M628 58 L740 280"],
  soft: [
    // fluted wall
    ...verticals(30, 390, 24, 0, 880),
    // downlight
    ellipse(628, 54, 14, 5),
    // planter in the foreground
    "M380 892 L470 892 L470 1180 L390 1300",
    ...spray([120, 1437], [
      [20, 700],
      [90, 650],
      [180, 690],
      [260, 760],
      [330, 860],
      [380, 980],
      [400, 1120],
      [10, 900],
    ]),
  ],
  notes: [
    { x: 620, y: 560, label: "olive door" },
    { x: 372, y: 420, label: "fluted wall" },
    { x: 862, y: 250, label: "steel partition" },
    { x: 628, y: 58, label: "downlight" },
  ],
};
