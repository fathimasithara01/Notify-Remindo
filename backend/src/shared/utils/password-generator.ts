// import crypto from 'crypto';

// const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O — avoid visual ambiguity
// const LOWERCASE = 'abcdefghijkmnpqrstuvwxyz';
// const DIGITS = '23456789'; // no 0/1 — avoid visual ambiguity
// const SYMBOLS = '!@#$%^&*';
// const ALL = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;

// function randomChar(pool: string): string {
//   const index = crypto.randomInt(0, pool.length);
//   return pool[index];
// }

// /** Generates a random password that always satisfies common strength rules
//  * (upper, lower, digit, symbol) and avoids visually-ambiguous characters
//  * since an admin will be reading this out loud or copy-pasting it. */
// export function generateTempPassword(length = 12): string {
//   const required = [
//     randomChar(UPPERCASE),
//     randomChar(LOWERCASE),
//     randomChar(DIGITS),
//     randomChar(SYMBOLS),
//   ];

//   const remainingLength = Math.max(length - required.length, 0);
//   const rest = Array.from({ length: remainingLength }, () => randomChar(ALL));

//   const chars = [...required, ...rest];

//   // Fisher-Yates shuffle so the required chars aren't always in the same
//   // position (e.g. always-uppercase-first looks suspicious/guessable).
//   for (let i = chars.length - 1; i > 0; i--) {
//     const j = crypto.randomInt(0, i + 1);
//     [chars[i], chars[j]] = [chars[j], chars[i]];
//   }

//   return chars.join('');
// }