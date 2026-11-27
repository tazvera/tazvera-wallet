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

## Implementation rules

- Prefer the narrowest existing stylesheet that owns the visual component.
- Put phone-specific rules in `mobile.css`; put desktop-only rules in the
  matching `*-desktop.css` file and retain its desktop media query.
- Put genuinely cross-device component rules in the shared component stylesheet.
- Do not add duplicate selectors to `app.css` when a feature stylesheet already owns them.
- Do not change HTML/JavaScript behavior merely to achieve spacing, colour, alignment,
  typography, or responsive-layout changes.
- Preserve the existing CSS load order in `index.html`.
