import {
  PATTERN_COLORS,
  PATTERN_SEQUENCE_LENGTH,
  REFLEX_DELAY_MIN_MS,
  REFLEX_DELAY_MAX_MS,
} from './shared';
import type { Challenge, ChallengeType, WordChallengePayload, ReflexChallengePayload, PatternChallengePayload, MathChallengePayload, ReverseChallengePayload } from './types';
import { randomInt, pickRandom } from './utils';

// Word categories with accepted answers
const WORD_CATEGORIES: Record<string, string[]> = {
  animaux: ['chat', 'chien', 'lion', 'tigre', 'ours', 'loup', 'aigle', 'serpent', 'cheval', 'vache', 'poule', 'canard', 'requin', 'dauphin', 'baleine', 'elephant', 'girafe', 'singe', 'lapin', 'souris', 'rat', 'cochon', 'mouton', 'chevre', 'cerf', 'renard', 'hibou', 'tortue', 'grenouille', 'crocodile'],
  fruits: ['pomme', 'banane', 'orange', 'fraise', 'cerise', 'raisin', 'poire', 'peche', 'mangue', 'ananas', 'kiwi', 'citron', 'melon', 'pasteque', 'abricot', 'prune', 'figue', 'noix', 'framboise', 'myrtille'],
  pays: ['france', 'espagne', 'italie', 'allemagne', 'portugal', 'japon', 'chine', 'inde', 'bresil', 'canada', 'mexique', 'australie', 'egypte', 'maroc', 'suisse', 'belgique', 'suede', 'grece', 'turquie', 'russie'],
  couleurs: ['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet', 'rose', 'noir', 'blanc', 'gris', 'marron', 'turquoise', 'beige', 'doré', 'argenté'],
  sports: ['football', 'tennis', 'basket', 'rugby', 'natation', 'cyclisme', 'boxe', 'judo', 'ski', 'surf', 'golf', 'handball', 'volleyball', 'athletisme', 'escalade', 'karate', 'escrime', 'equitation'],
};

const CATEGORY_NAMES = Object.keys(WORD_CATEGORIES);

export function generateChallenge(): Challenge {
  const types: ChallengeType[] = ['word_category', 'reflex', 'pattern', 'math', 'reverse'];
  const type = pickRandom(types);

  switch (type) {
    case 'word_category':
      return generateWordChallenge();
    case 'reflex':
      return generateReflexChallenge();
    case 'pattern':
      return generatePatternChallenge();
    case 'math':
      return generateMathChallenge();
    case 'reverse':
      return generateReverseChallenge();
  }
}

function generateWordChallenge(): Challenge {
  const category = pickRandom(CATEGORY_NAMES);
  const payload: WordChallengePayload = {
    category,
    acceptedWords: WORD_CATEGORIES[category],
  };
  return { type: 'word_category', payload, generatedAt: Date.now() };
}

function generateReflexChallenge(): Challenge {
  const payload: ReflexChallengePayload = {
    delay: randomInt(REFLEX_DELAY_MIN_MS, REFLEX_DELAY_MAX_MS),
    stimulusShownAt: null,
  };
  return { type: 'reflex', payload, generatedAt: Date.now() };
}

function generatePatternChallenge(): Challenge {
  const colors = [...PATTERN_COLORS];
  const sequence: string[] = [];
  for (let i = 0; i < PATTERN_SEQUENCE_LENGTH; i++) {
    sequence.push(pickRandom(colors));
  }
  const payload: PatternChallengePayload = {
    sequence,
    colors,
  };
  return { type: 'pattern', payload, generatedAt: Date.now() };
}

// ========== MATH CHALLENGE ==========

function generateMathChallenge(): Challenge {
  const ops = ['+', '-', '×'] as const;
  const op = pickRandom([...ops]);

  let a: number, b: number, answer: number;

  switch (op) {
    case '+':
      a = randomInt(5, 50);
      b = randomInt(5, 50);
      answer = a + b;
      break;
    case '-':
      a = randomInt(20, 99);
      b = randomInt(5, a); // ensure positive result
      answer = a - b;
      break;
    case '×':
      a = randomInt(2, 12);
      b = randomInt(2, 12);
      answer = a * b;
      break;
  }

  const expression = `${a} ${op} ${b}`;
  const payload: MathChallengePayload = { expression, answer };
  return { type: 'math', payload, generatedAt: Date.now() };
}

// ========== REVERSE CHALLENGE ==========

const REVERSE_WORDS = [
  'cuisine', 'musique', 'plage', 'jardin', 'fenetre', 'chapeau',
  'dragon', 'soleil', 'etoile', 'riviere', 'montagne', 'voiture',
  'ballon', 'clavier', 'fromage', 'chocolat', 'lanterne', 'papillon',
  'bouteille', 'diamant', 'guitare', 'pirate', 'robot', 'volcan',
  'jungle', 'tigre', 'camera', 'fusee', 'tresor', 'village',
  'piscine', 'fantome', 'cascade', 'horizon', 'planete', 'ouragan',
  'tornade', 'licorne', 'sirene', 'bateau',
];

function generateReverseChallenge(): Challenge {
  const word = pickRandom(REVERSE_WORDS);
  const reversed = word.split('').reverse().join('').toUpperCase();
  const payload: ReverseChallengePayload = { originalWord: word, reversedWord: reversed };
  return { type: 'reverse', payload, generatedAt: Date.now() };
}

export function validateChallengeAnswer(challenge: Challenge, answer: unknown): boolean {
  switch (challenge.type) {
    case 'word_category':
      return validateWordAnswer(challenge.payload as WordChallengePayload, answer);
    case 'reflex':
      return validateReflexAnswer(challenge.payload as ReflexChallengePayload, answer);
    case 'pattern':
      return validatePatternAnswer(challenge.payload as PatternChallengePayload, answer);
    case 'math':
      return validateMathAnswer(challenge.payload as MathChallengePayload, answer);
    case 'reverse':
      return validateReverseAnswer(challenge.payload as ReverseChallengePayload, answer);
  }
}

function validateWordAnswer(payload: WordChallengePayload, answer: unknown): boolean {
  if (typeof answer !== 'string') return false;
  const trimmed = answer.toLowerCase().trim();
  if (trimmed.length === 0 || trimmed.length > 30) return false;
  return payload.acceptedWords.includes(trimmed);
}

function validateReflexAnswer(payload: ReflexChallengePayload, answer: unknown): boolean {
  if (typeof answer !== 'number') return false;
  if (!payload.stimulusShownAt) return false;
  if (answer < 0) return false; // tapped too early
  const reactionTime = answer - payload.stimulusShownAt;
  return reactionTime > 0 && reactionTime <= 1000;
}

function validatePatternAnswer(payload: PatternChallengePayload, answer: unknown): boolean {
  if (!Array.isArray(answer)) return false;
  if (answer.length !== payload.sequence.length) return false;
  return answer.every((color, i) => color === payload.sequence[i]);
}

function validateMathAnswer(payload: MathChallengePayload, answer: unknown): boolean {
  if (typeof answer === 'string') {
    const parsed = parseInt(answer, 10);
    if (isNaN(parsed)) return false;
    return parsed === payload.answer;
  }
  if (typeof answer === 'number') {
    return answer === payload.answer;
  }
  return false;
}

function validateReverseAnswer(payload: ReverseChallengePayload, answer: unknown): boolean {
  if (typeof answer !== 'string') return false;
  const trimmed = answer.toLowerCase().trim();
  return trimmed === payload.originalWord;
}

export function getChallengePublicData(challenge: Challenge) {
  switch (challenge.type) {
    case 'word_category': {
      const payload = challenge.payload as WordChallengePayload;
      return { type: challenge.type, category: payload.category };
    }
    case 'reflex': {
      const payload = challenge.payload as ReflexChallengePayload;
      return { type: challenge.type, delay: payload.delay };
    }
    case 'pattern': {
      const payload = challenge.payload as PatternChallengePayload;
      return { type: challenge.type, sequence: payload.sequence, colors: payload.colors };
    }
    case 'math': {
      const payload = challenge.payload as MathChallengePayload;
      return { type: challenge.type, expression: payload.expression };
    }
    case 'reverse': {
      const payload = challenge.payload as ReverseChallengePayload;
      return { type: challenge.type, reversedWord: payload.reversedWord };
    }
  }
}
