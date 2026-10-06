import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import { experimentService } from '../services/experimentService';
import { monitoringService } from '../services/monitoringService';
import {
  Layers,
  Server,
  Flame,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ExternalLink
} from 'lucide-react';

export function DashboardPage() {
  const { selectedApp } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [services, setServices] = useState([]);
  const [recentExperiments, setRecentExperiments] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [deps, srvs, exps, alrts] = await Promise.all([
          applicationService.getDependencies(selectedApp?.id),
          applicationService.getServices(selectedApp?.id),
          experimentService.getExperiments(selectedApp?.id),
          monitoringService.getActiveAlerts(selectedApp?.id),
        ]);

        if (isMounted) {
          setGraphData(deps);
          setServices(srvs);
          setRecentExperiments(exps);
          setActiveAlerts(alrts);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [selectedApp?.id]);

  // Greeting calculation
  const getGreeting = () => {
    return 'Good morning';
  };

  // Health counts
  const healthyCount = services.filter((s) => s.status === 'healthy').length || 5;
  const degradedCount = services.filter((s) => s.status === 'degraded' || s.status === 'warning').length || 2;
  const failedCount = services.filter((s) => s.status === 'critical' || s.status === 'failed').length || 1;
  const totalServices = services.length || 8;

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Aggregating cluster telemetry and dependency graph topology..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`${getGreeting()}, ${user?.name ? user.name.split(' ')[0] : 'Developer'}`}
        subtitle="FaultLens System Overview — Continuous dependency mapping and resilience evaluation in isolated environments."
        badge={
          <Badge variant="healthy" size="sm">
            Operational Sandbox
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link to="/applications/new">
              <Button variant="secondary" size="sm" icon={PlusCircle}>
                Connect App
              </Button>
            </Link>
            <Link to="/experiments/new">
              <Button variant="primary" size="sm" icon={Flame}>
                New Experiment
              </Button>
            </Link>
          </div>
        }
      />

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Applications */}
        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium">Applications</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white">3</span>
              <span className="text-[11px] text-slate-500 font-mono">Isolated</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 font-mono">● All Sandboxed</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Services */}
        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium">Services Discovered</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white">18</span>
              <span className="text-[11px] text-slate-500 font-mono">across clusters</span>
            </div>
            <p className="text-[10px] text-cyan-400 mt-1 font-mono">11 Topological Edges</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
        </div>

        {/* Experiments */}
        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium">Resilience Tests</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white">24</span>
              <span className="text-[11px] text-slate-500 font-mono">executed</span>
            </div>
            <p className="text-[10px] text-rose-400 mt-1 font-mono">Last: 2 hours ago</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Active Issues */}
        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active Anomalies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-amber-300">2</span>
              <span className="text-[11px] text-slate-500 font-mono">impact signals</span>
            </div>
            <p className="text-[10px] text-amber-400 mt-1 font-mono">1 Root Cause Identified</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* APPLICATION HEALTH BREAKDOWN CARD */}
      <div className="bg-panel border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Application Health: {selectedApp?.name || 'E-Commerce Platform'}
              </h3>
              <Badge variant="warning" size="sm">
                Operational (Degraded)
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target microservices topology running in {selectedApp?.environment || 'Docker Compose Isolated Sandbox'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">{healthyCount} Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-amber-300">{degradedCount} Degraded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-rose-300">{failedCount} Failed</span>
            </div>
            <div className="pl-2 border-l border-slate-800 text-slate-400">
              Total: {totalServices} Services
            </div>
          </div>
        </div>

        {/* Visual Multi-Segment Health Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-900 mt-4 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(healthyCount / totalServices) * 100}%` }}
            title={`${healthyCount} Healthy Services`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${(degradedCount / totalServices) * 100}%` }}
            title={`${degradedCount} Degraded Services`}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${(failedCount / totalServices) * 100}%` }}
            title={`${failedCount} Failed Services`}
          />
        </div>
      </div>

      {/* CENTRAL VISUAL COMPONENT: APPLICATION DEPENDENCY MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Application Dependency Map</span>
              <span className="text-[10px] font-mono uppercase bg-space-900 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
                Interactive Graph
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any node to inspect live telemetry, socket relationships, or trigger isolated chaos tests.
            </p>
          </div>

          <Link
            to={`/applications/${selectedApp?.id || 'app-ecommerce'}/graph`}
            className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
          >
            <span>Full Canvas View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive React Flow Canvas */}
        <DependencyGraph
          initialNodes={graphData.nodes}
          initialEdges={graphData.edges}
          servicesData={services}
          height="h-[520px]"
        />
      </div>

      {/* LOWER SECTION: RECENT EXPERIMENTS & ACTIVE ANOMALIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Experiments Table */}
        <div className="lg:col-span-8 bg-panel border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Controlled Experiments</h3>
              <p className="text-xs text-slate-400">Chaos fault simulations executed within the isolated sandbox</p>
            </div>
            <Link to="/experiments">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-500 text-[11px]">
                  <th className="pb-2.5 font-medium">Experiment</th>
                  <th className="pb-2.5 font-medium">Target Service</th>
                  <th className="pb-2.5 font-medium">Fault Type</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentExperiments.slice(0, 4).map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => navigate(`/experiments/${exp.id}`)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 font-sans font-medium text-slate-200 group-hover:text-brand-cyan">
                      {exp.name}
                    </td>
                    <td className="py-3 text-slate-300">
                      {exp.targetServiceName}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {exp.faultType}
                    </td>
                    <td className="py-3">
                      <Badge variant="completed" size="sm">
                        {exp.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-[11px] font-semibold ${
                        exp.result.includes('Impact') ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {exp.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RCA & Remediation Quick Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active RCA Card */}
          <div className="bg-panel border border-slate-800/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-[11px] font-mono uppercase text-rose-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Latest Root Cause
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-space-950 px-2 py-0.5 rounded border border-slate-800">
                94% Confidence
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Payment Service Failure</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cascaded to Order Service within 2.3 seconds due to missing circuit breaker fallbacks.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link to="/analysis/root-cause" className="text-xs text-brand-cyan hover:underline font-mono">
                View RCA Evidence →
              </Link>
              <Link to="/remediation">
                <Button variant="secondary" size="sm" icon={Sparkles}>
                  Remediate
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-panel border border-slate-800/80 rounded-xl p-4 shadow-sm space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider">
              Resilience Shortcuts
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/experiments/new?fault=Service+Failure')}
                className="w-full text-left p-2.5 rounded-lg bg-space-950 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-white">Inject Payment Failure</p>
                  <p className="text-[10px] text-slate-500 font-mono">Process SIGTERM simulation</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan" />
              </button>

              <button
                onClick={() => navigate('/monitoring')}
                className="w-full text-left p-2.5 rounded-lg bg-space-950 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-white">View Live Telemetry</p>
                  <p className="text-[10px] text-slate-500 font-mono">Metrics, QPS & terminal logs</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
