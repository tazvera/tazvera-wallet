# Tazvera Wallet

**A simple, self-custody crypto wallet for everyday payments, in Hindi and English.**

Your keys stay on your phone, locked by your PIN. No MetaMask needed. Built in the open by a solo founder from India.

- App: https://app.tazvera.com
- Website: https://tazvera.com
- X: [@TazveraApp](https://x.com/TazveraApp) · Telegram: [t.me/TazveraApp](https://t.me/TazveraApp) · Discord: [discord.gg/s2tjFdaCVN](https://discord.gg/s2tjFdaCVN)

> ⚠️ **Test version.** Tazvera runs on test networks only (Shardeum Testnet, BNB Testnet, Ethereum Sepolia). Test coins have no value. Nothing here is financial advice.

---

## What it does

- Create or import a wallet inside the app (12 words, encrypted with a 6-digit PIN)
- Send, receive and request coins, with QR codes and a confirm screen before every send
- PIN for every send, app lock, auto-lock and fingerprint unlock
- Market prices, price converter, price alarms, history, address book
- Built-in helper with ready-made answers in English, Hindi, Marathi and Gujarati
- Free **TZT** test token faucet on Shardeum Testnet

## Project structure

The app (Version 7, "Design 2.0") is plain HTML, CSS and JavaScript. No framework and no build step.

| Path | What it is |
|------|-----------|
| `index.html` | App page. Loads the files below in order |
| `app/css/app.css` | All styles (light and dark mode) |
| `app/css/fonts.css` | Poppins font, embedded |
| `app/js/00-config.js` | Networks, storage helpers, icons |
| `app/js/01-i18n.js` | All texts in English and Hindi. **Add a new language here** |
| `app/js/02-core.js` | Balances, history, home, activity, receive |
| `app/js/10-send.js` … `13-lock-onboarding.js` | Send + Shield, QR scan, request, lock screen, new wallet |
| `app/js/20-…` … `25-…` | Faucet and security, tools, wallets, help center, backup, Back button, Explore, Settings |
| `app/js/30-render-boot.js` | Screen switching and app start |
| `wallet.js` | In-app wallet: keys are encrypted with the PIN and stay on the phone |
| `api/` | Vercel serverless functions: SHM price, TZT faucet |
| `contracts/` | Solidity source of the TZV token and the TZV lock |
| `classic/` | The previous app (Version 6), kept for a short time |
| `web/` | Website (tazvera.com) |

## Run it on your computer

No build step. It is plain HTML, CSS and JavaScript.

```bash
git clone https://github.com/tazvera/tazvera-wallet.git
cd tazvera-wallet
npx serve .
```

Then open the address it prints (for example `http://localhost:3000`).

Notes:
- The `api/` functions only run on Vercel (or with `vercel dev`). Without them, the app still works, but the SHM price and the free TZT faucet may not load.
- Use a **new test wallet** while developing. Never use a wallet that holds real money.

## Official token: Tazvera (TZV) on Shardeum Mainnet (chain ID 8118)

| Name | Address |
|------|---------|
| **Tazvera (TZV)** | `0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73` |

- Fixed supply: **1,000,000,000 TZV**, created once. No owner, no minting, no fees, no blacklist.
- Source code verified on the Shardeum Explorer ✓ (MIT license). Source: [`contracts/Tazvera.sol`](contracts/Tazvera.sol)
- **There is no sale or presale.** Only this address is the real TZV; any other "Tazvera" coin is fake.

### Locked TZV (450,000,000 TZV, 45% of supply)

TZV for the founder, treasury and liquidity sits in three verified lock contracts ([`contracts/TazveraLock.sol`](contracts/TazveraLock.sol)). No one, including the team, can take TZV out before the dates below. The beneficiary and dates can never be changed.

| Lock | Amount | Rule | Address |
|------|--------|------|---------|
| Founder | 150,000,000 TZV | Fully locked until 2 Nov 2027, then unlocks evenly until 1 Nov 2030 | [`0xCA3a…eb08`](https://explorer.shardeum.org/address/0xCA3a736464F6E0D5Ab5d9675FE26B878e6A0eb08) |
| Treasury | 150,000,000 TZV | Fully locked until 1 May 2027, then unlocks evenly until 30 Apr 2030 | [`0x9f1D…3C6B`](https://explorer.shardeum.org/address/0x9f1Da8bc7083E73F1CE93ea14AFe7f22Bbaf3C6B) |
| Liquidity | 150,000,000 TZV | Locked until 31 Jan 2027 (for a future DEX pool) | [`0x4Cb4…b790`](https://explorer.shardeum.org/address/0x4Cb4a91694B0CDdE83fe68EC34376f3AC1F1b790) |

## Contracts (Shardeum Testnet, chain ID 8119)

| Name | Address |
|------|---------|
| TZT test token | `0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0` |
| TZT faucet | `0x02b9e35cd82E5c781097D2188B4334c2485438bC` |
| Airdrop | `0x623A0E7628f281236D1d81ca1aceeCedcC30443e` |

The TZT token and faucet contracts are verified on the Shardeum Explorer ✓ (MIT license).

## How to help

All help is welcome, big or small.

1. **Report a bug or idea:** open an [Issue](https://github.com/tazvera/tazvera-wallet/issues). Screenshots and steps to repeat it help a lot.
2. **Fix something:** fork the repo, make a small focused change, and open a Pull Request that explains what you changed and how you tested it.
3. **Good first areas:** cleaning up `script.js`, accessibility, translations (Hindi, Marathi, Gujarati), tests, and security review of `wallet.js`.

Please keep in mind:
- Keep pull requests small and about one thing.
- Do not add tracking, ads or third-party scripts.
- Never commit private keys, seed phrases, API keys or passwords.
- Anything that touches keys, signing or sending (`wallet.js`, send flow) gets extra careful review.

## Security

Found a security problem? Please **do not** open a public Issue. Email **contact@tazvera.com** with the details.

The Tazvera team will **never** ask for your 12 words, PIN, passwords or money. Anyone who does is a scammer.

## License

The code is released under the [MIT License](LICENSE).

The **Tazvera** name and the green T logo are not covered by this license. Please do not use them to present another app or token as Tazvera.

## Maintainer

Dattu Sonawane, founder ([@dattusonawane](https://x.com/dattusonawane))
