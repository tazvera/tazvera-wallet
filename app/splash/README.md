# Opening animation (splash)

Everything for the first screen that shows the logo, the name and the tagline.

| File | What it controls |
|---|---|
| `splash.css` | Look and timing: logo pieces (`p1`–`p3`), tile, ring, name letters, tagline, and the fade out. |
| `splash.js` | Hides the splash after 2.7 s (1.4 s in calm / reduced-motion mode), or on tap. |
| `../../index.html` `#splash` | The logo SVG and the text markup. The splash must be in the HTML so it shows before any script loads. |

Where to change things:
- Speed of the logo pieces: `.p1`, `.p2`, `.p3` in `splash.css`.
- Name and tagline text: the `#splash` block in `index.html`.
- How long the splash stays: `setTimeout(out, …)` in `splash.js`. Keep it longer than the last text animation.

Note: the very first screen on a phone (before the web page loads) is the install launch screen. Its colours come from `manifest.webmanifest`, not from this folder.
