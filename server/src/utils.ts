import { ROOM_CODE_LENGTH, NICKNAME_REGEX, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH } from './shared';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function validateNickname(nickname: string): string | null {
  if (!nickname || nickname.length < NICKNAME_MIN_LENGTH) {
    return 'Le pseudonyme est trop court (minimum 1 caractère)';
  }
  if (nickname.length > NICKNAME_MAX_LENGTH) {
    return 'Le pseudonyme est trop long (maximum 16 caractères)';
  }
  if (!NICKNAME_REGEX.test(nickname)) {
    return 'Le pseudonyme ne peut contenir que des lettres, chiffres et tirets';
  }
  return null;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
