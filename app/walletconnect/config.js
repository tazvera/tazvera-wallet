/* Tazvera wallet · app/walletconnect/config.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* The WalletConnect project id. Not a private key: it ships inside the app and only tells
   WalletConnect's relay who is calling. Kept in this one file so it is never scattered. */
var WC_PROJECT_ID = "a92f88efb59902bdb4bec48d752e3f4a";
var WC_RELAY = "wss://relay.walletconnect.com";
var WC_META = {
  name: "Tazvera",
  description: "Tazvera wallet — self-custody, keys stay on your phone",
  url: "https://app.tazvera.com",
  icons: ["https://app.tazvera.com/icon-192.png"]
};
