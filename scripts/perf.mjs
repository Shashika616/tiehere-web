/**
 * Performance probe. Drives the real page in system Chrome and reports the
 * numbers that actually predict jank: how many layout-forcing reads happen
 * per frame, how many rAF loops are running, and how much time goes to
 * script, style and layout during a full scroll.
 *
 * Headless reports a locked 60fps whatever you do, so frame rate alone tells
 * you nothing here. These counters do.
 *
 *   node scripts/perf.mjs
 */
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
});
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

// Count layout-forcing reads and rAF registrations before any app code runs.
await p.evaluateOnNewDocument(() => {
  window.__stats = { rects: 0, rafs: 0, frames: 0, styleWrites: 0 };
  const origRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () { window.__stats.rects++; return origRect.call(this); };
  const origRaf = window.requestAnimationFrame;
  window.requestAnimationFrame = function (cb) {
    window.__stats.rafs++;
    return origRaf.call(window, (t) => { cb(t); });
  };
});

await p.goto("http://localhost:4321/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r => setTimeout(r, 2000));

await p.evaluate(() => {
  window.__stats.rects = 0; window.__stats.frames = 0;
  let last = performance.now(); window.__loopMs = [];
  const tick = (t) => { window.__stats.frames++; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});

const cdp = await p.createCDPSession();
await cdp.send("Performance.enable");
const before = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m => [m.name, m.value]));

for (let i = 0; i < 40; i++) {
  await p.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.lenis) window.lenis.scrollTo(max * f, { immediate: false }); else window.scrollTo(0, max * f);
  }, i / 39);
  await new Promise(r => setTimeout(r, 90));
}

const after = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m => [m.name, m.value]));
const s = await p.evaluate(() => window.__stats);
const d = (k) => (after[k] - before[k]);

console.log(`frames observed      ${s.frames}`);
console.log(`getBoundingClientRect ${s.rects}  ->  ${(s.rects / s.frames).toFixed(1)} per frame`);
console.log(`rAF callbacks queued  ${s.rafs}`);
console.log(`--- CDP deltas over the scroll ---`);
console.log(`LayoutCount          ${d("LayoutCount")}`);
console.log(`RecalcStyleCount     ${d("RecalcStyleCount")}`);
console.log(`LayoutDuration       ${d("LayoutDuration").toFixed(3)} s`);
console.log(`RecalcStyleDuration  ${d("RecalcStyleDuration").toFixed(3)} s`);
console.log(`ScriptDuration       ${d("ScriptDuration").toFixed(3)} s`);
console.log(`TaskDuration         ${d("TaskDuration").toFixed(3)} s`);
await b.close();
