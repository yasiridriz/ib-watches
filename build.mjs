// No dependencies. Run: node build.mjs  -> writes dist/
import { readdirSync, readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";

const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dir = "content/watches";
// Pages CMS may save a new watch as .md. The content is still JSON, so read both. A broken file is skipped with a warning.
const watches = readdirSync(dir).filter(f => f.endsWith(".json") || f.endsWith(".md")).sort()
  .flatMap(f => {
    try { return [JSON.parse(readFileSync(`${dir}/${f}`, "utf8"))]; }
    catch (e) { console.warn(`Skipped ${f}: ${e.message}`); return []; }
  });

// Pictures: the CMS list "images". The first picture is the header picture. The old single "image" field still works.
const url = p => { try { return encodeURI(decodeURI(p)); } catch { return p; } }; // file names with spaces, for example "WhatsApp Image (1).jpeg"
const pics = w => (Array.isArray(w.images) && w.images.length ? w.images : (w.image ? [w.image] : [])).map(url);
const card = w => `
  <article class="card${w.available === false ? " sold" : ""}">
    <div class="photo">${pics(w).length ? `<img src="${esc(pics(w)[0])}" alt="${esc(w.brand)} ${esc(w.name)}" loading="lazy">` : `<span>${esc(w.brand)}</span>`}</div>
    ${pics(w).length > 1 ? `<div class="thumbs">${pics(w).map(p => `<button type="button" data-src="${esc(p)}" aria-label="Show picture"><img src="${esc(p)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
    <h3>${esc(w.brand)} ${esc(w.name)}</h3>
    <p>${esc(w.description)}</p>
    ${w.available === false ? `<p class="price">Sold</p>` : `<a class="enquire" href="#contact" data-enquire="${esc(w.brand)} ${esc(w.name)}">Enquire</a>`}
  </article>`;

// Featured watch: the first one with "featured" switched on. If none, the first available watch.
const live = watches.filter(w => w.available !== false);
const feat = live.find(w => w.featured) || live[0];
const template = readFileSync("template.html", "utf8");
const featured = !feat ? "" : `<aside class="latest-card" aria-label="Latest arrival">
      <div class="lt-photo">${pics(feat).length ? `<img src="${esc(pics(feat)[0])}" alt="${esc(feat.brand)} ${esc(feat.name)}">` : esc(feat.brand)}</div>
      <div class="lt-body">
        <p class="lt-label">Latest arrival</p>
        <h3>${esc(feat.brand)} ${esc(feat.name)}</h3>
        ${feat.description ? `<p class="lt-text">${esc(feat.description)}</p>` : ""}
        <div class="lt-foot"><a href="#contact" data-enquire="${esc(feat.brand)} ${esc(feat.name)}">Enquire</a><a href="#collection">See all</a></div>
      </div>
    </aside>`;
const html = template.replace("<!--WATCHES-->", watches.map(card).join("\n")).replace("<!--FEATURED-->", featured);
if (existsSync("dist")) rmSync("dist", { recursive: true });
mkdirSync("dist");
writeFileSync("dist/index.html", html);
cpSync("assets", "dist/assets", { recursive: true, filter: p => !p.endsWith("illustration.jpg") && !p.endsWith("-main") && !p.includes("-main/") }); // skip the font download folders
console.log(`Built ${watches.length} watch(es) -> dist/`);
