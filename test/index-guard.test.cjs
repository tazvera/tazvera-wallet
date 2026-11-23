'use strict';
// Guard for index.html: fails (red X) if a needed line is lost, reordered, or points to a missing file.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = process.env.INDEX_ROOT || path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const CSS = [
  'app/splash/splash.css', 'app/fonts/fonts.css', 'app/theme/colors.css', 'app/css/app.css',
  'app/layout/mobile.css',
  'app/features/shell/shell-desktop.css', 'app/features/nav/nav-desktop.css',
  'app/features/home/home-desktop.css', 'app/features/send/send-desktop.css',
  'app/features/receive/receive-desktop.css', 'app/features/request/request-desktop.css',
  'app/features/activity/activity-desktop.css', 'app/features/explore/explore-desktop.css',
  'app/features/learn/learn-desktop.css', 'app/features/security/security-desktop.css',
  'app/features/browser/browser-desktop.css', 'app/features/settings/settings-desktop.css',
  'app/features/assistant/assistant-desktop.css'
];
const JS = [
  'app/splash/splash.js', 'ethers.min.js', 'wallet.js', 'qrcode.min.js',
  'app/browser/networks/networks.js',
  'app/js/00-config.js', 'app/js/01-i18n.js', 'app/js/02-core.js', 'app/js/10-send.js',
  'app/js/11-scan.js', 'app/js/12-request.js', 'app/js/13-lock-onboarding.js',
  'app/js/20-faucet-security.js', 'app/js/21-tools.js', 'app/js/22-wallets-help-backup.js',
  'app/js/23-back-button.js', 'app/js/24-explore.js', 'app/js/25-settings.js', 'app/js/26-v8-trust.js',
  'app/tokens/add-token.js', 'app/walletconnect/config.js', 'app/browser/browser.js',
  'app/browser/sites/connected-sites.js', 'app/browser/signing/signing.js',
  'app/js/27-ai.js', 'app/js/28-backup.js', 'app/js/29-ai2.js', 'app/js/30-render-boot.js'
];

const links = [...html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)].map(m => m[1]);
const scripts = [...html.matchAll(/<script[^>]*src=["']([^"']+)["']/g)].map(m => m[1]);

function inOrder(found, needed, what) {
  let last = -1;
  for (const n of needed) {
    const i = found.indexOf(n);
    assert.ok(i !== -1, `${what}: यह पंक्ति index.html से गायब है -> ${n}`);
    assert.ok(i > last, `${what}: क्रम बदल गया है, यह ग़लत जगह है -> ${n}`);
    last = i;
  }
}

test('CSS lines present and in order (mobile first, then desktop files)', () => inOrder(links, CSS, 'CSS'));
test('script lines present and in order', () => inOrder(scripts, JS, 'script'));

test('feature scripts are still loaded between 26-v8-trust.js and add-token.js', () => {
  const a = scripts.indexOf('app/js/26-v8-trust.js');
  const b = scripts.indexOf('app/tokens/add-token.js');
  const feats = scripts.filter(s => s.startsWith('app/js/features/'));
  assert.ok(feats.length >= 15, `app/js/features/ की फ़ाइलें कम हो गईं (${feats.length}, चाहिए कम से कम 15)`);
  feats.forEach(f => { const i = scripts.indexOf(f); assert.ok(i > a && i < b, `ग़लत जगह: ${f}`); });
});

test('no duplicate lines', () => {
  for (const [what, arr] of [['CSS', links], ['script', scripts]]) {
    const d = arr.filter((x, i) => arr.indexOf(x) !== i);
    assert.deepStrictEqual(d, [], `${what}: दो बार लिखा है -> ${d.join(', ')}`);
  }
});

test('every local file named in index.html exists', () => {
  const missing = [...links, ...scripts]
    .filter(f => !/^(https?:)?\/\//.test(f))
    .map(f => f.split('?')[0])
    .filter(f => !fs.existsSync(path.join(ROOT, f)));
  assert.deepStrictEqual(missing, [], `ये फ़ाइलें रिपॉज़िटरी में नहीं हैं -> ${missing.join(', ')}`);
});

test('app container and security rules are intact', () => {
  assert.ok(/<div id=["']app["']><\/div>/.test(html), '<div id="app"> गायब है');
  const csp = (html.match(/Content-Security-Policy"\s+content="([^"]+)"/) || [])[1] || '';
  assert.ok(csp.includes("script-src 'self'"), "CSP में script-src 'self' नहीं है");
  assert.ok(csp.includes('https://api.coingecko.com'), 'CSP से कीमतों का पता (coingecko) हट गया है');
  assert.ok(csp.includes('wss://relay.walletconnect.org'), 'CSP से WalletConnect का पता हट गया है');
  assert.ok(!/script-src[^;]*unsafe-inline/.test(csp), "script-src में 'unsafe-inline' नहीं होना चाहिए");
});
