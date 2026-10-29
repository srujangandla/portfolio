# Assets Directory

Place your personal assets and project preview screenshots here:

## 1. Project Preview Screenshots
Preview containers use a standard **16:9 aspect ratio** with built-in placement controls:

- **`dashcrate-preview.png`**: UI screenshot of DashCrate Studio. Controlled with class `pos-top` to prioritize the studio header and input brief.
- **`network-features.png`**: Top 15 Random Forest feature importances chart extracted from the telecom telemetry notebook.
- **`disease-heatmap.png`**: Correlation heatmap of epidemiological disease case predictors.

### Placement Controls in CSS
You can control how any image is positioned within its 16:9 container using helper classes or custom positioning:
- `pos-top`: Aligns image to top (`object-position: top center`)
- `pos-center`: Centers image (`object-position: center center`) [default]
- `pos-bottom`: Aligns image to bottom (`object-position: bottom center`)
- `preview-contain`: Sets `object-fit: contain` on a darkened glass backdrop so no edge is cropped
- Custom position: Add inline style `style="--preview-pos: 50% 20%;"` or `style="object-position: 50% 25%;"`

## 2. Documents
- **`resume.pdf`**:
   - Save your latest resume as `resume.pdf` in this directory (`assets/resume.pdf`).
   - Referenced by the "Download resume" buttons across the portfolio.

## 3. Social Sharing (Optional)
- **`og-image.png`**:
   - 1200x630px social preview image for Open Graph and Twitter Card sharing.
