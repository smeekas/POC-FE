# Radix Themes → Mantine Migration Plan

**Status:** proposed, not started
**Author:** drafted 2026-10-19
**Scope:** replace `@radix-ui/themes` + `radix-ui` primitives with Mantine across `src/`

---

## 1. Why

Radix Themes is a token system with a thin component layer on top. It is intentionally not a feature-complete component library: no searchable/multi `Select`, no `Combobox`, no `DatePicker`, no notifications, no modal manager, no form integration, no tags input.

The cost of that gap is already paid for in this repo. These components exist only because Radix doesn't ship them:

| Hand-rolled component | LOC | Mantine equivalent |
|---|---|---|
| `components/ui/Select/CustomSelect.tsx` | 93 | `Select` / `MultiSelect` |
| `components/common/DataTable/DataTable.tsx` | 175 | `Table` (+ own sort logic) |
| `components/ui/Pagination.tsx` | 145 | `Pagination` |
| `components/ui/SearchBar.tsx` | 102 | `TextInput` + `useDebouncedValue` |
| `components/common/ConfirmDialog/ConfirmDialog.tsx` | 69 | `modals.openConfirmModal` |
| `components/form/PasswordInput.tsx` | 67 | `PasswordInput` |
| `components/ui/ProgressBar.tsx` | 65 | `Progress` |
| `components/form/FormField.tsx` | 48 | `Input.Wrapper` |
| `components/ui/Alert.tsx` | 43 | `Alert` |
| `components/ui/StatCard.tsx` | 44 | `Card` / `Paper` |
| `components/ui/TextArea.tsx` | 33 | `Textarea` |
| `components/ui/TextInput.tsx` | 29 | `TextInput` |
| `components/ui/Spinner.tsx` | 15 | `Loader` |
| `modules/documents/components/TagInput.tsx` | — | `TagsInput` |

**~930 LOC of components plus 30 CSS modules** maintained in-house. The migration pays for itself by deleting most of that.

**Verdict: the move is justified.** The rest of this document is about doing it without a two-week broken build.

---

## 2. Scope inventory

### 2.1 TSX surface — small and mechanical

32 files import from `@radix-ui/themes`. Usage is shallow:

| Component | Import sites |
|---|---|
| `Button` | 20 |
| `Flex` | 14 |
| `Badge` | 9 |
| `Text` | 7 |
| `Heading`, `Grid`, `Box` | 3 each |
| `Separator`, `IconButton`, `Dialog`, `Avatar` | 2 each |
| `Tooltip`, `Theme`, `Table`, `Select`, `SegmentedControl`, `DropdownMenu`, `Card`, `AlertDialog` | 1 each |

`radix-ui` (unstyled primitives) appears in exactly **2** files:
- `components/ui/Select/CustomSelect.tsx:4` — `Select`
- `components/form/FormField.tsx:1` — `Label`

Both disappear entirely under Mantine. The `radix-ui` package can be dropped early.

`@radix-ui/react-icons` is used in 7 files and is **independent** of this migration. It can stay indefinitely.

### 2.2 CSS surface — this is the actual migration

**361 `var(--…)` references across 30 CSS modules** are bound to Radix Themes' token system. Nothing in `src/*.module.css` currently defines its own colours, spacing, or type scale — it all comes from `<Theme>` in `main.tsx`.

Heaviest files:

| File | Token refs |
|---|---|
| `components/ui/Select/CustomSelect.module.css` | 39 |
| `modules/onboarding/components/Plans.module.css` | 26 |
| `layouts/AuthLayout.module.css` | 25 |
| `components/ui/StatCard.module.css` | 24 |
| `components/common/Sidebar/Sidebar.module.css` | 23 |
| `components/ui/TextArea.module.css` | 21 |
| `modules/onboarding/pages/Upgrade.module.css` | 20 |
| `components/ui/ProgressBar.module.css` | 20 |
| `components/ui/TextInput.module.css` | 19 |
| `modules/onboarding/pages/Onboarding.module.css` | 16 |
| …20 more files | ≤14 each |

**If you delete `<Theme>` before dealing with this, every one of those 361 references silently resolves to nothing and the entire app loses its styling at once.** That is the failure mode this plan is built to avoid.

---

## 3. The core problem: the scales don't line up

Radix and Mantine use structurally different token systems. This is not a rename.

| | Radix Themes | Mantine |
|---|---|---|
| Colour steps | 12 per hue (`--gray-1`…`--gray-12`), each step has defined semantics (1–2 bg, 3–5 component bg, 6–8 borders, 9–10 solid, 11–12 text) | 10 per hue (`--mantine-color-gray-0`…`-9`), no fixed per-step semantics |
| Alpha track | Yes — `--gray-a3`, `--accent-a5`, `--red-a6` | **None** |
| Spacing | 9 steps: 4/8/12/16/24/32/40/48/64px | 5 steps: xs 10 / sm 12 / md 16 / lg 20 / xl 32px |
| Radius | 6 steps: 3/4/6/8/12/16px | 5 steps: xs…xl |
| Font size | 9 steps: 12/14/16/18/20/24/28/35/60px | 5 steps: xs…xl |
| Font weight | `--font-weight-regular/medium/bold` | no tokens |
| Letter spacing | `--letter-spacing-1`…`-9` | no tokens |
| Cursor | `--cursor-button: default`, `--cursor-disabled: not-allowed` | no tokens |

The alpha tokens are used **22 times** (`--gray-a3` ×7, `--gray-a9` ×4, `--accent-a5` ×3, `--accent-a3` ×2, `--red-a3/a5/a6`, `--green-a3/a6`, `--orange-a3`, `--white-a11/a12`). Mantine has no equivalent — those need `color-mix()` or literal `rgba()`.

The composed shadows are worse. `--shadow-4` expands to:

```css
0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
0 8px 40px var(--black-a1),
0 12px 32px -16px var(--gray-a3);
```

Nested alpha tokens that don't exist in Mantine. Hand-transcribing these is where transcription bugs come from.

---

## 4. Strategy

**Decouple the CSS from the component library before swapping the component library.**

Three steps, in this order:

1. Snapshot the current Radix token values into a plain `src/styles/tokens.css` that depends on nothing.
2. Remove `<Theme>`. The app looks pixel-identical because `tokens.css` now supplies the variables. **Radix Themes is no longer a styling dependency — only a component dependency.** All 30 CSS modules keep working, untouched.
3. Migrate components incrementally. Each one deletes its own CSS module as it goes. `tokens.css` shrinks to nothing and gets deleted last.

The key property: **the app is visually correct and green at every single commit.** No big-bang, no reviewing a 3,000-line diff.

### Why snapshot rather than hand-map

`tokens.css` should be **generated from the running app**, not typed by hand. Run this in the browser console against the current dev server:

```js
// Paste into DevTools console on a running page, then copy the output.
const USED = [...new Set(
  [...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch { return [] } })
    .flatMap(r => (r.cssText || '').match(/var\(--[a-z0-9-]+/g) || [])
    .map(m => m.slice(4))
)].sort();

const cs = getComputedStyle(document.querySelector('.radix-themes'));
console.log(':root {\n' + USED
  .map(v => [v, cs.getPropertyValue(v).trim()])
  .filter(([, val]) => val)
  .map(([v, val]) => `  ${v}: ${val};`)
  .join('\n') + '\n}');
```

This resolves every `calc()`, every nested alpha reference, and every composed shadow to its final computed value. It is exact by construction. Paste the result into `src/styles/tokens.css`, then spot-check against the token list in §6.

> Cross-check the output against the 88 distinct tokens listed in §6 — the console scrape only sees stylesheets the browser has actually loaded, so visit a few routes (auth, documents, onboarding, platform admin) before running it.

---

## 5. Phases

Each phase is independently shippable.

### Phase 0 — Freeze the tokens *(no Mantine yet)*

- [ ] Generate `src/styles/tokens.css` via the snapshot script above
- [ ] Import it in `main.tsx` **before** `index.css`
- [ ] Delete the `<Theme>` wrapper and the `@radix-ui/themes/styles.css` import from `main.tsx`
- [ ] Replace the `.radix-themes { height: 100% }` selector in `index.css:30` with a real app wrapper class
- [ ] Visual diff every route; fix any token the scrape missed

**Exit:** app looks identical, `<Theme>` is gone, 30 CSS modules untouched.
**Risk:** low. Fully reversible — one import.

> Note: the comment at `main.tsx:11-13` claims only tokens are imported and that `styles.css` would be added "the day we start rendering Radix Themes components" — but line 14 already imports the full stylesheet and 19 Themes components are in use. The comment is stale; it dies here.

### Phase 1 — Install Mantine side-by-side

- [ ] `pnpm add @mantine/core @mantine/hooks`
- [ ] `pnpm add -D postcss-preset-mantine postcss-simple-vars`
- [ ] Add `postcss.config.cjs` (none exists today)
- [ ] Add `MantineProvider` **inside** the current tree, import `@mantine/core/styles.css`
- [ ] Author `src/theme.ts` reproducing the Radix numeric scales as custom Mantine keys

Mantine's theme accepts arbitrary scale keys, so the Radix scale can be reproduced 1:1 rather than squashed into xs–xl:

```ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'violet',
  spacing:   { 1:'4px', 2:'8px', 3:'12px', 4:'16px', 5:'24px',
               6:'32px', 7:'40px', 8:'48px', 9:'64px' },
  radius:    { 1:'3px', 2:'4px', 3:'6px', 4:'8px', 5:'12px', 6:'16px' },
  fontSizes: { 1:'12px', 2:'14px', 3:'16px', 4:'18px', 5:'20px',
               6:'24px', 7:'28px', 8:'35px', 9:'60px' },
  lineHeights: { 1:'16px', 2:'20px' },
});
```

This emits `--mantine-spacing-4`, `--mantine-radius-3`, `--mantine-font-size-2`, etc. — so new Mantine components land on the **same** scale the existing CSS modules use. No visual drift between migrated and unmigrated screens.

Colour is the one place a 1:1 mapping is impossible (12 steps + alpha vs 10 steps, no alpha). Define a custom 10-shade `violet` array sampled from the Radix purple ramp, and keep the alpha tokens in `tokens.css` until their consumers are deleted.

**Exit:** both libraries loaded, nothing migrated yet. Bundle temporarily carries both stylesheets.
**Risk:** low. Mantine is CSS-module scoped; Radix Themes components are gone, so no cascade conflict.

### Phase 2 — Layout & typography primitives *(31 of the ~68 import sites)*

Highest volume, lowest risk. Pure mechanical substitution.

| Radix | Mantine | Notes |
|---|---|---|
| `Flex direction="column"` | `Stack` | |
| `Flex` (row) | `Group` | `Group` wraps by default — pass `wrap="nowrap"` to match Radix |
| `Flex` (complex) | `Flex` | same API shape |
| `Box` | `Box` | |
| `Grid` | `Grid` / `SimpleGrid` | **different API** — Radix `columns="3"` → `SimpleGrid cols={3}` |
| `Text` | `Text` | `size="2"` works given the Phase 1 `fontSizes` keys |
| `Heading` | `Title` | `Title order={1..6}` |

Files: `layouts/AppLayout.tsx`, `layouts/PlatformAdminLayout.tsx`, `components/common/Sidebar/Sidebar.tsx`, `components/common/PageHeader/PageHeader.tsx`, `components/common/LimitBanner/LimitBanner.tsx`, `modules/platformAdmin/components/TenantOverviewCards.tsx`, and the ~14 others using `Flex`/`Text`.

⚠️ `Grid` is the only non-mechanical one here — verify the 3 sites by eye.

### Phase 3 — Simple display components

| Radix | Mantine | Notes |
|---|---|---|
| `Button` (20 sites) | `Button` | `variant="soft"` → `variant="light"`, `variant="surface"` → `"default"`, `color="red"` → same |
| `Badge` (9) | `Badge` | Radix `color` + `variant="soft"` → `variant="light"` |
| `IconButton` (2) | `ActionIcon` | |
| `Avatar` (2) | `Avatar` | Radix `fallback` prop → Mantine uses `children` |
| `Separator` (2) | `Divider` | `orientation` matches |
| `Card` (1) | `Card` / `Paper` | |
| `Tooltip` (1) | `Tooltip` | Radix `content` → Mantine `label` |

⚠️ Button variant names are the main trap — Radix has `classic/solid/soft/surface/outline/ghost`, Mantine has `filled/light/outline/transparent/white/subtle/default/gradient`. Walk all 20 sites deliberately; this is where visual regressions hide.

### Phase 4 — The actual payoff: delete the hand-rolled layer

One component per PR. Each deletes its `.tsx`, its `.module.css`, and the tokens that were only used there.

| Replace | With | Gained |
|---|---|---|
| `CustomSelect` + `radix-ui` Select | `Select` | search, clearable, grouping, `MultiSelect` for free |
| `TagInput` | `TagsInput` | |
| `TextInput` / `TextArea` | `TextInput` / `Textarea` | `error`, `description`, `leftSection` built in |
| `PasswordInput` | `PasswordInput` | visibility toggle built in |
| `FormField` + `radix-ui` Label | `Input.Wrapper` | label/description/error wiring |
| `Alert` | `Alert` | |
| `Spinner` | `Loader` | |
| `ProgressBar` | `Progress` | |
| `Pagination` | `Pagination` | |
| `SearchBar` | `TextInput` + `useDebouncedValue` | |
| `ConfirmDialog` + `AlertDialog` | `@mantine/modals` `openConfirmModal` | imperative — no per-site state |
| `Dialog` (2 sites) | `Modal` | |
| `DropdownMenu` (1) | `Menu` | |
| `SegmentedControl` (1) | `SegmentedControl` | |
| `DataTable` + `Table` | `Table` | see caveat ↓ |
| `react-hot-toast` | `@mantine/notifications` | **optional** — see §7 |

⚠️ **`DataTable` caveat.** Mantine's `Table` is presentational — `striped`, `highlightOnHover`, `stickyHeader`, `Table.ScrollContainer`. It does **not** ship sorting, selection, or column config. The 175 lines in `DataTable.tsx` that handle column definitions don't go away; only the markup and CSS underneath them do. If you want sorting/filtering/virtualisation for free, that's a separate decision: `mantine-react-table` or TanStack Table + Mantine `Table` as the renderer. **Don't fold that into this migration.**

Note that `react-hook-form` + `zod` stay exactly as they are. Mantine inputs work with `Controller` out of the box — there is no reason to adopt `@mantine/form`, and doing so would be a second migration wearing this one's clothes.

### Phase 5 — Teardown

- [ ] `pnpm remove @radix-ui/themes radix-ui`
- [ ] Fold whatever remains of `tokens.css` into `theme.ts`, delete the file
- [ ] Decide on `@radix-ui/react-icons` (see §7)
- [ ] Delete the `--radix-select-*` / `--radix-popper-anchor-width` references (they die with `CustomSelect.module.css`)
- [ ] Rename `modules/members/components/copyBotton.module.css` → `copyButton.module.css` *(incidental — typo, 0 tokens, free to fix here)*
- [ ] Re-run the Phase 0 visual diff across all routes

---

## 6. Token reference

88 distinct tokens in use. Grouped by migration difficulty:

**Clean 1:1 via the Phase 1 theme** (spacing, radius, font-size, line-height — 140+ refs)
`--space-1`…`-9`, `--radius-1`…`-5`, `--radius-full`, `--font-size-1`…`-9`, `--line-height-1`, `--line-height-2`

**No Mantine token — inline the literal**
`--font-weight-regular/medium/bold` → `400/500/700`
`--letter-spacing-4/-8/-9` → `-0.0025em / -0.01em / -0.025em`
`--cursor-button` → `default` ⚠️ *not `pointer`* — Radix buttons use `default`
`--cursor-disabled` → `not-allowed`
`--transition-fast/-base` → already app-defined in `index.css:12-13`, keep as-is

**Solid colours — map onto the custom Mantine shade arrays**
`--gray-2`…`-12` (18 refs on `--gray-12` alone), `--accent-2/-4/-7/-8/-9/-11/-12`, `--accent-contrast`, `--red-8/-9/-11`, `--green-9/-11`, `--orange-9/-11`, `--focus-8`

**Alpha — no equivalent, needs `color-mix()` or literal `rgba()`** *(22 refs)*
`--gray-a3/-a4/-a5/-a9/-a10`, `--accent-a3/-a5`, `--red-a3/-a5/-a6`, `--green-a3/-a6`, `--orange-a3`, `--white-a11/-a12`

**Semantic — remap by hand**
`--color-background` → `--mantine-color-body`
`--color-panel-solid` → `--mantine-color-body` *(6 refs)*
`--color-surface` → `rgba(255,255,255,0.85)` literal

**Composed shadows — snapshot, don't transcribe** *(5 refs)*
`--shadow-2/-3/-4`

**Dies with its component**
`--radix-select-trigger-width`, `--radix-select-content-available-height`, `--radix-popper-anchor-width`, `--stat-color`, `--stat-tint`, `--bar-color`, `--bar-text-color`

---

## 7. Open decisions

Resolve these **before** Phase 1 — each one changes work downstream.

1. **Mantine version / React 19.** Mantine 8 is the current major and supports React 19 (this repo is on `react@^19.2.8`). ⚠️ I could not verify the exact peer range from this environment — there's no `npm` binary installed and `pnpm view` shells out to it. **Confirm at install time.**

2. **Dark mode.** `main.tsx:34` hardcodes `appearance='light'` and `tokens.css` would bake in light values only. Mantine has a real colour-scheme manager (`defaultColorScheme`, `useMantineColorScheme`, `light-dark()` in CSS). **If dark mode is ever wanted, decide it now** — retrofitting after 30 CSS modules are rewritten means rewriting them twice.

3. **Icons.** `@radix-ui/react-icons` (7 files) has no dependency on either library and can stay forever. Mantine's docs assume `@tabler/icons-react`. Keeping Radix icons is fine and saves a pass; swapping is cosmetic consistency only. **Recommend: keep, revisit later.**

4. **Toasts.** `react-hot-toast` works fine and is library-agnostic. Switching to `@mantine/notifications` buys visual consistency with Mantine modals/alerts and one less dependency. **Low priority — defer to after Phase 4.**

5. **Table strategy.** Decide now whether `DataTable` stays bespoke-on-Mantine-`Table` or moves to `mantine-react-table`/TanStack. Affects how much of Phase 4 is worth doing. **Recommend: keep bespoke for this migration, evaluate separately.**

---

## 8. Verification

There are no tests in this repo, so verification is manual and the plan depends on it. Per phase:

```bash
pnpm typecheck   # tsc --noEmit, both configs — catches every renamed prop
pnpm lint        # oxlint — catches dead imports
pnpm build
```

Then walk these routes by eye against the Phase 0 baseline — capture screenshots before Phase 0 and diff against them:

- auth: login, signup
- onboarding: plan selection, upgrade
- documents: list (with filters), create
- members: members table, invited members, copy invitation link
- platform admin: layout, tenant overview, settings
- profile settings, accept invitation, 404

---

## 9. Effort shape

| Phase | Nature | Relative size |
|---|---|---|
| 0 — freeze tokens | scripted + visual QA | small |
| 1 — install + theme | config + colour ramp design | small–medium |
| 2 — layout primitives | mechanical, 31 sites | medium |
| 3 — display components | mechanical + variant mapping | medium |
| 4 — hand-rolled layer | real work, deletes ~930 LOC | **large** |
| 5 — teardown | cleanup | small |

Phase 4 is the bulk, and it is also the only phase that produces the benefit that motivated the migration. Phases 0–3 are the cost of getting there safely.

**Do not start Phase 4 until Phases 0–3 are merged.** It is the phase most likely to stall, and you want the app in a consistent state if it does.
