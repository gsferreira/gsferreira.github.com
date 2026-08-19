import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vendored so the build does not depend on a system font. Netlify has no Inter.
const fonts = [
  { name: 'Inter', weight: 400, style: 'normal', data: fs.readFileSync(path.join(__dirname, 'fonts/Inter-Regular.ttf')) },
  { name: 'Inter', weight: 600, style: 'normal', data: fs.readFileSync(path.join(__dirname, 'fonts/Inter-SemiBold.ttf')) },
];

// Foundation palette only, per the Gui Ferreira sub-brand.
const SURFACE = '#F6F4F1';
const INK = '#1A1A1A';
const MUTED = '#484848';
const RULE = '#D1D1D1';

/** Stable, collision-free path for a page URL: "/blog/a-post/" -> "/og/blog-a-post.png" */
export function ogImagePath(url) {
  const slug = String(url).replace(/^\/|\/$/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  return `/og/${slug || 'index'}.png`;
}

function card({ title, eyebrow }) {
  // The brand H1 is 56px. Step down for long titles rather than clipping.
  const size = title.length > 110 ? 44 : title.length > 70 ? 52 : 64;
  const row = (children) => ({ type: 'div', props: { style: { display: 'flex', alignItems: 'center' }, children } });
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', backgroundColor: SURFACE,
        padding: '64px', fontFamily: 'Inter', // 64px is the brand outer margin
      },
      children: [
        { type: 'div', props: {
            style: { display: 'flex', fontSize: 20, fontWeight: 600, letterSpacing: '0.06em',
                     textTransform: 'uppercase', color: MUTED },
            children: eyebrow } },
        { type: 'div', props: {
            style: { display: 'flex', fontSize: size, lineHeight: 1.14, letterSpacing: '-0.02em',
                     fontWeight: 600, color: INK, maxWidth: '1000px' },
            children: title } },
        { type: 'div', props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              { type: 'div', props: { style: { display: 'flex', height: '2px', backgroundColor: RULE, marginBottom: '24px' } } },
              row([
                { type: 'div', props: { style: { display: 'flex', fontSize: 28, fontWeight: 600, color: INK }, children: 'Gui Ferreira' } },
                { type: 'div', props: { style: { display: 'flex', flexGrow: 1 } } },
                { type: 'div', props: { style: { display: 'flex', fontSize: 20, color: MUTED }, children: 'guiferreira.me' } },
              ]),
            ] } },
      ],
    },
  };
}

export async function renderOgImage({ title, eyebrow }) {
  const svg = await satori(card({ title, eyebrow }), { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
