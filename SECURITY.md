# Security Policy

Tazvera is a self-custody wallet: keys stay on the user's phone, encrypted with their PIN. Security reports are very welcome.

## Report a problem privately

- Email: **contact@tazvera.com** (subject: `Security`)
- Please **do not** open a public GitHub Issue for security problems.
- Include: what you found, steps to see it, and (if you can) a suggested fix.
- You will get a reply within 7 days.

The Tazvera team will **never** ask for your 12 words, PIN, passwords or money. Anyone who does is a scammer.

## What is in scope

| Area | Where |
|------|-------|
| Wallet app | `index.html`, `app/`, `wallet.js` (app.tazvera.com) |
| Server functions | `api/` |
| Smart contracts | `contracts/Tazvera.sol` (TZV token), `contracts/TazveraLock.sol` (TZV locks) |
| Website | `web/` (tazvera.com) |

Out of scope: problems in third-party services (Shardeum network, Vercel, Google), social engineering, and spam.

## Rewards in TZV

Valid, first-reported security problems can be rewarded in **TZV** from the developer reward pool (not money, and TZV is not for sale):

| Severity | Example | Reward |
|----------|---------|--------|
| Critical | Could steal funds or keys | up to 100,000 TZV |
| High | Could trick users into a wrong payment | up to 25,000 TZV |
| Medium | Real problem with limited impact | up to 5,000 TZV |
| Low | Small issue, hardening idea | up to 1,000 TZV |

Rewards are decided by the maintainer. Please test only with your own wallets and test networks, and give us time to fix the problem before talking about it publicly.

## Automatic checks

Every change is checked automatically and for free:

- **CodeQL** (GitHub) for the app code
- **Slither** (Trail of Bits) for the smart contracts
- **Dependabot** for libraries with known security problems
- **OpenSSF Scorecard** for the project's overall security practices

Contracts were also scanned with Slither on 7 Nov 2026: no issues found. This is an automatic scan, **not** a professional audit.

---

**हिंदी में:** सुरक्षा से जुड़ी कोई कमी मिले, तो सार्वजनिक Issue नहीं, बल्कि **contact@tazvera.com** पर ईमेल कीजिए। सही और पहली बार बताई गई कमी पर **TZV में इनाम** मिल सकता है।
