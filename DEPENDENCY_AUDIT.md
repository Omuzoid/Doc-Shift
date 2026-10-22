# DOC-SHIFT — Dependency Audit

This document tracks all external dependencies used in the DOC-SHIFT application, their purpose, licensing, browser-compatibility, and justification.

| Package | Version | Purpose | License | Execution Mode | Security / Privacy Justification |
|---------|---------|---------|---------|----------------|----------------------------------|
| `react` | ^19.0.0 | Core UI library | MIT | Client-only | Declarative component UI |
| `react-dom` | ^19.0.0 | DOM renderer | MIT | Client-only | Standard React DOM binding |
| `lucide-react` | Latest | Neo-Brutalist UI icons | ISC | Client-only | Zero runtime network calls, SVG icons |
| `tailwindcss` | ^4.0.0 | Styling framework | MIT | Build-time | Generates static utility CSS |
| `@tailwindcss/vite` | Latest | Vite plugin for Tailwind v4 | MIT | Build-time | Fast compilation, zero runtime overhead |
| `papaparse` | Latest | CSV / TSV parsing & formatting | MIT | Client-only | 100% in-browser, no network requests |
| `js-yaml` | Latest | YAML <-> JSON conversion | MIT | Client-only | Safe schema parsing, 100% in-browser |
| `jspdf` | Latest | Document to PDF generation | MIT | Client-only | Generates vector PDF blobs in browser |
| `marked` | Latest | Markdown <-> HTML conversion | MIT | Client-only | Fast client-side markdown compiler |
| `canvas-confetti` | Latest | Conversion success animations | MIT | Client-only | High performance HTML5 Canvas confetti |
| `vitest` | Latest | Automated testing suite | MIT | Dev-only | Verifies conversion logic & UI components |

## Privacy and Network Policy
1. **Zero External Conversion APIs:** All transformations take place inside user memory (RAM) via browser APIs (Canvas, DOMParser, Web Workers, Web Audio API, TypedArrays).
2. **Zero Telemetry / Tracking:** No Google Analytics, no telemetry beacons, no third-party tracking scripts.
3. **No File Transmission:** User files are held as `File` / `Blob` instances in the browser tab and released via `URL.revokeObjectURL()` immediately when discarded or replaced.
