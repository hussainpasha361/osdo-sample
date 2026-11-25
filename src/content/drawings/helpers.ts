/** Small geometry helpers for hand-authored drawings (all in photo pixel space). */
export type P = [number, number];
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
export function frond(a: P, c: P, b: P, len = 64): string[] {
  const out = [`M${f(a[0])} ${f(a[1])} Q${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`];
  for (let t = 0.22; t <= 0.96; t += 0.068) {
    const p = quad(a, c, b, t);
    const d = tangent(a, c, b, t);
    const L = len * (1.05 - 0.55 * t);
    for (const side of [-1, 1]) {
      let dir = rot(d, side * 52);
      dir = [dir[0], dir[1] + 0.35];
      const m = Math.hypot(dir[0], dir[1]);
      dir = [dir[0] / m, dir[1] / m];
      const e: P = [p[0] + dir[0] * L, p[1] + dir[1] * L];
      const k: P = [p[0] + dir[0] * L * 0.55 - dir[1] * 4 * side, p[1] + dir[1] * L * 0.55 + dir[0] * 4 * side];
      out.push(`M${f(p[0])} ${f(p[1])} Q${f(k[0])} ${f(k[1])} ${f(e[0])} ${f(e[1])}`);
    }
  }
  return out;
}

/** Strap leaves radiating from one base (dracaena, snake plant). */
export function spray(base: P, tips: P[], bend = 0.18): string[] {
  return tips.map(([x, y]) => {
    const cx = base[0] + (x - base[0]) * 0.5 + (y - base[1]) * bend;
    const cy = base[1] + (y - base[1]) * 0.5 - (x - base[0]) * bend * 0.4;
    return `M${f(base[0])} ${f(base[1])} Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}`;
  });
}

export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
export const front = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`;

/** Evenly spaced vertical lines (fluted walls, blinds). */
export const verticals = (x0: number, x1: number, step: number, y0: number, y1: number) => {
  const out: string[] = [];
  for (let x = x0; x <= x1; x += step) out.push(`M${x} ${y0} V${y1}`);
  return out;
};
