import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { EvidenceList } from '../components/analysis/EvidenceList';
import { IncidentTimeline } from '../components/analysis/IncidentTimeline';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { analysisService } from '../services/analysisService';
import {
  HelpCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  GitFork,
  Radio,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

export function RootCausePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRCA() {
      setLoading(true);
      try {
        const res = await analysisService.getRootCauseAnalysis('exp-101');
        if (isMounted) setData(res);
      } catch (e) {
        console.error('Failed to load RCA', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadRCA();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Correlating topological edges, log timestamps, and telemetry signatures..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Root Cause Analysis"
        subtitle="Automated correlation engine synthesizing topological dependencies, fault injection events, telemetry metrics, and distributed container logs."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'Analysis' },
          { label: 'Root Cause' }
        ]}
        badge={
          <Badge variant="ai" size="sm">
            Probable Root Cause • 94% Confidence
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link to="/analysis/impact">
              <Button variant="secondary" size="sm" icon={Zap}>
                Impact Blast Radius
              </Button>
            </Link>
            <Link to="/remediation">
              <Button variant="primary" size="sm" icon={Sparkles}>
                AI Remediation
              </Button>
            </Link>
          </div>
        }
      />

      {/* MAIN RESULT CARD: PROBABLE ROOT CAUSE */}
      <div className="bg-panel border-2 border-rose-600/70 rounded-2xl p-6 shadow-2xl shadow-rose-950/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>PROBABLE ROOT CAUSE</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              {data?.probableRootCause}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Target Service: <span className="text-rose-300 font-semibold">{data?.targetService}</span> • Severity: {data?.severity}
            </p>
          </div>

          <div className="text-right sm:text-right bg-space-950 p-3 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Analysis Confidence</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{data?.confidence}</span>
            <span className="text-[10px] font-mono text-emerald-400 block">Statistically High</span>
          </div>
        </div>

        <p className="text-sm text-slate-200 mt-4 leading-relaxed">
          {data?.summary}
        </p>

        {/* Epistemic note: "Probable" not guaranteed */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            FaultLens designates this as a <strong>Probable Root Cause</strong> based on temporal and topological correlation. It is not an absolute certainty.
          </span>
        </div>
      </div>

      {/* WHY THIS IS CONSIDERED THE PROBABLE ROOT CAUSE */}
      <Card>
        <CardHeader>
          <CardTitle>Why this is considered the probable root cause</CardTitle>
          <CardDescription>
            Multi-signal triangulation based on dependency graphs, fault events, metrics, logs, and temporal correlation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono bg-space-950 p-4 rounded-xl border border-slate-800">
            {data?.whyExplanation}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Topological Distance</span>
              <span className="text-white font-bold">1 Hop</span>
            </div>
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Failure Latency Lag</span>
              <span className="text-cyan-400 font-bold">2.3 seconds</span>
            </div>
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Temporal Correlation</span>
              <span className="text-emerald-400 font-bold">0.982 r-score</span>
            </div>
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Blast Radius Confinement</span>
              <span className="text-amber-400 font-bold">Isolated Path</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TWO COLUMNS: VALIDATED EVIDENCE LIST & INCIDENT TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Corroborating Evidence */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validated Evidence Checklist (6)</CardTitle>
              <CardDescription>Ground-truth telemetry matching root-cause signature</CardDescription>
            </CardHeader>
            <CardContent>
              <EvidenceList evidence={data?.evidence} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Incident Timeline */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Sequence Timeline</CardTitle>
              <CardDescription>Exact timestamps of fault propagation milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentTimeline timeline={data?.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Step Action */}
      <div className="p-5 rounded-xl bg-space-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">Ready for Remediation?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Review proposed circuit-breaker code patch for Order Service dependency handling.
          </p>
        </div>
        <Link to="/remediation">
          <Button variant="primary" size="md" icon={ArrowRight}>
            View AI Remediation & Suggested Patch
          </Button>
        </Link>
      </div>
    </div>
  );
}
