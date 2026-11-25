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
| `/` | Hero (drawing → photograph), Completed Projects, Inside OSDO, Approach, contact band |
| `/work` | Full Completed Projects archive, in gallery and index views |
| `/work/[slug]` | Project template, statically generated for every project |
| `/studio` | Inside OSDO, extended |
| `/approach` | Design approach sequence |
| `/contact` | Contact details and enquiry form (preview only, sends nothing) |

## Where content lives

All content is in `src/content/`. Components only read from it.

| File | Holds |
|---|---|
| `site.ts` | Name, contact details, Instagram, location, credit. Unconfirmed values are `null` and show as "To be confirmed". |
| `projects.ts` | Completed projects (currently **6 development placeholders**) |
| `studio.ts` | Office film and photographs for Inside OSDO |
| `approach.ts` | Approach stages (placeholder names and media) |
| `hero.ts` + `drawings/` | Hero photograph and the line drawing registered to it |
| `types.ts` | The content model: `Media`, `Project`, `ProjectBlock`, `Drawing` |

### Media status

Every media item carries a `status`:

- `placeholder`: a generated plate with a printed label. It is never presented as OSDO work.
- `temporary`: stand-in imagery that is not OSDO work. None is used at the moment.
- `provisional`: genuine OSDO material awaiting a better original. The office photos and reel are taken from Instagram screenshots.
- `final`: approved.

### Adding a real project

1. Put the processed images in `public/media/projects/<slug>/`.
2. In `projects.ts`, add an entry with `title`, `cover` and `media` (`kind: "image"`, real
   `width`/`height`, descriptive `alt`, `status: "final"`). Add `category`, `location`,
   `year`, `area`, `credits` and `summary` only when OSDO confirms them.
3. Remove one placeholder. Set `featured: true` to show the project on the homepage.

Project pages compose their own layout from image orientations (`src/lib/compose.ts`):
portraits pair up, landscapes alternate between full-bleed and inset, and runs of three
portraits become trios. For a hand-made sequence, set `blocks` on the project instead.
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
