# Project: AARK Innovations Enterprise Modernization Website Redesign

## Architecture
- **Tech Stack**: Semantic HTML5 (`index.html`), Modern CSS3 (`styles.css`), Vanilla JavaScript (`script.js`), Web Audio API, SVG graphics, responsive multi-viewport layouts.
- **Server Runtime**: Python `SimpleHTTP` running on `http://localhost:8080`.
- **Theming System**: Dual-mode engine (`data-theme="dark"` and `data-theme="light"`) with CSS custom properties, smooth transitions, and persistent `localStorage('aark_theme')`.
- **Audio System**: Pure procedural Web Audio API synthesizers (55 Hz/82.4 Hz drone + LFO breathing filter), zero external audio assets.
- **Header Contract**: Strictly absolute positioned (`position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important;`), never fixed/sticky.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Header Luxury Layout | Stripe/Linear/Apple style luxury header, absolute positioned, no sticky scroll | M1 | R1 |
| 2 | Header Action Controls | Consolidated micro-controls for Dark/Light toggle, audio toggle, consultation CTA | M1 | R1 |
| 3 | Header Responsive Wrap Fix | Prevent nav link wrapping at 1024-1280px (`white-space: nowrap`, responsive font scale) | M1 | R1 |
| 4 | Mobile Navigation Rescue | Compact action controls at <=768px ensuring hamburger `#mobileMenuBtn` is fully visible | M1 | R1 |
| 5 | Hero Prefix Indicator | Iridescent status capsule with live concentric radar beacon and telemetry metadata | M1 | R2 |
| 6 | Delivery Model Bento Cockpit | Chapter 01 transformation simulator Bento card, refined S01/S02/V1 SVG, 3 pillar tiles | M2 | R3 |
| 7 | Consulting Practices Showcase | Chapter 02 architectural split, terminal monitors for 3 live micro-apps, pill matrix | M2 | R3 |
| 8 | Case Studies Glass Switcher | Chapter 03 segmented dock, 3 client panels, before/after cards, luminous SVG gauges | M3 | R3 |
| 9 | ROI Calculator Cockpit | Chapter 04 fintech-grade range slider, dynamic capacity wave, luminous KPI cards | M3 | R3 |
| 10 | Mobilization Models Deck | Chapter 05 tiered cards with featured Principal Pod scale and gradient accent | M3 | R3 |
| 11 | Technology Constellation | Partner ecosystem cards with certified SVG emblems, hover halos, architectural tags | M4 | R3 |
| 12 | Private Client Briefing Suite | Contact form with bespoke vector SVGs, premium inputs, validation, and success state | M4 | R3 |
| 13 | Footer Polish | Luxury typographic hierarchy, responsive multi-column layout, and legal credits | M4 | R3 |
| 14 | 100% Copy Preservation | Preserve all headings, body copy, statistics, data points, and metrics across all sections | M1-M4 | R3 |
| 15 | Light Subpage Contrast & Fixes | Token remapping (`--accent-cyan: #0284c7`), dark SVG fills adaptation, logo box fix | M5 | R3 |
| 16 | Multi-Viewport Visual Verification | Capturing screenshots in Dark & Light modes at 1440px, 1280px, 1024px, 390px on localhost:8080 | M5 | Acceptance |
| 17 | E2E Interactive Test Suite | Automated testing of all 11 JS modules, header positioning, copy, and theme switching | E2E | Dual Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Site Header & Hero Prefix Redesign | Header layout, absolute positioning, theme/audio controls, nav link spacing, mobile toggle rescue, hero prefix status capsule | none | DONE |
| M2 | Delivery Model & Consulting Practices | Chapter 01 (Delivery Model / Big-4 simulator / Pillars) & Chapter 02 (3 Consulting Practices / live demos / capability matrix) | none | IN_PROGRESS |
| M3 | Case Studies & ROI Calculator | Chapter 03 (Case Studies tabs, panels, radial gauges), Chapter 04 (ROI simulator, slider, wave SVG, KPIs), Chapter 05 (Models) | none | PLANNED |
| M4 | Technology Ecosystem & Contact Form | Technology Ecosystem constellation, Contact form suite with SVG icons & validation, Footer polish | none | PLANNED |
| M5 | Cross-Theme Hardening & Visual Verification | Light Subpage WCAG AA contrast fixes, SVG theme adaptation, multi-viewport screenshots, visual regression check | M1, M2, M3, M4 | PLANNED |
| E2E | E2E Testing Suite (Tiers 1-4) | Comprehensive Puppeteer/Node test suite for header, prefix, copy preservation, interactivity, and theming | none | DONE (TEST_READY.md) |

## Code Layout
- `index.html`: Master markup, semantic structure, DOM element IDs.
- `styles.css`: Complete styling rules, design tokens (`:root`, `[data-theme="dark"]`, `[data-theme="light"]`), media queries.
- `script.js`: Interactive logic (theme, audio synth, ROI calculator, demos, form).
- `Assets/`: Images (`Assets/images/`) and video (`Assets/Videos/`).
- `tests/e2e/`: Automated test suite for visual and behavioral verification.

## Interface Contracts & DOM Hook Registry
The following selectors MUST be strictly preserved by all workers:
- Header: `#siteHeader`, `#themeToggle`, `.theme-icon`, `.theme-label`, `#audioToggle`, `#audioIcon`, `#audioLabel`, `.header-cta`, `#mobileMenuBtn`, `.primary-nav`, `.nav-link`
- Hero Prefix: `#locationStatusPill`, `#statusPillText`, `.pulse-dot`
- Chapter 01: `#btnSelectAark`, `#btnSelectBig4`, `#simTitleText`, `#simHeadline`, `#simModeTag`, `#simNarrativeText`, `#simPointsList`, `#simStatusBanner`, `#dashChipStatus`, `#dashTimerText`, `#simDynamicSvg`, `#dVal1`, `#dVal2`, `#dVal3`
- Chapter 02: `#practice-oracle`, `#btnRunOracleSim`, `#oracleSimStatus`, `#practice-data-ai`, `#btnTriggerAiDemo`, `#aiResponseBox`, `#citationPills`, `#practice-cloud-auto`, `#btnRunCpqDemo`, `#cpqTimer`, `#cpqBarFill`
- Chapter 03: `.case-tab`, `data-case="1"`, `data-case="2"`, `data-case="3"`, `#casePanel1`, `#casePanel2`, `#casePanel3`
- Chapter 04: `#teamSizeSlider`, `#sliderValue`, `.preset-btn[data-preset]`, `#svgWavePath`, `#gaugeBarFill`, `#calcHoursSaved`, `#calcCapacityVal`, `#calcSpeedupVal`, `#calcCtaBtn`
- Chapter 05: `.models-grid`, `.model-card`
- Technology: `#tech-section`, `.ecosystem-cards-grid`, `.tech-card`
- Contact: `#consultationForm`, `#fullName`, `#workEmail`, `#companyName`, `#modernizationArea`, `#projectGoals`, `#nameError`, `#emailError`, `#companyError`, `#areaError`, `#submitFormBtn`, `#formSuccessState`, `#confirmEmail`, `#resetFormBtn`
