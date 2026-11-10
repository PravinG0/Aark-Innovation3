# E2E Test Infra: AARK Innovations Website Redesign

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial Testing + Workload Verification.
- Runtime: Headless browser automation (Puppeteer/Node.js) on `http://localhost:8080`.

## Feature Inventory & Test Coverage
| # | Feature | Requirement Source | Tier 1 | Tier 2 | Tier 3 |
|---|---------|-------------------|:------:|:------:|:------:|
| 1 | Header Luxury Absolute Layout | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | Header Action Controls & Theme Toggle | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 3 | Header Ambient Audio Controls | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 4 | Hero Prefix Status Capsule | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 5 | Delivery Model / Transformation Simulator | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 6 | Consulting Practices & Demos | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 7 | Case Studies Tabs & Radial Gauges | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 8 | ROI Calculator & Capacity Wave | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 9 | Mobilization Models Deck | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 10 | Technology Ecosystem | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 11 | Contact Form & Validation | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 12 | 100% Section Copy Preservation | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |

## Test Architecture
- **Runner**: Node.js script `node tests/e2e/run_tests.js` (using Puppeteer).
- **Semantics**: Exit code 0 on all tests passing; detailed JSON / console report.
- **Port**: `http://localhost:8080`.
- **Viewports Tested**:
  - Desktop: 1440x900
  - Laptop: 1024x768
  - Tablet: 768x1024
  - Mobile: 390x844 (iPhone 12/13/14)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Executive Modernization Journey | Header Nav -> Model Simulator -> Practice Demos -> Case Studies -> ROI Calc -> Contact Form | High |
| 2 | Theme Switching Integrity Under Scroll | Scroll through page in Dark mode, toggle to Light mode, verify contrast & header absolute position | High |
| 3 | Mobile Executive Briefing & Contact | Mobile viewport (390px), open nav menu, inspect hero prefix, test calculator, submit consultation form | High |
| 4 | Ambient Audio Synth Lifecycle | Toggle audio on, verify AudioContext state, scroll sections, toggle off | Medium |
| 5 | ROI Calculator Custom Inputs & CTA Routing | Adjust team size slider to 120, verify formula outputs, click CTA, verify contact form pre-filled | Medium |
