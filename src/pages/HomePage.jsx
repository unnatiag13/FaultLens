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
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 atmospheric-glow-top border-b border-[#1F1F1F] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-brand-primary/30 text-[11px] font-mono text-brand-primary tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  <span>FAULT INJECTION + ROOT CAUSE ANALYSIS</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Find the fault. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-brand-primary to-orange-600">
                    Understand the impact.
                  </span> <br />
                  Fix the cause.
                </h1>

                {/* Supporting Paragraph */}
                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  FaultLens helps engineering teams safely simulate failures, understand service dependencies, identify probable root causes, and generate actionable remediation recommendations.
                </p>

                {/* Isolation Callout */}
                <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] text-xs text-[#888888] flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your application remains completely isolated. FaultLens tests within sandboxed environments without touching production code.</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link to="/register">
                    <Button size="lg" icon={ArrowRight} className="font-semibold px-6 shadow-glow-primary">
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

              {/* Right Column: Hero Visual */}
              <div className="lg:col-span-6 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/10 to-orange-500/10 rounded-3xl blur-2xl -z-10" />
                <StaticHeroGraph />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: HOW FAULTLENS HELPS */}
        <section id="architecture" className="py-20 md:py-28 border-b border-[#1F1F1F] engineering-grid-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-primary">
                Engineering Resilience Lifecycle
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                How FaultLens Helps
              </h2>
              <p className="text-sm text-[#888888] mt-3 leading-relaxed">
                A systematic, graph-grounded methodology for discovering fragile service dependencies before they cascade in production.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] hover:border-brand-primary/40 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Connect Your Application</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    Import or connect your application to an isolated FaultLens environment.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1F1F1F] text-[11px] font-mono text-[#555555]">
                  Step 01 • Docker Compose MVP
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] hover:border-brand-primary/40 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-105 transition-transform">
                    <GitFork className="w-5 h-5 rotate-90" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Discover Dependencies</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    Identify services and relationships and represent them as a dependency graph.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1F1F1F] text-[11px] font-mono text-[#555555]">
                  Step 02 • Topological Graphing
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] hover:border-rose-600/40 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Run Controlled Experiments</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    Inject controlled faults into selected services and observe system behavior.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1F1F1F] text-[11px] font-mono text-[#555555]">
                  Step 03 • Isolated Chaos Engine
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] hover:border-brand-primary/40 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-ai mb-4 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Analyze & Remediate</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    Understand impact, identify probable root causes, and receive AI-assisted remediation suggestions.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1F1F1F] text-[11px] font-mono text-[#555555]">
                  Step 04 • Developer Review Ready
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PRODUCT PREVIEW */}
        <section className="py-20 md:py-28 border-b border-[#1F1F1F] bg-space-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-primary">
                Observability & Mission Control
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                Your application's resilience at a glance.
              </h2>
              <p className="text-sm text-[#888888] mt-3 leading-relaxed">
                Direct visibility into microservice topology health, live blast-radius propagation metrics, and probable root-cause telemetry.
              </p>
            </div>

            {/* Mock Dashboard Window Preview */}
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#0D0D0D] shadow-2xl shadow-black overflow-hidden">
              {/* Window Title Bar */}
              <div className="px-4 py-3 bg-space-950 border-b border-[#1F1F1F] flex items-center justify-between text-xs text-[#888888]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-brand-primary/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 font-mono text-[11px] text-[#555555]">faultlens.internal/dashboard • E-Commerce Platform</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Sandbox Active
                </span>
              </div>

              {/* Internal Mock Dashboard */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0D0D0D]">
                {/* Left: Stats */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-3 rounded-lg bg-space-950 border border-[#1F1F1F]">
                    <span className="text-[10px] text-[#555555] uppercase font-mono block">Selected Target</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-white text-xs">E-Commerce Platform</span>
                      <span className="text-[10px] text-brand-primary font-mono">8 Services</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-space-950 border border-[#1F1F1F] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888888]">System Status</span>
                      <span className="text-brand-primary font-medium font-mono text-[11px]">Operational (Degraded)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] pt-1 border-t border-[#1F1F1F]">
                      <div className="bg-emerald-950/40 border border-emerald-900/50 p-1.5 rounded">
                        <span className="block text-emerald-400 font-bold">5</span>
                        <span className="text-[#888888]">Healthy</span>
                      </div>
                      <div className="bg-brand-primary/10 border border-brand-primary/30 p-1.5 rounded">
                        <span className="block text-brand-primary font-bold">2</span>
                        <span className="text-[#888888]">Degraded</span>
                      </div>
                      <div className="bg-rose-950/40 border border-rose-900/50 p-1.5 rounded">
                        <span className="block text-rose-400 font-bold">1</span>
                        <span className="text-[#888888]">Failed</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-rose-400 font-semibold">PROBABLE ROOT CAUSE</span>
                      <span className="text-slate-300 font-bold">94% CONFIDENCE</span>
                    </div>
                    <p className="text-xs font-semibold text-white">Payment Service Failure</p>
                    <p className="text-[11px] text-[#888888] font-mono">
                      SIGTERM crash initiated socket timeouts cascading to order checkout.
                    </p>
                  </div>
                </div>

                {/* Right: Graph preview */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-4 rounded-xl bg-space-950 border border-[#1F1F1F] relative">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-semibold text-slate-200">Discovered Dependency Topology</span>
                      <span className="text-[10px] font-mono text-brand-primary">Active Blast Radius</span>
                    </div>

                    <div className="py-6 flex items-center justify-around text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-[#0D0D0D] border border-brand-primary/60 text-orange-300 w-28">
                        <span className="block font-semibold">API Gateway</span>
                        <span className="text-[10px] text-[#888888]">420ms</span>
                      </div>
                      <div className="text-brand-primary font-bold">→</div>
                      <div className="p-2 rounded-lg bg-[#0D0D0D] border border-brand-primary/60 text-orange-300 w-28">
                        <span className="block font-semibold">Order Svc</span>
                        <span className="text-[10px] text-[#888888]">1,480ms</span>
                      </div>
                      <div className="text-rose-500 font-bold">→</div>
                      <div className="p-2 rounded-lg bg-rose-950/80 border-2 border-rose-600 text-rose-300 w-28 shadow-lg shadow-rose-950">
                        <span className="block font-bold">Payment Svc</span>
                        <span className="text-[10px] text-rose-400 font-bold">FAILED</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-[#1F1F1F] grid grid-cols-3 gap-2 text-[10px] font-mono text-[#888888]">
                      <div>Baseline Error Rate: <span className="text-emerald-400 font-semibold">0.08%</span></div>
                      <div>Experiment Error Rate: <span className="text-rose-400 font-semibold">34.8%</span></div>
                      <div>Cascade Latency: <span className="text-brand-primary font-semibold">+1,438ms</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FINAL CTA */}
        <section className="py-20 md:py-24 hero-glow border-t border-[#1F1F1F] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Understand your failures before they become incidents.
            </h2>
            <p className="text-sm sm:text-base text-[#888888] max-w-2xl mx-auto leading-relaxed">
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
