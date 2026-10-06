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
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';

const nodeTypes = {
  serviceNode: ServiceNode,
};

export function DependencyGraph({
  initialNodes = [],
  initialEdges = [],
  servicesData = [],
  interactive = true,
  height = 'h-[580px]',
  showControls = true,
  onNodeSelect,
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [propagationActive, setPropagationActive] = useState(true);

  // Sync when initialNodes or initialEdges update
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Handle Node Click
  const handleNodeClick = useCallback(
    (_, node) => {
      // Find full service data from servicesData or node.data
      const fullService =
        servicesData.find((s) => s.id === node.id) || {
          id: node.id,
          name: node.data.label,
          type: node.data.serviceType,
          status: node.data.status,
          port: node.data.port,
          responseTime: node.data.responseTime,
          errorRate: node.data.errorRate,
          dependencies: [],
          dependents: [],
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

  // Toggle failure propagation animation on edges
  const displayEdges = useMemo(() => {
    if (!propagationActive) {
      return edges.map((e) => ({ ...e, animated: false, className: '' }));
    }
    return edges;
  }, [edges, propagationActive]);

  return (
    <div className={`relative w-full ${height} bg-space-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col`}>
      {/* Top Toolbar */}
      {showControls && (
        <div className="p-3 bg-space-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 z-10">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Highlight node..."
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

          {/* Propagation Line Animation Toggle */}
          <div className="flex items-center gap-2">
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
              <span>Propagation {propagationActive ? 'Active' : 'Off'}</span>
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
          minZoom={0.4}
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
        <div className="absolute top-4 left-4 p-2 rounded-lg bg-space-950/80 backdrop-blur-sm border border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Healthy Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Degraded / Cascading Delays</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Failed / Process Crash</span>
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
