'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock, Mail, LayoutDashboard, ChevronRight } from 'lucide-react';

const DEFAULT_ROUTES: Record<string, string> = {
  finanzas: '/dashboard/finanzas',
  comercial: '/dashboard/comercial',
  marketing: '/dashboard/marketing',
  administrador: '/dashboard/finanzas',
};

const DEMO_USERS = [
  { label: 'Juan Díaz',       role: 'Finanzas',  email: 'juan@iencinas.cl',   password: '123456', color: '#3b82f6' },
  { label: 'María Rodríguez', role: 'Comercial', email: 'maria@iencinas.cl',  password: '123456', color: '#f97316' },
  { label: 'Carlos Cortés',   role: 'Marketing', email: 'carlos@iencinas.cl', password: '123456', color: '#a855f7' },
  { label: 'Ana Silva',       role: 'Admin',     email: 'ana@iencinas.cl',    password: '123456', color: '#22c55e' },
];

// Stars: [x%, y%, size-px, delay-s]
const STARS: number[][] = [
  [3,8,1,0],[8,22,1.5,1.2],[14,45,1,2.5],[19,78,2,0.7],[25,12,1,1.8],
  [31,58,1.5,0.3],[37,88,1,2.1],[42,32,2,0.9],[47,67,1,1.5],[52,15,1.5,0.6],
  [58,82,1,2.8],[63,40,2,0.2],[68,6,1,1.7],[73,70,1.5,0.5],[79,25,1,2.3],
  [84,90,2,0.8],[89,52,1,1.1],[94,18,1.5,2.9],[97,75,1,0.4],[2,65,2,1.6],
  [11,35,1,0.1],[22,90,1.5,2.2],[36,18,1,0.8],[48,85,2,1.3],[61,28,1,2.7],
  [74,92,1.5,0.6],[87,42,1,1.9],[6,50,2,0.3],[28,72,1,2.4],[50,5,1.5,1.0],
  [72,60,1,0.7],[91,80,2,2.0],[16,10,1,1.4],[44,48,1.5,0.2],[66,88,1,2.6],
  [88,15,2,0.9],[5,38,1,1.7],[34,62,1.5,0.4],[57,95,1,2.1],[80,35,2,0.6],
  [20,55,1,1.3],[43,20,1.5,2.8],[65,72,1,0.1],[86,58,2,1.8],[9,82,1,0.5],
  [39,8,1.5,2.3],[62,48,1,0.9],[83,25,2,1.5],[26,42,1,0.3],[55,65,1.5,1.1],
  [15,93,1,0.6],[33,2,2,2.0],[71,15,1,0.8],[95,48,1.5,1.4],[49,38,1,3.1],
  [18,68,1.5,0.5],[77,83,1,2.2],[42,10,2,0.4],[60,55,1,1.9],[30,30,1.5,1.3],
];

// Deterministic pseudo-random — stable between SSR & client (avoids hydration mismatch)
function rand(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Realistic stellar color palette (weighted toward cooler / more common stars,
// the way real survey images look: lots of white-yellow-orange, few hot blue giants)
const STAR_PALETTE = [
  '#ffffff', '#fbfcff', '#f3f6ff',          // A-type white
  '#dce6ff', '#c4d4ff',                       // B blue-white
  '#fff7ec', '#fff1d8', '#ffeac4',            // F/G yellow-white (sun-like)
  '#ffe1b3', '#ffd29c', '#ffc488',            // K orange
  '#ffb38e', '#ff9f78',                        // M red-orange
];
function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// Spiral galaxy star field — generated once into stable coords (SSR-safe)
interface GStar { x: number; y: number; s: number; o: number; c: string; g: string; tw: number }
const GALAXY_STARS: GStar[] = (() => {
  const out: GStar[] = [];
  let seed = 1;
  const pick = () => STAR_PALETTE[Math.floor(rand(seed++) * STAR_PALETTE.length)];
  const push = (x: number, y: number, s: number, o: number) => {
    const c = pick();
    out.push({ x: +x.toFixed(1), y: +y.toFixed(1), s: +s.toFixed(1), o: +o.toFixed(2), c, g: hexToRgba(c, 0.75), tw: +(2.5 + rand(seed++) * 3.5).toFixed(1) });
  };
  // Spiral arms (logarithmic), with fuzz growing outward like real arms
  const arms = 4, perArm = 85;
  for (let a = 0; a < arms; a++) {
    const armAngle = (a / arms) * Math.PI * 2;
    for (let i = 0; i < perArm; i++) {
      const t = i / perArm;
      const radius = 55 + t * 580;
      const angle = armAngle + t * 3.8 * Math.PI + (rand(seed++) - 0.5) * 0.5;
      const fuzz = (rand(seed++) - 0.5) * (16 + t * 100);
      const px = Math.cos(angle) * radius + Math.cos(angle + 1.7) * fuzz;
      const py = Math.sin(angle) * radius + Math.sin(angle + 1.7) * fuzz;
      // brightness: mostly faint pinpoints, a few bright (power-law-ish)
      const r = rand(seed++);
      const s = r < 0.80 ? 0.7 + rand(seed++) * 0.9 : r < 0.96 ? 1.8 + rand(seed++) * 1.1 : 3.2 + rand(seed++) * 1.8;
      push(px, py, s, 0.35 + rand(seed++) * 0.6);
    }
  }
  // Dense central bulge (concentrated, slightly flattened)
  for (let i = 0; i < 130; i++) {
    const angle = rand(seed++) * Math.PI * 2;
    const radius = rand(seed++) ** 2 * 190;
    push(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.82, 0.7 + rand(seed++) * 1.3, 0.4 + rand(seed++) * 0.5);
  }
  // Sparse outer halo for depth
  for (let i = 0; i < 80; i++) {
    const angle = rand(seed++) * Math.PI * 2;
    const radius = 130 + rand(seed++) * 700;
    push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.6 + (rand(seed++) < 0.14 ? 1.5 : 0.3), 0.18 + rand(seed++) * 0.4);
  }
  return out;
})();

// Foreground "hero" stars with diffraction spikes (telescope-photo look): [x%, y%, size, color, delay]
const HEROES: [number, number, number, string, number][] = [
  [17, 23, 5.5, '#dce6ff', 0],
  [83, 17, 6.5, '#fff1d8', 1.3],
  [72, 73, 4.5, '#ffffff', 2.2],
  [28, 80, 6,   '#ffd29c', 0.7],
  [52, 10, 4,   '#c4d4ff', 1.9],
  [92, 50, 5,   '#fff7ec', 0.4],
  [7,  62, 5.5, '#ffffff', 2.7],
  [40, 45, 3.5, '#ffb38e', 1.1],
];

// Flying ships: type, flight keyframe, duration, delay, inner orientation, glow color
interface ShipCfg { type: 'ufo' | 'rocket'; anim: string; dur: number; delay: number; inner: string; glow: string }
const SHIPS: ShipCfg[] = [
  { type: 'ufo',    anim: 'flyR1', dur: 30, delay: -3,  inner: 'scale(0.95)',                glow: 'rgba(74,222,128,0.55)' },
  { type: 'rocket', anim: 'flyL1', dur: 26, delay: -12, inner: 'rotate(-90deg) scale(0.95)', glow: 'rgba(147,197,253,0.55)' },
  { type: 'rocket', anim: 'flyR2', dur: 36, delay: -22, inner: 'rotate(90deg) scale(0.78)',  glow: 'rgba(167,139,250,0.55)' },
  { type: 'ufo',    anim: 'flyL2', dur: 40, delay: -7,  inner: 'scaleX(-1) scale(0.72)',     glow: 'rgba(253,230,138,0.5)' },
  { type: 'rocket', anim: 'flyL1', dur: 48, delay: -34, inner: 'rotate(-90deg) scale(0.58)', glow: 'rgba(74,222,128,0.4)' },
];

// Orbit rings: width, height, tilt, speed(s), ring-color, dots[]
interface OrbitDot { s: number; c: string; g: string; d: number }
interface OrbitCfg { w: number; h: number; rot: number; spd: number; stroke: string; dots: OrbitDot[] }

const ORBITS: OrbitCfg[] = [
  {
    w: 320, h: 110, rot: -58, spd: 9, stroke: 'rgba(167,139,250,0.20)',
    dots: [
      { s: 3, c: '#c4b5fd', g: 'rgba(167,139,250,0.95)', d: 0 },
      { s: 2, c: '#ddd6fe', g: 'rgba(196,181,253,0.7)', d: -4.5 },
    ],
  },
  {
    w: 540, h: 185, rot: 22, spd: 14, stroke: 'rgba(147,197,253,0.17)',
    dots: [
      { s: 4, c: '#93c5fd', g: 'rgba(147,197,253,0.95)', d: 0 },
      { s: 2, c: '#bfdbfe', g: 'rgba(147,197,253,0.6)', d: -7 },
    ],
  },
  {
    w: 760, h: 260, rot: -17, spd: 20, stroke: 'rgba(74,222,128,0.16)',
    dots: [
      { s: 5, c: '#86efac', g: 'rgba(74,222,128,0.95)', d: 0 },
      { s: 3, c: '#a7f3d0', g: 'rgba(74,222,128,0.7)', d: -6.7 },
      { s: 2, c: '#d1fae5', g: 'rgba(74,222,128,0.5)', d: -13.4 },
    ],
  },
  {
    w: 970, h: 330, rot: 11, spd: 26, stroke: 'rgba(253,230,138,0.13)',
    dots: [
      { s: 4, c: '#fde68a', g: 'rgba(253,230,138,0.95)', d: 0 },
      { s: 2, c: '#fef3c7', g: 'rgba(253,230,138,0.6)', d: -8.7 },
      { s: 3, c: '#fde68a', g: 'rgba(245,158,11,0.8)', d: -17.4 },
    ],
  },
  {
    w: 1180, h: 400, rot: -29, spd: 33, stroke: 'rgba(74,222,128,0.10)',
    dots: [
      { s: 4, c: '#34d399', g: 'rgba(52,211,153,0.9)', d: 0 },
      { s: 2, c: '#6ee7b7', g: 'rgba(74,222,128,0.6)', d: -8.25 },
      { s: 3, c: '#34d399', g: 'rgba(52,211,153,0.85)', d: -16.5 },
      { s: 2, c: '#a7f3d0', g: 'rgba(74,222,128,0.5)', d: -24.75 },
    ],
  },
  {
    w: 1430, h: 490, rot: 6, spd: 44, stroke: 'rgba(125,211,252,0.07)',
    dots: [
      { s: 3, c: '#7dd3fc', g: 'rgba(125,211,252,0.8)', d: 0 },
      { s: 2, c: '#bae6fd', g: 'rgba(125,211,252,0.5)', d: -11 },
      { s: 2, c: '#7dd3fc', g: 'rgba(56,189,248,0.7)', d: -22 },
      { s: 3, c: '#38bdf8', g: 'rgba(56,189,248,0.9)', d: -33 },
    ],
  },
];

// ── SVG Spaceship / Rocket (nose points up) ─────────────────────────────────
function RocketSvg() {
  return (
    <svg width="48" height="86" viewBox="0 0 48 86" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Exhaust flame — animated flicker */}
      <ellipse className="rkt-flame-a" cx="24" cy="74" rx="6" ry="12" fill="rgba(253,230,138,0.55)" style={{ filter: 'blur(3px)' }} />
      <path className="rkt-flame-b" d="M19 60 C20 70 22 78 24 84 C26 78 28 70 29 60Z" fill="rgba(251,146,60,0.85)" />
      <path className="rkt-flame-a" d="M21 60 C22 67 23 72 24 78 C25 72 26 67 27 60Z" fill="rgba(253,230,138,0.95)" />
      {/* Nozzle */}
      <path d="M18 56 L20 64 L24 67 L28 64 L30 56Z"
        fill="rgba(120,130,150,0.30)" stroke="rgba(148,163,184,0.45)" strokeWidth="0.6" />
      {/* Main body */}
      <path d="M24 4 C14 18 10 38 10 54 L24 58 L38 54 C38 38 34 18 24 4Z"
        fill="rgba(190,200,215,0.20)" stroke="rgba(190,200,215,0.5)" strokeWidth="0.8" />
      {/* Body shading (left) */}
      <path d="M24 4 C18 16 14 36 14 53 L24 56 L24 4Z" fill="rgba(255,255,255,0.05)" />
      {/* Cockpit dome */}
      <ellipse cx="24" cy="28" rx="8" ry="11.5"
        fill="rgba(147,197,253,0.20)" stroke="rgba(147,197,253,0.55)" strokeWidth="0.7" />
      <ellipse cx="22.5" cy="24.5" rx="4" ry="5.5" fill="rgba(200,225,255,0.18)" />
      {/* Nose glow */}
      <circle cx="24" cy="5" r="3.8" fill="rgba(253,230,138,0.6)" style={{ filter: 'blur(2px)' }} />
      <circle cx="24" cy="5" r="2" fill="rgba(255,255,255,0.7)" />
      {/* Left fin */}
      <path d="M10 48 L1 68 L11 60 L13 46Z"
        fill="rgba(110,126,150,0.28)" stroke="rgba(167,139,250,0.4)" strokeWidth="0.6" />
      {/* Right fin */}
      <path d="M38 48 L47 68 L37 60 L35 46Z"
        fill="rgba(110,126,150,0.28)" stroke="rgba(74,222,128,0.4)" strokeWidth="0.6" />
      {/* Body detail lines */}
      <line x1="15" y1="33" x2="33" y2="33" stroke="rgba(190,200,215,0.25)" strokeWidth="0.5" />
      <line x1="13" y1="45" x2="35" y2="45" stroke="rgba(190,200,215,0.25)" strokeWidth="0.5" />
      {/* Window light */}
      <circle cx="24" cy="43" r="2.2" fill="rgba(74,222,128,0.45)" className="ufo-light-a" />
    </svg>
  );
}

// ── SVG UFO / Saucer ────────────────────────────────────────────────────────
function UfoSvg() {
  return (
    <svg width="96" height="56" viewBox="0 0 96 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tractor-beam under-glow */}
      <ellipse cx="48" cy="48" rx="34" ry="10" fill="rgba(74,222,128,0.08)" style={{ filter: 'blur(8px)' }} />
      {/* Dome */}
      <path d="M48 7 C34 7 26 15 26 24 L70 24 C70 15 62 7 48 7Z"
        fill="rgba(147,197,253,0.16)" stroke="rgba(147,197,253,0.5)" strokeWidth="0.7" />
      {/* Dome highlight */}
      <path d="M48 10 C40 10 34 15 31 20 L42 20 C43 15 45 11 48 10Z"
        fill="rgba(255,255,255,0.08)" />
      {/* Saucer disc */}
      <ellipse cx="48" cy="31" rx="46" ry="12"
        fill="rgba(120,135,160,0.24)" stroke="rgba(190,200,215,0.45)" strokeWidth="0.7" />
      {/* Disc top sheen */}
      <ellipse cx="48" cy="28" rx="40" ry="6" fill="rgba(255,255,255,0.04)" />
      {/* Inner groove ring */}
      <ellipse cx="48" cy="33" rx="31" ry="7.5"
        fill="none" stroke="rgba(74,222,128,0.28)" strokeWidth="0.6" />
      {/* Bottom panel */}
      <ellipse cx="48" cy="36" rx="19" ry="5"
        fill="rgba(6,9,30,0.6)" stroke="rgba(190,200,215,0.2)" strokeWidth="0.5" />
      {/* Rim lights — animated */}
      <circle cx="20" cy="32" r="2.6" fill="rgba(74,222,128,0.9)"  className="ufo-light-a" />
      <circle cx="33" cy="36" r="2.1" fill="rgba(253,230,138,0.9)" className="ufo-light-b" />
      <circle cx="48" cy="37" r="2.6" fill="rgba(147,197,253,0.95)" className="ufo-light-a" />
      <circle cx="63" cy="36" r="2.1" fill="rgba(167,139,250,0.9)" className="ufo-light-b" />
      <circle cx="76" cy="32" r="2.6" fill="rgba(253,230,138,0.9)" className="ufo-light-a" />
    </svg>
  );
}

// ── Foreground bright star with diffraction spikes (telescope-photo style) ───
function HeroStar({ xp, yp, size, color, delay }: {
  xp: number; yp: number; size: number; color: string; delay: number;
}) {
  const spike = (rot: number, len: number, w: number, op: number): React.CSSProperties => ({
    position: 'absolute', left: '50%', top: '50%',
    width: `${w}px`, height: `${len}px`,
    background: `linear-gradient(to bottom, transparent, ${color} 50%, transparent)`,
    transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    transformOrigin: '50% 50%',
    filter: 'blur(0.4px)',
    opacity: op,
  });
  const L = size * 13;
  return (
    <div style={{
      position: 'absolute', left: `${xp}%`, top: `${yp}%`,
      transform: 'translate(-50%, -50%)',
      animation: `heroTwinkle ${4 + (delay % 3)}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}>
      {/* long primary spikes (vertical + horizontal) */}
      <div style={spike(0, L, 1.6, 0.85)} />
      <div style={spike(90, L, 1.6, 0.85)} />
      {/* short secondary spikes (diagonal) */}
      <div style={spike(45, L * 0.55, 1, 0.4)} />
      <div style={spike(135, L * 0.55, 1, 0.4)} />
      {/* glowing core */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: `${size}px`, height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, #ffffff 0%, ${color} 42%, transparent 75%)`,
        boxShadow: `0 0 ${size * 3}px ${size}px ${hexToRgba(color, 0.55)}, 0 0 ${size * 7}px ${size * 2}px ${hexToRgba(color, 0.25)}`,
      }} />
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = login(email, password);
      if (user) {
        router.push(DEFAULT_ROUTES[user.role] || '/dashboard/finanzas');
      } else {
        setError('Correo o contraseña incorrectos');
        setLoading(false);
      }
    }, 700);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #07091f 0%, #030411 55%, #010108 100%)' }}
    >
      {/* ════════════ GALAXY BACKGROUND ════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* ── Star field (soft-glow, realistic stellar colors) ── */}
        {STARS.map(([x, y, s, d], i) => {
          const c = STAR_PALETTE[(i * 3) % STAR_PALETTE.length];
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              width: `${s}px`, height: `${s}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, #ffffff 0%, ${c} 45%, transparent 78%)`,
              boxShadow: s >= 1.5 ? `0 0 ${s * 2.5}px ${hexToRgba(c, 0.6)}` : 'none',
              animation: `shine${(i % 3) + 1} ${2.2 + (i % 5) * 0.7}s ease-in-out infinite`,
              animationDelay: `${d}s`,
            }} />
          );
        })}

        {/* ── Spiral galaxy disc (tilted, slowly rotating) ── */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%) rotate(-18deg) scaleY(0.5)',
          zIndex: 1,
        }}>
          <div style={{
            position: 'relative', width: 0, height: 0,
            animation: 'galaxyRotate 80s linear infinite',
          }}>
            {/* Faint overall disc glow */}
            <div style={{
              position: 'absolute', width: '1280px', height: '1280px',
              left: '-640px', top: '-640px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,244,224,0.06) 0%, rgba(167,139,250,0.05) 26%, rgba(99,102,241,0.035) 46%, transparent 66%)',
              filter: 'blur(30px)',
            }} />
            {/* Emission nebula — pink/red Hα cloud */}
            <div style={{
              position: 'absolute', width: '520px', height: '360px',
              left: '-120px', top: '-280px',
              borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%',
              background: 'radial-gradient(ellipse at 40% 45%, rgba(244,114,182,0.16) 0%, rgba(219,39,119,0.09) 40%, transparent 72%)',
              filter: 'blur(34px)',
            }} />
            {/* Reflection nebula — blue cloud */}
            <div style={{
              position: 'absolute', width: '600px', height: '380px',
              left: '-420px', top: '40px',
              borderRadius: '45% 55% 50% 50% / 60% 45% 55% 40%',
              background: 'radial-gradient(ellipse at 55% 50%, rgba(96,165,250,0.15) 0%, rgba(59,130,246,0.08) 42%, transparent 72%)',
              filter: 'blur(38px)',
            }} />
            {/* OIII teal cloud */}
            <div style={{
              position: 'absolute', width: '480px', height: '300px',
              left: '40px', top: '120px',
              borderRadius: '55% 45% 60% 40% / 45% 55% 45% 55%',
              background: 'radial-gradient(ellipse at 45% 50%, rgba(45,212,191,0.12) 0%, rgba(20,184,166,0.06) 45%, transparent 72%)',
              filter: 'blur(34px)',
            }} />
            {/* Dark dust lanes (obscuring bands across the arms) */}
            <div style={{
              position: 'absolute', width: '900px', height: '120px',
              left: '-450px', top: '-40px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(6,6,16,0.55) 0%, rgba(6,6,16,0.25) 45%, transparent 72%)',
              filter: 'blur(22px)',
              transform: 'rotate(18deg)',
            }} />
            <div style={{
              position: 'absolute', width: '760px', height: '90px',
              left: '-300px', top: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(6,6,16,0.5) 0%, rgba(6,6,16,0.2) 45%, transparent 72%)',
              filter: 'blur(20px)',
              transform: 'rotate(-26deg)',
            }} />
            {/* Bright central bulge */}
            <div style={{
              position: 'absolute', width: '300px', height: '300px',
              left: '-150px', top: '-150px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,250,235,0.9) 0%, rgba(255,236,190,0.5) 18%, rgba(253,200,120,0.22) 40%, rgba(245,158,11,0.08) 62%, transparent 80%)',
              filter: 'blur(8px)',
            }} />
            {/* Stars along the spiral arms (soft glow) */}
            {GALAXY_STARS.map((st, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${st.x}px`, top: `${st.y}px`,
                width: `${st.s}px`, height: `${st.s}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, #ffffff 0%, ${st.c} 45%, transparent 80%)`,
                boxShadow: st.s > 1.8 ? `0 0 ${st.s * 3}px ${st.g}` : 'none',
                transform: 'translate(-50%, -50%)',
                animation: `gShine${(i % 3) + 1} ${st.tw}s ease-in-out infinite`,
                animationDelay: `${(i % 9) * 0.35}s`,
              }} />
            ))}
          </div>
        </div>

        {/* ── Central Star / Sun ── */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}>
          {/* Far outer corona */}
          <div style={{
            position: 'absolute',
            width: '600px', height: '600px',
            left: '-300px', top: '-300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(253,230,138,0.035) 0%, rgba(245,158,11,0.015) 45%, transparent 70%)',
            animation: 'starPulse 6s ease-in-out infinite',
          }} />
          {/* Mid corona */}
          <div style={{
            position: 'absolute',
            width: '320px', height: '320px',
            left: '-160px', top: '-160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(253,230,138,0.10) 0%, rgba(245,158,11,0.04) 50%, transparent 75%)',
            animation: 'starPulse 4.5s ease-in-out infinite 1s',
          }} />
          {/* Inner corona */}
          <div style={{
            position: 'absolute',
            width: '150px', height: '150px',
            left: '-75px', top: '-75px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(253,230,138,0.22) 0%, rgba(245,158,11,0.10) 50%, transparent 80%)',
            animation: 'starPulse 3s ease-in-out infinite 0.5s',
          }} />
          {/* Diffraction spikes (telescope-style cross) */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            animation: 'starPulse 5s ease-in-out infinite',
          }}>
            {/* long vertical + horizontal */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%', width: '2px', height: '440px',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(to bottom, transparent, rgba(253,230,138,0.55) 50%, transparent)',
              filter: 'blur(0.5px)',
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: '50%', width: '440px', height: '2px',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(to right, transparent, rgba(253,230,138,0.55) 50%, transparent)',
              filter: 'blur(0.5px)',
            }} />
            {/* shorter diagonals */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%', width: '1.2px', height: '220px',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              background: 'linear-gradient(to bottom, transparent, rgba(255,240,200,0.30) 50%, transparent)',
              filter: 'blur(0.5px)',
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: '50%', width: '1.2px', height: '220px',
              transform: 'translate(-50%, -50%) rotate(135deg)',
              background: 'linear-gradient(to bottom, transparent, rgba(255,240,200,0.30) 50%, transparent)',
              filter: 'blur(0.5px)',
            }} />
          </div>
          {/* Star core */}
          <div style={{
            position: 'absolute',
            width: '56px', height: '56px',
            left: '-28px', top: '-28px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fffde7 0%, #fde68a 30%, #f59e0b 65%, rgba(245,158,11,0.05) 100%)',
            boxShadow: [
              '0 0 18px rgba(253,230,138,1)',
              '0 0 40px rgba(245,158,11,0.75)',
              '0 0 80px rgba(245,158,11,0.35)',
              '0 0 160px rgba(245,158,11,0.12)',
            ].join(', '),
            animation: 'starPulse 2.8s ease-in-out infinite',
          }} />
        </div>

        {/* ── Ambient nebula clouds (deep-field gas, gently breathing) ── */}
        <div style={{
          position: 'absolute', left: '-160px', top: '0%',
          width: '620px', height: '620px',
          background: 'radial-gradient(ellipse at 45% 40%, rgba(129,140,248,0.10) 0%, rgba(99,102,241,0.05) 38%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'nebulaPulse 16s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', right: '-130px', top: '38%',
          width: '560px', height: '560px',
          background: 'radial-gradient(ellipse at 55% 50%, rgba(244,114,182,0.07) 0%, rgba(217,70,239,0.045) 40%, transparent 70%)',
          filter: 'blur(95px)',
          animation: 'nebulaPulse 20s ease-in-out infinite 3s',
        }} />
        <div style={{
          position: 'absolute', left: '20%', bottom: '-90px',
          width: '720px', height: '380px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(45,212,191,0.06) 0%, rgba(56,189,248,0.04) 45%, transparent 72%)',
          filter: 'blur(85px)',
          animation: 'nebulaPulse 18s ease-in-out infinite 6s',
        }} />
        <div style={{
          position: 'absolute', right: '12%', top: '-80px',
          width: '420px', height: '420px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(251,146,60,0.05) 0%, transparent 68%)',
          filter: 'blur(80px)',
          animation: 'nebulaPulse 22s ease-in-out infinite 2s',
        }} />

        {/* ── Orbital rings ── */}
        {ORBITS.map((orbit, oi) => (
          <div key={oi} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: `${orbit.w}px`, height: `${orbit.h}px`,
            transform: `translate(-50%, -50%) rotate(${orbit.rot}deg)`,
            zIndex: 2,
          }}>
            {/* Ring path */}
            <div style={{
              position: 'absolute', inset: 0,
              border: `1px solid ${orbit.stroke}`,
              borderRadius: '50%',
            }} />
            {/* Orbiting dots */}
            {orbit.dots.map((dot, di) => (
              <div key={di} style={{
                position: 'absolute', inset: 0,
                animation: `spinOrbit ${orbit.spd}s linear infinite`,
                animationDelay: `${dot.d}s`,
              }}>
                <div style={{
                  position: 'absolute',
                  top: `${-dot.s / 2}px`,
                  left: `calc(50% - ${dot.s / 2}px)`,
                  width: `${dot.s}px`,
                  height: `${dot.s}px`,
                  borderRadius: '50%',
                  background: dot.c,
                  boxShadow: `0 0 ${dot.s * 3}px ${dot.g}, 0 0 ${dot.s * 7}px ${dot.g.replace(/[\d.]+\)$/, '0.3)')}`,
                  animation: `spinReverse ${orbit.spd}s linear infinite`,
                  animationDelay: `${dot.d}s`,
                }} />
              </div>
            ))}
          </div>
        ))}

        {/* ── Foreground hero stars with diffraction spikes ── */}
        {HEROES.map(([xp, yp, size, color, delay], i) => (
          <HeroStar key={i} xp={xp} yp={yp} size={size} color={color} delay={delay} />
        ))}
      </div>

      {/* ════════════ FLYING SPACESHIPS ════════════ */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 3 }}>
        {SHIPS.map((sh, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            animation: `${sh.anim} ${sh.dur}s linear infinite`,
            animationDelay: `${sh.delay}s`,
          }}>
            {/* gentle bob layer */}
            <div style={{ animation: `bob ${4 + i}s ease-in-out infinite` }}>
              {/* orientation + glow layer */}
              <div style={{ transform: sh.inner, filter: `drop-shadow(0 0 12px ${sh.glow})` }}>
                {sh.type === 'ufo' ? <UfoSvg /> : <RocketSvg />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════ LOGIN CARD ════════════ */}
      <div
        className="relative w-full max-w-md mx-4"
        style={{
          zIndex: 10,
          background: 'rgba(5, 7, 24, 0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '28px',
          boxShadow: [
            '0 32px 80px rgba(0,0,0,0.85)',
            '0 0 0 1px rgba(255,255,255,0.03)',
            'inset 0 1px 0 rgba(255,255,255,0.07)',
          ].join(', '),
        }}
      >
        {/* Gold top highlight */}
        <div style={{
          position: 'absolute', top: 0, left: '14%', right: '14%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(253,230,138,0.45), transparent)',
          borderRadius: '50%',
        }} />

        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src="/logo original color.png" alt="Iencinas" className="w-64 h-24 mb-4 object-contain" />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Ingresa para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                style={{ color: 'rgba(255,255,255,0.28)' }} />
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="Correo electrónico"
                className="w-full pl-11 pr-4 py-3.5 text-sm text-white rounded-xl outline-none transition-all duration-200"
                style={{
                  background: focused === 'email' ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
                  border: focused === 'email' ? '1px solid rgba(253,230,138,0.42)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(253,230,138,0.05)' : 'none',
                  caretColor: '#fde68a',
                }}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                style={{ color: 'rgba(255,255,255,0.28)' }} />
              <input
                type={showPass ? 'text' : 'password'} value={password} required
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="Contraseña"
                className="w-full pl-11 pr-11 py-3.5 text-sm text-white rounded-xl outline-none transition-all duration-200"
                style={{
                  background: focused === 'password' ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
                  border: focused === 'password' ? '1px solid rgba(253,230,138,0.42)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: focused === 'password' ? '0 0 0 3px rgba(253,230,138,0.05)' : 'none',
                  caretColor: '#fde68a',
                }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.22)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-200"
                style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white relative overflow-hidden group transition-all duration-300 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                boxShadow: '0 8px 24px rgba(21,128,61,0.30), inset 0 1px 0 rgba(255,255,255,0.12)',
              }}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Ingresando...</>
                  : <>Ingresar <ChevronRight size={16} /></>}
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07), transparent)' }} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.18)' }}>
              Acceso rápido
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Quick access */}
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map(u => (
              <button key={u.email}
                onClick={() => { setEmail(u.email); setPassword(u.password); setError(''); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: u.color + '22', border: `1px solid ${u.color}44` }}>
                  <span style={{ color: u.color }}>{u.label[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium leading-tight truncate">{u.label.split(' ')[0]}</p>
                  <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.24)' }}>{u.role}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.11)' }}>
            © 2026 Iencinas Analytics · Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* ════════════ KEYFRAMES ════════════ */}
      <style jsx global>{`
        @keyframes spinOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes twinkleStar {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50%       { opacity: 0.08; transform: scale(0.5); }
        }
        /* Flat-field star shimmer — luminosity flares, out of phase */
        @keyframes shine1 {
          0%, 100% { opacity: 0.30; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1.4); }
        }
        @keyframes shine2 {
          0%, 100% { opacity: 0.95; transform: scale(1.2); }
          45%      { opacity: 0.20; transform: scale(0.75); }
        }
        @keyframes shine3 {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          30%      { opacity: 1;    transform: scale(1.25); }
          70%      { opacity: 0.20; transform: scale(0.85); }
        }
        /* Galaxy stars — same flares but keep centered (include translate) */
        @keyframes gShine1 {
          0%, 100% { opacity: 0.30; transform: translate(-50%, -50%) scale(0.8); }
          50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.35); }
        }
        @keyframes gShine2 {
          0%, 100% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.15); }
          45%      { opacity: 0.20; transform: translate(-50%, -50%) scale(0.75); }
        }
        @keyframes gShine3 {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          30%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.22); }
          70%      { opacity: 0.20; transform: translate(-50%, -50%) scale(0.85); }
        }
        @keyframes starPulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.10); }
        }
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.08); }
        }
        @keyframes galaxyRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes heroTwinkle {
          0%, 100% { opacity: 1;    transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.55; transform: translate(-50%, -50%) scale(0.92); }
        }
        /* Flight paths — ships drift across the whole screen */
        @keyframes flyR1 {
          0%   { transform: translate(-16vw, 16vh); opacity: 0; }
          6%   { opacity: 0.9; }
          50%  { transform: translate(48vw, 9vh);   opacity: 0.9; }
          94%  { opacity: 0.9; }
          100% { transform: translate(118vw, 22vh); opacity: 0; }
        }
        @keyframes flyL1 {
          0%   { transform: translate(118vw, 54vh); opacity: 0; }
          6%   { opacity: 0.9; }
          50%  { transform: translate(46vw, 62vh);  opacity: 0.9; }
          94%  { opacity: 0.9; }
          100% { transform: translate(-16vw, 50vh); opacity: 0; }
        }
        @keyframes flyR2 {
          0%   { transform: translate(-18vw, 76vh); opacity: 0; }
          7%   { opacity: 0.85; }
          50%  { transform: translate(50vw, 82vh);  opacity: 0.85; }
          93%  { opacity: 0.85; }
          100% { transform: translate(120vw, 70vh); opacity: 0; }
        }
        @keyframes flyL2 {
          0%   { transform: translate(120vw, 28vh); opacity: 0; }
          7%   { opacity: 0.85; }
          50%  { transform: translate(52vw, 20vh);  opacity: 0.85; }
          93%  { opacity: 0.85; }
          100% { transform: translate(-18vw, 36vh); opacity: 0; }
        }
        @keyframes bob {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-7px); }
        }
        .rkt-flame-a { animation: flameA 0.22s ease-in-out infinite; transform-box: fill-box; transform-origin: center top; }
        .rkt-flame-b { animation: flameB 0.3s ease-in-out infinite;  transform-box: fill-box; transform-origin: center top; }
        @keyframes flameA {
          0%,100% { opacity: 0.95; transform: scaleY(1);    }
          50%     { opacity: 0.6;  transform: scaleY(0.78); }
        }
        @keyframes flameB {
          0%,100% { opacity: 0.85; transform: scaleY(1.05); }
          50%     { opacity: 0.55; transform: scaleY(0.85); }
        }
        .ufo-light-a { animation: ufoLightA 1.8s ease-in-out infinite; }
        .ufo-light-b { animation: ufoLightB 1.8s ease-in-out infinite 0.9s; }
        @keyframes ufoLightA {
          0%,100% { opacity: 0.85; }
          50%     { opacity: 0.20; }
        }
        @keyframes ufoLightB {
          0%,100% { opacity: 0.85; }
          50%     { opacity: 0.20; }
        }
        input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  );
}
