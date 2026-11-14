// No dependencies. Run: node build.mjs  -> writes dist/
import { readdirSync, readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";

const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dir = "content/watches";
const watches = readdirSync(dir).filter(f => f.endsWith(".json"))
  .map(f => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")));

const card = w => `
  <article class="card${w.available === false ? " sold" : ""}">
    <div class="photo">${w.image ? `<img src="${esc(w.image)}" alt="${esc(w.brand)} ${esc(w.name)}" loading="lazy">` : `<span>${esc(w.brand)}</span>`}</div>
    <p class="meta">${esc(w.brand)}${w.source ? ` · ${esc(w.source)}` : ""}</p>
    <h3>${esc(w.name)}</h3>
    ${w.reference ? `<p class="ref">Ref. ${esc(w.reference)}</p>` : ""}
    <p>${esc(w.description)}</p>
    <p class="price">${w.available === false ? "Sold" : esc(w.price)}</p>
  </article>`;

// Featured watch: the first one with "featured" switched on. If none, the first available watch.
const live = watches.filter(w => w.available !== false);
const feat = live.find(w => w.featured) || live[0];
const template = readFileSync("template.html", "utf8");
const email = (template.match(/mailto:([^"?]+)/) || [, ""])[1];
const row = (k, v) => v ? `<li><span>${k}</span>${esc(v)}</li>` : "";
const featured = !feat ? "" : `<aside class="latest-card" aria-label="Latest arrival">
      <div class="lt-photo">${feat.image ? `<img src="${esc(feat.image)}" alt="${esc(feat.brand)} ${esc(feat.name)}">` : esc(feat.brand)}</div>
      <div class="lt-body">
        <p class="eyebrow">Latest arrival</p>
        <h3>${esc(feat.brand)} ${esc(feat.name)}</h3>
        ${feat.reference ? `<p class="ref">Ref. ${esc(feat.reference)}</p>` : ""}
        <ul class="specs">${row("Case", feat.case)}${row("Movement", feat.movement)}${row("Sourced from", feat.source)}</ul>
        <div class="lt-foot"><b>${esc(feat.price)}</b><a href="mailto:${esc(email)}?subject=${encodeURIComponent("Enquiry: " + feat.brand + " " + feat.name)}">Enquire</a></div>
      </div>
    </aside>`;
const html = template.replace("<!--WATCHES-->", watches.map(card).join("\n")).replace("<!--FEATURED-->", featured);
if (existsSync("dist")) rmSync("dist", { recursive: true });
mkdirSync("dist");
writeFileSync("dist/index.html", html);
cpSync("assets", "dist/assets", { recursive: true, filter: p => !p.endsWith("illustration.jpg") && !p.endsWith("-main") && !p.includes("-main/") }); // skip the font download folders
console.log(`Built ${watches.length} watch(es) -> dist/`);
