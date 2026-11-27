# Fin-CoDiT — project page

Static site for **Fin-CoDiT: Exploring Semantics-Frequency Alignment in Diffusion Transformers for
Conditional Financial Time Series Generation** (CIKM '26, DOI `10.1145/3799682.3841011`).

Live: **https://xigmoid.github.io/fin-codit/**

## Structure

```
index.html              homepage (hero, results card, method, evaluation, dataset, timeline)
results.html            full result tables (Table 2 fidelity grid, Table 3, Table 4)
assets/css/main.css     design system: tokens, components, light + dark themes
assets/js/main.js       theme toggle, heatmap, table renderers, mobile nav, scroll reveal
assets/data/results.js  every number the site shows — edit here to refresh all tables & charts
assets/img/             figures cropped from the paper, CIKM'26 + PKU logos, favicon
assets/paper/           camera-ready PDF and talk slides
```

No build step, no dependencies — plain HTML/CSS/JS, served directly by GitHub Pages.

## Updating the numbers

All evaluation numbers live in `assets/data/results.js` and are transcribed from the paper:

| key | paper source |
|---|---|
| `fidelity` | Table 2 — MSE / MAE over 6 assets × 3 horizons |
| `aggregate` | Table 3 — tail index error, vol. clustering, leverage, CVR, SCS, human score |
| `ablation` | Table 4 — SFA and TF-CVAE component ablation |
| `dataset` | Table 1 — windows and pairs per asset, chronological split |
| `headline` | summary rows surfaced in the results card |

Column order in `fidelity` is **asset-major**: TS(7,14,30), TF(7,14,30), T(7,14,30), TL(7,14,30),
HS300(7,14,30), SSE50(7,14,30) — 18 values per model.

Change a value there and every table, the best/second-best highlighting and the results heatmap
update on reload.

## Figures

`assets/img/fig*.png` are cropped from the camera-ready PDF at 260 dpi:

- `fig1_overview.png` — Figure 1, architecture overview
- `fig2_counterfactual.png` — Figure 2, counterfactual case studies
- `fig3a_tradeoff.png` / `fig3b_routing.png` — Figure 3, sparsity trade-off and routing heatmap
- `fig4_attention.png` — Figure 4, cross-attention maps

## Local preview

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000/
```

## Credits

Yingxiao Zhang¹, Jiaxin Duan², Junfu Zhang¹, Yue Zou¹, Ke Feng¹
¹ Peking University · ² China Electronics Cloud Tech Co., Ltd
