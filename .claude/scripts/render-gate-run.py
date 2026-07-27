#!/usr/bin/env python3
"""
render-gate-run.py — headless driver for the G13 render inspector (Phase 1: C0–C4).
Spec: flow-orchestrator/.claude/rules/design-quality-gate.md

Loads each target URL in headless Chromium, injects render-inspect.mjs, runs
window.__renderInspect(), and prints one JSON verdict per screen.

Runtime: Playwright-Python (flow-ui CI is python; this keeps the harness python).
  pip install playwright && python -m playwright install --with-deps chromium

Usage:
  render-gate-run.py --base http://localhost:PORT URL_PATH [URL_PATH ...]
  render-gate-run.py --base http://localhost:PORT --viewport 375x812 URL_PATH

Exit: 0 always (the .sh interprets verdicts); non-zero only on driver failure
(e.g. no browser installed) so a missing browser can never masquerade as a pass.
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
INSPECTOR = os.path.join(HERE, "render-inspect.mjs")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--viewport", default="1280x800")
    ap.add_argument("paths", nargs="+")
    a = ap.parse_args()
    w, h = (int(x) for x in a.viewport.lower().split("x"))

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.stderr.write(
            "ERROR: Playwright not installed — the render gate needs a headless browser.\n"
            "       pip install playwright && python -m playwright install --with-deps chromium\n"
            "       (A missing browser must fail, never silently pass — see the spec's anti-vacuous rule.)\n")
        sys.exit(3)

    inspector_src = open(INSPECTOR, encoding="utf-8").read()
    lucide_path = os.path.join(HERE, "assets", "lucide-paths.json")
    lucide = json.load(open(lucide_path, encoding="utf-8"))["paths"] if os.path.exists(lucide_path) else []
    results = []
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(args=["--force-prefers-reduced-motion"])
        except Exception as e:
            sys.stderr.write(f"ERROR: could not launch Chromium: {e}\n"
                             "       python -m playwright install --with-deps chromium\n")
            sys.exit(3)
        page = browser.new_page(viewport={"width": w, "height": h})
        for path in a.paths:
            url = a.base.rstrip("/") + "/" + path.lstrip("/")
            try:
                page.goto(url, wait_until="networkidle", timeout=15000)
                page.evaluate(inspector_src)          # defines window.__renderInspect
                r = page.evaluate("(opts)=>window.__renderInspect(opts)", {"lucidePaths": lucide})
            except Exception as e:
                r = {"verdict": "DRIVER-ERROR", "error": str(e), "findings": []}
            r["path"] = path
            results.append(r)
        browser.close()
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
