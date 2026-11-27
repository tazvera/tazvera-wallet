# Design to code map

This document maps approved visual design work to the wallet's existing stylesheets.
Keep changes presentational: do not change wallet state, key storage, PIN checks,
signing, transaction construction, RPC behavior, or navigation logic as part of a
visual redesign.

## Shared layout

| Design area | Existing file | Responsibility |
|---|---|---|
| Phone layout | `app/layout/mobile.css` | Mobile app width, safe-area spacing, bottom navigation and phone-only layout |
| Desktop application frame | `app/features/shell/shell-desktop.css` | Desktop page frame, left offset, shared content width and desktop typography |
| Desktop navigation | `app/features/nav/nav-desktop.css` | Desktop navigation/sidebar presentation |
| Shared base styles | `app/css/app.css` | Existing shared components and styles used across screen sizes |
| Theme colours | `app/theme/colors.css` | Design tokens and light/dark theme colours |

## Screen-specific desktop styles

| Design area | Existing file | Responsibility |
|---|---|---|
| Home | `app/features/home/home-desktop.css` | Desktop home screen and home cards |
| Send | `app/features/send/send-desktop.css` | Desktop send screen |
| Receive | `app/features/receive/receive-desktop.css` | Desktop receive screen |
| Request | `app/features/request/request-desktop.css` | Desktop request screen |
| Activity | `app/features/activity/activity-desktop.css` | Desktop activity/history screen |
| Explore | `app/features/explore/explore-desktop.css` | Desktop Explore screen |
| Learn | `app/features/learn/learn-desktop.css` | Desktop Learn screen |
| Security | `app/features/security/security-desktop.css` | Desktop security screen |
| Browser | `app/features/browser/browser-desktop.css` and `app/features/browser/browser-mobile.css` | Browser layout for desktop and mobile |
| Settings | `app/features/settings/settings-shared.css` and `app/features/settings/settings-desktop.css` | Shared settings rows and desktop settings layout |
| Assistant | `app/features/assistant/assistant-desktop.css` | Desktop assistant layout |

## dApps marketplace and browser start page

| Design area | Existing file | Responsibility |
|---|---|---|
| Local dApps data | `app/browser/dapps/catalog.json` | Single curated source of names, descriptions, exact domains, supported networks, generated icon marks, bookmarks, featured/popular flags and provenance metadata |
| dApps and browser start-page markup | `app/browser/dapps/dapps.js` | Reads only the same-origin catalogue JSON and renders only entries with documented WalletConnect support; no site opening, connection, permission or signing action |
| dApps and browser styling | `app/features/browser/dapps-catalog.css` | Approved Gemini layout measurements, dark palette and supplied Space Grotesk, Mukta and IBM Plex Mono fonts |

Approved dApps measurements: outer frame `100%`, max-width `1280px`, padding `28px 36px 56px`; main section gap `24px`; header gap `16px`; icon chip `44px` minimum; card radius `18px`; chip radius `12px`; small container radius `14px`; card padding `24px` (up to `28px` where specified); popular row approximately `72px` with `1px` dividers. Desktop uses two columns; narrow screens stack the columns. Featured cards scroll horizontally with the next card partly visible.

Approved dApps palette: background `#050806`, card `#0B100D`, bright green `#4CF27E`, deep green `#016B57`; text on green is near-black. Use only `SpaceGrotesk-Medium`, `SpaceGrotesk-Bold`, `Mukta-Regular`, `Mukta-Bold`, and `IBMPlexMono-Regular` for this screen. dApp marks are generated locally from a letter or simple mark; no external logos or image URLs. Candidate entries without confirmed WalletConnect support remain in the same JSON but are not rendered until verified.

## Implementation rules

- Prefer the narrowest existing stylesheet that owns the visual component.
- Put phone-specific rules in `mobile.css`; put desktop-only rules in the
  matching `*-desktop.css` file and retain its desktop media query.
- Put genuinely cross-device component rules in the shared component stylesheet.
- Do not add duplicate selectors to `app.css` when a feature stylesheet already owns them.
- Do not change HTML/JavaScript behavior merely to achieve spacing, colour, alignment,
  typography, or responsive-layout changes.
- Preserve the existing CSS load order in `index.html`.
