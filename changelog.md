# Changelog

All notable changes to the **GenericMed** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-08

- **Automated Integration Test Suite:**
  - Self-contained test suite ([`tests/server.test.ts`](file:///d:/agenti%20ai%20project/genericmde/tests/server.test.ts)) using Node.js test runner (`node:test` + `node:assert`).
  - Added `npm run test` script verifying `/api/health`, prescription OCR sample presets, 400 Bad Request error validation, and fallback handling.
- **AI Prescription Scanner Module:**
  - Express backend endpoint `/api/parse-prescription` supporting base64 image uploads.
  - Multimodal handwritten prescription parsing using `@google/genai` with model `gemini-3.8-flash`.
  - Structured JSON response parsing for Doctor Name, Patient Details, Prescribed Medicines, Generic Salt, Strength, Dosage,SOS flags, and Confidence level.
  - Intelligent local clinical fallback engine (`getPresetSampleData`) featuring verified clinical Rx models (`sample_dolo`, `sample_metformin`, `sample_panto`, `sample_augmentin`).
- **Patient Generic Medicine Price Comparison Marketplace:**
  - Interactive search interface across CDSCO normalized active generic chemical salts (Paracetamol, Metformin, Pantoprazole, Amoxicillin).
  - Real-time generic price comparison cards displaying branded MRP vs. generic offer price, per-tablet unit price, and savings percentages (up to 65%+).
  - Bioequivalence score badges (100% CDSCO certified score rating).
  - Multi-delivery option selection (Express 45m, Standard 2h, Scheduled).
  - Interactive Cart Drawer slide-over component (`CartDrawer.tsx`) supporting quantity increments, removals, and checkout notifications.
  - Mobile frame container toggle (`mobileFrameMode`) for responsive patient app testing.
- **Dispensary Operations & Fulfillment Portal:**
  - Multi-tenant dispensary fulfillment workspace (`DispensaryPortalView.tsx`) with real-time order status tracking (`needs_acceptance`, `picking_packing`, `ready_dispatch`, `completed`).
  - Active SLA countdown timer and rider dispatch integration with OTP handshake verification.
  - Pharmacy inventory management table (`DispensaryInventoryItem`) tracking stock counts, thresholds, batch numbers, and expiry dates.
- **Operations Console & Analytics:**
  - Executive operations console (`OpsConsoleView.tsx`) tracking platform-wide GMV, SLA fulfillment %, active tenant count, and order volumes.
  - Interactive Recharts analytics graphs (`DispensaryMetricsChart.tsx`) displaying fulfillment performance.
- **Master Formulary Management:**
  - CDSCO canonical salt catalog editor (`MasterFormularyView.tsx`) mapping salt strength, therapeutic class, branded benchmark pricing, and anomaly flags.
- **Dispatch & Orders Dispatch Queue:**
  - Rider allocation queue (`OrdersDispatchView.tsx`) with live partner tracking (Dunzo, Porter, Shadowfax) and OTP verification controls.
- **Identity & Access Management (IAM):**
  - Multi-role IAM management view (`IAMView.tsx`) supporting roles: `Super Admin`, `Admin / Ops Lead`, `Pharmacist-in-Charge`, `Support & Compliance`, `Customer / Patient`.
  - Drug license registration verification details and MFA state indicators.
  - Authentication modal (`AuthScreen.tsx`) supporting credential sign-in and user switching.
- **Super Admin Governance:**
  - Multi-tenant cluster health monitor (`SuperAdminView.tsx`) displaying tenant node schema IDs (`TenantNode`), storage usage, active orders, and node quarantine actions.
- **System Architecture Blueprint:**
  - Visual interactive system architecture diagram (`ArchitectureView.tsx`) outlining the end-to-end processing pipeline.
- **Persistent AI Context System:**
  - Created [`decisions.md`](file:///d:/agenti%20ai%20project/genericmde/decisions.md) documenting technical Architecture Decision Records (ADRs).
  - Created [`rules.md`](file:///d:/agenti%20ai%20project/genericmde/rules.md) detailing AI developer guidelines, coding standards, folder rules, security, and Git commit policies.
  - Created [`memory.md`](file:///d:/agenti%20ai%20project/genericmde/memory.md) outlining project technical memory, API specs, database schemas, and roadmap.
  - Created [`changelog.md`](file:///d:/agenti%20ai%20project/genericmde/changelog.md) for version release tracking.

### Changed
- Refactored server entry point `server.ts` to support both Vite dev middleware and production static distribution serving.
- Updated Tailwind CSS configuration to version 4 with zero-config bundle optimization.

### Fixed
- Fixed base64 image string stripping for data URL headers in `/api/parse-prescription`.
- Fixed local user session persistence handling in `localStorage` (`genericmed_auth_user`).

---

[1.0.0]: https://github.com/gayatrigangode829-png/genericmde/releases/tag/v1.0.0
