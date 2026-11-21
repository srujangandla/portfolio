# Srujan Gandla — Portfolio

[![Live Site](https://img.shields.io/badge/Live%20Site-srujangandla.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://srujangandla.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)
[![Tech](https://img.shields.io/badge/Built_With-HTML5_|_CSS3_|_Vanilla_JS-white?style=flat-square)](https://github.com/srujangandla)

A lightweight, high-performance personal portfolio engineered with semantic HTML5, modern CSS3, and vanilla JavaScript. Designed with a strict monochrome glassmorphic theme, 60 FPS 2D canvas starfield background engine, scroll parallax, and zero external dependencies.

🔗 **Live Deployment**: [https://srujangandla.vercel.app](https://srujangandla.vercel.app)

---

## 🌌 Highlights

- **Zero Dependencies**: Pure web standards with zero frameworks or runtime libraries — ultra-fast load with sub-100 KB total payload.
- **Monochrome Space Design System**: Near-black palette (`#050506` to `#0B0B0D`), glassmorphic cards with subtle white glow borders, and SVG film-grain overlay.
- **Optimized 2D Canvas Starfield**: 
  - 4 depth layers with independent speeds and twinkling dynamics.
  - Offscreen sprite caching for star dots, layer-4 glow halos, bokeh circles, and shooting star trails.
  - Interactive mouse parallax and gentle spring-back cursor displacement.
  - Hardware concurrency scaling and viewport culling via `IntersectionObserver` & `visibilitychange` to maintain a steady 60 FPS with low Interaction to Next Paint (INP).
- **Accessibility & Contrast**: Strict WCAG AAA compliance (>7:1 contrast on headings, >4.5:1 on muted copy), keyboard navigation focus rings, screen-reader landmarks, and full `prefers-reduced-motion` support.

---

## 🛠️ Featured Engineering Projects

| Project | Domain | Stack | Highlights & Validated Results |
|:---|:---|:---|:---|
| **[Real-Time Human Activity Recognition & Anomaly Detection](https://github.com/srujangandla/human_activity_recognition)** | Deep Learning & Wearables | Python, TensorFlow, Keras, scikit-learn, Streamlit | Decoupled 1D-CNN + Conv-Autoencoder with score fusion for 12-class activity recognition (PAMAP2) and fall anomaly detection (SisFall). Achieved **91.09% accuracy** & **91.23% weighted F1** on PAMAP2 (1.72 ms/window) and **91.10% accuracy** with **0.8723 ROC-AUC** on SisFall. [[Live Demo](https://srujangandla-human-activity-recognition-appdashboard-svhvin.streamlit.app)] |
| **[Network Service Availability Prediction](https://github.com/srujangandla/network-service-availability-prediction)** | Telecom Telemetry ML | Python, scikit-learn, Pandas, NumPy, Matplotlib, Seaborn | Retrospective anomaly classification across 32,000 multi-dimensional RAN KPI trace windows using class-weighted Random Forest and SHAP explainability. Achieved **F1 = 0.9577** and **Recall = 0.9189**. |
| **[Disease Outbreak Prediction & Surge Analysis](https://github.com/srujangandla/Disease-Outbreak-Prediction-and-Surge-Analysis)** | Epidemiological ML | R, Random Forest, Logistic Regression, K-Means, Caret, ggplot2 | Temporal leakage-free forecasting across 8,970 district outbreak reports using climatic and telemetry data. Achieved **RMSE = 0.95** (R² 0.18 vs 0.00 baseline) and surge **PR-AUC 0.44** vs 0.22 baseline. |
| **[BunkRide](https://github.com/srujangandla/bunkride)** | Full-Stack & WebSockets | React, Node.js, Express, MongoDB, Socket.IO, JWT | Full-stack ride booking platform featuring JWT authentication, distinct Rider and Driver roles, Socket.IO live tracking, and Google Maps routing. |

---

## 📂 Repository Structure

```text
├── index.html          # Semantic HTML5 page structure with ARIA landmarks & SEO meta
├── styles.css          # Monochromatic design system tokens & responsive layouts
├── script.js           # 60 FPS Starfield canvas engine, scroll parallax, and interactive UI
├── assets/             # Project screenshots & visual assets
│   ├── dashcrate-preview.png
│   ├── network-features.png
│   ├── disease-heatmap.png
│   └── resume.pdf
└── README.md           # Project documentation
```

---

## ⚡ Quick Start (Local Development)

Because this project relies strictly on native web technologies, no build tools or package managers are required.

### 1. Clone the repository
```bash
git clone https://github.com/srujangandla/Portfolio.git
cd Portfolio
```

### 2. Run locally
You can open `index.html` directly in any modern browser, or spin up a local preview server:

**Using Python:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using Node.js (npx):**
```bash
npx serve .
```

---

## 🚀 Deployment

The portfolio is deployed and hosted on **Vercel** with automatic Git deployments:

🔗 **Production URL**: [https://srujangandla.vercel.app](https://srujangandla.vercel.app)

---

## 📬 Contact & Profiles

- **Name**: Srujan Gandla
- **Institution**: Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad
- **Degree**: B.E. in Artificial Intelligence & Data Science
- **GitHub**: [@srujangandla](https://github.com/srujangandla)
- **LinkedIn**: [linkedin.com/in/srujangandla2504](https://www.linkedin.com/in/srujangandla2504/)
- **Live Portfolio**: [srujangandla.vercel.app](https://srujangandla.vercel.app)
