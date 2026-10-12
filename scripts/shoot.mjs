/**
 * Local screenshot harness. Drives the real page in system Chrome so the
 * canvas film can be reviewed at specific scroll depths.
 *
 *   node scripts/shoot.mjs [--reduced] [--mobile]
 *
 * Writes PNGs to .shots/. Dev-only; not part of the build.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.SHOOT_URL || "http://localhost:4321/";
const reduced = process.argv.includes("--reduced");
const mobile = process.argv.includes("--mobile");
const outDir = process.env.SHOOT_DIR || ".shots";

const STOPS = [
  ["01-hero", "#top", 0.0],
  ["01b-scene-alone", "#scene-alone", 0.3],
  ["02-problem", "[data-film='sparse']", 0.3],
  ["02b-scene-city", "#scene-city", 0.3],
  ["03-proximity", "[data-film='city']", 0.3],
  ["04-intents-a", "#intents", 0.08],
  ["05-intents-b", "#intents", 0.55],
  ["05c-intents-end", "#intents", 0.72],
  ["06-how", "#how", 0.35],
  ["06b-scene-street", "#scene-street", 0.3],
  ["07-trust", "#trust", 0.12],
  ["08-trust-b", "#trust", 0.55],
  ["09-principles", "#principles", 0.3],
  ["10-safety", "#safety", 0.2],
  ["11-faq", "#faq", 0.2],
  ["12-cta", "#get", 0.0],
  ["13-cta-b", "#get", 0.3],
  ["14-footer", "footer", 1.0],
];

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-device-scale-factor=2", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport(
  mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 2 },
);
if (reduced) {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
}

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

const suffix = (reduced ? "-reduced" : "") + (mobile ? "-mobile" : "");

for (const [name, selector, frac] of STOPS) {
  const ok = await page.evaluate((sel, f) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY + rect.height * f;
    const lenis = window.lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
    return true;
  }, selector, frac);
  if (!ok) { console.log(`\nMISSING SELECTOR: ${selector}`); continue; }
  // The film trails scroll on purpose; give it time to settle.
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: `${outDir}/${name}${suffix}.png` });
  process.stdout.write(`${name} `);
}

const height = await page.evaluate(() => document.documentElement.scrollHeight);
console.log(`\npage height: ${height}px`);
console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");

await browser.close();
