# THE RIGHT GEAR — VISUAL BRAND GUIDE

**Document:** `VISUAL_BRAND_GUIDE.md`  
**Version:** 0.1.2
**Status:** Canonical Visual Design Reference (Approved Logo D9 Integration)  
**Last updated:** 2026-08-[#] (Current)  
**Project:** The Right Gear  

---

## 1. OFFICIAL PRODUCTION LOGO

**Master Asset Path:** `/public/brand/the-right-gear-logo-master.png` *(Note: Source file currently missing from workspace, fallback logic applied)*

### Logo Usage Rules
- **Do-Not-Redraw:** The official logo must never be redrawn, approximated, or substituted with generic icons (cogs, wheels, steering wheels, etc.). Do not use AI to vectorize the raster master.
- **Natural Aspect Ratio:** Always preserve the logo's original horizontal aspect ratio (`width: auto`, `height: auto`, `object-fit: contain`). Never stretch or crop the artwork.
- **Header Variant (Light Background):** Use the light-background variant (`the-right-gear-logo-on-light.png`) for the Warm White (`#F7F7F5`) desktop Header.
- **Footer Variant (Dark Background):** Use the dark-background variant (`the-right-gear-logo-on-dark.png`) for the Carbon (`#0B0D10`) Footer. If safe recoloring is not possible, place the original logo on a controlled light brand plaque.

### Responsive Sizing
- **Desktop Header:** ~190-220px width
- **Tablet:** ~165-190px width
- **Mobile Header:** ~140-160px width. A two-row mobile Header is permitted and preferred to ensure the logo remains legible without being excessively shrunken.
- **Footer:** ~220-280px width (depending on layout).


## 1. BRAND IDEA

The Right Gear visual personality is built on four core pillars:

**PRECISION • INTELLIGENCE • ENGINEERING • RESTRAINT**

### Core Philosophy
> "The car is the hero. The interface explains it."

The product must feel like:
- A modern automotive intelligence atlas
- A premium editorial publication
- A precise, evidence-backed data product

The product must **NOT** feel like:
- A classified marketplace
- A generic automotive news website
- A racing-game interface
- A crypto or financial trading dashboard
- A generic SaaS template
- An artificial "luxury" dark-mode facade

Visual confidence stems from clean typography, authentic photography, generous negative space, clear information hierarchy, high data quality, and visible source provenance — never from superficial visual decoration.

**Brand Voice:** QUIET CONFIDENCE.

---

## 2. VISUAL ELEMENTS TO AVOID

To maintain brand integrity and credibility, the following visual clichés and decorative elements are strictly prohibited:

- Gear or cog motifs
- Steering-wheel icons as brand symbols
- Speedometer or gauge graphics
- Checkered flags or racing stripes
- Generic car silhouettes as logos
- Fake carbon-fibre textures or skeuomorphic materials
- Metallic or chrome gradients
- Neon or glowing laser effects
- Heavy glassmorphism and blurred overlays
- Large decorative drop-shadows
- Excessive pill shapes and floating badges
- Dashboard overload (too many metrics on one screen)
- Aggressive parallax scrolling
- Decorative racing animations

---

## 3. APPROVED LOGO DIRECTION (D9)

The canonical identity of **The Right Gear** is established by **Direction D9** (`logo_dark.svg` and `logo_light.svg`).

### Key Specifications:
- **Primary Mark:** An automotive/modern typographic wordmark reading **THE RIGHT GEAR** accompanied by a signature red focal accent (`#D71920`).
- **Assets:** `/public/logo_dark.svg` (for dark backgrounds) and `/public/logo_light.svg` (for light backgrounds).
- **Proportions:** Pictogram and wordmark are strictly aligned in height.
- **Interrupted Graphical Lines:** Subtle structural accent lines below "Gear" terminate exactly with the word boundary, symbolizing engineering alignment and chassis structural geometry.
- **Strict Logo Prohibitions:**
  - NO tagline or payoff inside the logo asset.
  - NO generic cog/gear icon or steering wheel graphic.
  - NO distortion, skewing, or color alteration of the canonical SVG files.

---

## 4. BRAND NAME / WORDMARK

### Primary Brand Identity
Always use the full, official brand name:
**The Right Gear**

- **Public Usage:** Always write "The Right Gear" in text and UI labels.
- **Forbidden Public Names:** Do not use "TRG", "TheRightGear", "RightGear", or "The Right Gear AI" as the public-facing primary brand.
- **Internal/Token Usage:** "TRG" is permitted strictly for internal code variables, CSS token prefixes (`--trg-*`), and technical identifiers.

### Wordmark Typography & Presentation
Until a final standalone symbol is officially approved, the wordmark serves as the primary brand identifier.

Allowed Wordmark Applications:
1. **Black on Light Canvas:** `THE RIGHT GEAR` (Carbon `#0B0D10` or Slate `#171A1F` on Warm White `#F7F7F5` / Pure White `#FFFFFF`)
2. **White on Dark Canvas:** `THE RIGHT GEAR` (Pure White `#FFFFFF` on Carbon `#0B0D10`)
3. **Monochrome Black:** `THE RIGHT GEAR` (Pure `#000000` / `#0B0D10`)

> Do **NOT** create an improvised gear, wheel, tachometer, or automotive symbol logo.

### Clear Space & Minimum Width
- **Clear Space:** Minimum clear padding around the wordmark equal to the height of the capital letter 'T'.
- **Minimum Visual Width:**
  - Desktop Web: `120px`
  - Mobile Web: `104px`
  - Print: `32mm`

---

## 4. PRIMARY COLOUR PALETTE

Canonical brand color tokens represent the refined identity of The Right Gear:

### Carbon
- **HEX:** `#0B0D10`
- **RGB:** `11, 13, 16`
- **Usage:** Primary text on light canvas, dark hero backgrounds, dark editorial sections, footers, graph backgrounds.

### Graphite
- **HEX:** `#171A1F`
- **RGB:** `23, 26, 31`
- **Usage:** Secondary dark surfaces, dark cards, dark hover states, subtle dark borders.

### Warm White
- **HEX:** `#F7F7F5`
- **RGB:** `247, 247, 245`
- **Usage:** **PRIMARY PUBLIC WEBSITE CANVAS**. Warm White is preferred over harsh pure white for the primary editorial background to reduce eye strain and feel like premium paper.

### Pure White
- **HEX:** `#FFFFFF`
- **RGB:** `255, 255, 255`
- **Usage:** Card backgrounds on Warm White canvas, reverse text, modal overlays, selected input surfaces.

### TRG Red (Primary Signature Accent)
- **HEX:** `#D71920`
- **RGB:** `215, 25, 32`
- **Usage:** Controlled primary accent — primary action CTAs, active tab indicators, small highlights, brand signature links.
- **Rule:** Red must **NOT** dominate the interface.
- **Page Visual Target Balance:** 80–90% neutral surfaces, 10–15% authentic photography & data panels, 2–5% red accents.

### TRG Red — Dark Interface Variant
- **HEX:** `#E63B44`
- **RGB:** `230, 59, 68`
- **Usage:** Used where greater contrast and luminosity are required over Carbon (`#0B0D10`) or Graphite (`#171A1F`) dark surfaces.

---

## 5. NEUTRAL SCALE

```text
Carbon 950 : #0B0D10  (Primary dark text / dark surface)
Graphite 900: #171A1F  (Secondary dark surface / cards)
Slate 700   : #41464F  (Secondary text on light canvas)
Slate 600   : #5B616B  (Muted body text / icons)
Slate 500   : #6B7280  (Subtle labels / captions)
Slate 400   : #A3A8B0  (Disabled text / dark borders)
Slate 300   : #D1D4D8  (Control borders / dividers)
Slate 200   : #E4E5E7  (Default card border)
Slate 100   : #EEEEEC  (Subtle background fills)
Warm White  : #F7F7F5  (Main public page canvas)
Pure White  : #FFFFFF  (Card container background)
```

**Default Subtle Border:** `#E4E5E7`

---

## 6. SEMANTIC COLOURS

- **Success:** `#18794E` (Green - verified facts, positive trend)
- **Warning:** `#AD5700` (Amber - pending review, missing data warning)
- **Error:** `#C62A2F` (Crimson - data conflict, validation failure)
- **Information:** `#2563A6` (Muted Blue - informational notices, external link indicators)

> **Important:** Do **NOT** use TRG Red (`#D71920`) as the sole error color, because red is primarily our brand identity color. Never communicate system state through color alone — always pair color with explicit text labels or icons.

---

## 7. TYPOGRAPHY

### Primary Typeface: Geist Sans
- **Usage:** Headings, body copy, navigation links, UI buttons, input labels, editorial paragraphs.
- **Fallback Stack:** `"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Technical & Data Typeface: Geist Mono
- **Usage:** Power (HP/kW), displacement (cc), torque (Nm), production counts, dates, valuation prices, market percentages, technical chassis codes, and measured specifications.
- **Examples:** `238 HP`, `175 kW`, `2,467 cc`, `600 units`, `€185,000`, `+12.4%`
- **Rule:** Do **NOT** use Geist Mono for standard body or paragraph text.

---

## 8. WEB TYPOGRAPHY — DESKTOP

| Level | Size | Line Height | Weight | Letter Spacing | Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 64px | 68px | 500 (Medium) | -0.035em | Sentence case |
| **H1** | 48px | 52px | 500 (Medium) | -0.030em | Sentence case |
| **H2** | 36px | 42px | 500 (Medium) | -0.025em | Sentence case |
| **H3** | 28px | 34px | 500 (Medium) | -0.015em | Sentence case |
| **H4** | 22px | 28px | 550–600 | Normal | Sentence case |
| **Body Large** | 18px | 29px | 400 (Regular) | Normal | Sentence case |
| **Body** | 16px | 26px | 400 (Regular) | Normal | Sentence case |
| **Small** | 14px | 21px | 400 (Regular) | Normal | Sentence case |
| **Metadata** | 13px | 18px | 500 (Medium) | Normal | Sentence case |
| **Eyebrow** | 12px | 16px | 600 (Semibold) | +0.080em | Uppercase |

> Uppercase styling is strictly reserved for short category eyebrows and technical data labels. Never use uppercase for full sentences or paragraphs.

---

## 9. WEB TYPOGRAPHY — MOBILE

| Level | Size | Line Height | Weight |
| :--- | :--- | :--- | :--- |
| **Display** | 40px | 44px | 500 |
| **H1** | 36px | 40px | 500 |
| **H2** | 28px | 34px | 500 |
| **H3** | 24px | 30px | 500 |
| **Body** | 16px | 24px | 400 |
| **Small** | 14px | 20px | 400 |

> **Rule:** Never reduce primary mobile body text below `16px` to prevent automatic zoom on touch inputs and maintain legibility.

---

## 10. PRINT TYPOGRAPHY

For official print media, report exports, and press releases:
- **Cover Title:** 34–42pt, Weight 500
- **Main Heading:** 26–30pt
- **H2:** 18–20pt
- **H3:** 13–15pt, Weight 600
- **Body:** 10–10.5pt, Leading 14–15pt
- **Captions:** 8–8.5pt
- **Technical Specs:** Geist Mono, 9–10pt

---

## 11. WEB GRID

- **Desktop (1440px+):** 12-column grid, 24px gutters, min outer margin 32px, max content width `1280px`.
- **Laptop (1024px–1439px):** Max content width `1180px`.
- **Tablet (768px–1023px):** 8 columns, 24px outer margins.
- **Mobile (<768px):** 4 columns, 16px gutters, 16–20px outer margins.
- **Editorial Reading Column:** Constrained to `680px`–`760px` (`max-w-3xl`) for optimal line lengths (65–75 characters per line).

---

## 12. SPACING SYSTEM

Built on a strict 4px grid system:
**Scale:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `96px`, `128px`

- **Desktop Homepage Section Gap:** `96px`–`128px`
- **Mobile Homepage Section Gap:** `64px`–`80px`
- **Card Inner Padding:** `20px`–`24px`
- **Whitespace Principle:** Generous negative space is a signature brand asset. Do not compress layouts unnecessarily.

---

## 13. BORDER RADIUS

- **Small controls (tags, small buttons):** `6px` (`rounded-md`)
- **Inputs & standard buttons:** `8px` (`rounded-lg`)
- **Cards & containers:** `8px`–`10px`
- **Large media containers / heroes:** `12px` (`rounded-xl`)
- **Pills:** `999px` (`rounded-full`) — use **only** for semantic tags (e.g. `Homologation Special`, `Limited Edition`, `1990`). Avoid making standard buttons or cards pill-shaped.

---

## 14. SURFACES & SHADOWS

Prefer 1px clean hairline borders (`#E4E5E7`) and subtle background contrast over heavy drop-shadows.

- **Default Card:** Background `#FFFFFF`, Border `1px solid #E4E5E7`.
- **Card Hover:** Subtle border color shift (`#D1D4D8`) or very restrained elevation (`shadow-sm`).
- **Forbidden:** No large, blurry floating SaaS drop-shadows or glow effects.

---

## 15. BUTTONS

### Primary Button
- **Background:** TRG Red `#D71920`
- **Text:** Pure White `#FFFFFF`
- **Height:** 44px–48px
- **Border Radius:** 8px
- **Padding:** Horizontal 18px–20px
- **Typography:** Geist Sans, 14px, Weight 600

### Secondary Button
- **Background:** Pure White `#FFFFFF` or Transparent
- **Border:** `1px solid #171A1F` or `#D1D4D8`
- **Text:** Carbon `#0B0D10`

### Tertiary / Link Action
- **Style:** Text + directional arrow (`Explore its DNA →`)
- **Text:** Carbon `#0B0D10` or TRG Red `#D71920` on hover

---

## 16. ICONOGRAPHY

- **Icon Set:** Lucide Icons (`lucide-react`) strictly.
- **Sizes:** `16px` (inline/badges), `18px` (standard UI buttons), `20px` (section headers), `24px` (feature icons max).
- **Stroke Width:** `1.5` to `1.75` for crisp technical precision.
- **Forbidden:** Oversized decorative icons, filled 3D icons, custom non-Lucide SVGs.

---

## 17. PHOTOGRAPHY

Authentic vehicle photography is a central asset of The Right Gear identity.

- **Preferred Angles:** 3/4 Front, Side Profile, 3/4 Rear, Cockpit/Interior, Engine Bay, Technical Details, Historical Racing Context.
- **Visual Style:** Authentic natural lighting, neutral environments, crisp detail.
- **Forbidden:** Heavy Instagram filters, oversaturated colors, fake HDR, dark vignettes, artificial color manipulation.
- **Compliance:** All public media must strictly preserve rights attribution and license records.

---

## 18. IMAGE RATIOS

- **Hero Banners:** `16:9` or `3:2`
- **Vehicle Cards:** `4:3`
- **Editorial Articles:** `3:2`
- **Portrait / Technical Detail:** `4:5`

Ratios must remain strictly uniform within any grid or list view.

---

## 19. TECHNICAL DATA PRESENTATION

Technical specifications must present information like a precision instruments display rather than a raw spreadsheet:

```text
POWER
238 HP
175 kW

ENGINE
2,467 cc
Inline-four

PRODUCTION
600
units
```

- **Category Label:** Geist Sans, ~12px, Uppercase, Tracking `+0.08em`, Color Slate 500 (`#6B7280`).
- **Main Numeric Value:** Geist Mono, ~24px–32px, Weight 500–600, Color Carbon (`#0B0D10`).
- **Sub-unit:** Geist Sans, ~14px, Color Slate 600 (`#5B616B`).

---

## 20. MOTION & TRANSITIONS

- **Micro-interactions (button hover, toggle):** `120ms`–`180ms`, `ease-out`
- **Standard UI transitions (dropdowns, tabs):** `180ms`–`240ms`, `ease-in-out`
- **Page / Content reveals:** `300ms`–`400ms`, `ease-out`
- **Reduced Motion:** Must respect `prefers-reduced-motion: reduce` by disabling non-essential transitions.

---

## 21. PUBLIC HEADER

### Desktop Structure (Height 72px–76px)
`[THE RIGHT GEAR]` &nbsp;&nbsp;&nbsp;&nbsp; `[GLOBAL SEARCH BAR]` &nbsp;&nbsp;&nbsp;&nbsp; `Explore | Market | Account`

- **Global Search:** Positioned prominently in the header center for rapid access.
- **Navigation Links:** Minimal public nav destinations.

### Mobile Structure (Height 64px)
`[THE RIGHT GEAR]` &nbsp;&nbsp;&nbsp;&nbsp; `[Search Button]` `[Compact Menu]`

---

## 22. MOBILE PRINCIPLES

- **No Horizontal Overflow:** Mobile pages must fit strictly within viewport width.
- **Touch Targets:** Minimum touch size `44px x 44px`.
- **No Hover Dependencies:** All actions must be accessible via direct tap.
- **Sticky Controls:** Variant pages feature compact sticky secondary navigation (`Overview`, `Specs`, `History`, `Market`, `DNA`).
- **List-First Views:** Complex Knowledge Graph relationships render as clear structured lists on mobile, with visual canvas graphs loaded strictly on explicit user request.

---

## 23. ACCESSIBILITY (WCAG 2.2 AA)

- **Contrast:** Minimum `4.5:1` contrast ratio for all body text against its canvas.
- **Keyboard Navigation:** Visible focus rings (`ring-2 ring-red-600`) for interactive elements.
- **Semantic HTML:** Strict use of `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<footer>`, `<dl>`, `<dt>`, `<dd>`.

---

## 24. PERFORMANCE

- **LCP (Largest Contentful Paint):** `≤ 2.5s`
- **INP (Interaction to Next Paint):** `≤ 200ms`
- **CLS (Cumulative Layout Shift):** `≤ 0.10`
- **Asset Optimization:** Lazy-load below-the-fold images and heavy graph visualizers (D3/Recharts). Never lazy-load the primary hero image.

---

## 25. PRINT & PRESENTATIONS

- **Print Document Format:** A4 Portrait (`210mm x 297mm`), margins `18mm–20mm`.
- **Presentation Format:** 16:9 Widescreen slides, 1 clear message per slide.

---

## 26. CANONICAL DESIGN TOKENS (CSS)

```css
:root {
  /* Brand Colors */
  --trg-carbon: #0B0D10;
  --trg-graphite: #171A1F;
  --trg-red: #D71920;
  --trg-red-dark-ui: #E63B44;

  /* Neutrals */
  --trg-white: #FFFFFF;
  --trg-warm-white: #F7F7F5;

  --trg-gray-100: #EEEEEC;
  --trg-gray-200: #E4E5E7;
  --trg-gray-300: #D1D4D8;
  --trg-gray-400: #A3A8B0;
  --trg-gray-500: #6B7280;
  --trg-gray-700: #41464F;

  /* Border Radii */
  --trg-radius-sm: 6px;
  --trg-radius-md: 8px;
  --trg-radius-lg: 12px;

  /* Layout Max Widths */
  --trg-content-max: 1280px;
  --trg-reading-max: 720px;
}
```

---

## 27. BRAND GOVERNANCE

This file (`/docs/VISUAL_BRAND_GUIDE.md`, Version `0.1.0`) is the canonical source of truth for all visual presentation decisions across The Right Gear.

Do **NOT** alter core brand colors, typography rules, or spacing principles inside individual components without updating this master guide and incrementing its version number.

## OFFICIAL LOGO MASTER
- **Path**: \`public/brand/the-right-gear-logo-master.png\`
- **Expected SHA256**: \`b044d4ba77c03e503fbb2545411ba4fe8157f0d082ec63191560f98e1e5d65af\`
- **Expected Dimensions**: \`1184 × 159\`
- **Constraint**: The master is immutable.
- **Constraint**: Production builds must fail if its integrity check fails.

## Maker Logo Asset Policy

- **Wikimedia-first policy**: The primary automatic source for all Maker logos is the Wikimedia ecosystem.
- **Wikidata entity resolution**: Maker logo resolution must begin with resolving the correct Maker identity via Wikidata. No brand-name string matching fallbacks.
- **P154 logo image**: When a Wikidata entity is resolved, use property P154 (logo image) to find the primary brand asset.
- **Wikimedia Commons media acquisition**: The referenced P154 media file must be retrieved from Wikimedia Commons. SVG format must be preserved when available.
- **Official Maker source as secondary fallback**: If Wikimedia resolution fails or returns an invalid asset, an official Maker-provided source acts as the secondary automated fallback provider.
- **Automatic workflow**: Resolving Maker logos is fully automated.
- **No normal manual editorial logo management**: Editorial staff must NOT manually search, upload, or manage normal Maker logos on a brand-by-brand basis. Human intervention is reserved strictly for exceptional corrections.
- **No permanent external hotlinking**: External assets are acquired, validated, and cached inside The Right Gear's controlled asset storage. UI consumers must use the internal TRG asset URL.
- **Controlled TRG asset URL**: The final state of a resolved logo is a stable, controlled internal asset URL.
- **Safe no-logo fallback**: If all providers fail to produce a valid asset (asset_status = UNAVAILABLE), the system fails safely and the UI renders a clean text-only identity. No broken image icons or placeholder graphics.
- **One shared Maker asset source**: The resolved logo asset serves as the single source of truth for all UI consumers across the application (Maker pages, Search, directories, cards, etc.). No component-specific logo logic.

## Global UI Surface & Typography Contract
- White is the universal primary public UI surface.
- Hierarchy comes from typography, spacing, alignment, borders and dividers.
- Gray backgrounds are not the normal separation mechanism.
- Meaningful text uses readable Carbon / Graphite tones.
- Light gray is reserved mainly for borders, dividers, disabled states and
  decorative details.
- Knowledge-page typography remains compact.
- TRG Red is a selective accent.

If an element can be separated using spacing, typography or a divider, do not give it a different background.
