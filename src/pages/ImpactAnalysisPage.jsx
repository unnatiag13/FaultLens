import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { ImpactPropagationFlow } from '../components/analysis/ImpactPropagationFlow';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { analysisService } from '../services/analysisService';
import {
  Zap,
  ArrowRight,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  Radio,
  Clock,
  Activity,
  Layers,
  ShieldAlert
} from 'lucide-react';

export function ImpactAnalysisPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadImpact() {
      setLoading(true);
      try {
        const res = await analysisService.getImpactAnalysis('exp-101');
        if (isMounted) setData(res);
      } catch (e) {
        console.error('Failed to load impact analysis', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadImpact();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Calculating failure propagation blast radius and cascade graph..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Experiment Impact Analysis"
        subtitle="Blast radius assessment: Track how injected faults cascade across inter-service dependencies to end-user traffic."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'Analysis' },
          { label: 'Impact' }
        ]}
        badge={
          <Badge variant="critical" size="sm">
            Impact Detected (2 Cascades)
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link to="/analysis/root-cause">
              <Button variant="secondary" size="sm" icon={HelpCircle}>
                Root Cause Analysis
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

      {/* SUMMARY BANNER */}
      <div className="bg-panel border border-slate-800/80 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Fault Injected</span>
            <span className="font-bold text-white text-sm">{data?.faultInjected.serviceName}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Fault Type</span>
            <span className="text-rose-400 font-semibold">{data?.faultInjected.faultType}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Severity</span>
            <span className="text-amber-400 font-semibold">{data?.faultInjected.severity}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Experiment Result</span>
            <span className="text-rose-400 font-bold">{data?.result}</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SECTION: PROPAGATION FLOW & AFFECTED SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visual Propagation Chain */}
        <div className="lg:col-span-6 bg-panel border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-white">Failure Propagation Flow</h3>
            <p className="text-xs text-slate-400">Directional blast radius from origin fault to user impact</p>
          </div>

          <ImpactPropagationFlow propagationPath={data?.propagationPath} />
        </div>

        {/* Right: Affected Services Breakdown & Comparison */}
        <div className="lg:col-span-6 space-y-6">
          {/* Affected Services Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Affected Services Breakdown</CardTitle>
              <CardDescription>Severity tier assignment based on error rates and latency deviation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.affectedServices.map((svc) => {
                let badgeVariant = 'healthy';
                if (svc.tier === 'Critical') badgeVariant = 'critical';
                else if (svc.tier === 'Degraded') badgeVariant = 'degraded';
                else if (svc.tier === 'Warning') badgeVariant = 'degraded';

                return (
                  <div
                    key={svc.name}
                    className="p-3.5 rounded-lg bg-space-950 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{svc.name}</span>
                      <Badge variant={badgeVariant} size="sm">
                        {svc.tier.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                      {svc.detail}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Error Rate: <strong className="text-slate-300">{svc.errorRate}</strong></span>
                      <span>Latency: <strong className="text-slate-300">{svc.latency}</strong></span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Before vs After Telemetry Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Telemetry: Before vs After Experiment</CardTitle>
              <CardDescription>Quantified delta across SLA metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                      <th className="pb-2 font-medium">Metric</th>
                      <th className="pb-2 font-medium">Baseline (Pre-fault)</th>
                      <th className="pb-2 font-medium">Experiment Window</th>
                      <th className="pb-2 font-medium text-right">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-2.5 font-sans text-slate-300">Error Rate</td>
                      <td className="py-2.5 text-emerald-400">{data?.metricsComparison.errorRate.before}</td>
                      <td className="py-2.5 text-rose-400 font-bold">{data?.metricsComparison.errorRate.during}</td>
                      <td className="py-2.5 text-right text-rose-400 font-bold">{data?.metricsComparison.errorRate.delta}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-slate-300">P99 Latency</td>
                      <td className="py-2.5 text-slate-300">{data?.metricsComparison.responseTime.before}</td>
                      <td className="py-2.5 text-amber-300 font-bold">{data?.metricsComparison.responseTime.during}</td>
                      <td className="py-2.5 text-right text-amber-400 font-bold">{data?.metricsComparison.responseTime.delta}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-slate-300">Failed Checkouts</td>
                      <td className="py-2.5 text-slate-400">{data?.metricsComparison.requestFailures.before}</td>
                      <td className="py-2.5 text-rose-400 font-bold">{data?.metricsComparison.requestFailures.during}</td>
                      <td className="py-2.5 text-right text-rose-400 font-bold">{data?.metricsComparison.requestFailures.delta}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans text-slate-300">Throughput</td>
                      <td className="py-2.5 text-slate-300">{data?.metricsComparison.throughput.before}</td>
                      <td className="py-2.5 text-slate-300">{data?.metricsComparison.throughput.during}</td>
                      <td className="py-2.5 text-right text-amber-400 font-bold">{data?.metricsComparison.throughput.delta}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
