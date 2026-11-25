# articulation-quest

fun litto quests to refine speech for charisma in a public professional setting

**Live:** https://articulation-quest-wh1z4i.freebuff.site

The game lives in three files inside `public/`: [`index.html`](public/index.html) is the markup, [`style.css`](public/style.css) holds every colour, font and layout rule, and [`game.js`](public/game.js) holds the day content and all game logic. `worker/index.js` just serves those static files, and `deploy.json` is the manifest used to publish it.

To preview locally: `python3 -m http.server 3000 --bind 0.0.0.0 --directory public`
