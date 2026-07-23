// Pixel-art style SVG avatars
// Each avatar is a small inline SVG string with a unique character

export interface AvatarDef {
  id: string;
  name: string;
  svg: string;
  color: string; // accent color
}

export const AVATARS: AvatarDef[] = [
  {
    id: 'skull',
    name: 'Skull',
    color: '#ff0000',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="8" height="8" rx="2" fill="#fff"/><rect x="5" y="4" width="2" height="2" fill="#000"/><rect x="9" y="4" width="2" height="2" fill="#000"/><rect x="7" y="7" width="2" height="2" fill="#000"/><rect x="5" y="10" width="2" height="4" fill="#fff"/><rect x="9" y="10" width="2" height="4" fill="#fff"/></svg>`,
  },
  {
    id: 'ghost',
    name: 'Ghost',
    color: '#c084fc',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 14V6a4 4 0 018 0v8l-2-2-2 2-2-2-2 2z" fill="#c084fc"/><rect x="6" y="5" width="2" height="2" fill="#000"/><rect x="10" y="5" width="2" height="2" fill="#000"/></svg>`,
  },
  {
    id: 'robot',
    name: 'Robot',
    color: '#38bdf8',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="8" height="8" rx="1" fill="#38bdf8"/><rect x="6" y="6" width="2" height="2" fill="#000"/><rect x="10" y="6" width="2" height="2" fill="#000"/><rect x="6" y="9" width="6" height="2" fill="#000"/><rect x="7" y="2" width="2" height="2" fill="#38bdf8"/><rect x="2" y="6" width="2" height="3" fill="#38bdf8"/><rect x="12" y="6" width="2" height="3" fill="#38bdf8"/></svg>`,
  },
  {
    id: 'demon',
    name: 'Demon',
    color: '#ef4444',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="8" height="7" rx="1" fill="#ef4444"/><rect x="5" y="7" width="2" height="2" fill="#ffff00"/><rect x="9" y="7" width="2" height="2" fill="#ffff00"/><rect x="6" y="10" width="4" height="2" fill="#000"/><polygon points="4,5 5,2 6,5" fill="#ef4444"/><polygon points="10,5 11,2 12,5" fill="#ef4444"/></svg>`,
  },
  {
    id: 'ninja',
    name: 'Ninja',
    color: '#1e293b',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5" fill="#334155"/><rect x="3" y="6" width="10" height="3" fill="#1e293b"/><rect x="6" y="7" width="2" height="1" fill="#fff"/><rect x="9" y="7" width="2" height="1" fill="#fff"/></svg>`,
  },
  {
    id: 'alien',
    name: 'Alien',
    color: '#4ade80',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><ellipse cx="8" cy="8" rx="5" ry="6" fill="#4ade80"/><ellipse cx="6" cy="7" rx="2" ry="2.5" fill="#000"/><ellipse cx="10" cy="7" rx="2" ry="2.5" fill="#000"/><ellipse cx="6" cy="7" rx="1" ry="1.5" fill="#4ade80"/><ellipse cx="10" cy="7" rx="1" ry="1.5" fill="#4ade80"/></svg>`,
  },
  {
    id: 'cat',
    name: 'Cat',
    color: '#fb923c',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="8" height="7" rx="2" fill="#fb923c"/><polygon points="4,5 3,1 6,4" fill="#fb923c"/><polygon points="12,5 13,1 10,4" fill="#fb923c"/><rect x="6" y="7" width="1.5" height="1.5" fill="#000"/><rect x="9" y="7" width="1.5" height="1.5" fill="#000"/><rect x="7.5" y="9" width="1" height="1" fill="#000"/></svg>`,
  },
  {
    id: 'flame',
    name: 'Flame',
    color: '#f59e0b',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 2c0 3-4 5-4 8a4 4 0 008 0c0-3-4-5-4-8z" fill="#f59e0b"/><path d="M8 7c0 2-2 3-2 5a2 2 0 004 0c0-2-2-3-2-5z" fill="#fbbf24"/><rect x="6.5" y="9" width="1.5" height="1.5" fill="#000"/><rect x="9" y="9" width="1.5" height="1.5" fill="#000"/></svg>`,
  },
  {
    id: 'ice',
    name: 'Ice',
    color: '#22d3ee',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><polygon points="8,1 3,6 3,11 8,15 13,11 13,6" fill="#22d3ee"/><rect x="6" y="6" width="1.5" height="1.5" fill="#000"/><rect x="9" y="6" width="1.5" height="1.5" fill="#000"/><rect x="6" y="10" width="4" height="1" fill="#0e7490"/></svg>`,
  },
  {
    id: 'bolt',
    name: 'Bolt',
    color: '#facc15',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><polygon points="9,1 4,9 7,9 6,15 12,7 9,7" fill="#facc15"/><rect x="6" y="6" width="1" height="1" fill="#000"/><rect x="9" y="9" width="1" height="1" fill="#000"/></svg>`,
  },
  {
    id: 'crown',
    name: 'Crown',
    color: '#a855f7',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="10" height="6" fill="#a855f7"/><polygon points="3,7 1,3 5,6" fill="#a855f7"/><polygon points="8,7 8,2 8,7" fill="#a855f7"/><polygon points="13,7 15,3 11,6" fill="#a855f7"/><rect x="3" y="12" width="10" height="2" fill="#7c3aed"/><circle cx="5" cy="5" r="1" fill="#facc15"/><circle cx="8" cy="3" r="1" fill="#facc15"/><circle cx="11" cy="5" r="1" fill="#facc15"/></svg>`,
  },
  {
    id: 'bomb',
    name: 'Bomb',
    color: '#ff0000',
    svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="9" r="5" fill="#1a1a1a"/><rect x="7" y="3" width="2" height="3" fill="#666"/><circle cx="8" cy="2" r="1.5" fill="#ff4444"/><circle cx="8" cy="2" r="0.8" fill="#ffaa00"/><rect x="6" y="8" width="2" height="2" fill="#fff" opacity="0.3"/></svg>`,
  },
];

export const REACTION_EMOTES: { id: string; svg: string; label: string }[] = [
  {
    id: 'laugh',
    label: 'Haha',
    svg: `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#facc15"/><rect x="4" y="5" width="2" height="2" fill="#000"/><rect x="10" y="5" width="2" height="2" fill="#000"/><path d="M5 9a3 3 0 006 0z" fill="#000"/></svg>`,
  },
  {
    id: 'skull-react',
    label: 'Dead',
    svg: `<svg viewBox="0 0 16 16"><rect x="4" y="3" width="8" height="7" rx="2" fill="#fff"/><path d="M5 5L7 7M7 5L5 7" stroke="#000" stroke-width="0.8"/><path d="M9 5L11 7M11 5L9 7" stroke="#000" stroke-width="0.8"/><rect x="6" y="10" width="1.5" height="3" fill="#fff"/><rect x="8.5" y="10" width="1.5" height="3" fill="#fff"/></svg>`,
  },
  {
    id: 'fire',
    label: 'Fire',
    svg: `<svg viewBox="0 0 16 16"><path d="M8 2c0 3-4 5-4 8a4 4 0 008 0c0-3-4-5-4-8z" fill="#ef4444"/><path d="M8 6c0 2-2 3-2 5a2 2 0 004 0c0-2-2-3-2-5z" fill="#f59e0b"/></svg>`,
  },
  {
    id: 'scared',
    label: 'Scared',
    svg: `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#38bdf8"/><circle cx="6" cy="6" r="1.5" fill="#fff"/><circle cx="6" cy="6" r="0.7" fill="#000"/><circle cx="10" cy="6" r="1.5" fill="#fff"/><circle cx="10" cy="6" r="0.7" fill="#000"/><ellipse cx="8" cy="11" rx="1.5" ry="2" fill="#000"/></svg>`,
  },
  {
    id: 'eyes',
    label: 'Eyes',
    svg: `<svg viewBox="0 0 16 16"><ellipse cx="5" cy="8" rx="2.5" ry="3" fill="#fff"/><ellipse cx="11" cy="8" rx="2.5" ry="3" fill="#fff"/><circle cx="6" cy="8" r="1.2" fill="#000"/><circle cx="12" cy="8" r="1.2" fill="#000"/></svg>`,
  },
  {
    id: 'clap',
    label: 'GG',
    svg: `<svg viewBox="0 0 16 16"><path d="M4 10L7 5" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><path d="M6 11L9 6" stroke="#fb923c" stroke-width="2" stroke-linecap="round"/><path d="M8 11L11 6" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><path d="M10 10L12 7" stroke="#fb923c" stroke-width="2" stroke-linecap="round"/><ellipse cx="8" cy="12" rx="4" ry="2" fill="#f59e0b"/></svg>`,
  },
  {
    id: 'rip',
    label: 'RIP',
    svg: `<svg viewBox="0 0 16 16"><path d="M4 14h8V6a4 4 0 00-8 0v8z" fill="#6b7280"/><rect x="6.5" y="8" width="3" height="1" fill="#374151"/><rect x="7.5" y="7" width="1" height="3" fill="#374151"/></svg>`,
  },
  {
    id: 'crown-react',
    label: 'King',
    svg: `<svg viewBox="0 0 16 16"><polygon points="2,12 3,6 5,9 8,4 11,9 13,6 14,12" fill="#facc15"/><rect x="3" y="12" width="10" height="2" fill="#d97706"/></svg>`,
  },
];

export function getAvatarById(id: string): AvatarDef {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}
