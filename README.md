# Huntle

A daily Hunt: Showdown sound quiz. Each day players hear five gunshots and name the weapon behind each one. A new set goes live every day at midnight Argentina time, and every player gets the same five shots.

It is a plain static website (HTML, CSS and JavaScript) with no build step and no server code.

## Adding your sounds and images

Each weapon in `js/weapons.js` has an `id`. Name your files after that id:

```
assets/audio/ranger-73.mp3
assets/images/ranger-73.png
```

That's it. Nothing else needs to change.

- **Other formats:** change `audioExt` / `imageExt` in `js/config.js` (for example `.ogg` or `.webp`), or give one weapon its own file name with `audio: "file.ogg"` / `image: "file.jpg"` in `weapons.js`.
- **Images** are already in: the 512×128 weapon pictures from the Hunt: Showdown wiki (art © Crytek, credited in the page footer). They show in a 4:1 box, so replacements should be wide side views on a transparent background. If an image is missing, the card shows the weapon's initials.
- **Sounds** are recorded in the in-game Item Viewer at 0 m: the shot and its echo, cut before any cocking or reload sound. Keep new ones short (one shot, about 1–3 seconds). Until a sound exists, a synthetic placeholder shot plays. When all your sounds are in, set `placeholderAudio: false` in `js/config.js`.
- **Weapons you have no sound for:** add `inPool: false` to that weapon. It stays in the guess list but is never an answer.

## Editing weapons

`js/weapons.js` follows the 1896 names on the [Hunt: Showdown wiki](https://huntshowdown.wiki.gg/wiki/Weapons), grouped by ammo type. Melee weapons are left out, and so are variants (Shorty, Precision, Match and so on) because they sound the same as their base weapon (the Vetterli 71 Cyclone, Mosin-Nagant Avtomat and Sparks Pistol are exceptions, as they sound different). Variant names are search words on the base weapon, so searching "Romero 77 Shorty" finds the Romero 77. Silencers are left out too, as they are too hard to tell apart. Add, rename or remove entries freely. Weapons that share a `family` (for example the Vandal 73C and the Ranger 73) are related guns: mixing them up scores yellow instead of red. `aliases` adds extra search words.

Weapons that sound identical (for example the Ranger, Frontier and Infantry) share a `soundGroup`. Any of them counts as a correct guess. Only one of them is ever an answer and needs a sound file; the others are marked `inPool: false`.

## Changing weapons after launch

Every player gets the same five shots each day because the puzzles are dealt in a fixed order from shuffled "decks" of weapons. Each day only depends on the days before it, so you can change the weapon list without changing a puzzle people already played, as long as you date the change for **tomorrow or later** (Argentina time):

- **Add a weapon:** add its entry, sound and image, with `since: "YYYY-MM-DD"`. It joins the next deck shuffled from that date.
- **Retire a weapon:** add `until: "YYYY-MM-DD"` (its last possible day). Later days skip it.
- **Turn on a held-back weapon** (one with `inPool: false`, like the Homestead 78): replace `inPool: false` with `since: "YYYY-MM-DD"`.
- **Group two weapons that sound the same:** give both the same `soundGroup`, and put `until: "YYYY-MM-DD"` (today's date) on the one that should stop being an answer. Guessing it still counts as correct from then on.

Renaming a weapon, fixing a search word, swapping an image or re-cutting a sound never affects the puzzle order. Changing `seedSalt`, `launchDate` or `roundsPerDay` reshuffles everything, so leave them alone after launch.

## Settings (`js/config.js`)

| Setting | What it does |
| --- | --- |
| `resetHour` | Hour the new puzzle starts, Argentina time (0 = midnight, 12 = noon) |
| `launchDate` | Argentina date of puzzle #1 |
| `roundsPerDay` | Shots per day (5) |
| `schedule` | Hand-picked puzzles by number, overriding the random pick |
| `shareUrl` | Link used in the "Share result" text |
| `seedSalt` | Changing it reshuffles all puzzles |

## Color themes

Players pick a theme with the gear button (Settings). The choice is saved on their device.

- **Sepia & Gold** (default) is defined in `css/styles.css`.
- **Bone & Ash**, **Bayou Night** and **Blood & Rust** live in `css/themes.css`. Each applies when the page has `data-theme="<id>"`, and they all use the same set of rules, so they cover the same parts of the page.
- The list shown in Settings is `themes` in `js/config.js`. To add a theme, add its rules to `css/themes.css` and an entry there.

All three extra themes together add about 2 KB to the page, and switching is instant.

## Running it on your computer

Browsers block some features when a page is opened straight from a file, so serve the folder locally:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Testing tricks

- `?day=7` plays puzzle #7 (no stats are saved). Handy to check upcoming puzzles.
- `?reset=1` clears your saved progress and stats on that browser.

## Putting it online (free)

Any static host works. Two easy options:

- **Netlify Drop:** go to https://app.netlify.com/drop and drag the `huntle` folder onto the page.
- **GitHub Pages:** push this folder to a GitHub repository, then in the repo go to Settings → Pages and set the source to the main branch.

## Link previews and app icon

- `assets/og-image.png` (1200×630) is the picture shown when the game's link is posted on Discord, Reddit, iMessage, WhatsApp or X. The tags that point to it are at the top of `index.html`.
- Those tags need full web addresses, currently `https://huntle.pages.dev/`. **If the game moves to its own domain, update the four `huntle.pages.dev` addresses in `index.html`** (and `shareUrl` in `js/config.js`).
- `assets/apple-touch-icon.png`, `assets/icon-192.png`, `assets/icon-512.png` and `manifest.webmanifest` give the game a proper icon when saved to a phone's home screen. Opened from there, it runs full screen like an app.

## How it works

- `js/daily.js` turns the current time into a puzzle number (it flips at 03:00 UTC, which is midnight in Argentina) and deals five weapons from a deck shuffled with that number as the seed. No weapon repeats until the whole pool has been used.
- `js/app.js` runs the game. Progress and stats are saved in the player's browser (`localStorage`), so there are no accounts and no server.
- `js/audio.js` plays the sounds, with the placeholder fallback.

Players who open the browser's developer tools can see the audio file names and so the answers. That's normal for games like this. If it matters, give the files meaningless names and point to them with the `audio` field.
