/* Fin-CoDiT — evaluation data transcribed from the CIKM '26 paper.
 * Source: "Exploring Semantics-Frequency Alignment in Diffusion Transformers
 *          for Financial Time Series Generation", CIKM '26, DOI 10.1145/3799682.3841011
 * Table 2 = generation fidelity, Table 3 = aggregate alignment, Table 4 = ablation.
 * Edit this file to refresh every table and chart on the site. */
window.FINCODIT_DATA = {
  meta: {
    paper: 'Fin-CoDiT: Exploring Semantics-Frequency Alignment in Diffusion Transformers for Conditional Financial Time Series Generation',
    venue: "CIKM '26 · 35th ACM International Conference on Information and Knowledge Management",
    date: 'November 7–11, 2026 · Rome, Italy',
    doi: '10.1145/3799682.3841011',
    assets: ['TS', 'TF', 'T', 'TL', 'HS300', 'SSE50'],
    horizons: [7, 14, 30]
  },

  // ---- Table 2: generation fidelity (MSE / MAE, lower is better) ----
  fidelity: [
    { model: 'TimeGAN',   kind: 'unconditional', mse: [0.408,0.423,0.465, 0.455,0.422,0.437, 0.413,0.430,0.458, 0.450,0.480,0.460, 0.442,0.465,0.491, 0.431,0.450,0.478], mae: [0.434,0.434,0.483, 0.481,0.412,0.431, 0.446,0.430,0.479, 0.514,0.527,0.537, 0.485,0.510,0.544, 0.462,0.495,0.521] },
    { model: 'WGAN',      kind: 'unconditional', mse: [0.429,0.472,0.488, 0.403,0.457,0.478, 0.451,0.480,0.400, 0.406,0.448,0.452, 0.459,0.481,0.512, 0.440,0.462,0.495], mae: [0.251,0.413,0.484, 0.439,0.467,0.433, 0.455,0.415,0.491, 0.533,0.505,0.549, 0.492,0.518,0.558, 0.471,0.502,0.533] },
    { model: 'QuatGAN',   kind: 'unconditional', mse: [0.525,0.557,0.537, 0.570,0.548,0.500, 0.425,0.464,0.459, 0.487,0.509,0.560, 0.533,0.564,0.589, 0.512,0.540,0.572], mae: [0.458,0.452,0.467, 0.463,0.466,0.463, 0.561,0.552,0.592, 0.595,0.514,0.627, 0.550,0.575,0.612, 0.524,0.551,0.590] },
    { model: 'GBMDiff',   kind: 'unconditional', mse: [0.388,0.664,0.614, 0.794,1.433,1.295, 0.390,0.863,0.920, 0.936,1.610,1.376, 0.720,1.105,1.224, 0.685,0.985,1.150], mae: [0.435,0.601,0.625, 0.903,1.169,1.041, 0.443,0.797,1.139, 0.931,1.847,1.144, 0.795,1.210,1.115, 0.740,1.085,1.090] },
    { model: 'FinDDPM',   kind: 'unconditional', mse: [0.456,0.422,0.490, 0.425,0.491,0.400, 0.433,0.442,0.669, 0.428,0.439,0.461, 0.448,0.462,0.521, 0.435,0.451,0.492], mae: [0.370,0.394,0.397, 0.421,0.405,0.538, 0.415,0.431,0.479, 0.465,0.466,0.475, 0.432,0.445,0.498, 0.418,0.432,0.482] },
    { model: 'TimeDiT',   kind: 'conditional',  mse: [0.404,0.427,0.464, 0.441,0.311,0.329, 0.301,0.366,0.277, 0.437,0.522,0.505, 0.385,0.412,0.438, 0.364,0.392,0.415], mae: [0.277,0.323,0.293, 0.335,0.316,0.368, 0.296,0.343,0.320, 0.353,0.463,0.488, 0.315,0.352,0.340, 0.298,0.334,0.325] },
    { model: 'TimeLLM',   kind: 'conditional',  mse: [0.429,0.306,0.440, 0.310,0.447,0.313, 0.430,0.305,0.451, 0.535,0.663,0.525, 0.442,0.354,0.462, 0.425,0.332,0.440], mae: [0.356,0.322,0.390, 0.225,0.291,0.300, 0.333,0.342,0.269, 0.328,0.339,0.361, 0.318,0.315,0.344, 0.302,0.298,0.328] },
    { model: 'CALF',      kind: 'conditional',  mse: [0.370,0.394,0.397, 0.421,0.605,0.538, 0.415,0.431,0.479, 0.465,0.466,0.475, 0.420,0.442,0.485, 0.402,0.421,0.462], mae: [0.404,0.427,0.464, 0.441,0.411,0.429, 0.501,0.466,0.677, 0.537,0.722,0.605, 0.462,0.485,0.540, 0.441,0.462,0.518] },
    { model: 'T2S',       kind: 'conditional',  mse: [0.244,0.293,0.283, 0.289,0.241,0.383, 0.262,0.297,0.275, 0.404,0.553,0.424, 0.282,0.310,0.322, 0.268,0.295,0.304], mae: [0.175,0.370,0.376, 0.369,0.380,0.380, 0.380,0.373,0.423, 0.392,0.346,0.427, 0.265,0.362,0.385, 0.244,0.345,0.368] },
    { model: 'Fin-CoDiT', kind: 'ours',         mse: [0.277,0.323,0.293, 0.235,0.216,0.268, 0.296,0.243,0.220, 0.353,0.433,0.418, 0.301,0.334,0.315, 0.285,0.312,0.298], mae: [0.234,0.273,0.283, 0.275,0.241,0.283, 0.242,0.279,0.279, 0.301,0.384,0.324, 0.272,0.298,0.312, 0.255,0.284,0.298] }
  ],

  // ---- Table 3: aggregate evaluation (averaged over 6 datasets × 3 horizons) ----
  aggregate: [
    { model: 'TimeGAN',   kind: 'unconditional', tail: 0.448, vol: 0.175, lev: 0.185, cvr: 14.22, scs: null, human: null },
    { model: 'WGAN',      kind: 'unconditional', tail: 0.375, vol: 0.142, lev: 0.155, cvr: 12.50, scs: null, human: null },
    { model: 'QuatGAN',   kind: 'unconditional', tail: 0.160, vol: 0.084, lev: 0.092, cvr: 8.85,  scs: null, human: null },
    { model: 'GBMDiff',   kind: 'unconditional', tail: 0.521, vol: 0.285, lev: 0.240, cvr: 18.40, scs: null, human: null },
    { model: 'FinDDPM',   kind: 'unconditional', tail: 0.288, vol: 0.115, lev: 0.124, cvr: 8.64,  scs: null, human: null },
    { model: 'TimeDiT',   kind: 'conditional',  tail: 0.215, vol: 0.088, lev: 0.095, cvr: 6.12,  scs: 0.692, human: '3.12 ± 0.24' },
    { model: 'TimeLLM',   kind: 'conditional',  tail: 0.198, vol: 0.076, lev: 0.082, cvr: 5.05,  scs: 0.731, human: '2.85 ± 0.18' },
    { model: 'CALF',      kind: 'conditional',  tail: 0.182, vol: 0.071, lev: 0.078, cvr: 4.42,  scs: 0.764, human: '2.69 ± 0.20' },
    { model: 'T2S',       kind: 'conditional',  tail: 0.144, vol: 0.052, lev: 0.055, cvr: 3.10,  scs: 0.748, human: '3.12 ± 0.21' },
    { model: 'Fin-CoDiT', kind: 'ours',         tail: 0.075, vol: 0.028, lev: 0.031, cvr: 0.05,  scs: 0.892, human: '3.45 ± 0.15' }
  ],

  // ---- Table 4: ablation ----
  ablation: [
    { variant: 'Fin-CoDiT (Full)',           group: 'full',   mse: 0.042, scs: 0.88, f1: 0.84, cvr: 0.05 },
    { variant: '– w/o SFA',                   group: 'sfa',    mse: 0.049, scs: 0.71, f1: 0.62, cvr: 0.06 },
    { variant: '– w/o Prior Bias',            group: 'sfa',    mse: 0.046, scs: 0.81, f1: 0.76, cvr: 0.05 },
    { variant: '– w/ Dense Routing',          group: 'sfa',    mse: 0.043, scs: 0.87, f1: 0.83, cvr: 0.05 },
    { variant: '– w/o Causal Encoder',        group: 'vae',    mse: 0.044, scs: 0.86, f1: 0.82, cvr: 0.05 },
    { variant: '– w/o Morphological Projection', group: 'vae', mse: 0.043, scs: 0.87, f1: 0.83, cvr: 8.42 },
    { variant: '– w/o LQA Bottleneck',        group: 'vae',    mse: 0.051, scs: 0.79, f1: 0.72, cvr: 0.08 }
  ],

  // ---- Table 1: dataset composition ----
  dataset: {
    assets: [
      { asset: 'T',     windows: 2581, total: 25123, train: 18918, val: 1956, test: 4249 },
      { asset: 'TF',    windows: 2572, total: 26488, train: 20012, val: 2058, test: 4418 },
      { asset: 'TS',    windows: 2586, total: 24115, train: 18183, val: 1875, test: 4057 },
      { asset: 'TL',    windows: 2568, total: 26982, train: 20317, val: 2102, test: 4563 },
      { asset: 'HS300', windows: 2592, total: 22354, train: 16832, val: 1739, test: 3783 },
      { asset: 'SSE50', windows: 2576, total: 20147, train: 15191, val: 1568, test: 3388 }
    ],
    totals: { windows: 15475, total: 145209, train: 109453, val: 11298, test: 24458 },
    span: 'January 1, 2015 → December 31, 2025',
    tradingDays: 2750,
    split: [
      { name: 'Train', range: 'Jan 1, 2015 → Dec 31, 2022', share: 73, pairs: 109453 },
      { name: 'Validation', range: 'Jan 1, 2023 → Dec 31, 2023', share: 9, pairs: 11298 },
      { name: 'Test', range: 'Jan 1, 2024 → Dec 31, 2025', share: 18, pairs: 24458 }
    ]
  },

  // ---- Counterfactual stress tests (Figure 2) ----
  scenarios: [
    { id: 1, title: 'Geopolitical escalation & oil shock',
      text: 'Bond futures plunge -12.4% cumulative over 7 days; a Day-2 oil supply shock opens a gap-down and a -6.5% intraday drawdown through the 101.50 support on 2.8× volume.',
      ours: 'Day-2 gap-down, exact; post-event consolidation preserved',
      base: 'Smooths the sharp liquidation into a monotonic curve' },
    { id: 2, title: 'Cooling inflation & short squeeze',
      text: 'Treasury futures post +5.6% over 7 days; a surprise -0.5% MoM CPI print on Day 5 sparks a +3.8% single-day surge that clears the 112.80 resistance on 2.2× volume.',
      ours: 'Day-5 CPI breakout, exact; volatility regime retained',
      base: 'Step-like surge flattened into a ramp' },
    { id: 3, title: 'Mid-week hawkish trend reversal',
      text: 'A hawkish reversal inside the week invalidates the earlier trend; the regime boundary must appear at the correct day.',
      ours: 'Regime boundary placed at the specified day',
      base: 'Misses the regime boundary entirely' },
    { id: 4, title: 'Abrupt liquidity / banking-default shock',
      text: 'A sudden liquidity event produces a Day-3 gap and a deep intraday drawdown that the trend structure alone cannot express.',
      ours: 'Day-3 banking-default liquidation, exact',
      base: 'Smooths the sharp liquidation into a monotonic curve' }
  ],

  // ---- Headline claims surfaced in the results card ----
  headline: [
    { label: 'Semantic consistency (SCS)', ours: 0.892, best: 0.764, bestName: 'CALF', dir: 'up', fmt: 'fixed3' },
    { label: 'Constraint violation rate', ours: 0.05,  best: 3.10,  bestName: 'T2S',  dir: 'down', fmt: 'pct2', unit: '%' },
    { label: 'Tail index error', ours: 0.075, best: 0.144, bestName: 'T2S',  dir: 'down', fmt: 'fixed3' },
    { label: 'Vol. clustering L2 error', ours: 0.028, best: 0.052, bestName: 'T2S', dir: 'down', fmt: 'fixed3' },
    { label: 'Leverage error', ours: 0.031, best: 0.055, bestName: 'T2S', dir: 'down', fmt: 'fixed3' },
    { label: 'Human realism (1–5)', ours: 3.45, best: 3.12, bestName: 'TimeDiT / T2S', dir: 'up', fmt: 'fixed2' }
  ],

  // ---- Timeline ----
  timeline: [
    { date: '2026-11-09', title: 'CIKM ’26 presentation, Rome',
      body: 'Fin-CoDiT presented at the 35th ACM International Conference on Information and Knowledge Management.' },
    { date: '2026-08-23', title: 'Camera-ready accepted',
      body: 'Full research paper accepted for the CIKM ’26 proceedings (12 pages, DOI 10.1145/3799682.3841011).' },
    { date: '2026-08-07', title: 'Acceptance notification',
      body: 'The paper clears review for the CIKM ’26 main conference track.' },
    { date: '2026-05-23', title: 'Submission',
      body: 'Full research paper submitted to CIKM ’26; code, dataset protocol and figures released alongside it.' }
  ]
};
