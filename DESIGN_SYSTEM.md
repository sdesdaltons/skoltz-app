# Skoltz Design System

This document defines the design system for the Skoltz Sports Bar PWA. It is written for the current stack: Next.js App Router, Tailwind CSS v4, shadcn/ui conventions, dark theme, and PWA-first mobile use.

The system is optimized for fast scanning in a dim sports-bar environment. It should feel energetic through strong contrast, blue/red accents, and Astros emphasis, while avoiding visual clutter.

## Brand Principles

- Dark by default: the app should feel natural in a bar at night.
- Fast scanning: users should understand event status, dates, rewards, and actions within a few seconds.
- High readability: text, buttons, and calendar cells must remain clear on mobile screens and in low light.
- Sports-bar energy: blue, red, glows, and scoreboard-like hierarchy are allowed, but effects must be restrained.
- Free-first architecture: design choices should not require paid image services, proprietary icon sets, native app stores, live sports data vendors, or heavy animation/runtime libraries.

## Token Source

Canonical runtime tokens live in:

- `src/styles/tokens.css`
- `src/lib/tokens.ts`
- `src/app/globals.css`

Use tokens and Tailwind theme variables instead of hardcoded colors in components.

### Color Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--sb-blue` | `#1E4DFF` | Primary actions, active state, Astros emphasis |
| `--sb-red` | `#E53935` | Destructive state, Rockets/red accent, urgent emphasis |
| `--sb-background` | `#111111` | App background |
| `--sb-surface-1` | `#171717` | Cards, day cells, main panels |
| `--sb-surface-2` | `#1D1D1D` | Elevated cards, overlays, bottom nav |
| `--sb-text` | `#F2F2F2` | Primary text |
| `--sb-text-muted` | `#CCCCCC` | Secondary text and metadata |
| `--sb-success` | `#2ECC71` | Positive status, pool indicators |
| `--sb-warning` | `#FFB020` | Warning, karaoke indicators, offline banner |
| `--sb-error` | `#FF4D4F` | Errors and destructive feedback |

Color usage rules:

- Use `bg-background` for page backgrounds.
- Use `bg-surface-1` and `bg-card` for standard cards.
- Use `bg-surface-2` for overlays, elevated cards, and nav.
- Reserve primary blue for meaningful interaction or Astros emphasis.
- Avoid large red fills unless the state is destructive or urgent.
- Do not introduce arbitrary new accent colors without adding tokens first.

## Typography

Current implementation uses Geist through `next/font`. Keep the system to one strong sans-serif family unless a future brand pass intentionally adds a display face.

| Role | Class Guidance | Usage |
| --- | --- | --- |
| Display | `text-4xl sm:text-5xl font-semibold` | Page-level hero text |
| Section title | `text-2xl sm:text-3xl font-semibold` | Section headers |
| Card title | `text-xl font-semibold` | Event/card titles |
| Body | `text-base leading-7` | Important descriptive copy |
| Body small | `text-sm leading-6` | Card descriptions, helper copy |
| Caption | `text-xs font-semibold` | Badges, metadata, nav labels |

Typography rules:

- Keep letter spacing at `tracking-normal`; do not use negative tracking.
- Avoid long uppercase text. Badges may be uppercase.
- Body text should generally be 14px or larger, with important copy at 16px or larger.
- Use muted text only for secondary content, never for required actions.
- Keep line height generous in dense cards and event details.

## Spacing System

Spacing follows the existing 8px-based token scale:

| Token | Value |
| --- | --- |
| `--sb-space-0` | `0` |
| `--sb-space-1` | `0.5rem` / 8px |
| `--sb-space-2` | `1rem` / 16px |
| `--sb-space-3` | `1.5rem` / 24px |
| `--sb-space-4` | `2rem` / 32px |
| `--sb-space-5` | `2.5rem` / 40px |
| `--sb-space-6` | `3rem` / 48px |
| `--sb-space-8` | `4rem` / 64px |
| `--sb-space-10` | `5rem` / 80px |
| `--sb-space-12` | `6rem` / 96px |

Spacing rules:

- Use 8px and 16px gaps inside compact components.
- Use 24px and 32px to separate sections within a screen.
- Mobile page gutters should usually be 16px.
- Desktop/container gutters should scale through `SbContainer`.
- Avoid arbitrary pixel spacing unless matching an icon or border detail.

## Radius Standards

Existing radius tokens:

| Token | Value | Usage |
| --- | --- | --- |
| `xs` | `0.25rem` | Tight badges and small details |
| `sm` | `0.375rem` | Small controls |
| `md` | `0.5rem` | Default buttons and calendar days |
| `lg` | `0.75rem` | Cards and panels |
| `xl` | `1rem` | Large featured cards and sheets |

Radius rules:

- Cards should use `rounded-lg`.
- Buttons should use `rounded-md`.
- Badges should use `rounded-sm` unless a future pill variant is added.
- Nested components should have equal or smaller radius than their container.

## Shadows And Glows

Existing tokens:

| Token | Usage |
| --- | --- |
| `--sb-shadow-sm` | Standard card elevation |
| `--sb-shadow-md` | Stronger panel elevation |
| `--sb-shadow-lg` | Overlay and bottom nav elevation |
| `--sb-glow-blue` | Astros, primary focus, featured emphasis |
| `--sb-glow-red` | Destructive emphasis |

Rules:

- In dark UI, elevation should mostly come from surface changes and subtle borders.
- Use blue glow sparingly for Astros and active/focused primary content.
- Do not stack multiple decorative glow effects in one view.
- Avoid decorative gradient orbs and non-functional background effects.

## Component Naming

Use `Sb` prefix for all Skoltz-specific components.

Examples:

- `SbButton`
- `SbCard`
- `SbBadge`
- `SbCalendarGrid`
- `SbEventCard`
- `SbBottomNav`
- `SbEmptyState`

File naming:

- Component files use kebab case: `sb-event-card.tsx`.
- Barrel exports use `index.ts`.
- Feature-local domain code lives under `src/features/<feature>`.
- UI components must not consume backend-shaped raw data directly.

## Card Variants

### Default Card

Use for standard content blocks and event listings.

- Base: `SbCard`
- Surface: `bg-card` or `bg-surface-1`
- Border: `border-border`
- Shadow: `--sb-shadow-sm`
- Padding: 16px minimum

### Elevated Card

Use for modal/sheet content and important grouped panels.

- Surface: `bg-surface-2`
- Shadow: `--sb-shadow-md` or `--sb-shadow-lg`
- Avoid nesting cards inside cards unless the inner card is a repeated item.

### Astros Highlight Card

Use for featured Astros events.

- Border: `border-primary/50` or stronger
- Background: `bg-primary/10`
- Shadow: `--sb-glow-blue`
- Badge: `Astros`
- Specials may be surfaced as compact tiles.

Astros cards should be visually dominant, but only one Astros highlight should appear per screen region.

## Button Variants

Current `SbButton` variants:

| Variant | Usage |
| --- | --- |
| `primary` | Main action, blue fill, strongest CTA |
| `secondary` | Neutral action on dark surfaces |
| `danger` | Error/destructive action |
| `ghost` | Low-emphasis toolbar or section action |

Size rules:

- `sm`: compact action, minimum 32px height.
- `md`: default action, minimum 40px height.
- `lg`: prominent action, minimum 48px height.
- Touch-critical buttons should be at least 44px high.

Interaction rules:

- Always preserve focus-visible rings.
- Disabled state should reduce opacity and block pointer events.
- Do not use primary buttons for multiple competing actions in the same card.

## Badge Variants

Current `SbBadge` tones:

| Tone | Usage |
| --- | --- |
| `blue` | Astros, primary category, info |
| `red` | Error, Rockets/red sports accent |
| `success` | Pool or positive status |
| `warning` | Karaoke, warning, offline |
| `neutral` | Metadata, featured label, low-emphasis state |

Rules:

- Badges should be short: one or two words.
- Use category badges for event scanning.
- Avoid more than three badges in a compact card.

## Calendar Styling

Existing components:

- `SbCalendarGrid`
- `SbCalendarDay`
- `SbDayDetail`
- `SbEventIndicator`

Rules:

- Month grid renders a stable 42-cell layout.
- Day buttons are square, touch-friendly, and keyboard focusable.
- Weekday labels are muted and compact.
- Out-of-month days are muted with reduced opacity.
- Today uses primary border/glow treatment.
- Event indicators are capped at two visible dots plus `+N` overflow.
- Astros event days receive `bg-primary/10` emphasis.
- Detail overlays use `SbDayDetail` and should remain presentation-only until real data flows require deeper behavior.

Event indicator mapping:

- Astros: blue dot
- Rockets: red dot
- Texans: blue dot with red ring
- Karaoke: warning dot
- Pool: success dot

## Navigation Styling

Existing mobile nav:

- `SbBottomNav`

Rules:

- Fixed bottom navigation is mobile-only.
- Must include safe-area padding: `env(safe-area-inset-bottom)`.
- Page content must include bottom padding so content is not hidden behind the nav.
- Active item uses blue tint and primary text.
- Labels must remain visible; do not rely on icons alone.
- Inline SVG icons are acceptable for the current dependency budget.

Future desktop nav:

- Add a sidebar or top app bar only when the app has enough routes to justify it.
- Keep navigation dense, simple, and scan-friendly.

## Animation Rules

Motion should reinforce interaction, not decorate the app.

- Standard transitions: 150-200ms.
- Overlays/sheets: 200-300ms.
- Use opacity and subtle surface transitions before transforms.
- Do not animate layout in ways that shift calendar height or card lists.
- Respect `prefers-reduced-motion`.
- Avoid constant pulsing except for rare live/active states.

Recommended patterns:

- Button hover: color transition only.
- Card hover: slight surface/border change.
- Astros live state, future only: restrained blue glow or small live indicator.

## Mobile Responsiveness

The app is mobile-first.

Rules:

- Primary screens should work in a single column at mobile width.
- Use `SbContainer` for responsive horizontal padding.
- Use `grid gap-4` and promote to multi-column layouts at `lg` only when cards remain readable.
- Text must not overlap or overflow buttons/cards.
- Touch targets should be at least 44px for primary interactions.
- Calendar cells must keep stable square sizing and a stable 6-row month height.
- Bottom nav must not cover content.

Breakpoint guidance:

- `sm`: increase section/card padding.
- `md`: remove mobile bottom padding when bottom nav is hidden.
- `lg`: allow multi-column event card grids.
- `xl+`: keep content constrained rather than stretching to full width.

## Accessibility

Required:

- Maintain visible focus states on every interactive element.
- Use semantic elements: `button`, `nav`, `main`, `section`, headings in order.
- Use `aria-label` for icon-only or compact visual indicators.
- Use `aria-current="page"` for active nav items.
- Use `aria-live` for future toast/notification messages.
- Keep normal text contrast at or above WCAG AA targets.
- Do not communicate event category only by color; include labels in detail views and cards.
- Offline and error states must be text-readable and not only icon/color-based.

Dim environment guidance:

- Prefer off-white text over pure white.
- Keep muted text readable; do not drop below the tokenized muted text color without testing contrast.
- Avoid dense paragraphs in cards.
- Prefer clear labels and short metadata strings.

## Async UX Rules

Current async components:

- `SbEventCardSkeleton`
- `SbEmptyState`
- `OfflineBanner`

Rules:

- Loading skeletons should match final layout dimensions closely.
- Calendar skeleton must preserve 42 cells to avoid layout shift.
- Error states must include retry where the action is safe and read-only.
- Empty states must explain what is missing and optionally provide a recovery action.
- Offline state should be subtle but visible.
- Query hooks must adapt raw data before UI consumption.

## Tailwind Theme Recommendations

This project uses Tailwind v4 CSS-first theme configuration in `src/app/globals.css`. Continue using `@theme inline` with CSS variables rather than adding a separate `tailwind.config.js` unless the project needs plugin configuration later.

Recommended mappings already in use:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface-1: var(--surface-1);
  --color-surface-2: var(--surface-2);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --spacing-sb-1: var(--sb-space-1);
  --spacing-sb-2: var(--sb-space-2);
  --spacing-sb-3: var(--sb-space-3);
  --shadow-sb-glow-blue: var(--sb-glow-blue);
  --shadow-sb-glow-red: var(--sb-glow-red);
}
```

If the project later adds Tailwind plugin needs, keep the token names aligned with existing CSS variables instead of duplicating values.

## Reusable Component Inventory

Implemented:

- `SbButton`
- `SbCard`
- `SbBadge`
- `SbContainer`
- `SbSection`
- `SbSectionHeader`
- `SbCalendarGrid`
- `SbCalendarDay`
- `SbDayDetail`
- `SbEventIndicator`
- `SbEventCard`
- `SbAstrosHighlightCard`
- `SbEventCardSkeleton`
- `SbBottomNav`
- `SbEmptyState`
- `OfflineBanner`

Recommended next reusable components:

- `SbAppShell`
- `SbTopBar`
- `SbIconButton`
- `SbAlert`
- `SbToast`
- `SbSkeleton`
- `SbStatTile`
- `SbScoreboard`
- `SbRewardCard`
- `SbCheckInStatus`

Do not build these until a feature needs them.

## Astros Event Emphasis

Astros events receive special treatment across the system:

- Event cards use blue glow and blue-tinted background.
- Calendar days use blue-tinted highlight.
- Featured Astros cards may show specials, including `$2 Hot Dogs` and `$2 Ziegenbock Pints`.
- Future live state may add a small live badge, but should not introduce realtime infrastructure until explicitly scoped.

Astros emphasis rules:

- Use blue as the dominant emphasis.
- Do not mix too many decorative sports motifs.
- Avoid busy textures unless they are extremely subtle and tokenized.
- Keep text hierarchy stronger than decoration.

## Scope And Cost Guardrails

To keep the app free or low-cost during MVP:

- Prefer local/mock data until Supabase work is explicitly in scope.
- Avoid native-only features.
- Avoid paid sports data APIs for MVP.
- Avoid realtime sports infrastructure.
- Avoid custom servers, microservices, and queue infrastructure.
- Avoid new dependencies for visual effects.
- Use PWA-first browser capabilities.

Design should support future growth without forcing paid services early.

## Implementation Checklist

Before merging new UI:

- Uses existing tokens or adds tokens intentionally.
- Uses `Sb*` naming for Skoltz components.
- Maintains keyboard focus styles.
- Works at mobile width.
- Avoids overlapping bottom navigation.
- Avoids card-inside-card layouts unless rendering repeated items.
- Does not consume backend-shaped raw data in UI components.
- Loading state preserves layout.
- Error and empty states are explicit.
- Astros emphasis is visible but not noisy.
