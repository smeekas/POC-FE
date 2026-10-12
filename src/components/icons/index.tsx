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

/** Both arrows, shown on a sortable column that is not the one currently sorted. */
export const SortIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="m8 9 4-4 4 4" />
    <path d="m16 15-4 4-4-4" />
  </svg>
);

/** Up arrow, shown on the column currently sorted ascending. */
export const SortAscIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);

/** Down arrow, shown on the column currently sorted descending. */
export const SortDescIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);

/** Magnifier, shown inside the search bar. */
export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

/** Cross, shown on the button that empties the search bar. */
export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/** Chevron, shown on the pagination control that steps back a page. */
export const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

/** Chevron, shown on the pagination control that steps forward a page. */
export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/** Chevron, shown on a dropdown trigger to say it opens a menu. */
export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** Vertical ellipsis, the trigger for a row's action menu. */
export const MoreVerticalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props}>
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
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
