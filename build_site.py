"""Builds jerjely.github.io from projects.json:
    index.html            the list of all software, grouped
    apps/<slug>.html      one page per app: description, downloads, screenshots from its README

    python build_site.py            (run in the website folder; then commit and push)

To add an app: add an entry to projects.json (and its logo to assets/, or leave "logo" null to show
its initials), run this script, push. Downloads and screenshots are read live from GitHub, so a
new release or a new screenshot in a README needs no change here.
"""
import html
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OWNER = "jerjely"
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700'
         '&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">')
E = html.escape


def head(title, desc, root, icon):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="icon" href="{root}assets/{icon}">
{FONTS}
<link rel="stylesheet" href="{root}assets/site.css">
</head>
"""


def logo(p, root, cls="logo"):
    if p.get("logo"):
        return f'<img class="{cls}" src="{root}assets/{p["logo"]}" alt="{E(p["name"])} logo" width="112" height="112">'
    return f'<div class="{cls} mono" aria-hidden="true">{E(p["mono"] or p["name"][:3].upper())}</div>'


def panel_attrs(p):
    a = f'data-repo="{E(p["repo"])}"'
    if p.get("soon"):
        a += f' data-soon="{E(p["soon"])}"'
    return a


FIRST_START = """<section class="help" aria-labelledby="first-start">
  <h3 id="first-start">Opening an installer the first time</h3>
  <p>The installers are not code-signed yet. On <strong>Windows</strong>, if SmartScreen says it protected your PC,
    click <em>More info</em> → <em>Run anyway</em>. On a <strong>Mac</strong>, if the .pkg is blocked, open
    <em>System Settings → Privacy &amp; Security</em> and click <em>Open Anyway</em>. Not sure which Mac you have?
    Apple menu → <em>About This Mac</em> shows an <em>Apple M</em> chip or an <em>Intel</em> processor.</p>
</section>"""


def build_index(P):
    out = [head("Gergely Szarka – Lab software",
                "Desktop tools for retina and superior colliculus research, free for Windows and Mac.", "", "surf.png")]
    out.append("""<body>
<div class="wrap">

<header class="site">
  <div class="eyebrow">Völgyi lab · Szentágothai Research Centre · University of Pécs</div>
  <h1>Gergely Szarka</h1>
  <p class="lede">Desktop tools I wrote for our retina and superior colliculus work. Each one is free to download
    for <strong>Windows</strong> and <strong>Mac</strong> (Apple silicon and Intel), with nothing else to install.</p>
</header>

<main class="projects" id="projects">
""")
    group = None
    for p in P:
        if p["group"] != group:
            group = p["group"]
            out.append(f'\n  <h2 class="group">{E(group)}</h2>\n')
        facts = "".join(f"<li>{E(f)}</li>" for f in p["facts"])
        out.append(f"""  <article class="proj" style="--accent:{p['accent']}" {panel_attrs(p)}>
    <a class="logo-link" href="apps/{p['slug']}.html" tabindex="-1" aria-hidden="true">{logo(p, "")}</a>
    <div class="body">
      <div class="title"><h2><a href="apps/{p['slug']}.html">{E(p['name'])}</a></h2><span class="long">{E(p['long'])}</span></div>
      <p class="desc">{p['desc']}</p>
      <ul class="facts">{facts}</ul>
      <div class="dl" data-dl></div>
      <div class="meta" data-meta><a class="more" href="apps/{p['slug']}.html">More about {E(p['name'])} →</a></div>
    </div>
  </article>
""")
    out.append(f"""
</main>

{FIRST_START}

<footer>
  <span>Source code, manuals and older versions on <a href="https://github.com/{OWNER}">GitHub · {OWNER}</a></span>
  <a href="playground.html">Earlier web exercises</a>
</footer>
</div>
<script src="assets/site.js"></script>
</body>
</html>
""")
    return "".join(out)


def build_app(p, P):
    root = "../"
    facts = "".join(f"<li>{E(f)}</li>" for f in p["facts"])
    others = [q for q in P if q is not p]
    nav = "".join(f'<a href="{q["slug"]}.html">{E(q["name"])}</a>' for q in others)
    plain = p["desc"].replace("<code>", "").replace("</code>", "")
    return head(f"{p['name']} – Gergely Szarka", plain, root, p.get("logo") or "surf.png") + f"""<body class="app-page">
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← All software</a><span>{E(p['group'])}</span></nav>

<article class="app" style="--accent:{p['accent']}" {panel_attrs(p)}>
  <header class="app-head">
    {logo(p, root, "logo big")}
    <div class="app-title">
      <h1>{E(p['name'])}</h1>
      <p class="long">{E(p['long'])}</p>
    </div>
  </header>

  <section class="app-body">
    <p class="desc lead">{p['desc']}</p>
    <ul class="facts">{facts}</ul>
    <div class="dl-box">
      <h2 class="label">Download</h2>
      <div class="dl" data-dl></div>
      <div class="meta" data-meta></div>
    </div>
  </section>

  <section class="shots" data-readme-gallery hidden>
    <h2 class="label">Screenshots</h2>
    <div class="gallery" data-gallery></div>
  </section>

  <section class="docs">
    <h2 class="label">Documentation</h2>
    <p>The full instructions are in the README on GitHub, together with the source code, the manual (where there is one)
      and all earlier versions.</p>
    <p class="doc-links" data-doc-links><a class="btn" href="https://github.com/{OWNER}/{E(p['repo'])}#readme">Read the README</a>
      <a class="btn" href="https://github.com/{OWNER}/{E(p['repo'])}">Source code</a></p>
  </section>
</article>

{FIRST_START}

<footer>
  <span class="other-label">Other software:</span>
  <span class="other">{nav}</span>
</footer>
</div>
<script src="../assets/site.js"></script>
</body>
</html>
"""


def main():
    P = json.load(open(os.path.join(HERE, "projects.json"), encoding="utf-8"))
    order = []
    for p in P:                      # keep the groups together, in the order they first appear
        if p["group"] not in order:
            order.append(p["group"])
    P = [p for g in order for p in P if p["group"] == g]
    with open(os.path.join(HERE, "index.html"), "w", encoding="utf-8") as f:
        f.write(build_index(P))
    os.makedirs(os.path.join(HERE, "apps"), exist_ok=True)
    for p in P:
        with open(os.path.join(HERE, "apps", p["slug"] + ".html"), "w", encoding="utf-8") as f:
            f.write(build_app(p, P))
    print(f"index.html + {len(P)} app pages written")


if __name__ == "__main__":
    main()
