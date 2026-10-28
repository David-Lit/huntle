# Huntle

A daily Hunt: Showdown sound quiz. Each day players hear five gunshots and name the weapon behind each one. A new set goes live every day at midnight Argentina time, and every player gets the same five shots.

It is a plain static website (HTML, CSS and JavaScript) with no build step and no server code.

## Adding your sounds and images

Each weapon in `js/weapons.js` has an `id`. Name your files after that id:

```
assets/audio/winfield-m1873.mp3
assets/images/winfield-m1873.png
```

That's it. Nothing else needs to change.

- **Other formats:** change `audioExt` / `imageExt` in `js/config.js` (for example `.ogg` or `.webp`), or give one weapon its own file name with `audio: "file.ogg"` / `image: "file.jpg"` in `weapons.js`.
- **Images** show at a 16:9 shape and are scaled to fit, so a weapon side view on a transparent background looks best. Until an image exists, the card shows the weapon's initials.
- **Sounds:** keep them short (one shot, about 1–3 seconds). Until a sound exists, a synthetic placeholder shot plays. When all your sounds are in, set `placeholderAudio: false` in `js/config.js`.
- **Weapons you have no sound for:** add `inPool: false` to that weapon. It stays in the guess list but is never an answer.

## Editing weapons

`js/weapons.js` is a starter list. Add, rename or remove entries freely. Weapons that share a `family` (for example the Winfield M1873 and M1873C) are variants of one gun: guessing the wrong variant scores yellow instead of red. `aliases` adds extra search words.

Note: the daily picks are shuffled from the answer pool, so adding or removing weapons changes upcoming puzzles. That's fine before launch. After launch, prefer adding weapons in batches.

## Settings (`js/config.js`)

| Setting | What it does |
| --- | --- |
| `resetHour` | Hour the new puzzle starts, Argentina time (0 = midnight, 12 = noon) |
| `launchDate` | Argentina date of puzzle #1 |
| `roundsPerDay` | Shots per day (5) |
| `schedule` | Hand-picked puzzles by number, overriding the random pick |
| `shareUrl` | Link used in the "Share result" text |
| `seedSalt` | Changing it reshuffles all puzzles |

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

## How it works

- `js/daily.js` turns the current time into a puzzle number (it flips at 03:00 UTC, which is midnight in Argentina) and deals five weapons from a deck shuffled with that number as the seed. No weapon repeats until the whole pool has been used.
- `js/app.js` runs the game. Progress and stats are saved in the player's browser (`localStorage`), so there are no accounts and no server.
- `js/audio.js` plays the sounds, with the placeholder fallback.

Players who open the browser's developer tools can see the audio file names and so the answers. That's normal for games like this. If it matters, give the files meaningless names and point to them with the `audio` field.
