/**
 * Regression check for the brand flight.
 *
 * Creeps through the flight in 20px steps, which is the condition that caught
 * the original bug: guarding the early exit on the eased value froze the
 * handover, leaving both copies half-faded on top of each other for the rest
 * of the page. Fast scrolling hid it entirely.
 *
 * Asserts the thing that actually matters: the two copies may crossfade, but
 * only while they coincide. Misaligned copies both visible is the defect.
 *
 *   node scripts/check-brand-flight.mjs
 */
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args:["--hide-scrollbars"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await p.goto("http://localhost:4321/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r => setTimeout(r, 2200));

// Creep through the flight in small steps: the condition that froze it.
console.log(" scrollY  flyerOp  navOp   flyerVis  sum");
let bad = 0;
for (let y = 0; y <= 620; y += 20) {
  await p.evaluate((yy) => { if (window.lenis) window.lenis.scrollTo(yy, { immediate: true }); else window.scrollTo(0, yy); }, y);
  await new Promise(r => setTimeout(r, 120));
  const s = await p.evaluate(() => {
    const f = document.querySelector('[aria-hidden="true"].fixed.left-0.top-0');
    const n = document.getElementById("nav-lockup");
    const fs = getComputedStyle(f), ns = getComputedStyle(n);
    const fr = f.getBoundingClientRect(), nr = n.getBoundingClientRect();
    return { f: +fs.opacity, n: +ns.opacity, vis: fs.visibility,
             dy: Math.abs(fr.top - nr.top), dw: Math.abs(fr.width - nr.width) };
  });
  const sum = s.f + s.n;
  // A crossfade between two perfectly aligned copies is invisible and correct.
  // The bug is two copies visible at once that do NOT coincide.
  const overlap = s.f > 0.05 && s.n > 0.05 && (s.dy > 1.5 || s.dw > 1.5);
  if (overlap) bad++;
  if (y % 40 === 0 || overlap) console.log(`${String(y).padStart(6)}  ${s.f.toFixed(3)}    ${s.n.toFixed(3)}   ${s.vis.padEnd(8)} dy=${s.dy.toFixed(2)} dw=${s.dw.toFixed(2)}${overlap ? "   <-- MISALIGNED OVERLAP" : ""}`);
}
// And confirm it stays resolved deep in the page.
await p.evaluate(() => window.lenis ? window.lenis.scrollTo(4000, { immediate: true }) : window.scrollTo(0, 4000));
await new Promise(r => setTimeout(r, 300));
const end = await p.evaluate(() => {
  const f = document.querySelector('[aria-hidden="true"].fixed.left-0.top-0');
  const n = document.getElementById("nav-lockup");
  return { f: +getComputedStyle(f).opacity, vis: getComputedStyle(f).visibility, n: +getComputedStyle(n).opacity };
});
console.log(`\nat 4000px: flyer ${end.f} (${end.vis}), nav ${end.n}`);
console.log(bad === 0 ? "PASS: copies never visibly misaligned" : `FAIL: ${bad} misaligned positions`);

// --- first paint: the nav lockup must never be painted and then hidden ---
const p2 = await b.newPage();
await p2.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await p2.evaluateOnNewDocument(() => {
  window.__op = [];
  const tick = () => {
    const el = document.getElementById("nav-lockup");
    if (el) window.__op.push(getComputedStyle(el).opacity);
    if (performance.now() < 2500) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await p2.goto("http://localhost:4321/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3000));
const flashed = await p2.evaluate(() => {
  const o = window.__op.map(Number);
  // Visible first, hidden later is the flash. Hidden throughout is correct.
  return o.length > 0 && o[0] > 0.5 && o.some((v) => v < 0.5);
});
console.log(flashed ? "FAIL: nav lockup flashes in then out on load" : "PASS: no lockup flash on first paint");

await b.close();
