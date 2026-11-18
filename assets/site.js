
// Each panel asks GitHub for its latest release and links its installers directly.
// If GitHub can't be reached, the buttons still lead to the release page.
const OWNER = "jerjely";
const KINDS = [
  { key: "win",   label: "Windows",   test: n => /windows.*\.exe$/i.test(n) },
  { key: "arm",   label: "Mac · Apple silicon", test: n => /(arm64|applesilicon).*\.pkg$/i.test(n) },
  { key: "intel", label: "Mac · Intel", test: n => /(x86_64|intel).*\.pkg$/i.test(n) },
];
const ICON = {
  win: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M0 2.3 6.5 1.4v6.1H0zm7.3-1L16 0v7.5H7.3zM0 8.5h6.5v6.1L0 13.7zm7.3 0H16V16l-8.7-1.2z"/></svg>',
  mac: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M11.2 8.5c0-1.6 1.3-2.3 1.4-2.4-.8-1.1-1.9-1.3-2.3-1.3-1-.1-1.9.6-2.4.6s-1.3-.6-2.1-.5c-1.1 0-2.1.6-2.6 1.6-1.1 2-.3 4.9.8 6.5.5.8 1.2 1.6 2 1.6s1.1-.5 2.1-.5 1.2.5 2.1.5 1.4-.8 1.9-1.6c.6-.9.8-1.7.9-1.8 0 0-1.8-.7-1.8-2.7zM9.6 3.6c.4-.5.7-1.2.6-1.9-.6 0-1.4.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.8z"/></svg>',
};
function userOS() {
  const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent;
  if (/win/i.test(p)) return "win";
  if (/mac/i.test(p)) return "mac";
  return "";
}
const OS = userOS();
function sizeMB(b) {
  if (!b) return "";
  if (b >= 1073741824) return (b / 1073741824).toFixed(1) + " GB";
  if (b >= 1048576) return Math.round(b / 1048576) + " MB";
  return Math.max(1, Math.round(b / 1024)) + " KB";
}
// "OKR-Drum-1.0.0-RaspberryPi.zip" -> "Raspberry Pi"
function partName(n) {
  const m = n.match(/-\d+(?:\.\d+)+-(.+?)\.[a-z0-9]+$/i);
  return m ? m[1].replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ") : n;
}
function el(tag, attrs, html) { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html) e.innerHTML = html; return e; }

function render(panel, repo, rel) {
  const dl = panel.querySelector("[data-dl]"), meta = panel.querySelector("[data-meta]");
  const page = `https://github.com/${OWNER}/${repo}/releases/latest`;
  const more = meta.querySelector("a.more");
  dl.innerHTML = ""; meta.innerHTML = "";
  if (more) meta.append(more);
  if (panel.hasAttribute("data-soon") && !(rel && rel.assets && rel.assets.length)) {
    dl.append(el("span", { className: "soon" }, panel.getAttribute("data-soon") || "Coming soon: installers for Windows and Mac"));
    return;
  }
  const assets = (rel && rel.assets) || [];
  const hasInst = assets.some(x => KINDS.some(k => k.test(x.name)));
  if (!assets.length || hasInst) for (const k of KINDS) {
    const a = assets.find(x => k.test(x.name));
    const mine = (k.key === "win" && OS === "win") || (k.key !== "win" && OS === "mac");
    const btn = el("a", { className: "btn" + (mine ? " mine" : ""), href: a ? a.browser_download_url : page },
      (k.key === "win" ? ICON.win : ICON.mac) + `<span>${k.label}</span>` + (a ? `<small>${sizeMB(a.size)}</small>` : ""));
    if (a) btn.title = a.name;
    dl.append(btn);
  }
  // other files in the release (scripts, firmware, Raspberry Pi recorder...): one button each
  const extra = assets.filter(x => !KINDS.some(k => k.test(x.name)) && !/\.(sha256|txt|md)$/i.test(x.name));
  for (const a of extra.slice(0, 8)) {
    dl.append(el("a", { className: "btn", href: a.browser_download_url, title: a.name },
      `<span>${partName(a.name)}</span><small>${sizeMB(a.size)}</small>`));
  }
  if (rel && rel.tag_name) {
    const d = rel.published_at ? new Date(rel.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
    meta.append(el("span", {}, `Version ${rel.tag_name.replace(/^v/, "")}${d ? " · " + d : ""}`));
  }
  meta.append(el("a", { href: page }, "All downloads"));
  meta.append(el("a", { href: `https://github.com/${OWNER}/${repo}` }, "Source and manual"));
}

document.querySelectorAll(".proj, .app").forEach(panel => {
  const repo = panel.dataset.repo;
  render(panel, repo, null);                       // usable at once, before GitHub answers
  // a release is remembered for 10 minutes, and only once its installers are attached
  // (right after a release is made, GitHub lists it for a minute before the files are uploaded)
  const key = "rel3:" + repo, cached = (() => { try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; } })();
  if (cached && Date.now() - cached.t < 600000) { render(panel, repo, cached.rel); return; }
  fetch(`https://api.github.com/repos/${OWNER}/${repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
    .then(r => r.ok ? r.json() : null)
    .then(rel => {
      if (!rel) return;
      const slim = { tag_name: rel.tag_name, published_at: rel.published_at,
                     assets: (rel.assets || []).map(a => ({ name: a.name, size: a.size, browser_download_url: a.browser_download_url })) };
      if (KINDS.every(k => slim.assets.some(a => k.test(a.name))) ||
          (slim.assets.length && !KINDS.some(k => slim.assets.some(a => k.test(a.name))))) {
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), rel: slim })); } catch (e) {}
      }
      render(panel, repo, slim);
    })
    .catch(() => {});
});


// ---- app pages: screenshots taken from the project's README on GitHub ----
// Every image in the README (markdown ![caption](path) or <img src>) is shown, except logos, icons and
// badges. Relative paths are read from the repository, so a screenshot added to the README appears here.
(function () {
  const sec = document.querySelector("[data-readme-gallery]");
  const app = document.querySelector(".app");
  if (!sec || !app) return;
  const repo = app.dataset.repo;
  const raw = `https://raw.githubusercontent.com/${OWNER}/${repo}/HEAD/`;
  const skip = /(logo|icon|wordmark|badge|shields\.io|favicon)/i;
  fetch(raw + "README.md").then(r => r.ok ? r.text() : "").then(md => {
    if (!md) {                     // not on GitHub yet: no links that lead nowhere
      const links = document.querySelector("[data-doc-links]");
      if (links && app.hasAttribute("data-soon")) {
        const p = links.previousElementSibling;
        if (p) p.textContent = "The source code, instructions and installers will appear here once they are on GitHub.";
        links.remove();
      }
      return;
    }
    const found = [], seen = new Set();
    const add = (src, alt) => {
      src = src.trim().replace(/^<|>$/g, "").split(/\s+/)[0];
      if (!src || skip.test(src) || seen.has(src)) return;
      seen.add(src);
      const url = /^https?:\/\//.test(src) ? src : raw + src.replace(/^\.?\//, "");
      found.push({ url, alt: (alt || "").trim() });
    };
    for (const m of md.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) add(m[2], m[1]);
    for (const m of md.matchAll(/<img\b[^>]*>/gi)) {
      const src = (m[0].match(/src\s*=\s*["']([^"']+)["']/i) || [])[1];
      const alt = (m[0].match(/alt\s*=\s*["']([^"']*)["']/i) || [])[1];
      if (src) add(src, alt);
    }
    if (!found.length) return;
    const g = sec.querySelector("[data-gallery]");
    if (found.length === 1) g.classList.add("one");
    for (const f of found.slice(0, 12)) {
      const fig = el("figure");
      const a = el("a", { href: f.url, target: "_blank", rel: "noopener" });
      a.append(el("img", { src: f.url, alt: f.alt || "Screenshot", loading: "lazy" }));
      fig.append(a);
      if (f.alt) fig.append(el("figcaption", { textContent: f.alt }));
      g.append(fig);
    }
    sec.hidden = false;
  }).catch(() => {});
})();
