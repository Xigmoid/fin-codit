/* Fin-CoDiT — site behaviour
 * Renders every table and chart from assets/data/results.js so the page stays
 * in sync with the paper tables: edit the data file, reload, done. */
(function () {
  'use strict';

  var D = window.FINCODIT_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------ theme */
  function initTheme() {
    var KEY = 'fcd-theme';
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    var sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = stored || sys;
    document.documentElement.setAttribute('data-theme', theme);

    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
        syncThemeIcons();
      });
    });
    syncThemeIcons();
  }

  function syncThemeIcons() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.innerHTML = dark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    });
  }

  /* ------------------------------------------------------------------ utils */
  function fmt(v, kind) {
    if (v === null || v === undefined) return '—';
    if (kind === 'pct2') return v.toFixed(2) + '%';
    if (kind === 'fixed3') return v.toFixed(3);
    if (kind === 'fixed2') return v.toFixed(2);
    if (kind === 'pct1') return v.toFixed(1) + '%';
    return String(v);
  }
  function pctDelta(ours, best, dir) {
    if (!best) return null;
    var d = (ours - best) / best * 100;
    if (dir === 'down') return -d;
    return d;
  }
  function metricKey(metric) { return metric === 'mse' ? 'mse' : 'mae'; }

  /* Column layout shared by every fidelity table:
   * assets × horizons, flattened. */
  function columns() {
    var cols = [];
    D.meta.assets.forEach(function (a) {
      D.meta.horizons.forEach(function (h) { cols.push({ asset: a, horizon: h }); });
    });
    return cols;
  }
  function colIndex(asset, horizon) {
    var i = D.meta.assets.indexOf(asset);
    var j = D.meta.horizons.indexOf(horizon);
    return i * D.meta.horizons.length + j;
  }

  /* ------------------------------------------------------- results heatmap */
  function renderHeatmap(metric) {
    var host = $('#heatmap');
    if (!host || !D) return;
    var cols = columns();
    var ours = D.fidelity.filter(function (r) { return r.kind === 'ours'; })[0];
    var baselines = D.fidelity.filter(function (r) { return r.kind !== 'ours'; });

    var html = '<table><thead><tr><th class="row-head">Asset</th>';
    D.meta.horizons.forEach(function (h) { html += '<th>' + h + '-day</th>'; });
    html += '</tr></thead><tbody>';

    D.meta.assets.forEach(function (asset) {
      html += '<tr><th class="row-head">' + asset + '</th>';
      D.meta.horizons.forEach(function (h) {
        var idx = colIndex(asset, h);
        var o = ours[metricKey(metric)][idx];
        var best = Infinity, bestName = '';
        baselines.forEach(function (b) {
          var v = b[metricKey(metric)][idx];
          if (v < best) { best = v; bestName = b.model; }
        });
        var delta = (o - best) / best * 100;           /* negative = better */
        var t = Math.min(1, Math.abs(delta) / 45);
        var bg = delta < -0.05
          ? 'color-mix(in srgb, var(--ok) ' + (7 + 30 * t).toFixed(1) + '%, var(--panel))'
          : (delta > 0.05
            ? 'color-mix(in srgb, var(--bad) ' + (7 + 30 * t).toFixed(1) + '%, var(--panel))'
            : 'var(--panel-2)');
        var cls = delta < -0.05 ? 'cell win' : (delta > 0.05 ? 'cell lose' : 'cell');
        var sign = delta <= 0 ? '−' : '+';
        html += '<td><div class="' + cls + '" style="background:' + bg + '" ' +
          'title="' + asset + ' · ' + h + '-day ' + metric.toUpperCase() + '\nFin-CoDiT ' + o.toFixed(3) +
          '\nBest baseline ' + bestName + ' ' + best.toFixed(3) + '\nΔ ' + sign + Math.abs(delta).toFixed(1) + '%">' +
          '<span class="v">' + sign + Math.abs(delta).toFixed(1) + '%</span>' +
          '<span class="m">' + o.toFixed(3) + ' vs ' + best.toFixed(3) + '</span></div></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    host.innerHTML = html;
  }

  /* -------------------------------------------------------- headline rail */
  function renderRail() {
    var host = $('#rail');
    if (!host || !D) return;
    var html = '<p class="rail-title">Headline metrics</p>';
    D.headline.forEach(function (h) {
      var d = pctDelta(h.ours, h.best, h.dir);
      /* pctDelta already normalises the sign: > 0 always means "improved". */
      var good = d === null ? null : d > 0;
      var sign = d === null ? '' : (d >= 0 ? '+' : '−');
      var abs = d === null ? '' : Math.abs(d).toFixed(1) + '%';
      html += '<div class="rail-row">' +
        '<span class="rail-label">' + h.label + '</span>' +
        '<span class="rail-value">' + fmt(h.ours, h.fmt) + '</span>' +
        '<span class="rail-delta">vs best baseline <b>' + h.bestName + ' ' + fmt(h.best, h.fmt) + '</b> · ' +
        '<b class="' + (good === null ? '' : (good ? 'up' : 'down')) + '">' + sign + abs + '</b></span>' +
        '</div>';
    });
    html += '<div class="rail-big" style="margin-top:1rem"><div class="n">145,209</div>' +
      '<div class="l">aligned text–series pairs</div></div>';
    host.innerHTML = html;
  }

  /* --------------------------------------------------------- fidelity table */
  function renderFidelityTable(host, metric) {
    if (!host) return;
    var cols = columns();
    var rows = D.fidelity;
    var best = {}, second = {};
    cols.forEach(function (c, i) {
      var vals = rows.map(function (r) { return r[metricKey(metric)][i]; }).sort(function (a, b) { return a - b; });
      best[i] = vals[0];
      second[i] = vals.find(function (v) { return v !== vals[0]; });
    });

    var html = '<table class="data"><thead><tr><th class="name">Model</th>';
    D.meta.assets.forEach(function (a, ai) {
      html += '<th class="grp grp-start' + (ai === 0 ? '' : '') + '" colspan="' + D.meta.horizons.length + '">' + a + '</th>';
    });
    html += '</tr><tr><th class="name"></th>';
    D.meta.assets.forEach(function (a, ai) {
      D.meta.horizons.forEach(function (h, hi) {
        html += '<th class="' + (hi === 0 ? 'grp-start grp' : '') + '">' + h + 'd</th>';
      });
    });
    html += '</tr></thead><tbody>';

    var lastKind = null;
    rows.forEach(function (r) {
      if (r.kind !== lastKind) {
        lastKind = r.kind;
        var label = r.kind === 'unconditional' ? 'Unconditional models' : (r.kind === 'conditional' ? 'Conditional models' : 'This work');
        html += '<tr class="section-row"><td colspan="' + (cols.length + 1) + '">' + label + '</td></tr>';
      }
      html += '<tr class="' + (r.kind === 'ours' ? 'ours' : '') + '"><td class="name">' + r.model +
        (r.kind === 'conditional' && r.model !== 'Fin-CoDiT' ? ' <span class="muted">*</span>' : '') + '</td>';
      cols.forEach(function (c, i) {
        var v = r[metricKey(metric)][i];
        var cls = 'num';
        if (v === best[i]) cls += ' best';
        else if (v === second[i]) cls += ' second';
        html += '<td class="' + cls + '">' + v.toFixed(3) + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    host.innerHTML = html;
  }

  /* -------------------------------------------------------- aggregate table */
  function renderAggregateTable(host) {
    if (!host) return;
    var cols = [
      { k: 'tail', label: 'Tail index err ↓' },
      { k: 'vol', label: 'Vol. clustering L2 ↓' },
      { k: 'lev', label: 'Leverage err ↓' },
      { k: 'cvr', label: 'CVR (%) ↓' },
      { k: 'scs', label: 'SCS ↑' },
      { k: 'human', label: 'Human (1–5) ↑' }
    ];
    var best = {};
    cols.forEach(function (c) {
      var vals = D.aggregate.map(function (r) { return r[c.k]; })
        .filter(function (v) { return v !== null && v !== undefined; })
        .map(function (v) { return typeof v === 'string' ? parseFloat(v) : v; });
      best[c.k] = c.k === 'human' ? Math.max.apply(null, vals) : Math.min.apply(null, vals);
    });

    var html = '<table class="data"><thead><tr><th class="name">Model</th>';
    cols.forEach(function (c) { html += '<th>' + c.label + '</th>'; });
    html += '</tr></thead><tbody>';
    var lastKind = null;
    D.aggregate.forEach(function (r) {
      if (r.kind !== lastKind) {
        lastKind = r.kind;
        var label = r.kind === 'unconditional' ? 'Unconditional models' : (r.kind === 'conditional' ? 'Conditional models' : 'This work');
        html += '<tr class="section-row"><td colspan="' + (cols.length + 1) + '">' + label + '</td></tr>';
      }
      html += '<tr class="' + (r.kind === 'ours' ? 'ours' : '') + '"><td class="name">' + r.model +
        (r.kind === 'conditional' && r.model !== 'Fin-CoDiT' ? ' <span class="muted">*</span>' : '') + '</td>';
      cols.forEach(function (c) {
        var v = r[c.k];
        if (v === null || v === undefined) { html += '<td class="num muted">—</td>'; return; }
        var num = typeof v === 'string' ? parseFloat(v) : v;
        var cls = 'num' + (num === best[c.k] ? ' best' : '');
        html += '<td class="' + cls + '">' + v + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    host.innerHTML = html;
  }

  /* ---------------------------------------------------------- ablation table */
  function renderAblationTable(host) {
    if (!host) return;
    var html = '<table class="data"><thead><tr><th class="name">Ablation variant</th>' +
      '<th>Denoising MSE ↓</th><th>SCS ↑</th><th>Event F1 ↑</th><th>CVR (%) ↓</th></tr></thead><tbody>';
    var lastGroup = null;
    D.ablation.forEach(function (r) {
      if (r.group !== lastGroup) {
        lastGroup = r.group;
        if (r.group !== 'full') {
          html += '<tr class="section-row"><td colspan="5">' + (r.group === 'sfa' ? 'SFA ablations' : 'TF-CVAE ablations') + '</td></tr>';
        }
      }
      var ours = r.group === 'full';
      var bad = r.cvr > 1;
      html += '<tr class="' + (ours ? 'ours' : '') + '"><td class="name">' + r.variant + '</td>' +
        '<td class="num' + (ours ? ' best' : '') + '">' + r.mse.toFixed(3) + '</td>' +
        '<td class="num' + (ours ? ' best' : '') + '">' + r.scs.toFixed(2) + '</td>' +
        '<td class="num' + (ours ? ' best' : '') + '">' + r.f1.toFixed(2) + '</td>' +
        '<td class="num' + (ours ? ' best' : (bad ? ' delta-bad' : '')) + '">' + r.cvr.toFixed(2) + '</td></tr>';
    });
    html += '</tbody></table>';
    host.innerHTML = html;
  }

  /* ----------------------------------------------------------- dataset table */
  function renderDatasetTable(host) {
    if (!host) return;
    var html = '<table class="data"><thead><tr><th class="name">Asset</th>' +
      '<th>Windows</th><th>Pairs</th><th>Train</th><th>Validation</th><th>Test</th></tr></thead><tbody>';
    D.dataset.assets.forEach(function (a) {
      html += '<tr><td class="name">' + a.asset + '</td>' +
        '<td class="num">' + a.windows.toLocaleString() + '</td>' +
        '<td class="num">' + a.total.toLocaleString() + '</td>' +
        '<td class="num">' + a.train.toLocaleString() + '</td>' +
        '<td class="num">' + a.val.toLocaleString() + '</td>' +
        '<td class="num">' + a.test.toLocaleString() + '</td></tr>';
    });
    var t = D.dataset.totals;
    html += '<tr class="ours"><td class="name">Total</td>' +
      '<td class="num best">' + t.windows.toLocaleString() + '</td>' +
      '<td class="num best">' + t.total.toLocaleString() + '</td>' +
      '<td class="num">' + t.train.toLocaleString() + '</td>' +
      '<td class="num">' + t.val.toLocaleString() + '</td>' +
      '<td class="num">' + t.test.toLocaleString() + '</td></tr>';
    html += '</tbody></table>';
    host.innerHTML = html;
  }

  /* --------------------------------------------------------------- copy bib */
  function initCopy() {
    $$('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sel = btn.getAttribute('data-copy');
        var node = sel.charAt(0) === '#' ? $(sel) : null;
        if (!node) return;
        var text = node.textContent || '';
        var done = function () {
          var toast = $('#toast');
          if (!toast) return;
          toast.textContent = 'Copied to clipboard';
          toast.classList.add('show');
          setTimeout(function () { toast.classList.remove('show'); }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
        } else { fallbackCopy(text, done); }
      });
    });
  }
  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ------------------------------------------------------------ scroll fx */
  function initNav() {
    var links = $('#nav-links');
    $$('[data-nav-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!links) return;
        var open = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    });
    if (links) {
      links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          links.classList.remove('open');
          var t = $('[data-nav-toggle]');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function initReveal() {
    var nodes = $$('.reveal');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) { nodes.forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------------------------------------------ init */
  function init() {
    initTheme();
    if (!D) return;
    renderHeatmap('mae');
    renderRail();
    renderAggregateTable($('#aggregate-table'));
    renderAblationTable($('#ablation-table'));
    renderDatasetTable($('#dataset-table'));
    var fidHost = $('#fidelity-table');
    if (fidHost) {
      var pressed = $('[data-metric-group="fidelity"] button[aria-pressed="true"]');
      renderFidelityTable(fidHost, pressed ? pressed.getAttribute('data-metric') : 'mse');
    }
    initCopy();
    initNav();
    initReveal();

    /* metric switchers */
    $$('[data-metric-group]').forEach(function (group) {
      var target = group.getAttribute('data-metric-group');
      $$('button', group).forEach(function (btn) {
        btn.addEventListener('click', function () {
          $$('button', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
          var metric = btn.getAttribute('data-metric');
          if (target === 'heatmap') renderHeatmap(metric);
          if (target === 'fidelity') renderFidelityTable($('#fidelity-table'), metric);
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
