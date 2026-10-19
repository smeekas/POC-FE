import { createTheme } from '@mantine/core';

import { generateShades } from './utils/color';

/**
 * The one colour to edit to rebrand the app. Everything else derives from it.
 *
 * It has to go through `generateShades` rather than straight into `primaryColor`:
 * Mantine reads `theme.colors[primaryColor][shade]`, so `primaryColor` takes a key of
 * `theme.colors` and never a colour value. A raw hex throws at render time, and because
 * the prop is typed as a plain `string`, TypeScript will not catch it.
 */
const BRAND_HEX = '#73328d';

/* `generateShades` keeps the hex above at whichever shade its own lightness is nearest
   — for a mid tone that is usually shade 3 — while Mantine fills buttons and badges
   from shade 6. The fill is therefore a deeper step of the same ramp, which is what
   keeps white label text legible; a light brand hex rarely clears 4.5:1 on its own.
   To fill with the hex itself instead, add `primaryShade: 3` and `autoContrast: true`
   below so labels flip dark where the contrast needs it. */
const brand = generateShades(BRAND_HEX);

/**
 * The app's design tokens.
 *
 * Mantine's default scales only span roughly 10–32px of spacing and 12–20px of type,
 * which is too narrow for this UI. Every scale below is therefore extended with `2xs`
 * and `2xl`+ steps so a single scale covers the whole range the app actually uses.
 *
 * These feed Mantine's CSS variable generator, so each key `k` is readable from any
 * stylesheet as `--mantine-spacing-k`, `--mantine-font-size-k`, `--mantine-radius-k`
 * and `--mantine-shadow-k`. Component stylesheets should use those variables rather
 * than hard coded values.
 */
export const theme = createTheme({
  colors: { brand },
  primaryColor: 'brand',
  defaultRadius: 'md',

  spacing: {
    '2xs': '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
    '4xl': '64px',
  },

  radius: {
    xs: '3px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },

  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '35px',
    '5xl': '60px',
  },

  lineHeights: {
    xs: '1.33',
    sm: '1.43',
    md: '1.5',
    lg: '1.55',
    xl: '1.6',
  },

  headings: {
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '35px', lineHeight: '1.25' },
      h2: { fontSize: '28px', lineHeight: '1.25' },
      h3: { fontSize: '24px', lineHeight: '1.3' },
      h4: { fontSize: '20px', lineHeight: '1.35' },
      h5: { fontSize: '18px', lineHeight: '1.4' },
      h6: { fontSize: '16px', lineHeight: '1.4' },
    },
  },

  fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',

  /* Motion is not part of Mantine's token set; `index.css` defines
     `--transition-fast` / `--transition-base` for stylesheets to use. */
  other: {
    transitionFast: '120ms ease',
    transitionBase: '200ms ease',
  },
});
