/*
 * The weapon list. Every weapon here appears as a guess option.
 *
 * Fields:
 *   id        Unique, lowercase, dashes. Also the default file name:
 *             assets/audio/<id>.mp3 and assets/images/<id>.png
 *   name      Name shown to players.
 *   category  One of the keys in config.js "categories".
 *   family    Optional. Weapons with the same family are variants of one gun.
 *             Guessing the right family but wrong variant scores a yellow (partial).
 *   aliases   Optional. Extra search terms.
 *   audio     Optional. Custom audio file name (e.g. "winfield.ogg").
 *   image     Optional. Custom image file name (e.g. "winfield.jpg").
 *   inPool    Optional. Set to false to keep the weapon as a guess option but
 *             never use it as an answer (e.g. you have no sound for it yet).
 *
 * This is a starter list: add, rename or remove entries freely.
 */
window.HUNTLE_WEAPONS = [
  // Rifles
  { id: "winfield-m1873", name: "Winfield M1873", category: "rifle", family: "winfield-1873" },
  { id: "winfield-m1873c", name: "Winfield M1873C", category: "rifle", family: "winfield-1873" },
  { id: "winfield-m1876-centennial", name: "Winfield M1876 Centennial", category: "rifle" },
  { id: "springfield-1866", name: "Springfield 1866", category: "rifle", family: "springfield-1866" },
  { id: "springfield-1866-compact", name: "Springfield 1866 Compact", category: "rifle", family: "springfield-1866" },
  { id: "springfield-m1892-krag", name: "Springfield M1892 Krag", category: "rifle", aliases: ["krag"] },
  { id: "vetterli-71-karabiner", name: "Vetterli 71 Karabiner", category: "rifle" },
  { id: "martini-henry-ic1", name: "Martini-Henry IC1", category: "rifle" },
  { id: "mosin-nagant-m1891", name: "Mosin-Nagant M1891", category: "rifle", family: "mosin" },
  { id: "mosin-nagant-m1891-obrez", name: "Mosin-Nagant M1891 Obrez", category: "rifle", family: "mosin", aliases: ["obrez"] },
  { id: "lebel-1886", name: "Lebel 1886", category: "rifle" },
  { id: "berthier-mle-1892", name: "Berthier Mle 1892", category: "rifle" },
  { id: "sparks-lrr", name: "Sparks LRR", category: "rifle" },
  { id: "nitro-express-rifle", name: "Nitro Express Rifle", category: "rifle", aliases: ["nitro"] },
  { id: "mako-1895-carbine", name: "Mako 1895 Carbine", category: "rifle" },
  { id: "nagant-m1895-officer-carbine", name: "Nagant M1895 Officer Carbine", category: "rifle" },
  { id: "avtomat", name: "Avtomat", category: "rifle" },
  { id: "drilling", name: "Drilling", category: "rifle" },

  // Pistols
  { id: "caldwell-92-new-army", name: "Caldwell 92 New Army", category: "pistol" },
  { id: "caldwell-conversion-pistol", name: "Caldwell Conversion Pistol", category: "pistol" },
  { id: "caldwell-conversion-uppercut", name: "Caldwell Conversion Uppercut", category: "pistol", aliases: ["uppercut"] },
  { id: "caldwell-pax", name: "Caldwell Pax", category: "pistol", aliases: ["pax"] },
  { id: "dolch-96", name: "Dolch 96", category: "pistol" },
  { id: "nagant-m1895", name: "Nagant M1895", category: "pistol", family: "nagant-m1895" },
  { id: "nagant-m1895-officer", name: "Nagant M1895 Officer", category: "pistol", family: "nagant-m1895" },
  { id: "scottfield-model-3", name: "Scottfield Model 3", category: "pistol" },
  { id: "lemat-mark-ii", name: "LeMat Mark II", category: "pistol", aliases: ["lemat"] },
  { id: "bornheim-no3", name: "Bornheim No. 3", category: "pistol" },

  // Shotguns
  { id: "romero-77", name: "Romero 77", category: "shotgun" },
  { id: "caldwell-rival-78", name: "Caldwell Rival 78", category: "shotgun", aliases: ["rival"] },
  { id: "specter-1882", name: "Specter 1882", category: "shotgun" },
  { id: "crown-king-auto-5", name: "Crown & King Auto-5", category: "shotgun", aliases: ["auto 5", "auto5"] },
  { id: "winfield-1887-terminus", name: "Winfield 1887 Terminus", category: "shotgun", aliases: ["terminus"] },
  { id: "winfield-1893-slate", name: "Winfield 1893 Slate", category: "shotgun", aliases: ["slate"] },

  // Special
  { id: "hunting-bow", name: "Hunting Bow", category: "special", aliases: ["bow"] },
  { id: "hand-crossbow", name: "Hand Crossbow", category: "special", aliases: ["crossbow"] },
  { id: "bomb-lance", name: "Bomb Lance", category: "special" },
];
