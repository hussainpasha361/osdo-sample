# OSDO, Ovais & Shahzad Design Office: website frontend

Frontend for OSDO's website, designed and built by AXERO Design. Frontend only: no
backend, CMS or database. Not deployed.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 (tokens in
`src/app/globals.css`), GSAP + ScrollTrigger, Lenis (desktop wheel smoothing only).

```bash
cd osdo
npm install
npm run dev         # http://localhost:3001
npm run typecheck
npm run build && npm start
```

Press **G** anywhere (outside form fields) to show the 12-column grid.

## Pages

| Route | What it is |
|---|---|
| `/` | Hero (drawing → photograph), Completed Projects, Inside OSDO, From plan to space (scroll animation), contact band |
| `/work` | Completed Projects, then Concepts & Design Studies, each with gallery and index views |
| `/work/[slug]` | Project template, statically generated for every project |
| `/studio` | Inside OSDO, extended |
| `/approach` | Design approach sequence |
| `/contact` | Contact details and enquiry form (preview only, sends nothing) |

## Where content lives

All content is in `src/content/`. Components only read from it.

| File | Holds |
|---|---|
| `site.ts` | Name, contact details, Instagram, location, credit. Unconfirmed values are `null` and show as "To be confirmed". |
| `projects.ts` | All projects. `group: "completed"` or `"study"` decides the section. |
| `studio.ts` | Office film and photographs for Inside OSDO |
| `films.ts` | Reels for the "On film" section. An entry without `src` shows as a labelled placeholder. |
| `hero.ts` | Hero photographs and their traced drawings (lead image plus three panes) |
| `approach.ts` | Title and project link for the "From plan to space" animation (`components/home/PlanToSpace.tsx`, an illustrative scroll-driven drawing) |
| `hero.ts` + `drawings/` | Hero photograph and the line drawing registered to it |
| `types.ts` | The content model: `Media`, `Project`, `ProjectBlock`, `Drawing` |

### Media status

Every media item carries a `status`:

- `placeholder`: a generated plate with a printed label. It is never presented as OSDO work.
- `temporary`: stand-in imagery that is not OSDO work. None is used at the moment.
- `provisional`: genuine OSDO material awaiting a better original. The office photos and reel are taken from Instagram screenshots.
- `final`: approved.

### Current projects (from the master asset package)

Package metadata is kept in `assets/source-metadata/`. Media is in `public/media/projects/<slug>/`.

| Project | Section | Notes shown on the site |
|---|---|---|
| KAALIYAS. Steakhouse | Completed, **flagship** | "AI-enhanced imagery". `entrance-alternate` and `facade-warm` are left out as near-duplicates (the package marks them optional). |
| Bella Pizzeria | Completed | Supplied caption only. The reel is a cropped screen recording and plays only on request. |
| Residential Transformation | Completed | "Working title". Plans side by side, then separate labelled Before and After chapters, with no comparison slider because camera angles differ. Source images are 709 px wide and never shown full-bleed. |
| Academy of Salon Science by Peng | Concepts & Design Studies | "Completion to be confirmed", "Design visualisations". Moves to Completed by changing `group` once OSDO confirms it is built. |
| Creative Workspace | Concepts & Design Studies | "Working title", "Sample render, not built work". |

No dates, areas, clients or credits are shown, because none were supplied.

### Adding a real project

1. Put the processed images in `public/media/projects/<slug>/`.
2. In `projects.ts`, add an entry with `title`, `cover` and `media` (`kind: "image"`, real
   `width`/`height`, descriptive `alt`, `status: "final"`). Add `category`, `location`,
   `year`, `area`, `credits` and `summary` only when OSDO confirms them.
3. Set `group`, and `featured: true` to show it on the homepage. Use `status` and `mediaNote`
   for anything a visitor must know, such as unconfirmed completion or AI-enhanced or rendered imagery.
   Give plans `role: "plan"` (and `paper`), and before/after photos `role` plus `label`. For a
   before-and-after story, fill `transformation` instead of relying on the automatic layout.

Project pages compose their own layout from image orientations (`src/lib/compose.ts`).
Plans gather on one paper sheet and are never cropped. Portraits pair up, and runs of three
portraits become trios. Landscapes alternate between inset and full-bleed, and only images at
least 1600 px wide go full-bleed. For a hand-made sequence, set `blocks` on the project instead.
Videos (`kind: "video"`, with a `poster`) load only when on screen.

### Replacing the hero

Set `hero.photo` to the chosen image and provide a `Drawing` traced in **that image's pixel
coordinates** (`lines`, optional `hidden`, `soft`, `grid`, `notes`). Path data exported
from CAD or Illustrator works when the artboard matches the photo size.

## Asset processing

- Original uploads go in `assets/originals/` and are never served.
- Processed web files go in `public/media/`. Next.js serves AVIF/WebP at responsive sizes.
- Instagram screenshots: crop out the interface and carousel counters, keep the original
  composition and colours, sharpen lightly (unsharp mask, about 35%), save at JPEG quality
  88 or better. The architecture itself is never edited.
- Done so far: four office photos (counter and scrollbar cropped out) and the office reel
  (title cards, Instagram overlays and avatar cropped out, 22 s, muted, H.264). The reel is
  only 332 px wide, so it needs replacing with the original footage.

## Brand notes

- Colours: ivory `#EAE6DB` (dominant), olive `#596344`, burnt orange `#C36D38`, charcoal
  `#252622`, timber `#A47749`, stone `#B9AD97`. For small orange text on ivory use
  `orange-ink` `#9A4F25`, which passes AA contrast.
- Type: Funnel Display for headlines, Funnel Sans for text, Geist Mono for numbers and
  drawing notes only.
- The mark in `components/brand/Logo.tsx` is rebuilt from the Instagram profile image.
  Swap in the official vector when OSDO supplies one.

## Accessibility and motion

Skip link, visible focus, one `h1` per page, a focus-trapped menu that closes on Escape,
keyboard-operable view toggles, and an accessible form with inline errors. With
`prefers-reduced-motion`, or without JavaScript, all content renders in its final state.
The hero's Drawing/Photograph toggle replaces the hover lens for touch and keyboard users.
