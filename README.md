# Srujan | AI & Data Science Portfolio

A minimalist, high-contrast, black-and-grey personal portfolio website built with semantic HTML, vanilla CSS, and vanilla JavaScript. Features glassmorphism cards, blurred ambient drifting background depth, white glow interactions, and full responsive support.

Designed for an undergraduate in **B.E. AI & Data Science** at **Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad**, targeting roles in:
- **Machine Learning Engineer**
- **AI Engineer**
- **Data Scientist**
- **Data Analyst**

---

## 🚀 Live Demo & Deployment

This project has **zero build steps** and **no external dependencies or frameworks**. It is ready to deploy directly onto **GitHub Pages**.

### GitHub Pages Deployment Steps

1. **Create a GitHub Repository**:
   - Go to [GitHub.com](https://github.com) and create a new repository named `portfolio` (or `srujangandla.github.io`).
   - If you name it `srujangandla.github.io`, your site will be hosted directly at `https://srujangandla.github.io/`.

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/srujangandla/portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your repository, go to **Settings** > **Pages** (under "Code and automation" in the left sidebar).
   - Under **Build and deployment**:
     - **Source**: Select `Deploy from a branch`.
     - **Branch**: Select `main` and folder `/ (root)`.
     - Click **Save**.
   - GitHub Pages will build and deploy your site within 1–2 minutes. Your URL will be shown at the top of the Pages settings tab.

---

## 📁 Repository Structure

```text
├── index.html          # Semantic HTML5 page structure with accessibility landmarks
├── styles.css          # Monochromatic glassmorphism design system & CSS variables
├── script.js           # Vanilla JS for IntersectionObserver fade-up, mobile nav & copy email
├── assets/             # Directory for personal files
│   ├── resume.pdf      # Place your PDF resume here
│   └── README.md       # Assets guide
└── README.md           # Documentation & deployment guide
```

---

## 🎨 Theme & Design Specs

- **Palette**: Monochromatic near-black `#0A0A0B` to subtle grey `#141416` gradient.
- **Glassmorphism**: `rgba(255, 255, 255, 0.04)` cards with `backdrop-filter: blur(16px) saturate(140%)` and `1px solid rgba(255, 255, 255, 0.12)`.
- **Glow & Interaction**: 250ms transition to white glow border (`rgba(255, 255, 255, 0.45)`) and 4px card lift on hover and focus.
- **Background Depth**: Three large drifting radial gradients with 120px+ gaussian blur.
- **Fallbacks**: Browser fallback (`@supports not (backdrop-filter)`) to solid dark panels, plus full `prefers-reduced-motion` compliance.

---

## 📝 Placeholders to Replace

Before publishing your portfolio live, search for and update the following placeholders across `index.html` and the `assets/` folder:

| # | Placeholder | Location in `index.html` | Description |
|---|---|---|---|
| 1 | `[ONE LINE ABOUT ME]` | Line ~133 | A concise 1-line elevator pitch highlighting your specific AI/DS passion or focus area. |
| 2 | `[REAL METRIC]` | Line ~230 | The measured benchmark/impact metric for **DashCrate** (e.g., latency reduction, NDCG score, token savings). |
| 3 | `[F1 / AUC]` | Line ~277 | The exact classification accuracy, F1-score, or anomaly detection AUC for the **HAR** model. |
| 4 | `[PROJECT 3 PLACEHOLDER]` | Line ~315 | The project title of your third portfolio project. |
| 5 | `[1-2 LINE PROJECT DESCRIPTION PLACEHOLDER]` | Line ~317 | Brief summary of what your third project does. |
| 6 | `[REAL METRIC]` | Line ~322 | The measured outcome or quantitative performance of your third project. |
| 7 | `[TOOL / LIB 1]`, `[TOOL / LIB 2]`, `[TOOL / LIB 3]` | Lines ~326–328 | The technologies used in Project 3 (e.g., PyTorch, SQL, Scikit-learn). |
| 8 | `[YOUR EMAIL]` | Lines ~434, 439 | Your contact email address (both in the visible text and the `mailto:` link). |
| 9 | `assets/resume.pdf` | `assets/` folder | Add your actual resume PDF named `resume.pdf` inside `assets/`. |
| 10 | Project Repo & Demo links | Lines ~200, 211, etc. | Update `href` attributes to point to the exact GitHub repository and live demo URLs for each project. |
| 11 | `og-image.png` (Optional) | `assets/` folder | Social preview card image (1200×630px) referenced in Open Graph meta tags. |
