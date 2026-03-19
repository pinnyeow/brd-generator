# AB BRD Generator — Project Plan

## Overall Goal

Every new Amazon Business (AB) country launch requires a PM to manually spend 1–2 weeks
reading dense documents, auditing existing marketplaces, and writing a BRD from scratch.
This project automates that synthesis step.

The PM provides 4 inputs. Claude runs a structured analysis pipeline.
The output is a complete, review-ready BRD draft in minutes — not weeks.

This is a locally-runnable Next.js web app. No cloud deployment, no external DB.
The PM reviews and owns the output before it goes anywhere.

---

## The 4 Inputs

| # | Input | Format | What Claude Does With It |
|---|-------|--------|--------------------------|
| 1 | Previous country BRD | PDF upload | Baseline for carry-forward features and parity diff |
| 2 | AB marketplace screenshots | PNG/JPG (multi) | Parity diff — what has the host team shipped since last launch |
| 3 | Local B2C marketplace screenshots | PNG/JPG (multi) | Feature gap analysis — country-specific buyer expectations |
| 4 | Tax / TRD document | Pasted text | Compliance extraction — acceptance criteria + team dependencies |

---

## Layout (Option A — Split Screen with Sticky Context Header)

```
┌─────────────────────────────────────────────────────────────────┐
│  AB BRD Generator                                               │
├─────────────────────┬───────────────────────────────────────────┤
│  INPUTS  (420px)    │  South Africa — Baseline: AU  ← sticky   │
│                     ├───────────────────────────────────────────┤
│  Country            │  [Copy]  [Download .md]       ← toolbar  │
│  [South Africa   ]  ├───────────────────────────────────────────┤
│  Baseline [AU ▼]    │                                           │
│                     │  # BRD: South Africa                      │
│  [1] Previous BRD   │  ## 1. Executive Summary                  │
│  [2] AB Screenshots │  ...                                      │
│  [3] B2C Screenshots│  ## 4. Feature Requirements               │
│  [4] Tax / TRD      │  ...                                      │
│                     │                                           │
│  [ Generate BRD ]   │                                           │
└─────────────────────┴───────────────────────────────────────────┘
```

The sticky blue header appears after Generate is clicked, showing:
`{Country} — Baseline: {Market}`

---

## High-Level Architecture

```
BROWSER (localhost:3000)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────────┐    ┌───────────────────────────────┐  │
│  │     LEFT PANEL       │    │        RIGHT PANEL            │  │
│  │     BrdForm.tsx      │    │        BrdOutput.tsx          │  │
│  │                      │    │                               │  │
│  │  Country name        │    │  [sticky] Country — Baseline  │  │
│  │  Baseline market     │    │  [toolbar] Copy / Download    │  │
│  │  [1] Previous BRD    │    │  Streamed markdown BRD        │  │
│  │      PDF upload      │    │  rendered via react-markdown  │  │
│  │  [2] AB screenshots  │    │                               │  │
│  │      multi-image     │    │                               │  │
│  │  [3] B2C screenshots │    │                               │  │
│  │      multi-image     │    │                               │  │
│  │  [4] Tax/TRD text    │    │                               │  │
│  │      textarea        │    │                               │  │
│  │                      │    │                               │  │
│  │  [Generate BRD]      │    │                               │  │
│  └──────────┬───────────┘    └───────────────────────────────┘  │
│             │  multipart/form-data POST                         │
└─────────────┼───────────────────────────────────────────────────┘
              │
              ▼
SERVER  (Next.js App Router)
┌─────────────────────────────────────────────────────────────────┐
│  app/api/generate-brd/route.ts                                  │
│                                                                 │
│  1. Parse FormData                                              │
│     ├── PDF → base64 document block                             │
│     ├── AB screenshots → base64 image blocks                    │
│     ├── B2C screenshots → base64 image blocks                   │
│     └── TRD text → text block                                   │
│                                                                 │
│  2. Build message for Claude                                    │
│     ├── System prompt: role + BRD template + output rules       │
│     └── User message: all 4 inputs as typed content blocks      │
│                                                                 │
│  3. Stream response from Claude API                             │
│     └── ReadableStream → browser                                │
└─────────────────────────────────────────────────────────────────┘
              │
              ▼
CLAUDE API  (claude-sonnet-4-6)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  PIPELINE                                                       │
│                                                                 │
│  Step 1 — Parity Diff                                           │
│  Previous BRD + AB screenshots                                  │
│       └──→ What changed since last launch?                      │
│                                                                 │
│  Step 2 — Feature Gap Analysis                                  │
│  AB screenshots + B2C screenshots                               │
│       └──→ What do local buyers expect that AB doesn't have?    │
│                                                                 │
│  Step 3 — Compliance Extraction                                 │
│  Tax / TRD document                                             │
│       └──→ Hard requirements + acceptance criteria              │
│                                                                 │
│  Step 4 — Triage Layer                                          │
│       ├── CARRY_FORWARD  → localize to new country              │
│       ├── PARITY_MATCH   → include, flag for AB integration     │
│       ├── COUNTRY_GAP    → include as new requirement           │
│       ├── NET_NEW        → include, flag for PM review          │
│       └── COMPLIANCE     → include with acceptance criteria     │
│                                                                 │
│  Step 5 — BRD Assembly                                          │
│       └──→ Populates standard 9-section BRD template            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
              │
              ▼
OUTPUT
┌─────────────────────────────────────────────────────────────────┐
│  Complete BRD Draft (Markdown)                                  │
│                                                                 │
│  1. Executive Summary                                           │
│  2. Problem Statement                                           │
│  3. Customer Segments & Use Cases                               │
│  4. Feature Requirements                                        │
│     4.1 Carry-Forward Features (localized)                      │
│     4.2 Parity Features (host team integration)                 │
│     4.3 Country-Specific Requirements (B2C gap)                 │
│     4.4 Compliance Requirements                                 │
│  5. Acceptance Criteria                                         │
│  6. Team Dependencies & Sign-offs                               │
│  7. Out of Scope                                                │
│  8. Open Questions                                              │
│  9. Triage Summary Table                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
claude-code-for-product-managers-course/
├── .env.local                          ← ANTHROPIC_API_KEY (never committed)
├── app/
│   ├── layout.tsx                      ← root layout + Tailwind
│   ├── page.tsx                        ← split-screen shell + brdContext state
│   └── api/
│       └── generate-brd/
│           └── route.ts                ← Claude API call (server-side only)
└── components/
    ├── BrdForm.tsx                     ← left panel: inputs + submit
    └── BrdOutput.tsx                   ← right panel: sticky header + streaming markdown + download
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Server-side API route keeps API key safe |
| Styling | Tailwind CSS v4 | Utility-first, no config needed |
| AI | `@anthropic-ai/sdk` | Native PDF + image support, streaming |
| Rendering | `react-markdown` + `@tailwindcss/typography` | Clean BRD display |
| Transport | `multipart/form-data` → streaming text | Handles large PDFs + images |

---

## Baseline Markets

AU, MX, IT, ES, FR, DE, GB, US, CA

---

## How to Run

```bash
cd "/Users/pinnyeow/Documents/AI Projects/claude-code-for-product-managers-course"

# 1. Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 2. Start the dev server
npm run dev

# 3. Open browser
open http://localhost:3000
```

---

## What This Is Not

- Not a replacement for PM judgment — always review before using
- Not connected to internal Amazon systems
- Not an automated scraper (no web crawling)
- Not a final BRD — it is a draft that the PM refines and owns

---

## Input Availability Model

You won't always have all 4 inputs ready — especially early in a launch when the TRD hasn't been drafted or the B2C audit hasn't been done yet. The generator is designed to work with whatever you have and be honest about what it couldn't do, rather than making things up.

| Inputs Provided | What You Get |
|----------------|--------------|
| Previous BRD only | Carry-forward features + BRD skeleton with flagged gaps |
| + AB Screenshots | Adds parity diff (what host team has shipped) |
| + B2C Screenshots | Adds country gap analysis (local buyer expectations) |
| + TRD | Adds compliance requirements + team sign-off list |

The minimum viable run is just the Previous BRD. As you gather more inputs over the course of launch prep, re-run to fill in the gaps.

---

## Updated Architecture (v2 — Adaptive Pipeline)

```
BROWSER (localhost:3000)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────────┐    ┌───────────────────────────────┐  │
│  │     BrdForm.tsx      │    │        BrdOutput.tsx          │  │
│  │                      │    │                               │  │
│  │  Country / Baseline  │    │  Empty state: input checklist │  │
│  │                      │    │  with Required/Optional tags  │  │
│  │  [1] Previous BRD    │    │                               │  │
│  │      REQUIRED ●      │    │  ── after Generate ──         │  │
│  │                      │    │                               │  │
│  │  [2] AB Screenshots  │    │  [sticky] Country — Baseline  │  │
│  │      optional ○      │    │  [toolbar] Copy / Download    │  │
│  │      ↓ if missing:   │    │                               │  │
│  │      amber warning   │    │  Streamed markdown BRD        │  │
│  │                      │    │  with [SKIPPED] placeholders  │  │
│  │  [3] B2C Screenshots │    │  for any missing inputs       │  │
│  │      optional ○      │    │                               │  │
│  │      ↓ if missing:   │    │                               │  │
│  │      amber warning   │    │                               │  │
│  │                      │    │                               │  │
│  │  [4] Tax / TRD       │    │                               │  │
│  │      optional ○      │    │                               │  │
│  │      ↓ if missing:   │    │                               │  │
│  │      amber warning   │    │                               │  │
│  │                      │    │                               │  │
│  │  ┌─ warning banner ─┐│    │                               │  │
│  │  │ Missing: X, Y, Z ││    │                               │  │
│  │  └──────────────────┘│    │                               │  │
│  │                      │    │                               │  │
│  │  [ Generate BRD ]    │    │                               │  │
│  └──────────┬───────────┘    └───────────────────────────────┘  │
│             │  multipart/form-data POST                         │
└─────────────┼───────────────────────────────────────────────────┘
              │
              ▼
SERVER  (Next.js App Router)
┌─────────────────────────────────────────────────────────────────┐
│  app/api/generate-brd/route.ts                                  │
│                                                                 │
│  1. Parse FormData                                              │
│     ├── previousBrd  → required, 400 if missing                 │
│     ├── abScreenshots → present? YES/NO → hasAbScreenshots      │
│     ├── b2cScreenshots → present? YES/NO → hasB2cScreenshots    │
│     └── trdContent → present? YES/NO → hasTrd                   │
│                                                                 │
│  2. buildSystemPrompt(hasAB, hasB2C, hasTrd)                    │
│     ├── if !hasAB  → Step 1 replaced with [SKIP instruction]    │
│     ├── if !hasB2C → Step 2 replaced with [SKIP instruction]    │
│     └── if !hasTrd → Step 3 replaced with [SKIP instruction]    │
│                                                                 │
│  3. Build user message content blocks                           │
│     ├── PDF → base64 document block (always)                    │
│     ├── AB images → image blocks  OR  [NOT PROVIDED] text       │
│     ├── B2C images → image blocks OR  [NOT PROVIDED] text       │
│     └── TRD → text block          OR  [NOT PROVIDED] text       │
│                                                                 │
│  4. Stream response from Claude API                             │
│     └── ReadableStream → browser                                │
└─────────────────────────────────────────────────────────────────┘
              │
              ▼
CLAUDE API  (claude-sonnet-4-6)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ADAPTIVE PIPELINE                                              │
│                                                                 │
│  Step 1 — Parity Diff                                           │
│  Previous BRD + AB screenshots                                  │
│       ├── AB screenshots present → run diff                     │
│       └── missing → output "[SKIPPED — upload AB screenshots]"  │
│                                                                 │
│  Step 2 — Feature Gap Analysis                                  │
│  AB screenshots + B2C screenshots                               │
│       ├── B2C screenshots present → run gap analysis            │
│       └── missing → output "[SKIPPED — upload B2C screenshots]" │
│                                                                 │
│  Step 3 — Compliance Extraction                                 │
│  Tax / TRD document                                             │
│       ├── TRD present → extract requirements                    │
│       └── missing → output "[SKIPPED — provide TRD]"           │
│                                                                 │
│  Step 4 — Triage Layer (always runs)                            │
│       ├── CARRY_FORWARD  → from previous BRD                    │
│       ├── PARITY_MATCH   → [NOT ASSESSED] if no AB shots        │
│       ├── COUNTRY_GAP    → [NOT ASSESSED] if no B2C shots       │
│       ├── NET_NEW        → from previous BRD                    │
│       └── COMPLIANCE     → [NOT ASSESSED] if no TRD             │
│                                                                 │
│  Step 5 — BRD Assembly (always runs)                            │
│       └── Sections without data get [SKIPPED] placeholders      │
│           + auto-generated open questions for PM to action       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
