# GenericMed - AI Assistant Rules & Development Guidelines

This document specifies mandatory rules, constraints, coding standards, folder structures, and security practices. **All AI coding assistants and developers must adhere strictly to these rules when interacting with or modifying the GenericMed repository.**

---

## Rule Summary Checklist

- [x] **Strict TypeScript Typing:** Zero unhandled `any` types; all API payloads and component props must use explicit interfaces from `src/types.ts`.
- [x] **Zero Regressions:** Never break existing features, view modes, or backend endpoints unless explicitly requested.
- [x] **API Key Security:** Never expose `GEMINI_API_KEY` to client-side code; all AI interactions must route through `server.ts`.
- [x] **Consistent UI Design:** Follow Tailwind CSS styling patterns, Lucide icons, and mobile frame container rules.
- [x] **Healthcare Compliance:** Mask sensitive patient data (e.g. `customerPhoneMasked`) and preserve CDSCO regulatory metadata.
- [x] **Conventional Commits:** Use standardized Git commit syntax (`feat`, `fix`, `docs`, `refactor`, `chore`).

---

## 1. Coding Standards

### TypeScript & React
1. **Strict Type Safety:** All interfaces, enums, and types must be exported from [`src/types.ts`](file:///d:/agenti%20ai%20project/genericmde/src/types.ts). Do not declare redundant inline type definitions across components.
2. **Functional Components:** Write clean React 19 functional components using standard hooks (`useState`, `useMemo`, `useCallback`, `useEffect`). Avoid class components.
3. **Immutability:** Always treat state objects and arrays as immutable. Use functional state updates for complex state transitions (e.g., cart operations in [`App.tsx`](file:///d:/agenti%20ai%20project/genericmde/src/App.tsx)).
4. **Error Handling:** Wrap async requests (such as `/api/parse-prescription`) in `try...catch` blocks and present graceful fallback UI states to the user.

### Node.js & Express (`server.ts`)
1. **API Route Convention:** Prefix all backend routes with `/api/` (e.g. `/api/health`, `/api/parse-prescription`).
2. **JSON Payload Limits:** Explicitly set body parser limits for base64 image data processing (`express.json({ limit: '25mb' })`).
3. **Graceful Fallbacks:** Server endpoints interacting with cloud services must implement local fallback mechanisms to prevent total failure when external APIs or environment variables are unavailable.

---

## 2. Folder Structure Rules

Maintain a clean, modular directory structure. Do not place random scratch files or loose components outside designated folders:

```
genericmed/
├── server.ts                 # Main Express server & Vite integration entrypoint
├── index.html                # SPA HTML template
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler & server configuration
├── metadata.json             # Capabilities and app metadata
├── decisions.md              # Architecture decision records
├── rules.md                  # Persistent AI guidelines (this file)
├── memory.md                 # Long-term project memory & technical specs
├── changelog.md              # Project version history
├── public/                   # Static public assets
└── src/                      # Frontend source code
    ├── main.tsx              # React entry point
    ├── App.tsx               # Root component, view state & theme provider
    ├── index.css             # Tailwind CSS & global styles
    ├── types.ts              # Master TypeScript domain model definitions
    ├── components/           # UI components organized by domain view
    │   ├── NavigationHeader.tsx
    │   ├── CustomerAppView.tsx
    │   ├── DispensaryPortalView.tsx
    │   ├── OpsConsoleView.tsx
    │   ├── MasterFormularyView.tsx
    │   ├── OrdersDispatchView.tsx
    │   ├── IAMView.tsx
    │   ├── SuperAdminView.tsx
    │   ├── ArchitectureView.tsx
    │   ├── AuthScreen.tsx
    │   ├── CartDrawer.tsx
    │   ├── PrescriptionScannerModal.tsx
    │   └── DispensaryMetricsChart.tsx
    └── data/                 # Initial mock data and CDSCO salt catalogues
        └── initialData.ts
```

### File Creation Rules:
- **New Views/Modals:** Place inside `src/components/`. Name files using `PascalCase` matching the export name (e.g. `MyNewView.tsx`).
- **Domain Data:** Place mock datasets inside `src/data/`.
- **Type Definitions:** Add to `src/types.ts`. Do not create multiple `types` files unless modularized under `src/types/`.

---

## 3. Naming Conventions

| Category | Convention | Examples |
| :--- | :--- | :--- |
| **React Components** | `PascalCase` | `CustomerAppView.tsx`, `PrescriptionScannerModal.tsx` |
| **TypeScript Types/Interfaces** | `PascalCase` | `MedicineOffer`, `DispensaryOrder`, `UserAccount` |
| **State Variables / Functions** | `camelCase` | `currentView`, `handleAddToCart`, `parsePrescription` |
| **Constants / Enums** | `UPPER_SNAKE_CASE` | `SYSTEM_USERS`, `MEDICINES_DATA` |
| **CSS Classes** | `kebab-case` | `bg-emerald-600`, `shadow-xl`, `border-slate-200` |
| **API Endpoints** | `kebab-case` | `/api/health`, `/api/parse-prescription` |

---

## 4. UI/UX Consistency Rules

1. **Design System & Tailwind CSS:**
   - Primary Theme Palette: **Emerald / Medical Teal** (`emerald-600`, `emerald-700`, `teal-500`) representing health & savings.
   - Dark/Light Balance: Support clean slate backdrops (`bg-slate-900` for admin consoles/charts, `bg-gray-50` for patient apps).
   - Card Containers: Rounded edges (`rounded-2xl` / `rounded-xl`), subtle borders (`border border-slate-200`), smooth hover transitions.
2. **Iconography:**
   - Exclusively use **Lucide React** (`lucide-react`) icons for visual consistency.
3. **Animations:**
   - Use **Motion** (`motion/react`) for drawer slide-overs, modal overlays, and badge updates.
4. **Mobile Frame Toggle:**
   - The Customer App View supports a mobile device frame container toggle. Always preserve this interactive layout option for testing mobile responsivity.

---

## 5. Git Commit Rules

Follow the **Conventional Commits** specification for all repository commits:

- `feat: <description>` – A new feature or view added to the platform.
- `fix: <description>` – A bug fix or runtime patch.
- `docs: <description>` – Documentation updates (`decisions.md`, `rules.md`, `memory.md`, `changelog.md`).
- `style: <description>` – Tailwind CSS tweaks, layout alignments, or visual polishing (no code logic change).
- `refactor: <description>` – Code changes that neither fix bugs nor add features.
- `chore: <description>` – Dependency updates, Vite build config modifications.

**Commit Example:**
```bash
git commit -m "feat(ocr): integrate Gemini 3.8 Flash model for prescription parsing"
```

---

## 6. Security and Environment Variable Rules

1. **Environment Variables:**
   - Store sensitive keys in `.env` (refer to `.env.example`).
   - Required variable: `GEMINI_API_KEY`.
   - **NEVER** expose API keys directly in client-side TypeScript code or commit `.env` files to Git.
2. **Patient Data Privacy (DISHA / HIPAA):**
   - Mask patient phone numbers in all public logs and dispensary queues (`customerPhoneMasked: "+91 98*** **321"`).
   - Base64 image data uploaded for prescription parsing must be processed in-memory and must not be saved to disk or logged into stdout.
3. **Input Sanitization & Limits:**
   - Server must validate base64 payload length and handle invalid image headers safely.

---

## 7. Preservation of Existing Functionality

> [!CAUTION]
> **Strict Non-Breaking Policy:**
> AI agents working on this codebase must NEVER remove, break, or disable existing views, mock datasets, or API endpoints unless the user explicitly requests a breaking change.

- Retain support for all 8 view modes: `customer`, `dispensary`, `ops`, `formulary`, `orders`, `iam`, `superadmin`, `architecture`.
- Ensure mock fallback data (`getPresetSampleData`) is preserved so the app runs cleanly out-of-the-box without an active API key.
- Verify TypeScript compilation passes without errors (`npm run lint`) after making changes.
