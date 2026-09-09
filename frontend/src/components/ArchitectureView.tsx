import React, { useState } from 'react';

export const ArchitectureView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(4);

  const layers = [
    {
      id: 1,
      title: '1. Client Layer (Multi-Persona Web/PWA)',
      tech: 'React 19, Tailwind CSS v4, TypeScript, Service Worker PWA',
      desc: 'Consumer Mobile Comparison App, Dispensary Partner Workdesk (TN-044), Operations & Governance Console, Super Admin Orchestrator.',
      security: 'End-to-end HTTPS, Content Security Policy, strict cookie boundaries.',
    },
    {
      id: 2,
      title: '2. Edge Security & Ingress Gateway',
      tech: 'Cloudflare Enterprise WAF, Anycast DNS, TLS 1.3 Termination',
      desc: 'DDoS mitigation, IP rate limiting (mitigates price scraping), edge bot management, and SSL offloading with 42ms response latency in Mumbai PoP.',
      security: 'Automated IP bans on scraping bursts, OWASP Top 10 rule enforcement.',
    },
    {
      id: 3,
      title: '3. API Gateway & Authentication Router',
      tech: 'Express / Envoy Ingress Proxy, JWT WebTokens, HMAC SHA256',
      desc: 'Routes inbound API calls, extracts tenant schema identity from headers (`x-tenant-id: ten_044_prod`), verifies JWT signatures, and enforces zero-trust RBAC.',
      security: 'Zero trust authentication, FIDO2/WebAuthn hardware keys for privileged accounts.',
    },
    {
      id: 4,
      title: '4. Application Service Core & Equivalence Engine',
      tech: 'Node.js / Express micro-framework, Algorithmic Salt Matcher',
      desc: 'Executes PRD FR-CORE-01 and FR-CORE-02. Maps disparate brand names (Calpol, Dolo) to canonical salt keys (NORM_PARA_650_SO) and computes real-time dispensary bid winners.',
      security: 'Deterministic bioequivalence scoring engine adhering to CDSCO standards.',
    },
    {
      id: 5,
      title: '5. Search & Normalization Engine',
      tech: 'OpenSearch 2.x Cluster, Vector Similarity, Fuzzy Stemmer',
      desc: 'Indexes 142,850+ SKUs across 48 tenant inventories. Powers sub-15ms auto-suggest for brand names, salts, and dosage forms.',
      security: 'Tenant data isolated in search indices; quarantined items instantly hidden.',
    },
    {
      id: 6,
      title: '6. High-Speed L2 Distributed Cache',
      tech: 'Redis Cluster (Multi-AZ), In-Memory Key-Value',
      desc: 'Caches active salt prices, dispensary stock availability, and session states. Yields 99.98% hit rate for common queries.',
      security: 'Encrypted in-transit and at rest; automated TTL eviction.',
    },
    {
      id: 7,
      title: '7. Multi-Tenant Relational Database Fleet',
      tech: 'PostgreSQL 16 with Isolated Schemas & Row-Level Security (RLS)',
      desc: '48 independent tenant schemas (`schema_ten_044_v4`, `schema_ten_012_v4`). Enforces total data segregation, preventing any cross-tenant data leakage.',
      security: 'PostgreSQL RLS policies: pharmacists can only access rows matching their bound tenant schema.',
    },
    {
      id: 8,
      title: '8. Real-Time Event Streaming & Dispatch Bus',
      tech: 'Server-Sent Events (SSE) & WebSocket Engine',
      desc: 'Streams real-time order state transitions: placement -> pharmacist acceptance -> packing -> rider OTP handover -> delivery.',
      security: 'Ephemeral authenticated channel tokens scoped to specific order IDs.',
    },
    {
      id: 9,
      title: '9. Document & Batch Certificate Vault',
      tech: 'Cloud Object Storage (S3 / GCS compliant)',
      desc: 'Stores uploaded doctor prescriptions (Rx), CDSCO Form 20B/21B retail drug licenses, and manufacturer WHO-GMP batch test certificates.',
      security: 'Encrypted client-side; pre-signed URLs with strict 15-minute expirations.',
    },
    {
      id: 10,
      title: '10. Immutable WORM Audit Vault',
      tech: 'Write-Once-Read-Many Cryptographic Audit Log',
      desc: 'Records all administrative overrides, pricing changes, quarantine releases, and escrow disbursements with SHA256 merkle chaining.',
      security: 'Tamper-proof compliance archive conforming to Indian Drugs and Cosmetics Act.',
    },
    {
      id: 11,
      title: '11. Logistics & Payment Escrow Integrations',
      tech: 'Shadowfax Express API, Dunzo Direct API, HDFC Escrow Engine',
      desc: 'Automates courier dispatch, rider OTP generation, customer payments, 9% platform take-rate retention, and automated bank disbursement.',
      security: 'Dual-signature escrow release with automated reconciler.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">account_tree</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-slate-900 text-lg sm:text-xl">
                  System Architecture & PRD Blueprint
                </h1>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200">
                  11 Production Layers
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Full-stack topology, database schema isolation, and regulatory compliance mapping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All 11 Layers Operational
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 11-Layer Architecture Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stack Visualizer */}
        <div className="lg:col-span-2 space-y-2.5">
          {layers.map((layer) => {
            const isSelected = activeLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-slate-900 text-sm sm:text-base">
                    {layer.title}
                  </h3>
                  <span className="font-mono text-[11px] text-blue-700 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                    {layer.tech.split(',')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{layer.desc}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Security & Compliance:</span>
                  <span>{layer.security}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Layer Detail Inspector */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-20">
            {activeLayer !== null ? (
              (() => {
                const cur = layers.find((l) => l.id === activeLayer)!;
                return (
                  <div className="space-y-3 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Layer Blueprint Inspector
                    </span>
                    <h3 className="font-headline font-bold text-slate-900 text-base">
                      {cur.title}
                    </h3>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-semibold text-slate-800 block">Technology Stack</span>
                      <p className="text-slate-600 font-mono text-[11px]">{cur.tech}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-semibold text-slate-800 block">PRD Functional Mandate</span>
                      <p className="text-slate-600 leading-relaxed">{cur.desc}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                      <span className="font-semibold text-emerald-900 block">Regulatory Compliance</span>
                      <p className="text-emerald-800 leading-relaxed">{cur.security}</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => alert(`Diagnostics ping dispatched to ${cur.title}`)}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                      >
                        Run Layer Health Diagnostic
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-xs text-slate-500">Select any layer to inspect blueprint.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
