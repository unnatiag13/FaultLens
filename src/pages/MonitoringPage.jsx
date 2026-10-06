import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCard } from '../components/monitoring/MetricCard';
import { MetricChart } from '../components/monitoring/MetricChart';
import { LogViewer } from '../components/monitoring/LogViewer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useApp } from '../context/AppContext';
import { monitoringService } from '../services/monitoringService';
import { applicationService } from '../services/applicationService';
import {
  Activity,
  AlertTriangle,
  Clock,
  Cpu,
  HardDrive,
  Radio,
  Server,
  Zap,
  Filter,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export function MonitoringPage() {
  const { selectedApp } = useApp();

  const [timeRange, setTimeRange] = useState('15m');
  const [selectedService, setSelectedService] = useState('all');
  const [services, setServices] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMonitoringData() {
      setLoading(true);
      try {
        const [srvs, met, lg, alr] = await Promise.all([
          applicationService.getServices(selectedApp?.id),
          monitoringService.getMetrics(selectedService, timeRange),
          monitoringService.getLiveLogs(selectedService),
          monitoringService.getActiveAlerts(selectedApp?.id),
        ]);

        if (isMounted) {
          setServices(srvs);
          setMetrics(met);
          setLogs(lg);
          setAlerts(alr);
        }
      } catch (e) {
        console.error('Failed to load telemetry', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMonitoringData();
    return () => {
      isMounted = false;
    };
  }, [selectedApp?.id, selectedService, timeRange]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Querying Prometheus time-series and log aggregation pipes..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Live Monitoring & Observability"
        subtitle="Real-time telemetry, latency signatures, error propagation curves, and streaming container logs."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'Monitoring' }
        ]}
        badge={
          <Badge variant="warning" size="sm">
            High Error Rate Active
          </Badge>
        }
      />

      {/* FILTER CONTROLS: TIME RANGE & SERVICE SELECTOR */}
      <div className="p-3 bg-panel border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Service Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Target Service:</span>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
          >
            <option value="all">All Services (Cluster Aggregated)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.status})
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-slate-800">
          {['5m', '15m', '30m', '1h', '6h', '24h'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                timeRange === range
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* TELEMETRY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cluster Error Rate"
          value="34.8"
          unit="%"
          change="+34.7%"
          isIncreaseGood={false}
          status="critical"
          subtitle="Baseline: 0.08%"
          icon={AlertTriangle}
        />

        <MetricCard
          title="P99 Response Time"
          value="1,480"
          unit="ms"
          change="+1,415ms"
          isIncreaseGood={false}
          status="warning"
          subtitle="Baseline: 65ms"
          icon={Clock}
        />

        <MetricCard
          title="Aggregate Throughput"
          value="980"
          unit="req/s"
          change="-31%"
          isIncreaseGood={true}
          status="warning"
          subtitle="Peak: 1,420 req/s"
          icon={Zap}
        />

        <MetricCard
          title="Container CPU Peak"
          value="78"
          unit="%"
          change="+36%"
          isIncreaseGood={false}
          status="neutral"
          subtitle="Memory: 75% max"
          icon={Cpu}
        />
      </div>

      {/* CHARTS GRID (RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart
          data={metrics}
          dataKey="errorRate"
          title="Error Rate (%) Surge During Fault Window"
          strokeColor="#DC2626"
          unit="%"
          referenceThreshold="1.0"
        />

        <MetricChart
          data={metrics}
          dataKey="responseTime"
          title="Response Time (ms) Cascade Signature"
          strokeColor="#D97706"
          unit="ms"
          referenceThreshold="200"
        />

        <MetricChart
          data={metrics}
          dataKey="cpu"
          title="CPU Utilization (%)"
          strokeColor="#2563EB"
          unit="%"
        />

        <MetricChart
          data={metrics}
          dataKey="requestRate"
          title="Request Throughput (req/s)"
          strokeColor="#06B6D4"
          unit=" req/s"
        />
      </div>

      {/* ACTIVE ALERTS */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Telemetry Alerts (3)</CardTitle>
              <CardDescription>Anomalies detected across microservices within the evaluation window</CardDescription>
            </div>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
              Degraded State
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-xs">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-lg bg-space-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${alt.severity === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div>
                    <span className="font-semibold text-white">{alt.service}: </span>
                    <span className="text-slate-300">{alt.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>{alt.metric}</span>
                  <span className="text-slate-500 font-sans">Active for {alt.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LIVE STREAMING TERMINAL LOGS */}
      <LogViewer logs={logs} />
    </div>
  );
}
