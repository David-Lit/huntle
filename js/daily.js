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

  // Puzzle number of an Argentina calendar date ("YYYY-MM-DD").
  function numberOfDate(s) {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d) / DAY - launchIndex() + 1;
  }

  // "since" / "until" in weapons.js, as puzzle numbers.
  const range = new Map(
    WEAPONS.map((w) => [
      w.id,
      { from: w.since ? numberOfDate(w.since) : -Infinity, to: w.until ? numberOfDate(w.until) : Infinity },
    ])
  );

  function eligible(id, n) {
    const r = range.get(id);
    return r.from <= n && n <= r.to;
  }

  // Possible answers on puzzle n. Only one weapon per soundGroup should be an
  // answer (the others have inPool: false or an "until" date); this is spelled out
  // in weapons.js rather than worked out here, so regrouping never rewrites history.
  function poolOn(n) {
    return WEAPONS.filter((w) => w.inPool !== false && eligible(w.id, n))
      .map((w) => w.id)
      .sort();
  }

  // Weapons are dealt day by day from a shuffled deck, so no weapon repeats until
  // the deck runs out; then a new deck is shuffled from the pool on that day.
  // Each day only depends on the days before it, so a weapon added with a future
  // "since" date (or retired with "until") never changes a puzzle already played.
  const dealt = [];
  let deck = [];
  let deckNo = -1;
  let cursor = 0;

  function take(n) {
    const picks = [];
    let i = cursor;
    while (picks.length < C.roundsPerDay && i < deck.length) {
      if (eligible(deck[i], n)) picks.push(deck[i]);
      i++;
    }
    if (picks.length < C.roundsPerDay) return null;
    cursor = i;
    return picks;
  }

  function dealThrough(n) {
    for (let day = dealt.length || 1; day <= n; day++) {
      let picks = take(day);
      if (!picks) {
        deckNo++;
        deck = shuffled(poolOn(day), C.seedSalt + ":" + deckNo);
        cursor = 0;
        picks = take(day);
      }
      if (!picks) {
        throw new Error(`Huntle needs at least ${C.roundsPerDay} weapons in the answer pool on puzzle ${day}.`);
      }
      dealt[day] = picks;
    }
  }

  function puzzleForNumber(n) {
    const k = C.roundsPerDay;
    const fixed = C.schedule && C.schedule[n];
    if (fixed) return { number: n, answers: fixed.slice(0, k) };
    // Days before launch (puzzle 0 and below) get a one-off shuffle.
    if (n < 1) return { number: n, answers: shuffled(poolOn(n), C.seedSalt + ":pre" + n).slice(0, k) };
    dealThrough(n);
    return { number: n, answers: dealt[n].slice() };
  }

  window.HuntleDaily = {
    hashStr,
    currentNumber: () => numberAt(Date.now()),
    nextResetMs: () => nextResetMs(Date.now()),
    today: () => puzzleForNumber(numberAt(Date.now())),
    puzzleForNumber,
  };
})();
