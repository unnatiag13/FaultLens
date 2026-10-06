import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StaticHeroGraph } from '../components/graph/StaticHeroGraph';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  Shield,
  Layers,
  GitFork,
  Flame,
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  Terminal,
  Cpu,
  Lock,
  ChevronRight
} from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col space-bg">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 atmospheric-glow-top border-b border-slate-800/60 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-brand-cyan tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  <span>FAULT INJECTION + ROOT CAUSE ANALYSIS</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Find the fault. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                    Understand the impact.
                  </span> <br />
                  Fix the cause.
                </h1>

                {/* Supporting Paragraph */}
                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  FaultLens helps engineering teams safely simulate failures, understand service dependencies, identify probable root causes, and generate actionable remediation recommendations.
                </p>

                {/* Architectural Isolation Callout */}
                <div className="p-3 rounded-lg bg-space-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your application remains completely isolated. FaultLens tests within sandboxed environments without touching production code.</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link to="/register">
                    <Button size="lg" icon={ArrowRight} className="font-semibold px-6">
                      Get Started
                    </Button>
                  </Link>

                  <Link to="/how-it-works">
                    <Button variant="secondary" size="lg" icon={ChevronRight}>
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Visual - Static Dependency Graph */}
              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-3xl blur-2xl -z-10" />
                <StaticHeroGraph />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: HOW FAULTLENS HELPS (4 CARDS) */}
        <section id="architecture" className="py-20 md:py-28 border-b border-slate-800/80 engineering-grid-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-cyan">
                Engineering Resilience Lifecycle
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                How FaultLens Helps
              </h2>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                A systematic, graph-grounded methodology for discovering fragile service dependencies before they cascade in production.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-xl bg-space-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Connect Your Application</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Import or connect your application to an isolated FaultLens environment.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                  Step 01 • Docker Compose MVP
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-xl bg-space-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                    <GitFork className="w-5 h-5 rotate-90" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Discover Dependencies</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Identify services and relationships and represent them as a dependency graph.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                  Step 02 • Topological Graphing
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-xl bg-space-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Run Controlled Experiments</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Inject controlled faults into selected services and observe system behavior.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                  Step 03 • Isolated Chaos Engine
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-xl bg-space-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Analyze & Remediate</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Understand impact, identify probable root causes, and receive AI-assisted remediation suggestions.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                  Step 04 • Developer Review Ready
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PRODUCT PREVIEW */}
        <section className="py-20 md:py-28 border-b border-slate-800/80 bg-space-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-cyan">
                Observability & Mission Control
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                Your application's resilience at a glance.
              </h2>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Direct visibility into microservice topology health, live blast-radius propagation metrics, and probable root-cause telemetry.
              </p>
            </div>

            {/* Mock Dashboard Window Preview */}
            <div className="rounded-2xl border border-slate-700/80 bg-space-900/95 shadow-2xl shadow-black overflow-hidden backdrop-blur-md">
              {/* Window Title Bar */}
              <div className="px-4 py-3 bg-space-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 font-mono text-[11px] text-slate-400">faultlens.internal/dashboard • E-Commerce Platform</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Sandbox Active
                </span>
              </div>

              {/* Internal Mock Dashboard Preview Grid */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-space-900/50">
                {/* Left Mini-Bar: Stats & Health */}
                <div className="lg:col-span-4 space-y-4">
                  {/* App selector simulation */}
                  <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Selected Target</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-white text-xs">E-Commerce Platform</span>
                      <span className="text-[10px] text-emerald-400 font-mono">8 Services</span>
                    </div>
                  </div>

                  {/* Health summary */}
                  <div className="p-3 rounded-lg bg-space-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">System Status</span>
                      <span className="text-amber-400 font-medium font-mono text-[11px]">Operational (Degraded)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] pt-1 border-t border-slate-800/60">
                      <div className="bg-emerald-950/40 border border-emerald-900/50 p-1.5 rounded">
                        <span className="block text-emerald-400 font-bold">5</span>
                        <span className="text-slate-400">Healthy</span>
                      </div>
                      <div className="bg-amber-950/40 border border-amber-900/50 p-1.5 rounded">
                        <span className="block text-amber-400 font-bold">2</span>
                        <span className="text-slate-400">Degraded</span>
                      </div>
                      <div className="bg-rose-950/40 border border-rose-900/50 p-1.5 rounded">
                        <span className="block text-rose-400 font-bold">1</span>
                        <span className="text-slate-400">Failed</span>
                      </div>
                    </div>
                  </div>

                  {/* Root cause summary preview */}
                  <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-rose-400 font-semibold">PROBABLE ROOT CAUSE</span>
                      <span className="text-slate-300 font-bold">94% CONFIDENCE</span>
                    </div>
                    <p className="text-xs font-semibold text-white">Payment Service Failure</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      SIGTERM crash initiated socket timeouts cascading to order checkout.
                    </p>
                  </div>
                </div>

                {/* Right Area: Mock Graph + Metrics Preview */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-4 rounded-xl bg-space-950 border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-semibold text-slate-200">Discovered Dependency Topology</span>
                      <span className="text-[10px] font-mono text-cyan-400">Active Blast Radius</span>
                    </div>

                    <div className="py-6 flex items-center justify-around text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-space-900 border border-amber-600/70 text-amber-300 w-28">
                        <span className="block font-semibold">API Gateway</span>
                        <span className="text-[10px] text-slate-400">420ms</span>
                      </div>
                      <div className="text-amber-500 font-bold">→</div>
                      <div className="p-2 rounded-lg bg-space-900 border border-amber-600/70 text-amber-300 w-28">
                        <span className="block font-semibold">Order Svc</span>
                        <span className="text-[10px] text-slate-400">1,480ms</span>
                      </div>
                      <div className="text-rose-500 font-bold">→</div>
                      <div className="p-2 rounded-lg bg-rose-950/80 border-2 border-rose-600 text-rose-300 w-28 shadow-lg shadow-rose-950">
                        <span className="block font-bold">Payment Svc</span>
                        <span className="text-[10px] text-rose-400 font-bold">FAILED</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                      <div>Baseline Error Rate: <span className="text-emerald-400 font-semibold">0.08%</span></div>
                      <div>Experiment Error Rate: <span className="text-rose-400 font-semibold">34.8%</span></div>
                      <div>Cascade Latency: <span className="text-amber-400 font-semibold">+1,438ms</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FINAL CTA */}
        <section className="py-20 md:py-24 atmospheric-glow-top border-t border-slate-800/80 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Understand your failures before they become incidents.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect an application, run a controlled experiment, and understand exactly how failures propagate through your system.
            </p>
            <div className="pt-4">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight} className="font-semibold px-8 shadow-glow-primary">
                  Launch FaultLens →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
