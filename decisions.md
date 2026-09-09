# Architecture & Product Decision Records (ADR)

This document records all critical technical, architectural, and product decisions for the **GenericMed** platform. Every AI coding assistant or engineer modifying this codebase must adhere to the context and constraints established by these decisions.

---

## ADR Index

1. [ADR-001: Hybrid Express Backend + Vite React SPA Architecture](#adr-001-hybrid-express-backend--vite-react-spa-architecture)
2. [ADR-002: Multimodal Gemini 3.8 Flash API with Local Clinical Regex Fallback for Prescription OCR](#adr-002-multimodal-gemini-38-flash-api-with-local-clinical-regex-fallback-for-prescription-ocr)
3. [ADR-003: Multi-Tenant Logical Data & Schema Partitioning Engine](#adr-003-multi-tenant-logical-data--schema-partitioning-engine)
4. [ADR-004: Canonical CDSCO Salt Normalization & Bioequivalence Scoring Matrix](#adr-004-canonical-cdsco-salt-normalization--bioequivalence-scoring-matrix)
5. [ADR-005: Role-Based Access Control (RBAC) & Interactive View Navigation Switcher](#adr-005-role-based-access-control-rbac--interactive-view-navigation-switcher)
6. [ADR-006: React 19, TypeScript 5.8, Tailwind CSS v4, and Motion UI Tech Stack](#adr-006-react-19-typescript-58-tailwind-css-v4-and-motion-ui-tech-stack)

---

## ADR-001: Hybrid Express Backend + Vite React SPA Architecture

- **Date:** 2026-09-08
- **Status:** Accepted

### Context / Problem
GenericMed requires both an interactive, ultra-responsive frontend UI for multiple user personas (Patients, Pharmacists, Ops Leads, Super Admins) and a secure server-side runtime to make authenticated AI calls to Google Gemini, manage environment variables securely, handle large image base64 payloads, and serve static assets efficiently.

### Decision Taken
Adopt a hybrid architecture where `server.ts` (Express on Node.js/tsx) acts as the single API server and entry point. In development, Express mounts Vite middleware (`createViteServer`) for HMR and instant SPA bundling. In production, Vite builds static assets to `/dist` and ESBuild bundles `server.ts` into `/dist/server.cjs` for node deployment.

### Reasoning
- **API Key Security:** Prevents exposing `GEMINI_API_KEY` to the browser runtime.
- **Unified Developer Workflow:** A single `npm run dev` command boots both API endpoints (`/api/*`) and hot-reloading frontend on port 3000.
- **Payload Control:** Express middleware allows tuning payload size limits (e.g. `25mb` limit for prescription image uploads).

### Alternatives Considered
1. **Client-only SPA:** Discarded because exposing Gemini API keys in frontend code compromises security.
2. **Next.js App Router / SSR:** Discarded to maintain rapid SPA responsiveness, lightweight client state handling, and simple containerized deployment.

### Impact on Project
- All server routes must reside under `/api/*` in `server.ts`.
- Server configuration must support both dev (Vite middleware) and production static serving modes.

---

## ADR-002: Multimodal Gemini 3.8 Flash API with Local Clinical Regex Fallback for Prescription OCR

- **Date:** 2026-09-08
- **Status:** Accepted

### Context / Problem
Patients upload handwritten or printed doctor prescriptions (Rx) to search for generic medicine substitutes. Deciphering doctor handwriting requires advanced multimodal AI vision models, but the application must remain fully functional even when the user has not configured `GEMINI_API_KEY` or during network timeouts.

### Decision Taken
Implement a dual-layer prescription parsing strategy in `/api/parse-prescription`:
1. **Primary Engine:** Call `@google/genai` using model `gemini-3.8-flash` with structured JSON output enforcing clinical extraction (Doctor Name, Patient Details, Prescribed Medicines, Generic Chemical Salts, Strength, Dosage, SOS flags, Confidence Score).
2. **Fallback Engine:** A local clinical parsing engine (`getPresetSampleData` / `generateIntelligentFallback`) that matches incoming presets or default clinical verified models (`sample_dolo`, `sample_metformin`, `sample_panto`, `sample_augmentin`).

### Reasoning
- **Resilience:** Ensures zero downtime or blank states for user testing even without cloud API keys.
- **High Accuracy:** Gemini 3.8 Flash offers industry-leading OCR accuracy for handwritten medical text at low latency and cost.
- **Structured JSON Schema:** Standardized JSON response eliminates non-deterministic text parsing in the client.

### Alternatives Considered
1. **Traditional Tesseract OCR:** Discarded due to extremely low accuracy on cursive medical handwriting.
2. **Strictly requiring Gemini API key with hard errors:** Discarded because it degrades developer onboarding and prototype demo reliability.

### Impact on Project
- Frontend modal (`PrescriptionScannerModal.tsx`) consumes structured JSON directly from `/api/parse-prescription`.
- Presets are supported via `sampleId` parameters for automated end-to-end user flows.

---

## ADR-003: Multi-Tenant Logical Data & Schema Partitioning Engine

- **Date:** 2026-09-08
- **Status:** Accepted

### Context / Problem
GenericMed serves multiple pharmacy chains, dispensaries, and regional nodes across different geographical zones (e.g., TN-044 Metro, TN-008 Apex, TN-015 Wellness). Each tenant requires logical isolation of stock count, order fulfillment queues, SLA metrics, and drug license compliance records.

### Decision Taken
Implement a multi-tenant schema partitioning model defined by `TenantNode` and `tenantBound` user relationships:
- Every inventory item (`DispensaryInventoryItem`), offer (`MedicineOffer`), and order (`DispensaryOrder`) is bound to a tenant identifier (`storeCode` / `tenantBound`).
- The Ops Console and Super Admin views monitor health, storage, latency, and SLA metrics per tenant schema ID.

### Reasoning
- **Regulatory Compliance:** Pharmacy licenses and drug regulatory audit logs in India (CDSCO) require store-specific ledger isolation.
- **Scalability:** Prepares the system for multi-tenant database partitioning (PostgreSQL schema-per-tenant or row-level security policy).

### Alternatives Considered
1. **Single flat inventory marketplace:** Discarded due to lack of compliance with state drug licensing laws and inventory collision risks.

### Impact on Project
- All data models in `types.ts` must maintain tenant association fields.
- Dispensary views automatically filter actions based on `currentUser.tenantBound`.

---

## ADR-004: Canonical CDSCO Salt Normalization & Bioequivalence Scoring Matrix

- **Date:** 2026-09-08
- **Status:** Accepted

### Context / Problem
Patients often pay inflated prices for branded medicines (e.g., Calpol 650 MRP ₹38) when bioequivalent generic equivalents (e.g., Paracip 650 MRP ₹14.50) with identical Active Pharmaceutical Ingredients (APIs) are available.

### Decision Taken
Build a canonical salt normalization data matrix (`SaltNormalization` & `FormularySalt`) mapped to Indian Pharmacopoeia / CDSCO categories:
- Calculate real-time `savingsPercent` against branded MRP.
- Assign an objective `bioEquivalenceScore` (default 100 for CDSCO approved generic bioequivalent formulations).
- Display per-tablet/per-unit price comparisons for absolute cost transparency.

### Reasoning
- Empower patients to make informed healthcare savings choices without compromising clinical efficacy.
- Enable Ops Leads and Master Formulary Managers to flag pricing anomalies or unauthorized salt variations.

### Alternatives Considered
1. **Unregulated marketplace list:** Discarded due to patient safety risks and risk of counterfeit generic listing.

### Impact on Project
- `MEDICINES_DATA` dictionary in `src/data/initialData.ts` enforces canonical salt keying (e.g., `paracetamol`, `metformin`, `pantoprazole`, `amoxicillin`).

---

## ADR-005: Role-Based Access Control (RBAC) & Interactive View Navigation Switcher

- **Date:** 2026-09-08
- **Status:** Accepted

### Context / Problem
GenericMed encompasses 8 distinct operational views: Customer App, Dispensary Portal, Ops Console, Master Formulary, Orders & Dispatch, IAM & Access Management, Super Admin Governance, and System Architecture. Users need seamless switching for testing while maintaining permission boundary enforcement for real accounts.

### Decision Taken
Define `ViewMode` union type and maintain system users with explicit roles in `SYSTEM_USERS`:
- Roles: `Super Admin`, `Admin / Ops Lead`, `Pharmacist-in-Charge`, `Support & Compliance`, `Customer / Patient`.
- Implement user persistence via `localStorage` under key `genericmed_auth_user`.
- Provide a quick view-switcher navigation header (`NavigationHeader.tsx`) with dynamic badge indicators.

### Reasoning
- Simplifies cross-role testing and walkthroughs for stakeholders.
- Enforces role-specific interface visibility without page reloads.

### Alternatives Considered
1. **Separate standalone repositories per app:** Discarded due to increased maintenance overhead for shared types and mock data.

### Impact on Project
- Navigation component must adjust visible tabs according to `currentUser.permissions` and `role`.

---

## ADR-006: React 19, TypeScript 5.8, Tailwind CSS v4, and Motion UI Tech Stack

- **Date:** 2026-09-08
- **Status:** Accepted

### Context / Problem
The frontend UI requires high performance, strict type safety for complex medical schemas, modern component styling, and fluid visual animations for patient modals and order queues.

### Decision Taken
Adopt **React 19**, **TypeScript 5.8**, **Tailwind CSS v4**, **Lucide React** (icons), **Motion v12** (animations), and **Recharts v3** (analytics graphs).

### Reasoning
- React 19 provides optimized rendering and modern hook primitives.
- Tailwind v4 delivers zero-config CSS compilation with high speed.
- Motion enables polished UI micro-interactions (modal transitions, cart drawer slide-overs).

### Alternatives Considered
1. **CSS Modules / Plain CSS:** Discarded due to slower UI development speed.
2. **Untyped JavaScript:** Discarded due to high risk of missing properties on complex healthcare interfaces.

### Impact on Project
- Codebase must maintain 100% clean TypeScript compliance without introducing unhandled runtime errors.
