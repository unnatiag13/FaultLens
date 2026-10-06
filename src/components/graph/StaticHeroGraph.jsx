import React from 'react';
import { Network, Server, Database, Shield, Radio, AlertTriangle, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function StaticHeroGraph() {
  return (
    <div className="relative w-full max-w-lg mx-auto bg-space-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/80 backdrop-blur-md overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 engineering-grid-subtle opacity-40 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-semibold text-slate-200">LIVE RESILIENCE TOPOLOGY</span>
        </div>
        <span className="text-slate-400 bg-space-950 px-2 py-0.5 rounded border border-slate-800">
          Propagation Blast Radius
        </span>
      </div>

      {/* Diagram container */}
      <div className="relative flex flex-col items-center space-y-6 py-2">
        {/* Level 1: API Gateway */}
        <div className="relative z-10 w-56 p-3 rounded-xl bg-space-950/90 border border-amber-600/60 shadow-lg shadow-amber-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-950/50 border border-amber-800/50 flex items-center justify-center text-amber-400">
                <Network className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-200">API Gateway</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              DEGRADED
            </span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between pt-1 border-t border-slate-800">
            <span>Latency: 420ms</span>
            <span className="text-amber-400">Errors: 12.4%</span>
          </div>
        </div>

        {/* Level 2: Auth and Order Services */}
        <div className="w-full flex items-center justify-between px-2 sm:px-6 relative z-10">
          {/* Auth Service (Healthy) */}
          <div className="w-40 sm:w-44 p-2.5 rounded-xl bg-space-950/90 border border-slate-700/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Server className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-slate-200 truncate">Auth Service</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                <CheckCircle2 className="w-2.5 h-2.5" />
                OK
              </span>
            </div>
            <div className="mt-1.5 text-[9px] font-mono text-slate-400 flex justify-between">
              <span>19ms</span>
              <span className="text-emerald-400">0.0% err</span>
            </div>
          </div>

          {/* Order Service (Degraded) */}
          <div className="w-40 sm:w-44 p-2.5 rounded-xl bg-space-950/90 border border-amber-600/70 shadow-md shadow-amber-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
                  <Server className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-slate-200 truncate">Order Service</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400">
                <AlertTriangle className="w-2.5 h-2.5" />
                DEGRADED
              </span>
            </div>
            <div className="mt-1.5 text-[9px] font-mono text-slate-400 flex justify-between">
              <span className="text-amber-300">1,480ms</span>
              <span className="text-amber-400">18.6% err</span>
            </div>
          </div>
        </div>

        {/* Level 3: Payment and Inventory */}
        <div className="w-full flex items-center justify-between px-2 sm:px-6 relative z-10">
          {/* Payment Service (FAILED - Injected Fault) */}
          <div className="w-40 sm:w-44 p-2.5 rounded-xl bg-rose-950/80 border-2 border-rose-600 shadow-xl shadow-rose-950/50 ring-2 ring-rose-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded bg-rose-900/80 border border-rose-700 flex items-center justify-center text-rose-300">
                  <Server className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-white truncate">Payment Svc</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-rose-300 bg-rose-900/60 px-1 py-0.5 rounded">
                <XCircle className="w-2.5 h-2.5 text-rose-400" />
                FAILED
              </span>
            </div>
            <div className="mt-1.5 text-[9px] font-mono text-slate-300 flex justify-between">
              <span className="text-rose-200">3,200ms</span>
              <span className="text-rose-400 font-bold">34.8% err</span>
            </div>
          </div>

          {/* Inventory Service (Healthy) */}
          <div className="w-40 sm:w-44 p-2.5 rounded-xl bg-space-950/90 border border-slate-700/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Server className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-slate-200 truncate">Inventory</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                <CheckCircle2 className="w-2.5 h-2.5" />
                OK
              </span>
            </div>
            <div className="mt-1.5 text-[9px] font-mono text-slate-400 flex justify-between">
              <span>26ms</span>
              <span className="text-emerald-400">0.0% err</span>
            </div>
          </div>
        </div>

        {/* Level 4: Database */}
        <div className="relative z-10 w-52 p-2.5 rounded-xl bg-space-950/90 border border-slate-700/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <Database className="w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-slate-200">PostgreSQL Primary</span>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
              <CheckCircle2 className="w-2.5 h-2.5" />
              HEALTHY
            </span>
          </div>
          <div className="mt-1.5 text-[9px] font-mono text-slate-400 flex justify-between">
            <span>7ms response</span>
            <span>Connection Pool 38%</span>
          </div>
        </div>

        {/* Failure propagation callout overlay */}
        <div className="w-full mt-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center justify-between text-[11px] font-mono text-rose-300">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Root Fault: Payment Process Crash</span>
          </div>
          <span className="text-slate-400 text-[10px]">Cascade: 2 hops</span>
        </div>
      </div>
    </div>
  );
}
