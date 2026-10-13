/**
 * Regression check for where the page opens.
 *
 * A brand site has to start on the hero, and two independent things broke
 * that: the browser's `scrollRestoration` defaults to "auto" (reload returns
 * you to wherever you were), and the nav handler used to write the section
 * into the URL (so any reload after clicking a tab opened on that tab).
 *
 * Covers all seven cases, including the two that must still work: a pasted
 * deep link, and back/forward restoring your reading position.
 *
 *   node scripts/check-scroll-entry.mjs
 */
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args:["--hide-scrollbars"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
const settle = async () => { await new Promise(r => setTimeout(r, 2600)); };
const where = async () => p.evaluate(() => ({
  y: Math.round(window.scrollY),
  h1: Math.round(document.querySelector("h1").getBoundingClientRect().top),
  hash: location.hash || "(none)",
}));
const line = (label, s, want) =>
  console.log(`${label.padEnd(38)} scrollY=${String(s.y).padStart(6)}  heroH1Top=${String(s.h1).padStart(6)}  hash=${s.hash.padEnd(8)} ${want}`);

await p.goto("http://localhost:4321/", { waitUntil: "networkidle0", timeout: 60000 });
await settle(); line("1. fresh load", await where(), "want hero");

await p.reload({ waitUntil: "networkidle0" }); await settle();
line("2. plain reload", await where(), "want hero");

// Section links are root-relative, so the selector is "/#how", not "#how".
await p.evaluate(() => {
  const a = [...document.querySelectorAll('a[href="/#how"]')].find((n) => n.offsetParent !== null);
  if (!a) throw new Error('no visible link to /#how');
  a.click();
});
await new Promise(r => setTimeout(r, 2200));
const afterClick = await where();
line("3. after clicking #how (should move)", afterClick, "want scrolled, no hash");

await p.reload({ waitUntil: "networkidle0" }); await settle();
line("4. reload after that click", await where(), "want hero");

await p.evaluate(() => window.scrollTo(0, 6000));
await new Promise(r => setTimeout(r, 900));
await p.reload({ waitUntil: "networkidle0" }); await settle();
line("5. scroll 6000 then reload", await where(), "want hero");

await p.goto("http://localhost:4321/#safety", { waitUntil: "networkidle0" }); await settle();
line("6. pasted deep link /#safety", await where(), "want safety");

// Back/forward restore: scroll home, go to /privacy, come back.
await p.goto("http://localhost:4321/", { waitUntil: "networkidle0" }); await settle();
await p.evaluate(() => window.scrollTo(0, 9000));
await new Promise(r => setTimeout(r, 900));
await p.goto("http://localhost:4321/privacy", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 900));
await p.goBack({ waitUntil: "networkidle0" }); await settle();
line("7. back from /privacy", await where(), "want ~9000 restored");
await b.close();
