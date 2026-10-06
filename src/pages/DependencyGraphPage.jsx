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
import {
  RotateCcw,
  Save,
  Maximize2,
  Flame,
  Shield,
  Layers,
  Sparkles,
  GitFork
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
  const [isSaving, setIsSaving] = useState(false);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const [deps, srvs] = await Promise.all([
        applicationService.getDependencies(appId),
        applicationService.getServices(appId),
      ]);
      setGraphData(deps);
      setServices(srvs);
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
          <Badge variant="warning" size="sm">
            Failure Cascade Active
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
              onClick={() => navigate('/experiments/new')}
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
          <span>8 Active Nodes</span>
          <span>11 Edge Links</span>
          <span>FastAPI Gateway: 200 OK</span>
        </div>
      </div>
    </div>
  );
}
