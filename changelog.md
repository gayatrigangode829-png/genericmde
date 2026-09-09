# Changelog

All notable changes to the **GenericMed** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-09-09

### Changed
- **Decoupled Dual-Folder Architecture Refactoring:**
  - Completely separated repository into isolated `frontend/` (React 19 SPA) and `backend/` (Express 4.21 API Server) subfolders.
  - Created independent `frontend/package.json` and `backend/package.json` manifests with separate dependencies and scripts.
  - Configured Vite development server proxy (`/api` -> `http://localhost:3000`) in `frontend/vite.config.ts`.
  - Moved Prisma database schema and migration scripts into `backend/prisma/`.
  - Moved all 34 integration test suites into `backend/tests/`.
  - Created root `README.md` with standalone and dual setup/execution instructions.
  - Updated persistent context documentation (`decisions.md`, `rules.md`, `memory.md`, `changelog.md`, `phases.md`).

---

## [1.4.0] - 2026-09-09

### Added
- **Phase 5 Enterprise Scaling & Ecosystem Expansion:**
  - Multi-Region Cluster Orchestrator Engine ([`src/services/clusterOrchestrator.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/clusterOrchestrator.ts)) managing compute capacity, node auto-scaling, and quarantine circuit breakers across regional nodes.
  - B2B Generic Medicine Procurement Marketplace Engine ([`src/services/b2bProcurementService.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/b2bProcurementService.ts)) connecting retail dispensaries with certified pharmaceutical manufacturers (Cipla, Torrent, Alkem) with bulk tier discount calculations.
  - Predictive AI Demand Forecasting Engine ([`src/services/demandForecastingService.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/demandForecastingService.ts)) predicting seasonal disease surges and auto-generating stock replenishment POs.
- **Phase 5 Backend API Endpoints:**
  - `GET /api/cluster/nodes`: Returns multi-region cluster node status & health allocations.
  - `POST /api/cluster/scale`: Triggers node auto-scaling / quarantine status toggles.
  - `GET /api/b2b/wholesalers`: Returns certified pharmaceutical manufacturer list.
  - `POST /api/b2b/purchase-orders`: Generates B2B wholesale purchase orders with discount calculations.
  - `GET /api/forecast/replenishment`: Returns predictive AI stock replenishment recommendations.
- **Master Test Runner & Suite Integration:**
  - Added `npm run test:all` script executing 34/34 passing integration tests across all 5 engineering phases (`tests/server.test.ts`, `tests/phase2.test.ts`, `tests/phase3.test.ts`, `tests/phase4.test.ts`, `tests/phase5.test.ts`).

---

## [1.3.0] - 2026-09-09

### Added
- **Phase 4 AI Clinical Safety & CDSCO Compliance:**
  - AI Drug-Drug Interaction (DDI) & Contraindication Engine ([`src/services/ddiEngine.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/ddiEngine.ts)) analyzing combinations of prescribed active chemical salts with severity grading (`critical`, `major`, `moderate`, `safe`).
  - Prescription Authenticity Verification Engine ([`src/services/fraudDetectionService.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/fraudDetectionService.ts)) checking doctor council registration numbers and tracking CDSCO Schedule H1 antibiotics.
  - CDSCO e-Pharmacy Regulatory Compliance Generator ([`src/services/cdscoReportGenerator.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/cdscoReportGenerator.ts)) generating official e-Pharmacy audit ledgers and NLEM price cap anomaly reports.
- **Phase 4 Backend API Endpoints:**
  - `POST /api/clinical/check-interactions`: Analyzes active chemical salt arrays and returns clinical interaction warnings & recommendations.
  - `POST /api/clinical/verify-prescription`: Validates Rx authenticity, doctor council registration, and Schedule H1 requirements.
  - `GET /api/compliance/cdsco-report`: Generates official CDSCO e-Pharmacy regulatory audit ledger data.
  - `GET /api/compliance/pricing-anomalies`: Returns NLEM pricing anomaly review flags.
- **Phase 4 Automated Test Suite:**
  - Created test suite ([`tests/phase4.test.ts`](file:///d:/agenti%20ai%20project/genericmde/tests/phase4.test.ts)) with 6/6 passing tests.
  - Added `npm run test:phase4` script to `package.json`.

---

## [1.2.0] - 2026-09-09

### Added
- **Phase 3 Real-Time Telemetry & Logistics Gateway:**
  - Real-time WebSocket event broadcasting service hub ([`src/services/websocket.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/websocket.ts)) for broadcasting `RIDER_TELEMETRY_UPDATED` and `ORDER_STATUS_CHANGED` events.
  - 3PL Logistics Dispatch Adapter ([`src/services/logisticsAdapter.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/logisticsAdapter.ts)) supporting Dunzo, Porter, and Shadowfax partner networks with 4-digit OTP generation and ETA calculations.
  - Customer SMS/WhatsApp notification gateway ([`src/services/notificationService.ts`](file:///d:/agenti%20ai%20project/genericmde/src/services/notificationService.ts)) sending instant order tracking alerts.
- **Phase 3 Backend API Endpoints:**
  - `GET /api/logistics/partners`: Fetches active 3PL logistics partner network.
  - `POST /api/orders/:id/dispatch`: Dispatches 3PL rider partner, generates delivery OTP, triggers SMS/WhatsApp alerts, and broadcasts WebSocket telemetry.
  - `POST /api/orders/:id/status`: Updates order status queue with real-time event broadcasting.
  - `POST /api/orders/:id/verify-otp`: Validates rider delivery OTP codes and marks orders completed upon successful verification.
- **Phase 3 Automated Test Suite:**
  - Created test suite ([`tests/phase3.test.ts`](file:///d:/agenti%20ai%20project/genericmde/tests/phase3.test.ts)) with 5/5 passing tests.
  - Added `npm run test:phase3` script to `package.json`.

---

## [1.1.0] - 2026-09-09

### Added
- **Phase 2 Database & Persistence Layer:**
  - Integrated **Prisma ORM** with SQLite database (`prisma/schema.prisma`).
  - Defined multi-tenant relational schemas for `User`, `TenantNode`, `FormularySalt`, `MedicineOffer`, `DispensaryInventoryItem`, and `DispensaryOrder`.
  - Created database seed script ([`prisma/seed.ts`](file:///d:/agenti%20ai%20project/genericmde/prisma/seed.ts)) populating master salt catalogues, initial users, tenant nodes, and orders.
  - Added Prisma client singleton helper ([`src/db/prisma.ts`](file:///d:/agenti%20ai%20project/genericmde/src/db/prisma.ts)).
- **JWT Authentication API Endpoints:**
  - `POST /api/auth/login`: Authenticates users and returns signed JWT tokens with 24-hour expiration.
  - `GET /api/auth/me`: Validates Bearer token headers and returns authenticated user profiles.
  - `POST /api/auth/logout`: Clears session token state.
  - Multi-tenant data API endpoints (`GET /api/medicines`, `GET /api/tenants`, `GET /api/orders`).
- **Phase 2 Automated Test Suite:**
  - Created test suite ([`tests/phase2.test.ts`](file:///d:/agenti%20ai%20project/genericmde/tests/phase2.test.ts)) with 9/9 passing tests.
  - Added `npm run test:phase2` script to `package.json`.

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
