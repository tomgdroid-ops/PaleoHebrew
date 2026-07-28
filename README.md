This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## The homepage

`src/app/page.tsx` is a five-act reading of Romans 8:1 — darkness, the weight of
accusation, the word that turns it, the welcome, the morning. It has its own
stylesheet (`src/app/romans.css`) and does not share the interior pages' design
system.

Two things are worth knowing before editing it:

**Light fields, then plates.** Every backdrop is a layered gradient study built
in CSS (`.lf-void`, `.lf-chamber`, `.lf-wash`, `.lf-morning`). The page is
complete and cinematic with no images at all. A *plate* is an optional
photograph that layers on top of a light field, underneath the same grade and
grain, so the visual language holds either way. `src/lib/plates.ts` lists the
five frames and resolves each to `null` until its file exists in
`public/images/romans/`, so a missing plate is never a broken image.

To add them:

```bash
npm run fetch:plates   # downloads from the URLs in src/lib/plates.ts
npm run build
```

**One custom property drives Act III.** `PivotStage` writes scroll progress to
`--p` (0 → 1) on the pinned section; every transformation on that screen is
derived from it in CSS. There is no per-element JavaScript, the listener only
exists while the section is on screen, and under `prefers-reduced-motion` the
scene resolves to its finished state and gives back the scroll length it was
borrowing.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
