# Changelog

All notable changes to the Tazvera wallet. Newest first.
Tazvera is a test version on test networks. Test coins have no value.

## Version 8.7 · November 2026

- Shield asks the blockchain whether an address is a smart contract and warns before sending to it; the three TZV lock contracts are blocked like the token
- Only one send at a time (a double tap can never send twice)
- MetaMask with a different account selected: the send is stopped with a clear message (no silent switch)
- Network or wallet change clears every number from the old one (balances, TZV, fee)
- Tokens you add belong to the network you added them on
- A transaction counts as successful only with a clear success status
- Token send refuses a missing contract address; the fee estimate uses the same strict amount check as sending
- Opening Send from a coin's page works out the fee at once
- No guessed rupee price (the "dollar x 88" fallback is gone)
- Clear message when the QR scanner cannot load; "Cancelled" now in Hindi too
- In-app wallet adds a 20% gas safety margin; Continue uses the exact fee check
- Tokens without a logo show a letter instead of a broken picture
- README: the real network story and the current file list
- A failed send also locks the wallet again (when PIN-for-every-send is on)
- Very old history entries (made before networks were recorded, all on test networks) no longer show on Mainnet
- Request/receive QR never contains an empty token address; request page coins without a logo show a letter
- Sharing a payment request also shares the payment link with the amount
- Cleaner Home: the safety card shows only when something is still missing; "Recent" shows only when there is activity

## Version 8.6 · November 2026

- Changing the PIN now re-locks every wallet on the phone with the new PIN (not only the open one)
- Added tokens never borrow a real coin's picture; a token pretending to be SHM, TZV or TZT is refused; it must answer like a real token
- Restoring the settings file needs the PIN and never changes PIN-on-send, auto-lock or the "already sent to" list
- Removing a wallet needs the PIN, with a strong warning if its 12 words were never checked
- Request QR uses each coin's own decimals
- QR codes must be a whole address or an ethereum: link (no address taken from inside a key or hash)

## Version 8.5 · November 2026

- Send: the confirm screen shows the exact amount that will be sent (no rounding)
- Send: strict amount check ("12abc", "1e-7" and too many decimals are refused with a clear message)
- Send: balances, MAX and fee checks use exact whole-number math (no decimal rounding errors)
- Send: addresses with a wrong capital-letter checksum are refused (typing mistakes caught)
- Wallet engine is no longer exposed as window.ethereum (only the Tazvera app can use it); old "test networks only" text fixed; dead code removed
- Assistant: at most 4 Google calls per question, and it stops at once on key, billing or quota problems
- Test-coin faucet: exact undo of failed requests; no internal error text shown to users
- ethers pinned to 6.17.0 (same as the app); security.txt also at /.well-known/security.txt; README cleaned; privacy page mentions coin pictures

## Version 8.4 · November 2026

- Every new wallet now gets the 12-word check (3 random words each time), and "backup done" is tracked for each wallet separately
- The app locks by itself when nobody touches it for the auto-lock time, even if it stays open on a computer
- The assistant icon: no background, sits in the bottom bar's line, and can be moved with a finger

## Version 8.3 · November 2026

- New: encrypted wallet backup file (Settings → Backup & restore). All wallets locked with a separate backup password (standard Ethereum keystore); restore on a new phone from the welcome screen
- Bottom bar: Home · Learn · Explore; Scan stays at the top; the assistant sits in the bottom-right corner
- Fix: Shardeum Mainnet sending now works for everyone (the wallet engine still expected the old hidden switch)
- Fix: on computers with MetaMask, the Tazvera wallet works again (create, import, restore are always shown; MetaMask is an extra choice and never interferes)

## Version 8.2 · November 2026

- QR codes from other wallets read correctly ("1e18", "2.5e18" amounts, exact decimals); no more freeze
- QR for another network: clear warning with a "Switch network" button; unsupported networks are refused
- Stricter security rule: no inline scripts can run (stronger protection against injected code)
- Secret words: "do not take a screenshot" warning; the words close when you leave the app
- Easier to read: darker grey and green text, QR codes described for screen readers (0 accessibility issues in the audit)
- Activity CSV: Indian time (IST) column, works in Excel with Hindi, file name with network and date
- The installed app now opens without internet (always uses the newest files when online)

## Version 8.1 · November 2026

- Mainnet is now shown openly in the network list, marked "Real money", with a one-time safety check before the first switch
- No internet: clear message and a "Try again" button instead of endless loading; refreshes by itself when the internet is back; Send is blocked early
- Copy buttons tell the truth: a second way to copy, or "copy it yourself" when a browser blocks copying
- After 5 wrong PINs: waiting time with a live countdown (30 s, 1 min, 5 min, 15 min)
- Google voice for the assistant now plays (security rule fixed); phone voice stays as backup
- AI and voice servers only answer our own app
- Phone status bar follows light/dark; "Auto" follows the phone at once; better install settings
- Small phones: search boxes fixed; token Explorer link fixed; Settings shows Version 8

## Version 8 · November 2026

- Verified badges on official coins; "not verified" warning on tokens you add yourself
- Tap any coin on Home for its own page: balance, contract, history (TZV page shows the 3 locks)
- News & alerts bell on Home (news comes from announcements.json, no app update needed)
- Network health chip on the balance card
- Security card on Home, "your wallet is ready" card for new wallets
- Extra check before sending a big amount
- "Before you start" safety screen when creating a wallet
- Back button on every sheet; asks "Leave Tazvera?" before closing the app
- Refresh no longer asks for the PIN inside the auto-lock time (sending still asks)
- Cleaner look: navy main buttons, see-through bottom bar with Home and Explore; Settings and News on the Home header; Activity in Home actions and Settings
- AI assistant: answers in the user's own language, faster replies, no voice-gender buttons

## v6 · Build 95
- Hidden "Mainnet beta" switch for testing Shardeum Mainnet with very small amounts (tap the Build line in About 7 times)
- Real-money mode: red "REAL MONEY" bar, extra confirm checkbox before sending, warning for larger amounts
- New "Test my 12 words" check in Security (checks only, saves nothing)
- Clearer error messages (low fee balance, slow network, invalid address)

## v6 · Build 94
- GitHub link in Settings; website links moved to github.com/tazvera/tazvera-wallet

## v6 · Build 93
- BNB Testnet and Ethereum Sepolia test networks for the in-app wallet
- Network list split into test networks and real-money networks
- Wallet always signs on the network shown on screen

## v6 · Builds 86–92
- Services focused on wallet tools; extra calculators hidden
- New Bill split, Profit / Loss, Security checkup, Security tips, Notifications, Help, Feedback and About TZT pages
- Settings redesigned (wallet card, one icon style, clean switches)
- Helper answers updated; question buttons in one sliding line

## v6 · Builds 80–85
- Network fee page with rupee estimate
- New PIN screens and "Ask PIN for every send" (on by default)
- Price alarm in rupees, Address book with paste/scan, History page with filters

## v6 · Builds 70–79
- Home cleanup: "Get TZT" button, Market prices, same number style
- Receive and Request pages redesigned; correct coin logo inside QR codes
- Steady SHM price from exchanges
- Services regrouped; Price converter in calm colours

## v6 · Builds 61–69
- New logo and launch animation, light theme by default, Poppins font
- Navy balance card, green action buttons, "Main wallet" menu
- One-page Send with Confirm screen and green "Sent" screen
- New wallet onboarding: welcome, PIN, 12 words, quick check
- Built-in helper with answers in English, Hindi, Marathi and Gujarati
