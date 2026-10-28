/*
 * Picks the daily puzzle. Every player gets the same five weapons on the same
 * day because the choice is seeded from the puzzle number, not random.
 */
(function () {
  "use strict";
  const C = window.HUNTLE_CONFIG;
  const WEAPONS = window.HUNTLE_WEAPONS;
  const DAY = 86400000;
  const HOUR = 3600000;

  // Day index that flips at resetHour Argentina time.
  function dayIndexAt(ms) {
    return Math.floor((ms + C.utcOffsetHours * HOUR - C.resetHour * HOUR) / DAY);
  }

  function launchIndex() {
    const [y, m, d] = C.launchDate.split("-").map(Number);
    return Date.UTC(y, m - 1, d) / DAY;
  }

  function numberAt(ms) {
    return dayIndexAt(ms) - launchIndex() + 1;
  }

  function nextResetMs(ms) {
    return (dayIndexAt(ms) + 1) * DAY - C.utcOffsetHours * HOUR + C.resetHour * HOUR;
  }

  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(list, seed) {
    const rand = mulberry32(hashStr(seed));
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function answerPool() {
    return WEAPONS.filter((w) => w.inPool !== false).map((w) => w.id).sort();
  }

  // Weapons are dealt from a shuffled deck, five per day, so no weapon repeats
  // until the whole pool has been used. Then a new deck is shuffled.
  function puzzleForNumber(n) {
    const k = C.roundsPerDay;
    const fixed = C.schedule && C.schedule[n];
    if (fixed) return { number: n, answers: fixed.slice(0, k) };

    const pool = answerPool();
    if (pool.length < k) {
      throw new Error(`Huntle needs at least ${k} weapons in the answer pool, found ${pool.length}.`);
    }
    const perDeck = Math.floor(pool.length / k);
    const idx = n - 1;
    const deck = Math.floor(idx / perDeck);
    const slot = idx - deck * perDeck;
    const order = shuffled(pool, C.seedSalt + ":" + deck);
    return { number: n, answers: order.slice(slot * k, slot * k + k) };
  }

  window.HuntleDaily = {
    hashStr,
    currentNumber: () => numberAt(Date.now()),
    nextResetMs: () => nextResetMs(Date.now()),
    today: () => puzzleForNumber(numberAt(Date.now())),
    puzzleForNumber,
  };
})();
