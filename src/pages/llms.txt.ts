import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const text = `# FaceShapeAtlas

> FaceShapeAtlas is a free, browser-based face shape detector with guides to facial proportions, hairstyles, and glasses for six common facial outlines.

The detector accepts a front-facing photo or a camera capture. It uses MediaPipe landmarks and geometric rules to compare the visible outline with oval, round, square, heart, diamond, and oblong shapes. Match scores describe resemblance to those outlines. Photo angle, lighting, and visibility can affect results.

Photo analysis and report generation run on the user's device. The site serves the model and other static files. It has no photo upload endpoint or account requirement. Users can also compare outlines without a photo using the manual guide.

## Tools and guides

- [Home](${url('/')}): Start a photo check and compare the six outlines.
- [Face shape detector](${url('/face-shape-detector/')}): Analyze a photo, inspect the proportions, and get hairstyle and glasses ideas.
- [What is my face shape?](${url('/what-is-my-face-shape/')}): Compare visible features with a mirror or a photo.
- [Face shape guide](${url('/face-shape-guide/')}): Compare the six outlines side by side.
- [Facial proportions](${url('/face-proportions/')}): Understand how face length, cheekbones, temples, and jaw are compared.
- [Hairstyles for face shapes](${url('/hairstyles-for-face-shapes/')}): Browse cuts, layers, and parting ideas.
- [Glasses for face shapes](${url('/glasses-for-face-shapes/')}): Compare frame styles and learn how to check fit and size.

## Individual face shapes

- [Heart](${url('/heart-face-shape/')}): A wider upper outline with a jaw that tapers toward the chin.
- [Oval](${url('/oval-face-shape/')}): A moderately longer outline with a gradual taper.
- [Round](${url('/round-face-shape/')}): Similar visible length and width with a curved lower outline.
- [Square](${url('/square-face-shape/')}): Relatively similar widths and a more defined jaw turn.
- [Diamond](${url('/diamond-face-shape/')}): Cheekbones wider than the temples and jaw.
- [Oblong](${url('/oblong-face-shape/')}): An outline with more visible length relative to width.

## Optional

- [Methodology](${url('/about/')}): Landmark measurements, classification rules, and limitations.
- [Privacy](${url('/privacy/')}): Local analysis, camera permissions, memory, and reports.
- [Questions and answers](${url('/faq/')}): Photo quality, accuracy, and report downloads.
- [Sitemap index](${url('/sitemap-index.xml')}): Public page inventory.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
