export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 8;
export const INITIAL_LIVES = 3;
export const ROOM_CODE_LENGTH = 4;
export const MAX_ROOMS = 100;

export const SECRET_TIMER_MIN = 15; // seconds
export const SECRET_TIMER_MAX = 30; // seconds

export const RECONNECT_GRACE_PERIOD_MS = 10_000;
export const HEARTBEAT_INTERVAL_MS = 5_000;
export const HEARTBEAT_TIMEOUT_MS = 15_000;
export const ROOM_CLEANUP_DELAY_MS = 5 * 60 * 1000; // 5 minutes

export const NICKNAME_MIN_LENGTH = 1;
export const NICKNAME_MAX_LENGTH = 16;
export const NICKNAME_REGEX = /^[A-Za-z0-9-]+$/;

export const WORD_CHALLENGE_TIMEOUT_MS = 5_000;
export const WORD_MAX_LENGTH = 30;
export const REFLEX_DELAY_MIN_MS = 1_000;
export const REFLEX_DELAY_MAX_MS = 3_000;
export const REFLEX_TIME_LIMIT_MS = 1_000;
export const PATTERN_SEQUENCE_LENGTH = 3;
export const PATTERN_DISPLAY_MS = 800;
export const PATTERN_TIMEOUT_MS = 5_000;
export const PATTERN_COLORS = ['red', 'blue', 'green', 'yellow'] as const;
