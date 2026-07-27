/*
 * render-inspect.mjs — the G13 Rendered-Visual Gate inspector (Phase 1: C0–C4).
 * Spec: flow-orchestrator/.claude/rules/design-quality-gate.md
 *
 * Runs IN THE PAGE CONTEXT against the computed DOM — never greps source.
 * Two runtimes, one body:
 *   - agent (ux-executor): browser MCP → javascript_tool evaluates window.__renderInspect(opts)
 *   - CI: render-gate-run.py (Playwright) → page.evaluate(window.__renderInspect, opts)
 *
 * Returns { archetype, viewport, findings:[{sev,code,msg,sel}], verdict }.
 * Phase 1 implements C0,C1,C2,C3,C4. C5 (icons) + C6 (pattern) are Phase 2.
 */
(function () {
  const REQUIRED_STATES = {
    list:     ['loading', 'empty', 'filtered-empty', 'error', 'populated'],
    form:     ['default', 'field-validation-error', 'submitting', 'success', 'submit-failure'],
    detail:   ['loading', 'not-found', 'error', 'populated'],
    mutation: ['confirm', 'pending', 'success', 'failure'],
    degraded: ['unavailable'],
  };
  // Only the app-shell chrome may be viewport-pinned. Prototypes are in-flow docs.
  const FIXED_ALLOW = new Set(['app-shell', 'sidebar-root']);

  function cssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + el.id;
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && parts.length < 4; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      if (n.getAttribute && n.getAttribute('data-state-band')) s += `[data-state-band="${n.getAttribute('data-state-band')}"]`;
      parts.unshift(s);
    }
    return parts.join('>');
  }

  function parseRGB(str) {
    const m = (str || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function relLum({ r, g, b }) {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function contrast(fg, bg) {
    const L1 = relLum(fg), L2 = relLum(bg);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  // First opaque background walking up the ancestor chain; default white page.
  function compositedBg(el, win) {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const c = parseRGB(win.getComputedStyle(n).backgroundColor);
      if (c && c.a >= 0.99) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }
  function isLargeText(st) {
    const px = parseFloat(st.fontSize) || 0;
    const bold = (parseInt(st.fontWeight, 10) || 400) >= 700;
    return px >= 24 || (bold && px >= 18.66);
  }

  window.__renderInspect = function (opts) {
    opts = opts || {};
    const doc = document, win = window;
    const findings = [];
    const push = (sev, code, msg, el) => findings.push({ sev, code, msg, sel: cssPath(el) });

    const archetype = doc.documentElement.getAttribute('data-archetype') || opts.archetype || null;
    const bandEls = [...doc.querySelectorAll('[data-state-band]')];
    const present = new Set(bandEls.map(e => e.getAttribute('data-state-band')));

    // C0 — required-state completeness (states must EXIST)
    if (archetype && REQUIRED_STATES[archetype]) {
      for (const s of REQUIRED_STATES[archetype])
        if (!present.has(s)) push('P0', 'C0-missing-state', `archetype '${archetype}' requires a '${s}' state — not authored`);
    } else if (!archetype) {
      push('P1', 'C0-no-archetype', 'screen declares no data-archetype — cannot verify state completeness');
    }

    // C1 — each declared state band actually renders (EXISTS → visible)
    for (const el of bandEls) {
      const r = el.getBoundingClientRect(), st = win.getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0)
        push('P0', 'C1-invisible-state', `state '${el.getAttribute('data-state-band')}' is authored but does not render`, el);
    }

    // C2 — no stray position:fixed (allowlist = app shell only)
    for (const el of doc.querySelectorAll('*')) {
      if (win.getComputedStyle(el).position !== 'fixed') continue;
      const id = el.id || el.getAttribute('data-shell') || '';
      if (!FIXED_ALLOW.has(id)) push('P0', 'C2-fixed', 'viewport-pinned element; state variants must be in-flow bands', el);
    }

    // C3 — WCAG AA contrast on rendered text
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!t.nodeValue.trim()) continue;
      const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      const st = win.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || st.display === 'none' || st.visibility === 'hidden') continue;
      const fg = parseRGB(st.color); if (!fg) continue;
      const ratio = contrast(fg, compositedBg(el, win));
      const min = isLargeText(st) ? 3 : 4.5;
      if (ratio + 0.05 < min) push('P1', 'C3-contrast', `contrast ${ratio.toFixed(2)} < ${min} on "${t.nodeValue.trim().slice(0, 30)}"`, el);
    }

    // C4 — no page-level horizontal overflow (report at whatever viewport we run)
    const de = doc.documentElement;
    if (de.scrollWidth > de.clientWidth)
      push('P1', 'C4-overflow', `page scrolls horizontally: scrollWidth ${de.scrollWidth} > clientWidth ${de.clientWidth}`);

    return {
      archetype,
      viewport: { width: win.innerWidth, height: win.innerHeight },
      findings,
      verdict: findings.some(f => f.sev === 'P0') ? 'RENDER-VIOLATIONS'
             : findings.length ? 'RENDER-ADVISORY' : 'RENDER-CLEAN',
    };
  };
  return window.__renderInspect;
})();
