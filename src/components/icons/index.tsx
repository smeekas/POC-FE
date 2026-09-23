import type { SVGProps } from 'react';

/**
 * Inline SVG icons.
 *
 * Kept in the repo rather than pulled from an icon package so the bundle only ever
 * carries the handful of glyphs the app actually draws. All icons inherit the current
 * text colour and are decorative by default — label the control that holds them.
 */

/** Shared geometry so every icon lines up on the same 24px grid. */
const baseIconProps: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

/** Open eye, shown when the password is hidden and can be revealed. */
export const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/** Crossed out eye, shown when the password is visible and can be hidden. */
export const EyeOffIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="M10.7 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.4 3.4" />
    <path d="M6.6 6.6A18.4 18.4 0 0 0 2 12s3.6 7 10 7a10.7 10.7 0 0 0 5.4-1.4" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m3 3 18 18" />
  </svg>
);
