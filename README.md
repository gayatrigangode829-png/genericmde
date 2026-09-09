# GenericMed - Multi-Tenant Generic Medicine Marketplace Platform

GenericMed is a multi-tenant B2B & B2C healthcare marketplace platform operating across India. It provides AI-powered prescription parsing, drug-drug interaction (DDI) clinical validation, automated 3PL logistics dispatch, CDSCO regulatory compliance reporting, multi-tenant RBAC, real-time telemetry, and B2B procurement forecasting.

---

## 🏗️ Repository Architecture

This project is fully separated into an independent **Frontend SPA** and a **Backend REST/WebSocket API**:

```
genericmde/
├── frontend/                 # React 19 + Vite + Tailwind CSS v4 SPA
│   ├── src/                  # React UI components, state, views, data models
│   ├── public/               # Web assets & prescription sample presets
│   ├── index.html            # Vite HTML template
│   ├── package.json          # Independent frontend dependencies
│   ├── tsconfig.json         # React TypeScript config
│   ├── vite.config.ts        # Vite config with /api -> http://localhost:3000 proxy
│   └── .env                  # Frontend environment variables
│
├── backend/                  # Express 4.21 + Node.js API Server
│   ├── src/                  # REST API endpoints, WebSocket server, engines & services
│   ├── prisma/               # Database schema & seed scripts (SQLite / PostgreSQL)
│   ├── tests/                # Node test runner integration test suite (34 tests)
│   ├── package.json          # Independent backend dependencies
│   ├── tsconfig.json         # Express TypeScript config
│   └── .env                  # Server port, JWT secret, database & Gemini AI key
│
├── README.md                 # Project documentation (this file)
├── .gitignore                # Target ignore rules for root, frontend & backend
├── decisions.md              # Architectural decisions log (ADRs)
├── rules.md                  # Project standards & guidelines for AI assistants
├── memory.md                 # Long-term technical project memory
├── changelog.md              # Chronological version & change history
└── phases.md                 # Development phase completion status
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

---

### 1. Backend Setup & Startup

Navigate to the `backend/` folder and install dependencies:

```bash
cd backend
npm install
```

Configure environment variables in `backend/.env`:

```env
PORT=3000
JWT_SECRET=genericmed-jwt-secret-key-2026
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-optional-gemini-api-key"
```

Start the backend API server in development mode:

```bash
npm run dev
```

The backend server will run at **`http://localhost:3000`**.

#### Running Backend Tests

To execute the full test suite (34 integration tests covering Auth, Multi-Tenancy, 3PL Logistics, DDI Engine, CDSCO Compliance, and Cluster Orchestration):

```bash
cd backend
npm run test:all
```

---

### 2. Frontend Setup & Startup

In a separate terminal, navigate to the `frontend/` folder and install dependencies:

```bash
cd frontend
npm install
```

Configure environment variables in `frontend/.env`:

```env
VITE_API_BASE_URL=/api
```

Start the frontend Vite development server:

```bash
npm run dev
```

The frontend application will run at **`http://localhost:5173`**.

Vite automatically proxies all `/api/*` requests from `http://localhost:5173` to `http://localhost:3000`.

---

## ⚡ Build & Production Deployment

### Building Backend for Production
```bash
cd backend
npm run build
npm start
```
Bundles `server.ts` using `esbuild` into `dist/server.cjs` for Node.js production runtime.

### Building Frontend for Production
```bash
cd frontend
npm run build
```
Compiles TypeScript and bundles static assets into `frontend/dist/`.

---

## 🔒 Security & Standards
- CDSCO Drug & Cosmetics Rules 1945 Form 20B/21B compliance validation.
- JWT Role-Based Access Control (RBAC) supporting 8 isolated persona views.
- Strict multi-tenant data boundary scoping (Tenant Node isolation).
