/**
 * Paint/raster/composite profiler.
 *
 * scripts/perf.mjs measures script, style and layout, which miss everything
 * the compositor does. A masked backdrop-filter, a large gradient or an
 * oversized image costs nothing there and plenty here, so this traces the
 * real paint work over a full scroll and prints the biggest contributors.
 *
 * The second run disables the header's backdrop blur, so the cost of that one
 * effect can be read off directly rather than argued about.
 *
 *   node scripts/paint-trace.mjs
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const run = async (label, css) => {
  const b = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new", args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await p.goto("http://localhost:4321/", { waitUntil: "networkidle0", timeout: 60000 });
  if (css) await p.addStyleTag({ content: css });
  await new Promise(r => setTimeout(r, 2500));
  const file = `/tmp/trace-${label}.json`;
  await p.tracing.start({ path: file, categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
  for (let i = 0; i < 40; i++) {
    await p.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (window.lenis) window.lenis.scrollTo(max * f, { immediate: false }); else window.scrollTo(0, max * f);
    }, i / 39);
    await new Promise(r => setTimeout(r, 90));
  }
  await p.tracing.stop();
  await b.close();

  const ev = JSON.parse(fs.readFileSync(file, "utf8")).traceEvents;
  const sum = {};
  for (const e of ev) {
    if (e.ph !== "X" || !e.dur) continue;
    if (/Paint|Rasterize|Composite|Layerize|Layout|UpdateLayer|Decode/i.test(e.name)) {
      sum[e.name] = (sum[e.name] || 0) + e.dur / 1000;
    }
  }
  const top = Object.entries(sum).sort((a, b) => b[1] - a[1]).slice(0, 6);
  console.log(`\n--- ${label} ---`);
  for (const [k, v] of top) console.log(`  ${k.padEnd(28)} ${v.toFixed(1)} ms`);
  console.log(`  ${"TOTAL (paint+raster+composite)".padEnd(28)} ${Object.values(sum).reduce((a, c) => a + c, 0).toFixed(1)} ms`);
};

await run("with-veil-blur", null);
await run("no-veil-blur", ".header-veil{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}");
