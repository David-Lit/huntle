/*
 * The weapon list. Every weapon here appears as a guess option.
 * Names follow the Hunt: Showdown 1896 wiki (huntshowdown.wiki.gg/wiki/Weapons),
 * grouped by ammo type like the wiki. Melee weapons are left out, and so are
 * variants (Shorty, Precision, Match...) since they sound like the base weapon,
 * and silencers, which are too hard to tell apart. The Vetterli 71 Cyclone and
 * Mosin-Nagant Avtomat are kept because they sound different.
 *
 * Fields:
 *   id        Unique, lowercase, dashes. Also the default file name:
 *             assets/audio/<id>.mp3 and assets/images/<id>.png
 *   name      Name shown to players.
 *   category  One of the keys in config.js "categories".
 *   family    Optional. Weapons with the same family are variants of one gun.
 *             Guessing the right family but wrong variant scores a yellow (partial).
 *   soundGroup Optional. Weapons with the same soundGroup sound identical, so
 *             guessing any of them counts as correct. They are treated as one
 *             answer, and the first one listed here supplies the sound file.
 *   aliases   Optional. Extra search terms (old pre-1896 names go here).
 *   audio     Optional. Custom audio file name (e.g. "winfield.ogg").
 *   image     Optional. Custom image file name (e.g. "winfield.jpg").
 *   inPool    Optional. Set to false to keep the weapon as a guess option but
 *             never use it as an answer (e.g. you have no sound for it yet).
 */
window.HUNTLE_WEAPONS = [
  // Compact ammo
  { id: "ranger-73", name: "Ranger 73", category: "compact", family: "73", soundGroup: "73", aliases: ["winfield"] },
  { id: "frontier-73c", name: "Frontier 73C", category: "compact", family: "73", soundGroup: "73", aliases: ["winfield"] },
  { id: "infantry-73l", name: "Infantry 73L", category: "compact", family: "73", soundGroup: "73", aliases: ["winfield"] },
  { id: "vandal-73c", name: "Vandal 73C", category: "compact", family: "73", aliases: ["winfield"] },
  { id: "marathon", name: "Marathon", category: "compact" },
  { id: "lemat", name: "LeMat", category: "compact", aliases: ["LeMat Carbine", "lemat mark ii"] },
  { id: "officer", name: "Officer", category: "compact", aliases: ["Officer Carbine", "nagant officer"] },
  { id: "bornheim-no-3", name: "Bornheim No. 3", category: "compact", aliases: ["Bornheim No. 3 Match"] },
  { id: "nagant-m1895", name: "Nagant M1895", category: "compact", aliases: ["Nagant M1895 Precision"] },
  { id: "conversion", name: "Conversion", category: "compact", aliases: ["caldwell conversion"] },
  { id: "new-army", name: "New Army", category: "compact", aliases: ["caldwell 92"] },

  // Medium ammo
  { id: "centennial", name: "Centennial", category: "medium", aliases: ["Centennial Shorty", "winfield 1876"] },
  { id: "drilling", name: "Drilling", category: "medium", aliases: ["Drilling Shorty"] },
  { id: "maynard-sniper", name: "Maynard Sniper", category: "medium" },
  { id: "springfield-1866", name: "Springfield 1866", category: "medium", aliases: ["Springfield 1866 Shorty"] },
  { id: "vetterli-71", name: "Vetterli 71", category: "medium", family: "vetterli-71", aliases: ["karabiner"] },
  { id: "vetterli-71-cyclone", name: "Vetterli 71 Cyclone", category: "medium", family: "vetterli-71", aliases: ["cyclone"] },
  { id: "scottfield", name: "Scottfield", category: "medium", aliases: ["Scottfield Precision", "model 3"] },
  { id: "wildland", name: "Wildland", category: "medium", aliases: ["scarce"] },
  { id: "1865-carbine", name: "1865 Carbine", category: "medium" },
  { id: "pax", name: "Pax", category: "medium", aliases: ["caldwell pax"] },

  // Long ammo
  { id: "mako-1895", name: "Mako 1895", category: "long" },
  { id: "martini-henry", name: "Martini-Henry", category: "long", aliases: ["ic1"] },
  { id: "sparks", name: "Sparks", category: "long", aliases: ["Sparks Pistol", "sparks lrr"] },
  { id: "1890-cavalry", name: "1890 Cavalry", category: "long" },
  { id: "uppercut", name: "Uppercut", category: "long", aliases: ["Uppercut Precision", "caldwell"] },
  { id: "haymaker", name: "Haymaker", category: "long" },

  // Special long ammo
  { id: "krag", name: "Krag", category: "special-long", aliases: ["springfield m1892"] },
  { id: "lebel-1886", name: "Lebel 1886", category: "special-long" },
  { id: "mosin-nagant", name: "Mosin-Nagant", category: "special-long", family: "mosin-nagant", aliases: ["m1891"] },
  { id: "mosin-nagant-avtomat", name: "Mosin-Nagant Avtomat", category: "special-long", family: "mosin-nagant", aliases: ["avtomat"] },
  { id: "berthier-1892", name: "Berthier 1892", category: "special-long", aliases: ["mle"] },
  { id: "mosin-obrez", name: "Mosin Obrez", category: "special-long", aliases: ["Mosin Obrez Match"] },

  // Shotgun shells
  { id: "auto-5", name: "Auto-5", category: "shells", aliases: ["crown king"] },
  { id: "auto-4-shorty", name: "Auto-4 Shorty", category: "shells" },
  { id: "homestead-78", name: "Homestead 78", category: "shells", aliases: ["scarce"] },
  { id: "rival-78", name: "Rival 78", category: "shells", aliases: ["Rival 78 Shorty", "caldwell rival"] },
  { id: "romero-77", name: "Romero 77", category: "shells", aliases: ["Romero 77 Shorty"] },
  { id: "slate", name: "Slate", category: "shells", aliases: ["winfield 1893"] },
  { id: "specter-1882", name: "Specter 1882", category: "shells", aliases: ["Specter 1882 Shorty"] },
  { id: "terminus", name: "Terminus", category: "shells", aliases: ["Terminus Shorty", "winfield 1887"] },
  { id: "burgess", name: "Burgess", category: "shells" },

  // Special ammo
  { id: "nitro-express", name: "Nitro Express", category: "special" },
  { id: "crossbow", name: "Crossbow", category: "special" },
  { id: "bomb-lance", name: "Bomb Lance", category: "special" },
  { id: "dolch-96", name: "Dolch 96", category: "special", aliases: ["Dolch 96 Precision"] },
  { id: "hunting-bow", name: "Hunting Bow", category: "special", aliases: ["bow"] },
  { id: "bomb-launcher", name: "Bomb Launcher", category: "special" },
  { id: "chu-ko-nu", name: "Chu Ko Nu", category: "special" },
  { id: "flame-rifle", name: "Flame Rifle", category: "special", aliases: ["scarce"] },
  { id: "hand-crossbow", name: "Hand Crossbow", category: "special" },
];
