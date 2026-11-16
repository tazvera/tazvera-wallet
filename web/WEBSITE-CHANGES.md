# Website: what changed

The landing page was one HTML file of 1295 KB. Every visitor downloaded all of it before the first
pixel appeared: 13 screenshots inlined as base64 (both the English and the Hindi set), six Poppins
weights inlined as base64, the favicon, the logo and the QR code. None of it could be cached
separately, compressed, or loaded lazily.

Now the page is 62 KB and the rest arrives as normal files the browser caches.

## Numbers

| | before | after |
|---|---|---|
| `index.html` | 1295 KB | **62 KB** |
| First view (html + js + css + one font + hero image) | 1295 KB | **170 KB** |
| Whole page, every image, both languages | 1295 KB | 978 KB |
| Fonts | inlined, all 6, 143 KB | separate files, 108 KB, only the weights used |
| JavaScript | inline in the page | `app.js`, 3 KB, cacheable |

The 170 KB is the honest first-paint number: everything below the fold is lazy-loaded, and the Hindi
screenshots are not fetched at all unless the visitor switches language.

## What was done

**Assets pulled out of the HTML.** The 6 screenshot pairs became `img/screen1-en.jpg` …
`img/screen6-hi.jpg`, the founder photo, the TZV mark, the logo, the favicon and the QR code.
The hero image is preloaded with `fetchpriority="high"`; the rest keep `loading="lazy"`.
Every `<img>` keeps its `width`/`height`, so the layout no longer jumps while images arrive.

**Fonts split properly.** Six `@font-face` blocks moved to `fonts.css` with one file per weight.
The two Devanagari subsets keep their `unicode-range` — I checked the original file, because dropping
that would have served the Hindi font to English text and broken Hindi rendering.

**Script out of the page.** The inline `<script>` became `app.js` with `defer`. That is what makes a
strict CSP possible: the policy is now `script-src 'self'` with no `'unsafe-inline'` for scripts.

**Security headers.** New `web/vercel.json` with the same set the app got: CSP (with
`frame-ancestors 'none'`, `form-action 'none'`), HSTS, COOP, CORP, `nosniff`, `Referrer-Policy` and a
tighter `Permissions-Policy`. `img/` and `fonts/` get `Cache-Control: immutable` for a year, because
the filenames carry a content hash.

**SEO.** `rel="canonical"` (you have two domains, this tells Google which page is the real one),
JSON-LD for `Organization`, `SoftwareApplication` and `WebSite` with the MIT licence and the free
offer, and a `sitemap.xml` that now lists all three pages with `lastmod` and priority.

**Accessibility and polish.** `prefers-reduced-motion` (the smooth scroll now only applies when the
visitor has not asked for less motion), a visible green `:focus-visible` ring, `scroll-margin-top` on
sections so the sticky header no longer covers the heading you jumped to, `text-wrap: balance` on
headings, a hover lift on the feature cards, an underline animation on the nav links, a header shadow
on scroll, and two extra breakpoints for small phones.

## How to apply

Upload the whole `web/` folder, keeping the folder structure exactly: `index.html`, `app.js`,
`fonts.css`, `vercel.json`, `sitemap.xml`, `img/` and `fonts/`. The old `index.html` is replaced; the
new `app.js`, `fonts.css`, `img/` and `fonts/` are new files, so if your uploader has an "upload
folder" option, use it.

## Not done, your call

`web/og.png` (300 KB) and `web/og3.png` (371 KB) are not referenced anywhere. I left them in place
because deleting files is your decision, but they can go.
