import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useToast } from '../context/ToastContext';
import { applicationService } from '../services/applicationService';
import { experimentService } from '../services/experimentService';
import {
  Play,
  Square,
  Flame,
  GitFork,
  Server,
  Layers,
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [services, setServices] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [sandboxRunning, setSandboxRunning] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [appData, srvs, exps] = await Promise.all([
          applicationService.getApplicationById(id),
          applicationService.getServices(id),
          experimentService.getExperiments(id),
        ]);
        if (isMounted) {
          setApp(appData);
          setServices(srvs);
          setExperiments(exps);
        }
      } catch (e) {
        console.error('Failed to load application details', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStartSandbox = () => {
    setSandboxRunning(true);
    addToast('Sandbox Started', `Containers for ${app?.name} resumed in isolated network.`, 'success');
  };

  const handleStopSandbox = () => {
    setSandboxRunning(false);
    addToast('Sandbox Stopped', `All containers for ${app?.name} gracefully paused.`, 'warning');
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading application topology and telemetry..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={app?.name || 'E-Commerce Platform'}
        subtitle={app?.description}
        breadcrumbs={[
          { label: 'Applications', to: '/applications' },
          { label: app?.name || 'Details' }
        ]}
        badge={
          <Badge variant={sandboxRunning ? 'healthy' : 'neutral'} size="sm">
            {sandboxRunning ? 'Connected & Sandboxed' : 'Sandbox Paused'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            {sandboxRunning ? (
              <Button variant="outline" size="sm" icon={Square} onClick={handleStopSandbox}>
                Stop Sandbox
              </Button>
            ) : (
              <Button variant="secondary" size="sm" icon={Play} onClick={handleStartSandbox}>
                Start Sandbox
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              icon={Flame}
              onClick={() => navigate(`/experiments/new?appId=${app?.id}`)}
            >
              Run Experiment
            </Button>
          </div>
        }
      />

      {/* Overview Cards: Services (8), Dependencies (11), Experiments (12), Active Issues (1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Services</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">{app?.servicesCount || 8}</p>
            <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Microservices & DBs</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400">
            <Server className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Dependencies</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">{app?.dependenciesCount || 11}</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Topological edges</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <GitFork className="w-4 h-4 rotate-90" />
          </div>
        </div>

        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Resilience Tests</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">{app?.experimentsCount || 12}</p>
            <p className="text-[10px] text-rose-400 font-mono mt-0.5">Chaos injection runs</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-panel border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Active Issues</span>
            <p className="text-2xl font-bold font-mono text-amber-300 mt-1">{app?.activeIssues || 1}</p>
            <p className="text-[10px] text-amber-400 font-mono mt-0.5">Pending RCA fix</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* QUICK GRAPH JUMP BANNER */}
      <div className="p-4 rounded-xl bg-space-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <GitFork className="w-4 h-4 rotate-90" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Full Application Dependency Graph</h4>
            <p className="text-[11px] text-slate-400">Explore interactive nodes, failure blast radius, and network hops.</p>
          </div>
        </div>
        <Link to={`/applications/${app?.id || 'app-ecommerce'}/graph`}>
          <Button variant="secondary" size="sm" icon={ExternalLink}>
            Open Graph Canvas
          </Button>
        </Link>
      </div>

      {/* SERVICE INVENTORY TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Service Inventory ({services.length})</CardTitle>
          <CardDescription>
            Containerized services running in isolated Docker environment with health metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                  <th className="pb-2.5 font-medium">Service Name</th>
                  <th className="pb-2.5 font-medium">Type</th>
                  <th className="pb-2.5 font-medium">Port</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium">Response Time</th>
                  <th className="pb-2.5 font-medium">Error Rate</th>
                  <th className="pb-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-sans font-medium text-slate-200">
                      {s.name}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {s.type}
                    </td>
                    <td className="py-3 text-slate-400">
                      :{s.port}
                    </td>
                    <td className="py-3">
                      <Badge variant={s.status} size="sm">
                        {s.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-300">
                      {s.responseTime}
                    </td>
                    <td className="py-3">
                      <span className={s.status === 'critical' ? 'text-rose-400 font-bold' : s.status === 'degraded' ? 'text-amber-400' : 'text-emerald-400'}>
                        {s.errorRate}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/experiments/new?targetService=${s.id}`)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-sans hover:underline"
                      >
                        Inject Fault
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* RECENT EXPERIMENTS FOR THIS APPLICATION */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Controlled Experiments</CardTitle>
          <CardDescription>Resilience tests targeting services within this application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                  <th className="pb-2.5 font-medium">Experiment</th>
                  <th className="pb-2.5 font-medium">Target</th>
                  <th className="pb-2.5 font-medium">Fault</th>
                  <th className="pb-2.5 font-medium">Severity</th>
                  <th className="pb-2.5 font-medium">Result</th>
                  <th className="pb-2.5 font-medium text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {experiments.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-sans font-medium text-slate-200">
                      {exp.name}
                    </td>
                    <td className="py-3 text-slate-300">
                      {exp.targetServiceName}
                    </td>
                    <td className="py-3 text-slate-400">
                      {exp.faultType}
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] text-amber-300">{exp.severity}</span>
                    </td>
                    <td className="py-3 font-semibold text-rose-400">
                      {exp.result}
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/experiments/${exp.id}`} className="text-brand-cyan hover:underline">
                        Report →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
