# 🌳 GreenRoots — Verified Trees, Trusted Plant Knowledge

**HACKDAY 1.0 · Tech for a Better Tomorrow**

One codebase (Expo Router + React Native), two products: an Android/web app for
verifying real tree survival, and a bilingual-ready plant & home-remedy
knowledge platform that's honest about evidence instead of viral.

> "10,000 trees planted" proves nothing. **"7,842 trees verified alive after
> 12 months"** does. GreenRoots applies the same standard of honesty to plant
> and health knowledge — separating tradition from evidence, every time.

---

## The problem

1. **Plantation drives report activity, not outcomes.** Trees get planted,
   photographed once, and never checked again. Nobody knows what's actually
   alive a year later.
2. **Plant and home-remedy knowledge spreads with no evidence label.**
   Short videos and forwarded messages present traditional knowledge as
   guaranteed cures, with no allergy, medicine-interaction, pregnancy, or
   child-safety warnings attached.

GreenRoots treats both as the same failure — confident claims, no
verification — and fixes both with the same tool.

## What's built (working prototype)

| Module | Status |
|---|---|
| Verified tree registry + digital ID (QR, GPS, photos) | ✅ |
| Before/after photo comparison + simulated AI observation | ✅ |
| Volunteer verification flow (photo → GPS → status → notes) | ✅ |
| Org impact dashboard (survival rate, species/monthly charts) | ✅ |
| Illustrated plantation map with status-coloured pins | ✅ |
| Plant Knowledge Library — 15 real, evidence-labelled profiles | ✅ |
| Plant detail pages (traditional use, care, safety, evidence) | ✅ |
| Evidence framework guide (Traditional → Preclinical → Human → Clinical) | ✅ |
| AI Plant & Health Assistant (Gemini-backed, safe rule-based fallback) | ✅ |
| Rule-based Safety Checker (allergy / interaction / pregnancy / child) | ✅ |
| Health Video Education flow — bilingual (EN/HI), simulated AI pipeline, emergency short-circuit | ✅ |
| Community plant-knowledge submissions + review states | ✅ |
| Admin/reviewer dashboard (approve verifications, review submissions) | ✅ |
| User dashboard (saved plants, safety history, video history) | ✅ |
| Role-based demo access (Visitor / Volunteer / Admin), Supabase-ready auth | ✅ |

Everything above **runs with zero configuration** — Supabase and Gemini are
optional upgrades (see `.env.example`); without them the app runs on local
seed data, AsyncStorage persistence, and a safe rule-based assistant, so
judging never depends on live infrastructure.

## Tech stack

- **Expo Router + TypeScript** — one codebase, Android + Web (same pattern as
  our other production Expo apps)
- **NativeWind / Tailwind** — custom nature-inspired design system
- **Reanimated + Moti + Gesture Handler** — animations, before/after slider
- **Supabase** (optional) — auth, Postgres, storage
- **Gemini API** (optional) — AI assistant
- Custom SVG charts, illustrated map, and QR codes — no fragile third-party
  chart library

## ✅ Pre-submission checklist

- **No API keys required.** Supabase and Gemini are both fully optional
  (see `.env.example`) — leave `.env` unset and the app runs entirely on
  local seed data, on-device AsyncStorage, and a safe rule-based assistant.
  Nothing breaks, and no external service can go down mid-demo.
- **Every image slot is wired up** — logo, all 15 plant photos, 3
  before/after tree photo pairs, the landing hero image, and the
  verification-capture preview. No placeholders remain (`lib/imageRegistry.ts`).
- **App icon, splash screen, web favicon, and Android adaptive icon** all use
  the vanAushadhi logo.
- **Dashboard donut chart crash fixed** (was breaking on web).
- **Theme pinned to light mode app-wide** so it looks correct regardless of
  the judge's/tester's phone dark-mode setting.
- All internal `@/...` imports and every `require()`'d image path were
  checked and resolve correctly.
- Not independently run here (no network in this sandbox) — please run
  once yourself before submitting: `npm install --legacy-peer-deps && npx
  expo start --web` (or `npx tsc --noEmit` for a type check). This project's
  code was reviewed manually but not compiled end-to-end in this session.

## Getting started

```bash
npm install --legacy-peer-deps
npx expo start          # press w for web, or scan the QR for Android
```

No `.env` file is required to explore the full prototype. To connect real
infrastructure, copy `.env.example` to `.env` and fill in what you want.

> **Note on a react-native 0.86.3 upstream bug:** this exact react-native
> release ships several internal codegen spec files (`VirtualView`,
> `VirtualViewExperimental`, and a couple of deprecated components) written
> with the TypeScript utility types `Readonly<...>` / `ReadonlyArray<...>`
> instead of Flow's `$ReadOnly<...>` / `$ReadOnlyArray<...>`, which
> `@react-native/codegen`'s Flow parser can't resolve — it fails with errors
> like `Unable to determine event arguments for "onModeChange"` or `Unknown
> property type for "colors": "ReadonlyArray"`. `react-native-screens@4.26.2`
> has a related issue (`React.ComponentRef` instead of the codegen-recognized
> `React.ElementRef`). These aren't bugs in this app — they're patched
> automatically via `patch-package` (see `patches/`), which runs on every
> `npm install` through the `postinstall` script. If you ever see a similar
> `Unable to determine event arguments` / `Unknown property type` error after
> bumping a dependency, it means a new file hit the same upstream issue — find
> it in the Metro error path and add the same `Readonly` → `$ReadOnly` fix,
> then run `npx patch-package <package-name>` to refresh the patch.

## Demo script (matches the judging flow)

1. Landing page → problem framing → "Open the live impact dashboard"
2. **Dashboard** — 10,000 registered, 7,842 verified alive, 78.42% survival,
   species + monthly charts
3. **Map** — filter by project, tap a "Needs attention" pin
4. Tree preview → **Open digital ID** → before/after slider, QR code,
   verification timeline with AI-assisted observations
5. **Submit a new verification** — photo, GPS, status, notes → pending review
6. **Library** → open a plant (e.g. Neem) → traditional uses, evidence label,
   full Safety & Notes section
7. Tap **Evidence guide** icon → the Traditional → Clinical framework
8. **Safety Checker** for that plant — age, allergies, medicines, pregnancy
9. **Assistant** tab — ask "Is Aloe vera safe for everyone?"
10. **Health video education** (Profile → card, or header icon) — demo clip,
    consent, simulated pipeline, cautious summary, then the emergency example
11. **Community** — submit local plant knowledge → shows as "Pending review"
12. **Profile** → switch role to **Admin** → approve the verification and
    review the community submission

## Image Placement Guide

Every visual slot below renders a clean, on-brand placeholder until a real
file is registered. To add or swap one:

1. Save the image into `assets/images/`
2. Add one line to `lib/imageRegistry.ts`:
   ```ts
   "plant-tulsi-1": require("../assets/images/plant-tulsi-1.jpg"),
   ```
3. Reload — every screen using that key updates automatically.

**Currently wired up:** the logo (`logo-vanaushadhi`), all 15 plant-library
photos, 3 "before" sapling photos (`tree-sapling-1..3`), 3 "after" tree
photos (`tree-grown-1..3`), `hero-forest-canopy`, and
`verification-capture-preview`. Every image slot in the app now has a real
photo — no placeholders remain.

| Key | Used on | Suggested image | Suggested size |
|---|---|---|---|
| `logo-vanaushadhi` | Landing nav, in-app header, login screen | Brand logo | Square, transparent or light bg |
| `hero-forest-canopy` | Landing page hero | Lush tree canopy, or volunteers planting trees | 1200×800 landscape |
| `plant-<id>-1` (×15, see list below) | Library grid + plant detail | A clear photo of that specific plant/herb | 800×800 square |
| `tree-sapling-1` … `tree-sapling-3` | Tree "before" photos | Young saplings/small plants, varied angles | 800×600 |
| `tree-grown-1` … `tree-grown-3` | Tree "after"/latest + verification timeline | Mature trees, same varied angles | 800×600 |
| `verification-capture-preview` | Volunteer verification flow, after capturing a photo | Any tree/field photo (placeholder for the live camera capture) | 800×600 |

15 plant keys: `plant-tulsi-1`, `plant-neem-1`, `plant-aloevera-1`,
`plant-ginger-1`, `plant-turmeric-1`, `plant-mint-1`, `plant-amla-1`,
`plant-guava-1`, `plant-pomegranate-1`, `plant-garlic-1`,
`plant-cinnamon-1`, `plant-moringa-1`, `plant-lemon-1`,
`plant-curryleaves-1`, `plant-ashwagandha-1`.

> Tree photo rotation was reduced from 6 angles to 3 to match the 3
> before/after photo pairs supplied (`tree-sapling-1..3` and
> `tree-grown-1..3`).

## Ethical & safety guardrails (built in, not bolted on)

- Never diagnoses, prescribes, or claims a cure — enforced in the AI
  assistant's system prompt *and* its rule-based fallback
- Every plant profile separates **Traditional Knowledge** from **Evidence
  Level**, with dedicated allergy / medicine-interaction / pregnancy / child
  sections
- Emergency-symptom detection short-circuits both the chat assistant and the
  health-video flow with a direct "seek emergency care" message — no
  educational content is shown alongside it
- All AI-assisted tree comparisons are labelled "AI-assisted observation —
  human verification recommended," never presented as ground truth
- Safety Checker and Community submissions are explicitly labelled as
  prototype / pending-review — nothing is presented as confirmed medical
  advice without a human reviewer

## What we'd build next

1. **Real computer-vision comparison** — swap the simulated before/after
   observation for an actual image-similarity/canopy-growth model.
2. **Plant image identification** — point your camera at a plant, get a
   likely-species match against the Library.
3. **Offline-first sync** — queue verifications and community submissions
   locally so volunteers in low-connectivity plantation zones never lose data.
4. **Hindi/regional-language voice assistant** — voice in, voice out, for
   lower-literacy users in both the plant assistant and video-education flow.
5. **Expert review pipeline** — a dedicated botanist/clinician queue so
   "Evidence not reviewed" submissions can graduate to "Verified" with a
   named, credentialed reviewer attached.

---

Built for HACKDAY 1.0 · Tech for a Better Tomorrow.
