/**
 * Deterministic SVG generators for seed placeholder art.
 *
 * These produce blueprint-style 2D drawing thumbnails, brand marks, industry
 * hero panels, and avatars — all as self-contained SVG strings written to
 * /public/generated during seeding. No external image dependencies, and every
 * output is deterministic from its seed string (no Math.random) so re-seeding
 * is stable.
 *
 * SCOPE: everything here depicts flat 2D plan/schematic work only.
 */

const DISCIPLINE_INK: Record<string, string> = {
  electrical: "#f6b23d",
  hvac: "#38bdf8",
  plumbing: "#5b9bff",
  lighting: "#c084fc",
  "fire-protection": "#f87171",
};

// Small seeded PRNG (mulberry32) so layouts vary but stay reproducible.
function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function rng(seed: string) {
  let a = hashSeed(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ------------------------------------------------------------------ */
/* Discipline motifs — schematic content for the drawing area.         */
/* ------------------------------------------------------------------ */

function electricalMotif(r: () => number, ink: string): string {
  let s = "";
  // Panel + homerun feeders with circuit dots
  const panelY = 70 + Math.floor(r() * 30);
  s += `<rect x="60" y="${panelY}" width="46" height="120" fill="none" stroke="${ink}" stroke-width="2"/>`;
  for (let i = 0; i < 6; i++) {
    const y = panelY + 14 + i * 18;
    s += `<line x1="106" y1="${y}" x2="${180 + r() * 260}" y2="${y}" stroke="${ink}" stroke-width="1.4"/>`;
    s += `<circle cx="${180 + r() * 260}" cy="${y}" r="4" fill="none" stroke="${ink}" stroke-width="1.4"/>`;
  }
  // Receptacle + switch symbols scattered
  for (let i = 0; i < 5; i++) {
    const x = 220 + r() * 300;
    const y = 250 + r() * 120;
    s += `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${ink}" stroke-width="1.4"/><line x1="${x - 5}" y1="${y}" x2="${x + 5}" y2="${y}" stroke="${ink}" stroke-width="1.4"/>`;
  }
  return s;
}

function hvacMotif(r: () => number, ink: string): string {
  let s = "";
  // Supply trunk duct with branch runs and diffusers
  const y0 = 120 + r() * 40;
  s += `<rect x="70" y="${y0}" width="440" height="26" fill="none" stroke="${ink}" stroke-width="2"/>`;
  for (let i = 0; i < 5; i++) {
    const x = 120 + i * 82;
    s += `<rect x="${x}" y="${y0 + 26}" width="16" height="${60 + r() * 60}" fill="none" stroke="${ink}" stroke-width="1.4"/>`;
    s += `<rect x="${x - 8}" y="${y0 + 26 + (60 + r() * 60)}" width="32" height="14" fill="none" stroke="${ink}" stroke-width="1.4"/>`;
  }
  // RTU box
  s += `<rect x="380" y="${y0 - 70}" width="80" height="52" fill="none" stroke="${ink}" stroke-width="2"/><line x1="380" y1="${y0 - 44}" x2="460" y2="${y0 - 44}" stroke="${ink}" stroke-width="1.2"/>`;
  return s;
}

function plumbingMotif(r: () => number, ink: string): string {
  let s = "";
  // Vertical riser + horizontal branches with fixture circles
  const x0 = 90;
  s += `<line x1="${x0}" y1="70" x2="${x0}" y2="360" stroke="${ink}" stroke-width="2.4"/>`;
  for (let i = 0; i < 5; i++) {
    const y = 100 + i * 55;
    const len = 120 + r() * 260;
    s += `<line x1="${x0}" y1="${y}" x2="${x0 + len}" y2="${y}" stroke="${ink}" stroke-width="1.6"/>`;
    s += `<circle cx="${x0 + len}" cy="${y}" r="10" fill="none" stroke="${ink}" stroke-width="1.6"/><line x1="${x0 + len - 6}" y1="${y - 6}" x2="${x0 + len + 6}" y2="${y + 6}" stroke="${ink}" stroke-width="1.2"/>`;
  }
  return s;
}

function lightingMotif(r: () => number, ink: string): string {
  let s = "";
  // Grid of luminaire symbols (2x4 troffers) with circuiting
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 90 + col * 72;
      const y = 90 + row * 66;
      s += `<rect x="${x}" y="${y}" width="44" height="22" fill="none" stroke="${ink}" stroke-width="1.4"/><line x1="${x}" y1="${y + 11}" x2="${x + 44}" y2="${y + 11}" stroke="${ink}" stroke-width="1"/>`;
    }
  }
  // Photometric contour hint
  s += `<circle cx="300" cy="220" r="${60 + r() * 20}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="4 4" opacity="0.7"/>`;
  s += `<circle cx="300" cy="220" r="${110 + r() * 20}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;
  return s;
}

function fireMotif(r: () => number, ink: string): string {
  let s = "";
  // Sprinkler main + branch lines with heads on a grid
  const y0 = 100;
  s += `<line x1="80" y1="${y0}" x2="80" y2="360" stroke="${ink}" stroke-width="2.4"/>`;
  for (let row = 0; row < 5; row++) {
    const y = y0 + row * 52;
    s += `<line x1="80" y1="${y}" x2="520" y2="${y}" stroke="${ink}" stroke-width="1.4"/>`;
    for (let c = 0; c < 6; c++) {
      const x = 140 + c * 66;
      s += `<circle cx="${x}" cy="${y}" r="4.5" fill="none" stroke="${ink}" stroke-width="1.4"/><line x1="${x - 6}" y1="${y - 6}" x2="${x + 6}" y2="${y + 6}" stroke="${ink}" stroke-width="1"/><line x1="${x - 6}" y1="${y + 6}" x2="${x + 6}" y2="${y - 6}" stroke="${ink}" stroke-width="1"/>`;
    }
  }
  return s;
}

const MOTIFS: Record<string, (r: () => number, ink: string) => string> = {
  electrical: electricalMotif,
  hvac: hvacMotif,
  plumbing: plumbingMotif,
  lighting: lightingMotif,
  "fire-protection": fireMotif,
};

/* ------------------------------------------------------------------ */
/* Blueprint drawing thumbnail                                         */
/* ------------------------------------------------------------------ */

export function blueprintSvg(opts: {
  seed: string;
  title: string;
  discipline: string; // primary discipline slug
  sheet?: string;
  label?: string; // e.g. "E-101"
  dark?: boolean;
}): string {
  const r = rng(opts.seed);
  const ink = DISCIPLINE_INK[opts.discipline] ?? "#8fb3ff";
  const bg = opts.dark ? "#050c1a" : "#0a1f44";
  const bg2 = opts.dark ? "#0a1424" : "#0c2450";
  const motif = (MOTIFS[opts.discipline] ?? electricalMotif)(r, ink);
  const sheet = opts.label ?? opts.sheet ?? "S-100";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400" role="img" aria-label="${esc(opts.title)} drawing">
  <defs>
    <linearGradient id="bp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="400" fill="url(#bp)"/>
  <rect width="600" height="400" fill="url(#grid)"/>
  <rect x="16" y="16" width="568" height="368" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <rect x="24" y="24" width="552" height="352" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  <g opacity="0.92">${motif}</g>
  <!-- title block -->
  <g>
    <rect x="360" y="330" width="216" height="46" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <line x1="360" y1="352" x2="576" y2="352" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
    <line x1="480" y1="330" x2="480" y2="376" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
    <text x="368" y="345" fill="#e6edf7" font-family="monospace" font-size="10" letter-spacing="1">DRAFTING STUDIO</text>
    <text x="368" y="368" fill="${ink}" font-family="monospace" font-size="11">${esc(sheet)}</text>
    <text x="488" y="345" fill="#aebfda" font-family="monospace" font-size="8">SCALE 1/8"=1'</text>
    <text x="488" y="368" fill="#aebfda" font-family="monospace" font-size="8">2D / AutoCAD</text>
  </g>
  <text x="32" y="46" fill="#dbe6f5" font-family="monospace" font-size="13" letter-spacing="0.5">${esc(opts.title.slice(0, 46).toUpperCase())}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Industry hero panel                                                 */
/* ------------------------------------------------------------------ */

export function heroSvg(opts: { seed: string; label: string }): string {
  const r = rng(opts.seed);
  let lines = "";
  for (let i = 0; i < 22; i++) {
    const y = 20 + i * 18;
    lines += `<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="rgba(255,255,255,${0.03 + r() * 0.03})" stroke-width="1"/>`;
  }
  let shapes = "";
  for (let i = 0; i < 6; i++) {
    const x = 80 + r() * 1000;
    const y = 60 + r() * 260;
    const w = 60 + r() * 160;
    const h = 40 + r() * 120;
    shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgba(120,170,255,${0.25 + r() * 0.3})" stroke-width="1.5"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
  <rect width="1200" height="400" fill="#0a1f44"/>
  <rect width="1200" height="400" fill="#0c2450" opacity="0.5"/>
  ${lines}${shapes}
  <text x="60" y="360" fill="rgba(255,255,255,0.12)" font-family="monospace" font-size="120" font-weight="700">${esc(opts.label.toUpperCase())}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Blog cover                                                          */
/* ------------------------------------------------------------------ */

export function blogCoverSvg(opts: { seed: string; discipline?: string; kicker: string }): string {
  const r = rng(opts.seed);
  const ink = opts.discipline ? DISCIPLINE_INK[opts.discipline] ?? "#8fb3ff" : "#f59e0b";
  const motif = (MOTIFS[opts.discipline ?? ""] ?? lightingMotif)(r, ink);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1f44"/><stop offset="1" stop-color="#081936"/></linearGradient>
    <pattern id="g2" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <g transform="translate(300,120) scale(1.4)" opacity="0.5">${motif}</g>
  <text x="70" y="120" fill="${ink}" font-family="monospace" font-size="22" letter-spacing="3">${esc(opts.kicker.toUpperCase())}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Brand mark + client logos + avatars                                 */
/* ------------------------------------------------------------------ */

export function logoMarkSvg(color = "#0a1f44", accent = "#f59e0b"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <rect x="2" y="2" width="36" height="36" rx="8" fill="${color}"/>
  <path d="M11 28 L11 12 L20 12 A8 8 0 0 1 20 28 Z" fill="none" stroke="#ffffff" stroke-width="2.4"/>
  <line x1="26" y1="12" x2="30" y2="12" stroke="${accent}" stroke-width="2.4"/>
  <line x1="26" y1="28" x2="30" y2="28" stroke="${accent}" stroke-width="2.4"/>
  <line x1="28" y1="12" x2="28" y2="28" stroke="${accent}" stroke-width="2.4"/>
</svg>`;
}

export function clientLogoSvg(name: string): string {
  const r = rng(name);
  const hue = Math.floor(r() * 360);
  const short = name.length > 16 ? name.slice(0, 15) + "…" : name;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80">
  <rect width="220" height="80" fill="none"/>
  <circle cx="34" cy="40" r="16" fill="none" stroke="hsl(${hue} 45% 55%)" stroke-width="3"/>
  <circle cx="34" cy="40" r="7" fill="hsl(${hue} 45% 55%)"/>
  <text x="60" y="47" fill="currentColor" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700">${esc(short)}</text>
</svg>`;
}

export function avatarSvg(name: string): string {
  const r = rng(name);
  const hue = Math.floor(r() * 360);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 50% 45%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360} 55% 35%)"/></linearGradient></defs>
  <rect width="96" height="96" fill="url(#a)"/>
  <text x="48" y="58" fill="#fff" font-family="'Plus Jakarta Sans', sans-serif" font-size="36" font-weight="700" text-anchor="middle">${esc(initials)}</text>
</svg>`;
}
