// Persistent player profile in localStorage

export interface PlayerProfile {
  nickname: string;
  avatar: string;
  gamesPlayed: number;
  wins: number;
  totalKills: number;
}

const STORAGE_KEY = 'chrono-bomb-profile';

export function loadProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Partial<PlayerProfile>): void {
  try {
    const existing = loadProfile() || { nickname: '', avatar: 'skull', gamesPlayed: 0, wins: 0, totalKills: 0 };
    const updated = { ...existing, ...profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}

export function incrementStat(key: 'gamesPlayed' | 'wins' | 'totalKills', amount: number = 1): void {
  const profile = loadProfile();
  if (!profile) return;
  profile[key] += amount;
  saveProfile(profile);
}
