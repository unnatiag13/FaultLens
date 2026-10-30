import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { applicationService } from '../services/applicationService';
import { experimentService } from '../services/experimentService';
import {
  RotateCcw,
  Save,
  Maximize2,
  Flame,
  Shield,
  Layers,
  Sparkles,
  GitFork,
  Radio,
  CheckCircle2
} from 'lucide-react';

export function DependencyGraphPage() {
  const { id } = useParams();
  const { selectedApp, applications, setSelectedAppId } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const appId = id || selectedApp?.id || 'app-ecommerce';

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [services, setServices] = useState([]);
  const [activeExperiment, setActiveExperiment] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const [deps, srvs, exps] = await Promise.all([
        applicationService.getDependencies(appId),
        applicationService.getServices(appId),
        experimentService.getExperiments(appId).catch(() => []),
      ]);
      setGraphData(deps || { nodes: [], edges: [] });
      setServices(srvs || []);

      // Find currently running experiment or most recent completed/recovered experiment
      const running = exps.find((e) => e.status === 'Running');
      const latest = running || (exps.length > 0 ? exps[0] : null);

      setActiveExperiment(latest);
      if (running) {
        setElapsed(running.elapsed || 0);
      } else if (latest) {
        setElapsed(latest.duration || 60);
      }
    } catch (e) {
      console.error('Failed to load dependency graph', e);
      addToast('Error', 'Unable to load service topology data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [appId]);

  // Live timer if an experiment is actively running for this application
  useEffect(() => {
    if (!activeExperiment || activeExperiment.status !== 'Running') return;

    const duration = activeExperiment.duration || 60;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeExperiment]);

  const handleSaveGraph = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Graph Saved', 'Topology node coordinates and layout preferences saved.', 'success');
    }, 400);
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Calculating topological graph layout and socket traces..." size="lg" />
      </div>
    );
  }

  const isRunning = activeExperiment?.status === 'Running';
  const isRecovered =
    activeExperiment?.status === 'Recovered' ||
    activeExperiment?.status === 'Completed';

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        title="Dependency Graph"
        subtitle={`Topological service mesh map for ${selectedApp?.name || 'E-Commerce Platform'}. Inspect blast radius propagation and inter-service dependencies.`}
        breadcrumbs={[
          { label: 'Applications', to: '/applications' },
          { label: selectedApp?.name || 'Application', to: `/applications/${appId}` },
          { label: 'Dependency Graph' }
        ]}
        badge={
          <Badge
            variant={
              isRunning
                ? 'running'
                : isRecovered
                ? 'healthy'
                : activeExperiment
                ? 'warning'
                : 'operational'
            }
            size="sm"
          >
            {isRunning
              ? '● RUNNING - FAULT INJECTED'
              : isRecovered
              ? 'RECOVERED — IMPACT PRESERVED'
              : activeExperiment
              ? 'Failure Cascade Active'
              : 'Operational Topology'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={fetchGraph}
            >
              Refresh
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Save}
              isLoading={isSaving}
              onClick={handleSaveGraph}
            >
              Save Layout
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Flame}
              onClick={() => navigate(`/experiments/new?appId=${appId}`)}
            >
              Run Experiment
            </Button>
          </div>
        }
      />

      {/* Main Focus: Dependency Graph Canvas */}
      <div className="relative">
        <DependencyGraph
          initialNodes={graphData.nodes}
          initialEdges={graphData.edges}
          servicesData={services}
          activeExperiment={activeExperiment}
          elapsed={elapsed}
          height="h-[680px]"
          showControls={true}
        />
      </div>

      {/* Bottom Architectural Info Strip */}
      <div className="p-3 bg-panel border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Non-destructive telemetry extraction. Socket communication monitored via network mirror proxy.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>{graphData.nodes.length} Active Nodes</span>
          <span>{graphData.edges.length} Edge Links</span>
          <span>
            {activeExperiment
              ? `Experiment: ${activeExperiment.name || activeExperiment.id} (${activeExperiment.status})`
              : 'Topology Synchronized'}
          </span>
        </div>
      </div>
    </div>
  );
}
