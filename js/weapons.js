/*
 * The weapon list. Every weapon here appears as a guess option.
 * Names follow the Hunt: Showdown 1896 wiki (huntshowdown.wiki.gg/wiki/Weapons),
 * grouped by ammo type like the wiki. Melee weapons are left out.
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
  { id: "lemat", name: "LeMat", category: "compact", family: "lemat", aliases: ["lemat mark ii"] },
  { id: "lemat-carbine", name: "LeMat Carbine", category: "compact", family: "lemat" },
  { id: "officer", name: "Officer", category: "compact", family: "officer", aliases: ["nagant officer"] },
  { id: "officer-carbine", name: "Officer Carbine", category: "compact", family: "officer", aliases: ["nagant officer carbine"] },
  { id: "bornheim-no-3", name: "Bornheim No. 3", category: "compact", family: "bornheim" },
  { id: "bornheim-no-3-match", name: "Bornheim No. 3 Match", category: "compact", family: "bornheim" },
  { id: "nagant-m1895", name: "Nagant M1895", category: "compact", family: "nagant-m1895" },
  { id: "nagant-m1895-precision", name: "Nagant M1895 Precision", category: "compact", family: "nagant-m1895" },
  { id: "conversion", name: "Conversion", category: "compact", aliases: ["caldwell conversion"] },
  { id: "new-army", name: "New Army", category: "compact", aliases: ["caldwell 92"] },

  // Medium ammo
  { id: "centennial", name: "Centennial", category: "medium", family: "centennial", aliases: ["winfield 1876"] },
  { id: "centennial-shorty", name: "Centennial Shorty", category: "medium", family: "centennial" },
  { id: "drilling", name: "Drilling", category: "medium", family: "drilling" },
  { id: "drilling-shorty", name: "Drilling Shorty", category: "medium", family: "drilling" },
  { id: "maynard-sniper", name: "Maynard Sniper", category: "medium", family: "maynard" },
  { id: "maynard-sniper-silencer", name: "Maynard Sniper Silencer", category: "medium", family: "maynard" },
  { id: "springfield-1866", name: "Springfield 1866", category: "medium", family: "springfield-1866" },
  { id: "springfield-1866-shorty", name: "Springfield 1866 Shorty", category: "medium", family: "springfield-1866" },
  { id: "vetterli-71", name: "Vetterli 71", category: "medium", family: "vetterli-71", aliases: ["karabiner"] },
  { id: "vetterli-71-cyclone", name: "Vetterli 71 Cyclone", category: "medium", family: "vetterli-71" },
  { id: "scottfield", name: "Scottfield", category: "medium", family: "scottfield", aliases: ["model 3"] },
  { id: "scottfield-precision", name: "Scottfield Precision", category: "medium", family: "scottfield" },
  { id: "wildland", name: "Wildland", category: "medium", aliases: ["scarce"] },
  { id: "1865-carbine", name: "1865 Carbine", category: "medium" },
  { id: "pax", name: "Pax", category: "medium", aliases: ["caldwell pax"] },

  // Long ammo
  { id: "mako-1895", name: "Mako 1895", category: "long" },
  { id: "martini-henry", name: "Martini-Henry", category: "long", aliases: ["ic1"] },
  { id: "sparks", name: "Sparks", category: "long", family: "sparks", aliases: ["sparks lrr"] },
  { id: "sparks-pistol", name: "Sparks Pistol", category: "long", family: "sparks" },
  { id: "1890-cavalry", name: "1890 Cavalry", category: "long" },
  { id: "uppercut", name: "Uppercut", category: "long", family: "uppercut", aliases: ["caldwell"] },
  { id: "uppercut-precision", name: "Uppercut Precision", category: "long", family: "uppercut" },
  { id: "haymaker", name: "Haymaker", category: "long" },

  // Special long ammo
  { id: "krag", name: "Krag", category: "special-long", aliases: ["springfield m1892"] },
  { id: "lebel-1886", name: "Lebel 1886", category: "special-long" },
  { id: "mosin-nagant", name: "Mosin-Nagant", category: "special-long", aliases: ["m1891"] },
  { id: "berthier-1892", name: "Berthier 1892", category: "special-long", aliases: ["mle"] },
  { id: "mosin-obrez", name: "Mosin Obrez", category: "special-long", family: "mosin-obrez" },
  { id: "mosin-obrez-match", name: "Mosin Obrez Match", category: "special-long", family: "mosin-obrez" },

  // Shotgun shells
  { id: "auto-5", name: "Auto-5", category: "shells", aliases: ["crown king"] },
  { id: "auto-4-shorty", name: "Auto-4 Shorty", category: "shells" },
  { id: "homestead-78", name: "Homestead 78", category: "shells", aliases: ["scarce"] },
  { id: "rival-78", name: "Rival 78", category: "shells", family: "rival-78", aliases: ["caldwell rival"] },
  { id: "rival-78-shorty", name: "Rival 78 Shorty", category: "shells", family: "rival-78" },
  { id: "romero-77", name: "Romero 77", category: "shells", family: "romero-77" },
  { id: "romero-77-shorty", name: "Romero 77 Shorty", category: "shells", family: "romero-77" },
  { id: "slate", name: "Slate", category: "shells", aliases: ["winfield 1893"] },
  { id: "specter-1882", name: "Specter 1882", category: "shells", family: "specter-1882" },
  { id: "specter-1882-shorty", name: "Specter 1882 Shorty", category: "shells", family: "specter-1882" },
  { id: "terminus", name: "Terminus", category: "shells", family: "terminus", aliases: ["winfield 1887"] },
  { id: "terminus-shorty", name: "Terminus Shorty", category: "shells", family: "terminus" },
  { id: "burgess", name: "Burgess", category: "shells" },

  // Special ammo
  { id: "nitro-express", name: "Nitro Express", category: "special" },
  { id: "crossbow", name: "Crossbow", category: "special" },
  { id: "shredder", name: "Shredder", category: "special", aliases: ["scarce"] },
  { id: "bomb-lance", name: "Bomb Lance", category: "special" },
  { id: "dolch-96", name: "Dolch 96", category: "special", family: "dolch-96" },
  { id: "dolch-96-precision", name: "Dolch 96 Precision", category: "special", family: "dolch-96" },
  { id: "hunting-bow", name: "Hunting Bow", category: "special", aliases: ["bow"] },
  { id: "bomb-launcher", name: "Bomb Launcher", category: "special" },
  { id: "chu-ko-nu", name: "Chu Ko Nu", category: "special" },
  { id: "flame-rifle", name: "Flame Rifle", category: "special", aliases: ["scarce"] },
  { id: "hand-crossbow", name: "Hand Crossbow", category: "special" },
];
