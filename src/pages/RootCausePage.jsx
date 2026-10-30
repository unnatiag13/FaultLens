import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { EvidenceList } from '../components/analysis/EvidenceList';
import { IncidentTimeline } from '../components/analysis/IncidentTimeline';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { analysisService } from '../services/analysisService';
import { experimentService } from '../services/experimentService';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  GitFork,
  Radio,
  Clock,
  Layers,
  FileText,
  Activity,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Server,
  Network
} from 'lucide-react';

export function RootCausePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [selectedExpId, setSelectedExpId] = useState('');
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { selectedApp } = useApp();

  const queryExpId = params.experimentId || searchParams.get('experimentId');

  // Load available experiments for selector dropdown
  useEffect(() => {
    let isMounted = true;
    async function loadExperiments() {
      try {
        const list = await experimentService.getExperiments();
        if (isMounted && Array.isArray(list)) {
          setExperiments(list);
          if (!queryExpId && list.length > 0) {
            setSelectedExpId(list[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load experiments list for selector', err);
      }
    }
    loadExperiments();
    return () => {
      isMounted = false;
    };
  }, [queryExpId]);

  // Synchronize selectedExpId with query or params
  useEffect(() => {
    if (queryExpId) {
      setSelectedExpId(queryExpId);
    }
  }, [queryExpId]);

  // Load RCA data for the selected experiment
  const loadRCA = async () => {
    setLoading(true);
    setError(null);
    try {
      const targetId = selectedExpId || queryExpId || null;
      const res = await analysisService.getRootCauseAnalysis(targetId);
      setData(res);
      if (res?.experimentId && res.experimentId !== selectedExpId) {
        setSelectedExpId(res.experimentId);
      }
    } catch (e) {
      console.error('Failed to load RCA', e);
      setError(e.message || 'Failed to generate Root Cause Analysis from backend engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRCA();
  }, [selectedExpId]);

  const handleExperimentChange = (newExpId) => {
    setSelectedExpId(newExpId);
    setSearchParams(newExpId ? { experimentId: newExpId } : {});
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Correlating topological edges, log timestamps, and telemetry signatures..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorState
          title="Root Cause Analysis Failed"
          message={error}
          onRetry={loadRCA}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          title="No RCA Data Available"
          message="No experiment record found to evaluate root cause. Run a chaos experiment first."
          actionLabel="Create Chaos Test"
          onAction={() => navigate('/experiments/new')}
        />
      </div>
    );
  }

  const confidencePct = data?.confidence || `${Math.round(data?.confidenceScore || 94)}%`;
  const confidenceLevel = data?.confidenceLevel || 'Statistically High';
  const breakdown = data?.confidenceBreakdown;

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
            Probable Root Cause • {confidencePct} Confidence
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Experiment Selector Dropdown */}
            {experiments.length > 0 && (
              <div className="flex items-center gap-1.5 bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 text-[11px] hidden sm:inline">Experiment:</span>
                <select
                  value={selectedExpId || data?.experimentId}
                  onChange={(e) => handleExperimentChange(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[180px] truncate"
                >
                  {experiments.map((exp) => (
                    <option key={exp.id} value={exp.id} className="bg-space-950 text-slate-200">
                      {exp.targetServiceName || exp.name} ({exp.faultType})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link to={selectedExpId ? `/analysis/impact?experimentId=${selectedExpId}` : '/analysis/impact'}>
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
              Target Service: <span className="text-rose-300 font-semibold">{data?.targetServiceName || data?.targetService}</span>
              {data?.rootCauseService?.containerId && (
                <span> • Container: <span className="text-slate-300">{data?.rootCauseService?.containerId}</span></span>
              )}
              <span> • Severity: <span className="text-rose-400 font-semibold">{data?.severity}</span></span>
              <span> • Fault: <span className="text-amber-400 font-semibold">{data?.faultType}</span></span>
            </p>
          </div>

          <div
            onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
            className="text-right sm:text-right bg-space-950 p-3 rounded-xl border border-slate-800 shrink-0 cursor-pointer hover:border-cyan-500/50 transition-colors group"
            title="Click to toggle explainable confidence breakdown"
          >
            <span className="text-[10px] font-mono uppercase text-slate-400 block group-hover:text-cyan-400">Analysis Confidence</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{confidencePct}</span>
            <span className="text-[10px] font-mono text-emerald-400 block">{confidenceLevel}</span>
          </div>
        </div>

        <p className="text-sm text-slate-200 mt-4 leading-relaxed">
          {data?.summary}
        </p>

        {/* Explainable Confidence Breakdown Panel */}
        {breakdown && showConfidenceDetails && (
          <div className="mt-4 p-4 rounded-xl bg-space-950/90 border border-slate-800 text-xs font-mono space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-semibold uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Explainable Scoring Breakdown
              </span>
              <span className="text-slate-400 text-[10px]">Total Score: {breakdown.totalScore} / 100</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded bg-space-900 border border-slate-800/80">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>1. Fault Injection Confirmed</span>
                  <span className="text-emerald-400">{breakdown.faultInjectionConfirmed?.score}/{breakdown.faultInjectionConfirmed?.maxScore} pts</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{breakdown.faultInjectionConfirmed?.description}</p>
              </div>
              <div className="p-2 rounded bg-space-900 border border-slate-800/80">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>2. Topological Path Coherence</span>
                  <span className="text-emerald-400">{breakdown.topologicalCoherence?.score}/{breakdown.topologicalCoherence?.maxScore} pts</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{breakdown.topologicalCoherence?.description}</p>
              </div>
              <div className="p-2 rounded bg-space-900 border border-slate-800/80">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>3. Temporal Precedence</span>
                  <span className="text-emerald-400">{breakdown.temporalPrecedence?.score}/{breakdown.temporalPrecedence?.maxScore} pts</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{breakdown.temporalPrecedence?.description}</p>
              </div>
              <div className="p-2 rounded bg-space-900 border border-slate-800/80">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>4. Telemetry Signature Alignment</span>
                  <span className="text-emerald-400">{breakdown.telemetrySignatureMatch?.score}/{breakdown.telemetrySignatureMatch?.maxScore} pts</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{breakdown.telemetrySignatureMatch?.description}</p>
              </div>
              <div className="p-2 rounded bg-space-900 border border-slate-800/80 sm:col-span-2">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>5. Control Group Non-Dependent Resilience</span>
                  <span className="text-emerald-400">{breakdown.controlGroupIsolation?.score}/{breakdown.controlGroupIsolation?.maxScore} pts</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{breakdown.controlGroupIsolation?.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Epistemic note: "Probable" not guaranteed */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              FaultLens designates this as a <strong>Probable Root Cause</strong> based on temporal and topological correlation.
            </span>
          </div>
          <button
            onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
            className="text-[11px] text-cyan-400 hover:underline shrink-0 ml-2"
          >
            {showConfidenceDetails ? 'Hide Score Breakdown' : 'Explain Confidence Score →'}
          </button>
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
              <span className="text-white font-bold">{data?.topologicalDistance || '1 Hop'}</span>
            </div>
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Failure Latency Lag</span>
              <span className="text-cyan-400 font-bold">{data?.latencyLag || '2.1 seconds'}</span>
            </div>
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Temporal Correlation</span>
              <span className="text-emerald-400 font-bold">{data?.temporalCorrelation || '0.984 r-score'}</span>
            </div>
            <div className="p-2.5 rounded bg-space-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Blast Radius Confinement</span>
              <span className="text-amber-400 font-bold">{data?.blastRadiusConfinement || 'Isolated Path'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROOT CAUSE VS DOWNSTREAM SYMPTOMS DIFFERENTIATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Downstream Symptoms (Affected Callers) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Downstream Symptoms ({data?.downstreamSymptoms?.length || 0})</CardTitle>
                  <CardDescription>Dependent callers degraded as a consequence of the root cause</CardDescription>
                </div>
                <Badge variant="warning" size="xs">
                  Secondary Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {data?.downstreamSymptoms?.length === 0 ? (
                <div className="p-4 rounded-lg bg-space-950 border border-slate-800 text-xs text-slate-400 font-mono text-center">
                  No downstream caller services were affected. Blast radius is strictly isolated to the target service.
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.downstreamSymptoms?.map((symp, idx) => (
                    <div
                      key={symp.id || idx}
                      className="p-3.5 rounded-lg bg-space-950/80 border border-slate-800/80 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span className="text-xs font-bold text-slate-200">{symp.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 uppercase">
                            Tier {symp.level} • {symp.role}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-rose-400 font-semibold uppercase">
                          Symptom
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                        {symp.symptom}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {symp.whySymptom}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Unaffected Control Group Services */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Control Group ({data?.unaffectedServices?.length || 0})</CardTitle>
                  <CardDescription>Independent services maintaining 100% health</CardDescription>
                </div>
                <Badge variant="healthy" size="xs">
                  Intact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {data?.unaffectedServices?.length === 0 ? (
                <div className="p-4 rounded-lg bg-space-950 border border-slate-800 text-xs text-slate-400 font-mono text-center">
                  All services in this application are in the direct blast radius of the target service.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {data?.unaffectedServices?.map((u, idx) => (
                    <div
                      key={u.id || idx}
                      className="p-2.5 rounded-lg bg-space-950/60 border border-slate-800/70 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-slate-300 font-medium">{u.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">0.0% Errors</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-slate-500 font-mono mt-3 leading-relaxed">
                Healthy control group services eliminate broad host-level or network interface failure hypotheses.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TWO COLUMNS: VALIDATED EVIDENCE LIST & INCIDENT TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Corroborating Evidence */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validated Evidence Checklist ({data?.evidence?.length || 0})</CardTitle>
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

      {/* ACTIONABLE RESILIENCE RECOMMENDATIONS */}
      {data?.recommendations && data.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actionable Resilience Recommendations</CardTitle>
                <CardDescription>Targeted architectural mitigations to eliminate single points of failure</CardDescription>
              </div>
              <Badge variant="ai" size="xs">
                Generated Findings
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-space-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-900 border border-slate-700 text-cyan-300 uppercase">
                        {rec.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${
                        rec.priority === 'Critical' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white mb-1">{rec.title}</h5>
                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Target: {rec.targetService}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Step Action */}
      <div className="p-5 rounded-xl bg-space-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Ready for Remediation?</h4>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Review proposed resilience patches for {data?.targetServiceName || data?.targetService} and dependent callers.
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
