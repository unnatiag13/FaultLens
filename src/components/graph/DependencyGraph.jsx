import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ServiceNode } from './ServiceNode';
import { ServiceDetailsPanel } from './ServiceDetailsPanel';
import { traverseDependencyGraph } from '../../utils/graphTraversal';
import {
  Search,
  Filter,
  Maximize2,
  RotateCcw,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Radio,
  Layers,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Button } from '../ui/Button';

const nodeTypes = {
  serviceNode: ServiceNode,
};

export function DependencyGraph({
  initialNodes = [],
  initialEdges = [],
  servicesData = [],
  activeExperiment = null,
  elapsed = 0,
  interactive = true,
  height = 'h-[580px]',
  showControls = true,
  onNodeSelect,
}) {
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [propagationActive, setPropagationActive] = useState(true);
  const [showBaseline, setShowBaseline] = useState(false);

  // Dynamically compute traversal and highlighted graph state based on active experiment
  const traversalResult = useMemo(() => {
    if (!activeExperiment?.targetServiceId) {
      return {
        nodes: initialNodes,
        edges: initialEdges,
        isImpactActive: false,
        maxLevel: 0,
        revealedLevel: 0,
        affectedCount: 0,
        unaffectedCount: initialNodes.length,
        isRecovered: false,
        isRunning: false,
        isFailed: false,
      };
    }

    return traverseDependencyGraph({
      nodes: initialNodes,
      edges: initialEdges,
      services: servicesData,
      targetServiceId: activeExperiment.targetServiceId,
      experimentStatus: activeExperiment.status,
      elapsed,
      duration: activeExperiment.duration || 60,
    });
  }, [
    initialNodes,
    initialEdges,
    servicesData,
    activeExperiment?.targetServiceId,
    activeExperiment?.status,
    activeExperiment?.duration,
    elapsed,
  ]);

  const effectiveNodes = showBaseline ? initialNodes : traversalResult.nodes;
  const effectiveEdges = showBaseline ? initialEdges : traversalResult.edges;

  const [nodes, setNodes, onNodesChange] = useNodesState(effectiveNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(effectiveEdges);

  // Sync when traversal/nodes/edges update
  useEffect(() => {
    setNodes(effectiveNodes);
  }, [effectiveNodes, setNodes]);

  useEffect(() => {
    setEdges(effectiveEdges);
  }, [effectiveEdges, setEdges]);

  // Handle Node Click
  const handleNodeClick = useCallback(
    (_, node) => {
      // Find full service data from servicesData or node.data
      const baseService = servicesData.find((s) => s.id === node.id) || {};
      const fullService = {
        ...baseService,
        id: node.id,
        name: node.data.label || baseService.name || node.id,
        type: node.data.serviceType || baseService.type,
        status: node.data.status || baseService.status,
        statusLabel: node.data.statusLabel,
        port: node.data.port || baseService.port,
        responseTime: node.data.responseTime || baseService.responseTime,
        errorRate: node.data.errorRate || baseService.errorRate,
        isTarget: node.data.isTarget,
        isAffected: node.data.isAffected,
        dependencies: baseService.dependencies || [],
        dependents: baseService.dependents || [],
      };

      setSelectedService(fullService);
      if (onNodeSelect) {
        onNodeSelect(fullService);
      }
    },
    [servicesData, onNodeSelect]
  );

  // Filtering / highlighting nodes based on search and status
  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const label = node.data.label?.toLowerCase() || '';
      const status = node.data.status?.toLowerCase() || '';
      const matchesSearch = !searchQuery || label.includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CRITICAL' && (status === 'critical' || status === 'failed')) ||
        (statusFilter === 'DEGRADED' && (status === 'degraded' || status === 'warning')) ||
        (statusFilter === 'HEALTHY' && status === 'healthy');

      const isDimmed = !matchesSearch || !matchesStatus;

      return {
        ...node,
        style: {
          opacity: isDimmed ? 0.25 : 1,
          transition: 'opacity 0.2s ease',
        },
      };
    });
  }, [nodes, searchQuery, statusFilter]);

  // Failure propagation animation on edges toggle
  const displayEdges = useMemo(() => {
    if (!propagationActive) {
      return edges.map((e) => ({ ...e, animated: false, className: '' }));
    }
    return edges;
  }, [edges, propagationActive]);

  return (
    <div className={`relative w-full ${height} bg-space-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col`}>
      {/* Real-time Experiment Traversal Status Banner */}
      {traversalResult.isImpactActive && !showBaseline && (
        <div
          className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors ${
            traversalResult.isRunning
              ? 'bg-rose-950/40 border-rose-800/50 text-rose-200'
              : traversalResult.isRecovered
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
              : 'bg-amber-950/40 border-amber-800/50 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {traversalResult.isRunning ? (
              <Radio className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
            ) : traversalResult.isRecovered ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="font-semibold">
              {traversalResult.isRunning
                ? `CHAOS ACTIVE: Target ${activeExperiment?.targetServiceName || activeExperiment?.targetServiceId}`
                : traversalResult.isRecovered
                ? `RECOVERED: Target ${activeExperiment?.targetServiceName || activeExperiment?.targetServiceId} (Impact Preserved)`
                : `FAULT CONFIRMED: Target ${activeExperiment?.targetServiceName || activeExperiment?.targetServiceId}`}
            </span>
            <span className="text-[11px] opacity-80 hidden sm:inline">
              • {traversalResult.isRunning
                ? `Traversing propagation tier ${traversalResult.revealedLevel} of ${traversalResult.maxLevel}`
                : `Preserving all ${traversalResult.maxLevel} failure cascade tiers`}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-700/60 text-rose-300 font-semibold">
              1 Target (Red)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-700/60 text-amber-300 font-semibold">
              {traversalResult.affectedCount - 1} Cascading
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
              {traversalResult.unaffectedCount} Unaffected
            </span>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      {showControls && (
        <div className="p-3 bg-space-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 z-10">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search or highlight node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-space-950 rounded border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] font-mono mr-1">Filter:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'HEALTHY', label: 'Healthy', icon: CheckCircle2, color: 'text-emerald-400' },
              { id: 'DEGRADED', label: 'Degraded', icon: AlertTriangle, color: 'text-amber-400' },
              { id: 'CRITICAL', label: 'Failed', icon: XCircle, color: 'text-rose-400' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  statusFilter === f.id
                    ? 'bg-slate-700 text-white font-medium border border-slate-600'
                    : 'bg-space-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f.icon && <f.icon className={`w-3 h-3 ${f.color}`} />}
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* Actions & Toggles */}
          <div className="flex items-center gap-2">
            {activeExperiment && (
              <button
                onClick={() => setShowBaseline((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  showBaseline
                    ? 'bg-brand-primary/20 text-cyan-300 border border-brand-primary/40'
                    : 'bg-space-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
                title="Toggle between baseline topology and active chaos blast radius"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showBaseline ? 'Showing Baseline' : 'Fault Impact Active'}</span>
              </button>
            )}

            {/* Propagation Line Animation Toggle */}
            <button
              onClick={() => setPropagationActive((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                propagationActive
                  ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                  : 'bg-space-950 text-slate-400 border border-slate-800'
              }`}
              title="Toggle animated failure propagation edges"
            >
              <Zap className={`w-3.5 h-3.5 ${propagationActive ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
              <span>Flow {propagationActive ? 'Active' : 'Off'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={filteredNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
        >
          <Background color="#1E293B" gap={20} size={1} />
          <Controls showInteractive={false} className="!left-4 !bottom-4" />
          <MiniMap
            nodeColor={(node) => {
              if (node.data?.status === 'critical') return '#DC2626';
              if (node.data?.status === 'degraded') return '#D97706';
              return '#16A34A';
            }}
            maskColor="rgba(5, 7, 13, 0.75)"
            className="!bg-space-900 !border !border-slate-800 !rounded-lg !right-4 !bottom-4 hidden sm:block"
          />
        </ReactFlow>

        {/* Informative Legend Overlay */}
        <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-space-950/90 backdrop-blur-sm border border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1.5 pointer-events-none shadow-lg">
          <div className="text-[11px] font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">
            Topology Legend
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-950" />
            <span className="text-rose-200 font-semibold">Fault Target (Red / Failed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-950" />
            <span className="text-amber-200">Downstream Caller (Degraded)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-950" />
            <span className="text-emerald-200">Unaffected Service (Healthy)</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60 text-[9px] text-slate-400">
            <span className="w-2.5 h-0.5 bg-rose-500" />
            <span>Red Flow = Ingress Outage</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
            <span className="w-2.5 h-0.5 bg-amber-500" />
            <span>Amber Flow = Cascade Latency</span>
          </div>
        </div>

        {/* Selected Service Flyout Details */}
        <ServiceDetailsPanel
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      </div>
    </div>
  );
}
