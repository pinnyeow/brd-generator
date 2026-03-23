# Style Guide — ABIX BRD Generator

## 1. Design Philosophy
Dark, focused, and intelligence-forward. The interface recedes so the AI output takes centre stage. Depth is created through layered dark surfaces, not colour. Orange accents (Amazon brand) signal where to act; everything else stays quiet.

## 2. Target User + Jobs-to-be-Done
**User:** Product managers launching Amazon Business into new countries.
**JTBD:**
- Upload inputs and get a review-ready BRD draft with minimal friction
- Trust that the tool is smart and professional
- Focus on the output, not the UI

## 3. Layout & Spacing
- **Layout pattern:** Fixed left panel (420px) + flex right panel (full remaining width)
- **Spacing scale:** 4px base — use 4, 8, 12, 16, 24, 28, 32, 48px
- **Panel padding:** 28px horizontal, 24–28px vertical
- **Section gap:** 28px between input sections in left panel
- **Right panel body:** 40px vertical, 48px horizontal padding

## 4. Typography
- **Font family:** `"Inter", system-ui, sans-serif`
- **Panel title (h1):** 18px / Bold
- **Section labels:** 11px / Bold / ALL CAPS / letter-spacing 0.08em / muted color
- **Input labels:** 13px / Medium
- **Body / descriptions:** 12–13px / Regular / line-height 1.5–1.6
- **Small / meta:** 11–12px / Regular / secondary or muted color
- **BRD output headings:** rendered via react-markdown prose (h1: xl, h2: lg, h3: base)

## 5. Colors

### Dark mode (default)
| Role | Color | Value |
|---|---|---|
| Page background | Deep black | `#141414` |
| Panel background | Dark gray | `#1C1C1C` |
| Card / surface | Elevated dark | `#252525` |
| Card hover | Slightly lighter | `#2E2E2E` |
| Input background | Deep input | `#1E1E1E` |
| Border (layout) | Subtle dark | `#2A2A2A` |
| Border (input) | Slightly lighter | `#333333` |
| Border (field) | Field border | `#3A3A3A` |
| Text primary | White | `#F5F5F5` |
| Text secondary | Muted gray | `#8A8A8A` |
| Text muted | Dim gray | `#555555` |
| Text label | Light gray | `#C0C0C0` |
| Text description | Dark gray | `#666666` |
| Placeholder | Dark placeholder | `#555555` |
| Accent / primary | Amazon orange | `#FF9900` |
| Accent hover | Darker orange | `#E88A00` |
| Success | Emerald | `#10B981` |
| Error | Red | `#EF4444` |
| Warning | Amber | `#F59E0B` |

### Light mode
| Role | Value |
|---|---|
| Page background | `#F3F4F6` |
| Panel background | `#FFFFFF` |
| Surface | `#FFFFFF` |
| Surface hover | `#F5F5F5` |
| Border (layout) | `#E5E5E5` |
| Border (input/field) | `#D5D5D5` |
| Text primary | `#111111` |
| Text secondary | `#555555` |
| Text muted | `#999999` |
| Placeholder | `#AAAAAA` |

### Input section icon colors
| Input | Icon color | Background tint |
|---|---|---|
| Previous BRD (Required) | `#FF9900` orange | `rgba(255,153,0,0.15)` |
| AB Screenshots | `#F472B6` pink | `rgba(236,72,153,0.15)` |
| B2C Screenshots | `#34D399` teal | `rgba(16,185,129,0.15)` |
| Tax / TRD | `#FBBF24` amber | `rgba(245,158,11,0.15)` |

## 6. Components

### Buttons
- **Primary (Generate BRD):** `linear-gradient(135deg, #FF9900, #E88A00)`, text `#111`, font-weight 600, border-radius 10px, padding 12px, full width
- **Secondary (toolbar):** Background `#252525`, border `#333`, text `#F5F5F5`, border-radius 7px, padding 6px 14px, 12px font
- **File choose button:** Background `#252525`, border `#3A3A3A`, text `#FF9900`, border-radius 7px — hover darkens border to `#FF9900`
- **Hover:** Primary lifts slightly (`translateY(-1px)`) and fades opacity 0.9; secondary lightens to `#2E2E2E`
- **Disabled:** Primary at 50% opacity

### Inputs / Textarea
- Background: `#252525` (select/text) or `#1E1E1E` (textarea)
- Border: 1px solid `#333` or `#3A3A3A`, border-radius 8px
- Text: `#F5F5F5`, placeholder `#555`
- Focus: border `#FF9900`, box-shadow `0 0 0 2px rgba(255,153,0,0.25)`
- Font size: 13px

### Input Sections (left panel)
- Header: 36×36px icon with rounded square background + ALL CAPS label (12px, bold, 0.06em tracking) + Required/Optional tag
- Required tag: `rgba(255,153,0,0.15)` bg, `#FF9900` text
- Optional tag: `rgba(255,255,255,0.06)` bg, `#666` text
- Description: 12px, `#666`, line-height 1.5
- Sections separated by 1px `#2A2A2A` horizontal rule

### Warning Banner (missing optionals)
- Background: `rgba(245,158,11,0.08)`, border `rgba(245,158,11,0.2)`, border-radius 8px
- Title: 12px semibold amber
- Items: 12px amber, label bolded
- Appears above Generate button when any optional input is missing

### Output Header (context bar)
- Background: `#FF9900`, text `#000`, 14px semibold, sticky top-0, z-20
- Shows: `{country} — Baseline: {baseline}`

### Toolbar (output panel)
- Background: `#1C1C1C`, border-bottom `#2A2A2A`, sticky `top-[42px]`, z-10
- Left: status text in `#8A8A8A`
- Right: Copy + Download .md buttons (secondary style)

### Checklist (empty state)
- Container: border `#2A2A2A`, border-radius 12px, background `#1C1C1C`
- Items separated by 1px `#2A2A2A` divider
- Icon: 32×32px rounded square with tinted background
- Title: 13px semibold `#C0C0C0` + inline tag
- Description: 12px `#555`

### Loading Spinner
- Animated spin, 8×8, border-2 `#FF9900`, border-t transparent, rounded-full
- Text: `#8A8A8A`, 14px

### Scrollbar
- Width: 6px, track transparent, thumb `#2E2E2E`, border-radius 3px

## 7. Content Style
- **Tone:** Calm, capable, slightly technical. Smart colleague, not a chatbot.
- **Labels:** Short and action-forward. "Generate BRD", "Choose File", "Download .md"
- **Section headers:** ALL CAPS, small, muted — organise, don't shout
- **Tags:** "Required" (orange), "Optional" (gray) — always short
- **Error messages:** Factual. "Previous BRD is required to generate a BRD." — no apologies.
- **Empty state copy:** Explain what happens, not just what's missing

## 8. Accessibility
- **Focus states:** Orange ring — `2px solid #FF9900`, offset via box-shadow
- **Contrast:** Secondary text `#8A8A8A` on `#252525` passes WCAG AA
- **Disabled states:** 50% opacity on primary button
- **File inputs:** Native browser input, styled via Tailwind `file:` prefix classes
- **Light/dark toggle:** Supported via `body.light` class override of CSS variables

## 9. Do / Don't

| Do | Don't |
|---|---|
| Use `#FF9900` orange exclusively for primary actions, focus states, and Required tags | Use purple or any other accent colour |
| Use layered dark surfaces (`#141414` → `#1C1C1C` → `#252525`) to create depth | Use pure black `#000` as the only dark shade |
| Keep section labels short and ALL CAPS | Write long sidebar labels or use title case |
| Show a warning banner for missing optional inputs — don't block submission | Block form submission for optional inputs |
| Use per-input icon colours (orange, pink, teal, amber) to visually distinguish the 4 inputs | Use a single colour for all input icons |
| Let the right panel breathe with generous padding (40px / 48px) | Cram output content to the edges |
