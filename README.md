# DOC-SHIFT — 100% In-Browser File Converter

> **Your files. A whole new format.**  
> Convert images, video, audio, documents, and structured data right in your browser. Fast, private, completely free, and 100% local. Zero uploads, zero servers.

---

## ✦ Key Highlights

- **Neo-Brutalist Visual Identity:** Bold typography, warm cream background (`#FFF6EC`), heavy black outlines (`2.5px - 3.5px`), hard offset shadows, vibrant retro color palette, and folded-corner file badges.
- **Signature Hero Animation:** Smooth continuous state machine cycling between:
  - **Phase A — Horizontal Parade (~3.5s):** Cards float smoothly across the screen along dynamic horizontal tracks.
  - **Phase B — Anticlockwise Orbit (~3.5s):** Seamlessly morphs into a circular ring orbiting counter-clockwise around the central exchange hub.
  - **Reduced Motion Support:** Respects `prefers-reduced-motion` with a calm, static balanced composition.
- **100% Client-Side Engine:** No user files or filenames ever leave the device. Transformations take place in browser RAM using HTML5 Canvas, DOMParser, Web Audio API, and TypedArray memory.
- **No Sign-up / No Limits:** Free forever with no accounts, paywalls, or third-party tracking beacons.

---

## 📁 Supported & Verified File Conversions

| Category | Input Formats | Output Formats | Local Engine | Verification |
|----------|---------------|----------------|--------------|--------------|
| **Images** | PNG, JPG, JPEG, WEBP, BMP, SVG, ICO | PNG, JPG, WEBP, BMP, ICO | HTML5 Canvas / ImageBitmap | **Verified** |
| **Data** | JSON, CSV, TSV, XML, YAML | JSON, CSV, TSV, XML, YAML | PapaParse, js-yaml, DOMParser | **Verified** |
| **Documents** | TXT, MD (Markdown), HTML, CSV | PDF, HTML, MD, TXT | jsPDF, marked, HTML Sanitizer | **Verified** |
| **Audio** | WAV, MP3, OGG, AAC, M4A | WAV, MP3 | Web Audio API / AudioContext | **Verified** |
| **Video** | MP4, WebM | WAV, MP3 (Audio Extraction) | Web Audio Media Decoder | **Verified** |

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 + Custom Neo-Brutalist CSS Token System
- **Icons:** Lucide React + Custom SVG Brand Badges
- **Engines:**
  - `papaparse` (High-speed CSV/TSV parsing and serialization)
  - `js-yaml` (YAML / JSON mapping)
  - `jspdf` (Client-side vector PDF generation)
  - `marked` (Markdown compiler)
  - `canvas-confetti` (High-performance celebratory particle physics)
- **Testing:** Vitest

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/doc-shift.git
cd doc-shift

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Automated Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```
Generates an optimized static bundle in the `dist/` directory ready for deployment.

---

## 🌐 Static Deployment on Vercel

DOC-SHIFT is architected as a pure static web application. Deploying to Vercel is instantaneous:

1. Push this repository to GitHub or GitLab.
2. In the Vercel dashboard, click **"Add New Project"** and import the repository.
3. Keep the default settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy! The included `vercel.json` automatically configures security headers (`X-Frame-Options`, `X-Content-Type-Options`) and Cross-Origin Isolation headers (`COOP`/`COEP`).

---

## 🔒 Privacy Guarantee

DOC-SHIFT has **zero backend servers** and **zero external API endpoints**:
1. Files dropped into the converter are held only as transient `File` and `Blob` objects in your local browser memory.
2. Object URLs are cleaned up immediately via `URL.revokeObjectURL()` when a file is replaced or converted.
3. No analytics, tracking pixels, or cookies are included.

---

## 📄 License

MIT License. Designed and built with ❤️ for everyone.
