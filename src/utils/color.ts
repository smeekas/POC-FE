import type { MantineColorsTuple } from '@mantine/core';

/**
 * Builds a Mantine colour scale from a single brand hex.
 *
 * This is a dependency free port of `@mantine/colors-generator`, which needs `chroma-js`
 * at runtime. Output is identical to it for the same colour.
 *
 * The maths runs through CIE Lab/LCH rather than staying in HSL because saturation
 * steps in HSL skew hue badly at the dark end — the same reason chroma-js works in LCH.
 */

/* Target HSL lightness per shade, 0 (lightest) through 9 (darkest). */
const LIGHTNESS_MAP = [
  0.96, 0.907, 0.805, 0.697, 0.605, 0.547, 0.518, 0.445, 0.395, 0.34,
];

/* How far each shade is pushed away from the base colour's saturation. The ends of the
   scale are pushed hardest so pale tints stay tinted and dark shades stay rich. */
const SATURATION_MAP = [
  0.32, 0.16, 0.08, 0.04, 0, 0, 0.04, 0.08, 0.16, 0.32,
];

/* chroma-js's Kn: one unit of `saturate` is 18 LCH chroma units. */
const SATURATION_UNIT = 18;

/* D65 white point and the Lab piecewise-function breakpoints, as chroma-js defines them. */
const WHITE_X = 0.95047;
const WHITE_Y = 1;
const WHITE_Z = 1.08883;
const LAB_T0 = 4 / 29;
const LAB_T1 = 6 / 29;
const LAB_T2 = 3 * LAB_T1 * LAB_T1;
const LAB_T3 = LAB_T1 * LAB_T1 * LAB_T1;

type Rgb = [number, number, number];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// ---------- hex <-> rgb ----------

const hexToRgb = (hex: string): Rgb => {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`generateShades: "${hex}" is not a 3 or 6 digit hex colour`);
  }

  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const rgbToHex = ([r, g, b]: Rgb) =>
  `#${[r, g, b]
    .map((channel) =>
      clamp(Math.round(channel), 0, 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

// ---------- rgb <-> hsl ----------

/** Hue is `NaN` for greys, which have no hue to report. */
const rgbToHsl = ([r255, g255, b255]: Rgb): [number, number, number] => {
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) return [Number.NaN, 0, lightness];

  const delta = max - min;
  const saturation =
    lightness < 0.5 ? delta / (max + min) : delta / (2 - max - min);

  let hue: number;
  if (r === max) hue = (g - b) / delta;
  else if (g === max) hue = 2 + (b - r) / delta;
  else hue = 4 + (r - g) / delta;

  hue *= 60;
  if (hue < 0) hue += 360;

  return [hue, saturation, lightness];
};

/** `h` in degrees, `s` and `l` as 0–1 fractions. Channels come back unrounded. */
const hslToRgb = (h: number, s: number, l: number): Rgb => {
  if (s === 0) return [l * 255, l * 255, l * 255];

  const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const t1 = 2 * l - t2;
  const hue = h / 360;

  const channel = (offset: number) => {
    let t = hue + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;

    if (6 * t < 1) return t1 + (t2 - t1) * 6 * t;
    if (2 * t < 1) return t2;
    if (3 * t < 2) return t1 + (t2 - t1) * (2 / 3 - t) * 6;
    return t1;
  };

  return [channel(1 / 3) * 255, channel(0) * 255, channel(-1 / 3) * 255];
};

// ---------- rgb <-> lch ----------

const srgbToLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const linearToSrgb = (channel: number) =>
  255 *
  (channel <= 0.00304 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055);

const xyzToLab = (t: number) =>
  t > LAB_T3 ? Math.cbrt(t) : t / LAB_T2 + LAB_T0;

const labToXyz = (t: number) => (t > LAB_T1 ? t * t * t : LAB_T2 * (t - LAB_T0));

const rgbToLch = ([r255, g255, b255]: Rgb): [number, number, number] => {
  const r = srgbToLinear(r255 / 255);
  const g = srgbToLinear(g255 / 255);
  const b = srgbToLinear(b255 / 255);

  const x = xyzToLab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / WHITE_X);
  const y = xyzToLab((0.2126729 * r + 0.7151522 * g + 0.072175 * b) / WHITE_Y);
  const z = xyzToLab((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / WHITE_Z);

  const lightness = 116 * y - 16;
  const labA = 500 * (x - y);
  const labB = 200 * (y - z);

  const chroma = Math.sqrt(labA * labA + labB * labB);
  /* A colour with no chroma has no meaningful hue; chroma-js reports NaN here, and
     `lchToRgb` pins that back to the red axis the way chroma-js does. */
  const hue =
    Math.round(chroma * 10000) === 0
      ? Number.NaN
      : (Math.atan2(labB, labA) * (180 / Math.PI) + 360) % 360;

  return [Math.max(0, lightness), chroma, hue];
};

const lchToRgb = (l: number, c: number, h: number): Rgb => {
  /* A hueless colour is pinned to the red axis rather than left alone, matching
     chroma-js. It matters for greys: saturating one has to push it somewhere, and this
     is the direction chroma-js picks. */
  const hueRad = (Number.isNaN(h) ? 0 : h) * (Math.PI / 180);
  const labA = c * Math.cos(hueRad);
  const labB = c * Math.sin(hueRad);

  let y = (l + 16) / 116;
  let x = y + labA / 500;
  let z = y - labB / 200;

  x = WHITE_X * labToXyz(x);
  y = WHITE_Y * labToXyz(y);
  z = WHITE_Z * labToXyz(z);

  return [
    linearToSrgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
    linearToSrgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z),
    linearToSrgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
  ];
};

/** Positive `amount` saturates, negative desaturates, in whole chroma-js units. */
const adjustSaturation = (rgb: Rgb, amount: number): Rgb => {
  const [l, c, h] = rgbToLch(rgb);
  return lchToRgb(l, Math.max(0, c + SATURATION_UNIT * amount), h);
};

/**
 * Ten hex shades spanning light to dark, with the supplied colour kept exactly at
 * whichever index its own lightness is closest to.
 *
 * `generateShades('#B163FF')` returns:
 * `['#f8e9ff', '#e8cfff', '#ce9bff', '#b163ff', '#9a36fe', '#8b19fe', '#8409ff',
 *   '#7100e4', '#6500cc', '#5600b4']`
 *
 * @param hex a 3 or 6 digit hex colour, with or without the leading `#`
 * @throws if `hex` is not a valid hex colour
 */
export const generateShades = (hex: string): MantineColorsTuple => {
  const baseRgb = hexToRgb(hex);
  const [hue, saturation, lightness] = rgbToHsl(baseRgb);

  /* The supplied colour keeps its own slot rather than being forced onto a step, so the
     brand hex survives the round trip untouched. */
  const baseIndex = LIGHTNESS_MAP.reduce(
    (closest, candidate, index) =>
      Math.abs(candidate - lightness) <
      Math.abs(LIGHTNESS_MAP[closest] - lightness)
        ? index
        : closest,
    0,
  );

  const shades = LIGHTNESS_MAP.map((targetLightness, index) => {
    if (index === baseIndex) return rgbToHex(baseRgb);

    const relit = hslToRgb(hue, saturation, targetLightness);
    const delta = SATURATION_MAP[index] - SATURATION_MAP[baseIndex];

    return rgbToHex(adjustSaturation(relit, delta));
  });

  return shades as unknown as MantineColorsTuple;
};
