import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ServiceNode from './ServiceNode';

const nodeTypes = {
  serviceNode: ServiceNode,
};

// Preset layout positions for standard 6-service topology
const DEFAULT_POSITIONS = {
  gateway: { x: 300, y: 40 },
  auth: { x: 300, y: 170 },
  order: { x: 300, y: 300 },
  payment: { x: 140, y: 430 },
  inventory: { x: 460, y: 430 },
  database: { x: 300, y: 560 },
};

const SystemGraph = ({ services = [], dependencies = [] }) => {
  const nodes = useMemo(() => {
    return services.map((service, index) => {
      const pos = DEFAULT_POSITIONS[service.id] || {
        x: 100 + (index % 3) * 220,
        y: 100 + Math.floor(index / 3) * 150,
      };

      return {
        id: service.id,
        type: 'serviceNode',
        position: pos,
        data: {
          id: service.id,
          name: service.name,
          status: service.status,
        },
      };
    });
  }, [services]);

  const edges = useMemo(() => {
    return dependencies.map((dep) => {
      const edgeId = `e-${dep.source}-${dep.target}`;
      const sourceService = services.find((s) => s.id === dep.source);
      const targetService = services.find((s) => s.id === dep.target);

      let strokeColor = '#64748b'; // default slate-500
      let animated = false;

      if (targetService?.status === 'FAILED' || sourceService?.status === 'FAILED') {
        strokeColor = '#ef4444'; // red
        animated = true;
      } else if (targetService?.status === 'DEGRADED' || sourceService?.status === 'DEGRADED') {
        strokeColor = '#f59e0b'; // amber
        animated = true;
      }

      return {
        id: edgeId,
        source: dep.source,
        target: dep.target,
        animated,
        label: dep.critical ? 'critical' : 'optional',
        labelStyle: {
          fill: dep.critical ? '#f87171' : '#94a3b8',
          fontSize: 11,
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#0f172a',
          fillOpacity: 0.85,
          rx: 4,
          ry: 4,
        },
        style: {
          stroke: strokeColor,
          strokeWidth: dep.critical ? 2.5 : 1.5,
          strokeDasharray: dep.critical ? undefined : '5,5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 16,
          height: 16,
        },
      };
    });
  }, [dependencies, services]);

  return (
    <div className="system-graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="custom-controls" />
      </ReactFlow>
    </div>
  );
};

export default SystemGraph;
