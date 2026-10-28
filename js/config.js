/*
 * Huntle settings. Everything you are likely to tweak lives here or in weapons.js.
 */
window.HUNTLE_CONFIG = {
  roundsPerDay: 5,

  // A new puzzle starts every day at this hour, Argentina time.
  // 0 = midnight, 12 = noon.
  resetHour: 0,
  // Argentina is UTC-3 all year (no daylight saving).
  utcOffsetHours: -3,
  // The Argentina date on which puzzle #1 went live (at resetHour).
  launchDate: "2026-10-28",

  // Where your files live, and the default file extensions.
  // A weapon with id "ranger-73" loads assets/audio/ranger-73.mp3
  // and assets/images/ranger-73.png, unless the weapon sets its own
  // "audio" or "image" filename in weapons.js.
  audioDir: "assets/audio/",
  imageDir: "assets/images/",
  audioExt: ".mp3",
  imageExt: ".png",

  // While audio files are missing, play a synthetic gunshot so the game is
  // testable. Set to false once all your sounds are in.
  placeholderAudio: true,

  // Changing this reshuffles every future (and past) puzzle.
  seedSalt: "huntle-v1",

  // Optional hand-picked puzzles, keyed by puzzle number. These override the
  // random daily pick. Each list must have exactly roundsPerDay weapon ids.
  // Example: schedule: { 1: ["ranger-73", "romero-77", "dolch-96", "lebel-1886", "sparks"] }
  schedule: {},

  // Link included in the share text. Leave empty to use the page's own URL.
  shareUrl: "",

  // Filter chips shown above the weapon list: [key, chip label, label on the
  // answer screen]. Keys match "category" in weapons.js.
  categories: [
    ["all", "All"],
    ["compact", "Compact", "Compact ammo"],
    ["medium", "Medium", "Medium ammo"],
    ["long", "Long", "Long ammo"],
    ["special-long", "Special Long", "Special long ammo"],
    ["shells", "Shotgun", "Shotgun shells"],
    ["special", "Special", "Special ammo"],
  ],
};
