import type { Drawing } from "../types";

/**
 * Line drawing traced over /media/studio/office-arch.jpg (1150 × 1430 px).
 * Coordinates are in the photograph's pixel space so the two stay registered
 * at any crop. To use another photograph in the hero, trace a new Drawing in
 * that image's pixel space (an SVG exported from CAD works: copy its path data).
 */

type P = [number, number];
const f = (n: number) => n.toFixed(1);

function quad(a: P, c: P, b: P, t: number): P {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}
function tangent(a: P, c: P, b: P, t: number): P {
  const x = 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]);
  const y = 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
}
const rot = ([x, y]: P, deg: number): P => {
  const r = (deg * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
};

/** A palm frond: the rachis plus paired leaflets that droop slightly. */
function frond(a: P, c: P, b: P, len = 64): string[] {
  const out = [`M${f(a[0])} ${f(a[1])} Q${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`];
  for (let t = 0.22; t <= 0.96; t += 0.068) {
    const p = quad(a, c, b, t);
    const d = tangent(a, c, b, t);
    const L = len * (1.05 - 0.55 * t);
    for (const side of [-1, 1]) {
      let dir = rot(d, side * 52);
      dir = [dir[0], dir[1] + 0.35]; // gravity
      const m = Math.hypot(dir[0], dir[1]);
      dir = [dir[0] / m, dir[1] / m];
      const e: P = [p[0] + dir[0] * L, p[1] + dir[1] * L];
      const k: P = [p[0] + dir[0] * L * 0.55 - dir[1] * 4 * side, p[1] + dir[1] * L * 0.55 + dir[0] * 4 * side];
      out.push(`M${f(p[0])} ${f(p[1])} Q${f(k[0])} ${f(k[1])} ${f(e[0])} ${f(e[1])}`);
    }
  }
  return out;
}

const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
const front = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`;

const trunks: [P, P, P][] = [
  [[470, 905], [452, 740], [420, 560]],
  [[498, 905], [488, 660], [470, 420]],
  [[522, 905], [534, 690], [545, 470]],
  [[542, 905], [575, 770], [600, 640]],
];

export const officeArchDrawing: Drawing = {
  width: 1150,
  height: 1430,
  lines: [
    // arched opening and its reveal
    "M728 1092 V150 A200 200 0 0 1 1128 150 V1215",
    "M752 1084 V158 A176 176 0 0 1 1104 158",
    // skirting meeting the room corner
    "M238 1142 L500 1032 L728 1090",
    // pantry shelf
    "M752 310 L1045 330",
    "M752 348 L1000 378 L1045 345",
    // worktop and joinery
    "M752 650 L1110 622",
    "M752 668 L1110 636",
    "M752 668 V1080",
    "M862 662 V1003",
    "M958 652 V975",
    "M1043 643 V948",
    "M1110 636 V935",
    "M752 768 L862 760",
    "M752 855 L862 848",
    "M752 1080 L1110 935",
    // window and upper wall
    "M998 150 H1100 V545 H998 Z",
    "M965 125 H1128",
    // appliances
    "M757 222 H820 V305 H757 Z",
    "M826 252 H893 V300 H826 Z",
    "M966 492 H1034 V600 H966 Z",
    // steel table
    "M988 806 L1150 762",
    "M988 806 V1430",
    "M1004 822 V1430",
    "M1004 852 L1150 850",
    // bench
    "M0 1038 L242 994 V1284 L0 1302",
    // terracotta planter
    ellipse(505, 922, 125, 26),
    front(505, 948, 118, 22),
    "M388 950 L415 1104",
    "M622 950 L596 1104",
    front(505, 1012, 106, 20),
    front(505, 1042, 101, 19),
    front(505, 1104, 91, 16),
    ellipse(503, 1135, 98, 22),
  ],
  hidden: ["M500 1032 V0", "M242 1284 L500 1180"],
  soft: [
    "M0 42 Q95 60 205 12",
    "M0 935 Q90 945 165 958 Q178 985 160 1000 Q80 1002 0 990",
    ...trunks.map(([a, c, b]) => `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`),
    ...frond([420, 560], [300, 380], [165, 335], 70),
    ...frond([420, 560], [380, 650], [372, 760], 50),
    ...frond([470, 420], [440, 250], [455, 150], 60),
    ...frond([470, 420], [365, 300], [250, 302], 56),
    ...frond([470, 420], [520, 262], [560, 172], 56),
    ...frond([545, 470], [600, 330], [690, 330], 62),
    ...frond([545, 470], [622, 432], [702, 520], 52),
    ...frond([600, 640], [690, 640], [740, 745], 52),
  ],
  grid: [
    { axis: "x", at: 238, label: "A" },
    { axis: "x", at: 500, label: "B" },
    { axis: "x", at: 728, label: "C" },
    { axis: "x", at: 1128, label: "D" },
    { axis: "y", at: 150, label: "arch spring" },
    { axis: "y", at: 650, label: "worktop" },
  ],
  notes: [
    { x: 928, y: 52, label: "arch" },
    { x: 262, y: 560, label: "leaf shadow" },
    { x: 505, y: 1020, label: "planter" },
    { x: 905, y: 820, label: "timber joinery" },
    { x: 996, y: 1120, label: "steel frame" },
  ],
};
