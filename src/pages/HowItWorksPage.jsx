import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
  Search,
  GitFork,
  Flame,
  Activity,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  FileCode,
  AlertTriangle,
  XCircle,
  Copy,
  Terminal,
  Radio,
  Clock,
  UserCheck,
  Server,
  Database,
  Network
} from 'lucide-react';

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col space-bg">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top: Back to Home Button */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="border-b border-slate-800/80 pb-8 mb-16 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900 border border-slate-700/80 text-[11px] font-mono text-brand-cyan mb-4">
              <span>ENGINEERING WORKFLOW</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              How FaultLens Works
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
              From application connection to root-cause analysis and developer-reviewed remediation.
            </p>
          </div>

          {/* VERTICAL WORKFLOW STEPS */}
          <div className="relative pl-8 sm:pl-10 space-y-16 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
            {/* STEP 1 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-brand-primary text-brand-cyan text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                1
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider font-semibold">Step 01</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Connect Your Application
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Connect or import an application into an isolated FaultLens environment.
                  </p>
                </div>

                {/* Visual Representation */}
                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-4 text-xs font-mono text-center">
                    <div className="p-3 rounded-lg bg-space-950 border border-slate-700 w-44">
                      <span className="text-slate-400 block text-[10px]">Source Target</span>
                      <span className="font-semibold text-white">User Application</span>
                    </div>
                    <div className="text-slate-500 font-bold sm:rotate-0 rotate-90">↓</div>
                    <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-200 w-44 shadow-sm">
                      <span className="text-cyan-400 block text-[10px]">Ingress Controller</span>
                      <span className="font-bold">FaultLens</span>
                    </div>
                    <div className="text-slate-500 font-bold sm:rotate-0 rotate-90">↓</div>
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 w-44 shadow-sm">
                      <span className="text-emerald-400 block text-[10px]">Execution Boundary</span>
                      <span className="font-semibold">Isolated Environment</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800/80">
                      <span className="font-semibold text-brand-cyan block">Docker Compose (Primary MVP)</span>
                      <span className="text-[11px] text-slate-400">Parse service links and port mappings automatically</span>
                    </div>
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800/80">
                      <span className="font-semibold text-slate-300 block">Configuration Import</span>
                      <span className="text-[11px] text-slate-400">Kubernetes manifests or OpenAPI service descriptors</span>
                    </div>
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800/80">
                      <span className="font-semibold text-slate-300 block">Application Endpoint</span>
                      <span className="text-[11px] text-slate-400">Direct synthetic harness into test sandbox cluster</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-brand-cyan text-brand-cyan text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                2
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider font-semibold">Step 02</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Discover Services
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    FaultLens identifies the services within the connected application and prepares them for dependency analysis.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                    <span>Application</span>
                    <span>→</span>
                    <span className="text-brand-cyan font-semibold">Service Discovery Scanner</span>
                    <span>→</span>
                    <span className="text-emerald-400">6 Discovered Nodes</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    {[
                      { name: 'API Gateway', type: 'Gateway', port: 8080, icon: Network },
                      { name: 'Auth Service', type: 'Microservice', port: 8081, icon: Server },
                      { name: 'Order Service', type: 'Microservice', port: 8082, icon: Server },
                      { name: 'Payment Service', type: 'Microservice', port: 8083, icon: Server },
                      { name: 'Inventory', type: 'Microservice', port: 8084, icon: Server },
                      { name: 'Database', type: 'Postgres DB', port: 5432, icon: Database },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.name} className="p-2.5 rounded-lg bg-space-950 border border-slate-800 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">:{s.port}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-brand-primary text-brand-cyan text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                3
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider font-semibold">Step 03</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Build the Dependency Graph
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    FaultLens represents service relationships as a graph so that failure propagation can be analyzed.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-[11px] font-mono">
                    <span className="text-slate-400">Node State Legend:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Green = Healthy
                      </span>
                      <span className="text-amber-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Yellow = Degraded
                      </span>
                      <span className="text-rose-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Red = Failed
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-500" /> Gray = Unknown
                      </span>
                    </div>
                  </div>

                  {/* Visual Topology Diagram */}
                  <div className="py-4 flex flex-col items-center space-y-4 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-space-950 border border-emerald-600/60 text-emerald-300 w-44 text-center">
                      API Gateway
                    </div>
                    <div className="flex justify-between w-64 text-slate-600">
                      <span>↙</span>
                      <span>↘</span>
                    </div>
                    <div className="flex justify-between w-80">
                      <div className="p-2 rounded bg-space-950 border border-emerald-600/60 text-emerald-300 w-32 text-center">
                        Auth Service
                      </div>
                      <div className="p-2 rounded bg-space-950 border border-amber-600/70 text-amber-300 w-36 text-center shadow-sm">
                        Order Service
                      </div>
                    </div>
                    <div className="w-80 flex justify-end pr-14 text-slate-600">
                      <span>↓</span>
                    </div>
                    <div className="flex justify-end w-80 space-x-3 pr-2">
                      <div className="p-2 rounded bg-rose-950/80 border-2 border-rose-600 text-rose-300 font-bold w-36 text-center">
                        Payments (Failed)
                      </div>
                      <div className="p-2 rounded bg-space-950 border border-emerald-600/60 text-emerald-300 w-28 text-center">
                        Inventory
                      </div>
                    </div>
                    <div className="w-80 flex justify-end pr-36 text-slate-600">
                      <span>↓</span>
                    </div>
                    <div className="flex justify-end w-80 pr-24">
                      <div className="p-2 rounded bg-space-950 border border-emerald-600/60 text-emerald-300 w-44 text-center">
                        Database (Postgres)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-rose-500 text-rose-400 text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                4
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider font-semibold">Step 04</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Create a Controlled Experiment
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Configure intentional fault injection into a target service to test recovery behaviors.
                  </p>
                </div>

                {/* Configuration Panel Visual */}
                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">Experiment Configuration</span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                      Service Failure Test
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Application</span>
                      <span className="text-slate-200 font-semibold">E-Commerce Platform</span>
                    </div>
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Target Service</span>
                      <span className="text-rose-400 font-semibold">Payment Service</span>
                    </div>
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Fault Type</span>
                      <span className="text-slate-200">Service Failure (SIGKILL)</span>
                    </div>
                    <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Duration & Severity</span>
                      <span className="text-slate-200">60 seconds • High Severity</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-xs text-slate-400">
                    <span className="text-slate-300 font-semibold block mb-0.5">Description:</span>
                    Simulate a payment service outage in the staging sandbox to assess checkout error cascades.
                  </div>

                  {/* Warning */}
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-center gap-2 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Experiments should run only in the configured isolated environment.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 5 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-brand-cyan text-brand-cyan text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                5
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider font-semibold">Step 05</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Observe Failure Propagation
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Watch failure signals spread along the dependency chain in real time.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  {/* Timeline */}
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { time: '12:04:20', text: 'Experiment started', color: 'text-cyan-400' },
                      { time: '12:04:25', text: 'Payment Service failed', color: 'text-rose-400 font-bold' },
                      { time: '12:04:27', text: 'Order Service degraded (socket wait)', color: 'text-amber-400' },
                      { time: '12:04:30', text: 'API error rate increased (HTTP 504 timeouts)', color: 'text-amber-400' },
                      { time: '12:04:42', text: 'User requests affected (348 failed checkouts)', color: 'text-rose-400' },
                    ].map((t) => (
                      <div key={t.time} className="flex items-center gap-3 p-2 rounded bg-space-950 border border-slate-800/80">
                        <span className="text-slate-500 font-semibold">{t.time}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span className={t.color}>{t.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Affected service cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs">
                      <span className="text-rose-400 font-bold text-[10px] uppercase font-mono block">Critical Origin</span>
                      <span className="text-slate-100 font-semibold">Payment Service</span>
                      <p className="text-[11px] text-rose-300/80 mt-1 font-mono">Process terminated</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs">
                      <span className="text-amber-400 font-bold text-[10px] uppercase font-mono block">Degraded Dependent</span>
                      <span className="text-slate-100 font-semibold">Order Service</span>
                      <p className="text-[11px] text-amber-300/80 mt-1 font-mono">Latency: 1,480ms</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs">
                      <span className="text-amber-400 font-bold text-[10px] uppercase font-mono block">Warning Ingress</span>
                      <span className="text-slate-100 font-semibold">API Gateway</span>
                      <p className="text-[11px] text-amber-300/80 mt-1 font-mono">12.4% error rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 6 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-brand-primary text-brand-cyan text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                6
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider font-semibold">Step 06</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Identify the Probable Root Cause
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    FaultLens evaluates dependency topologies, experiment events, logs, and telemetry to pinpoint probable root causes.
                  </p>
                </div>

                {/* Professional RCA Card */}
                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-rose-400 font-bold uppercase">PROBABLE ROOT CAUSE</span>
                      <span className="text-slate-200 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800/60">
                        Confidence: 94%
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Payment Service Failure</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Fault cascade originated from process termination in Payment Service. Upstream Order Service lacked circuit-breaker or async timeout protection, saturating threads.
                    </p>
                  </div>

                  {/* Evidence Checklist */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <span className="text-slate-400 text-[11px] uppercase block font-semibold mb-2">Validated Telemetry Evidence:</span>
                    {[
                      'Service failure detected (Container exit code 137)',
                      'Dependency relationship confirmed (Order -> Payment synchronous call)',
                      'Error rate increased (Surge to 18.6% on Order endpoint)',
                      'Downstream failures correlated (Blast radius strictly follows order cascade)',
                      'Timeline correlation (Initial failure occurred at T+5s prior to all cascades)',
                    ].map((ev, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-space-950 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-800">
                    FaultLens combines dependency information, experiment events, logs, and metrics to determine the most probable root cause.
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 7 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-purple-500 text-purple-400 text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                7
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider font-semibold">Step 07</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Generate Remediation Recommendations
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    AI synthesizes architectural recommendations and prepares suggested code patches for developer review.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="font-semibold text-purple-300 uppercase tracking-wider font-mono">AI REMEDIATION</span>
                    <Badge variant="ai" size="sm">Priority: HIGH</Badge>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400 block text-[11px] font-mono">Recommended Action:</span>
                    <p className="font-medium text-slate-100 mt-0.5">
                      Introduce retry handling and circuit-breaker protection around the payment dependency.
                    </p>
                  </div>

                  {/* Code Diff Panel */}
                  <div className="rounded-lg bg-space-950 border border-slate-800 overflow-hidden font-mono text-xs">
                    <div className="p-2.5 bg-space-900 border-b border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                      <span>Suggested Patch • services/order/payment_client.py</span>
                      <span className="text-slate-400 text-[10px]">Python</span>
                    </div>

                    <div className="p-4 space-y-1 text-xs">
                      <div className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded">
                        - paymentService.process(order)
                      </div>
                      <div className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded">
                        + try:
                      </div>
                      <div className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded pl-6">
                        + paymentService.process(order)
                      </div>
                      <div className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded">
                        + except PaymentServiceError:
                      </div>
                      <div className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded pl-6">
                        + retry_payment()
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" icon={Copy}>
                        Copy Patch
                      </Button>
                      <Button variant="outline" size="sm">
                        View Full Patch
                      </Button>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Suggested patch only • Non-autonomous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 8 */}
            <div className="relative group">
              <div className="absolute -left-[37px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-400 text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                8
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-semibold">Step 08</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Developer Review
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Human-in-the-loop validation ensures developers retain absolute control over codebase changes.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-space-900/90 border border-slate-800 space-y-4">
                  {/* Process flow */}
                  <div className="flex flex-wrap items-center justify-center gap-3 py-2 text-xs font-mono text-center">
                    <span className="p-2 rounded bg-space-950 border border-slate-800">AI Recommendation</span>
                    <span className="text-slate-600">→</span>
                    <span className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 font-semibold">Developer Review</span>
                    <span className="text-slate-600">→</span>
                    <span className="p-2 rounded bg-space-950 border border-slate-800">Approve / Modify / Reject</span>
                    <span className="text-slate-600">→</span>
                    <span className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-semibold">Developer-Controlled Deployment</span>
                  </div>

                  {/* Review Notice */}
                  <div className="p-4 rounded-lg bg-space-950 border border-slate-700/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="text-xs font-bold text-white">Developer Review Required</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      FaultLens provides recommendations and suggested patches for developer review. It does not autonomously modify production systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Home
              </Button>
            </Link>

            <Link to="/register">
              <Button size="md" icon={ArrowRight}>
                Try FaultLens Platform
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
