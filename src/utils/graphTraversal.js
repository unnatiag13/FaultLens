/**
 * Utility for dependency graph traversal and fault injection impact visualization.
 * Respects strict dependency direction: only services that depend on (call) the failed service
 * can be affected by the failure cascade. Unaffected services remain healthy and unchanged.
 */

/**
 * Builds a mapping of service ID -> Set of caller service IDs (dependents).
 * In microservices: if A calls B (A depends on B), then B's caller is A.
 * If B fails, A can be impacted.
 */
export function buildCallersMap(nodes = [], edges = [], services = []) {
  const callersMap = new Map();

  // Initialize entry for all known services/nodes
  nodes.forEach((n) => callersMap.set(n.id, new Set()));
  services.forEach((s) => {
    if (!callersMap.has(s.id)) {
      callersMap.set(s.id, new Set());
    }
  });

  // 1. Extract from services metadata (dependencies & dependents)
  services.forEach((srv) => {
    const srvId = srv.id;

    // srv.dependencies = services that srv calls.
    // If srv calls depId, then srv is a caller of depId.
    if (Array.isArray(srv.dependencies)) {
      srv.dependencies.forEach((depId) => {
        if (!callersMap.has(depId)) callersMap.set(depId, new Set());
        callersMap.get(depId).add(srvId);
      });
    }

    // srv.dependents = services that call srv.
    if (Array.isArray(srv.dependents)) {
      srv.dependents.forEach((callerId) => {
        if (!callersMap.has(srvId)) callersMap.set(srvId, new Set());
        callersMap.get(srvId).add(callerId);
      });
    }
  });

  // 2. Extract from edges:
  // In FaultLens standard topology (compose_parser.py), edge: source is caller (srv_id), target is dependency (dep_id).
  edges.forEach((edge) => {
    const { source, target } = edge;
    if (!source || !target) return;

    // Check if target is a known dependency of source in services
    const sourceSrv = services.find((s) => s.id === source);
    const targetSrv = services.find((s) => s.id === target);

    if (sourceSrv && Array.isArray(sourceSrv.dependencies) && sourceSrv.dependencies.includes(target)) {
      if (!callersMap.has(target)) callersMap.set(target, new Set());
      callersMap.get(target).add(source);
    } else if (targetSrv && Array.isArray(targetSrv.dependencies) && targetSrv.dependencies.includes(source)) {
      if (!callersMap.has(source)) callersMap.set(source, new Set());
      callersMap.get(source).add(target);
    } else {
      // Default convention: source calls target
      if (!callersMap.has(target)) callersMap.set(target, new Set());
      callersMap.get(target).add(source);
    }
  });

  return callersMap;
}

/**
 * Traverses the dependency graph starting from targetServiceId level by level (BFS).
 * Returns the level of each affected service and the connecting edges along the cascade.
 */
export function computeGraphImpact({
  nodes = [],
  edges = [],
  services = [],
  targetServiceId,
}) {
  if (!targetServiceId) {
    return {
      levelMap: new Map(),
      levelEdges: new Map(),
      maxLevel: 0,
      affectedServiceIds: [],
    };
  }

  const callersMap = buildCallersMap(nodes, edges, services);
  const nodeIds = new Set(nodes.map((n) => n.id));

  const levelMap = new Map(); // serviceId -> number (0 = target, 1 = direct callers, etc.)
  const levelEdges = new Map(); // edgeId -> { fromLevel, toLevel, callerId, calleeId }
  const visited = new Set();
  const queue = [];

  // Level 0: Injected Fault Target
  levelMap.set(targetServiceId, 0);
  visited.add(targetServiceId);
  queue.push(targetServiceId);

  let maxLevel = 0;

  while (queue.length > 0) {
    const currentCallee = queue.shift();
    const currentLevel = levelMap.get(currentCallee);
    const callers = callersMap.get(currentCallee) || new Set();

    callers.forEach((callerId) => {
      // Ensure caller is an active node on the canvas
      if (!nodeIds.has(callerId)) return;

      if (!visited.has(callerId)) {
        visited.add(callerId);
        const nextLevel = currentLevel + 1;
        levelMap.set(callerId, nextLevel);
        if (nextLevel > maxLevel) maxLevel = nextLevel;
        queue.push(callerId);
      }

      // Find connecting edge between caller and currentCallee
      const edge = edges.find(
        (e) =>
          (e.source === callerId && e.target === currentCallee) ||
          (e.source === currentCallee && e.target === callerId)
      );

      if (edge && !levelEdges.has(edge.id)) {
        levelEdges.set(edge.id, {
          edgeId: edge.id,
          fromLevel: currentLevel,
          toLevel: levelMap.get(callerId),
          callerId,
          calleeId: currentCallee,
        });
      }
    });
  }

  const affectedServiceIds = Array.from(levelMap.keys()).filter(
    (id) => id !== targetServiceId
  );

  return {
    levelMap,
    levelEdges,
    maxLevel,
    affectedServiceIds,
  };
}

/**
 * Main function to transform nodes and edges based on fault injection experiment state.
 *
 * @param {Object} options
 * @param {Array} options.nodes - Raw @xyflow/react nodes
 * @param {Array} options.edges - Raw @xyflow/react edges
 * @param {Array} options.services - Service details array
 * @param {string} options.targetServiceId - Fault target service ID
 * @param {string} options.experimentStatus - 'Running' | 'Failed' | 'Recovered' | 'Completed' | 'Stopped'
 * @param {number} options.elapsed - Elapsed experiment seconds
 * @param {number} options.duration - Configured experiment duration
 * @returns {Object} Transformed { nodes, edges, maxLevel, revealedLevel, affectedCount, unaffectedCount }
 */
export function traverseDependencyGraph({
  nodes = [],
  edges = [],
  services = [],
  targetServiceId = null,
  experimentStatus = null,
  elapsed = 0,
  duration = 60,
}) {
  if (!targetServiceId || !nodes.length) {
    return {
      nodes,
      edges,
      maxLevel: 0,
      revealedLevel: 0,
      affectedCount: 0,
      unaffectedCount: nodes.length,
      isImpactActive: false,
    };
  }

  const { levelMap, levelEdges, maxLevel, affectedServiceIds } = computeGraphImpact({
    nodes,
    edges,
    services,
    targetServiceId,
  });

  const normalizedStatus = (experimentStatus || 'Running').toLowerCase();
  const isRecovered =
    normalizedStatus === 'recovered' ||
    normalizedStatus === 'completed' ||
    normalizedStatus === 'stopped';
  const isFailed = normalizedStatus === 'failed';
  const isRunning = normalizedStatus === 'running';

  // Determine current progression level
  let revealedLevel = 0;
  if (isRecovered || isFailed) {
    // Preserve the complete final impact blast radius
    revealedLevel = maxLevel;
  } else if (isRunning) {
    // Progressive traversal level-by-level:
    // Level 0 at elapsed 0
    // Level 1 at elapsed >= 1s
    // Level 2 at elapsed >= 2s, etc.
    const safeElapsed = Math.max(0, elapsed || 0);
    revealedLevel = Math.min(maxLevel, safeElapsed);
  } else {
    revealedLevel = maxLevel;
  }

  // Transform nodes
  const transformedNodes = nodes.map((node) => {
    const isTarget = node.id === targetServiceId;
    const isAffected = levelMap.has(node.id);
    const nodeLevel = isAffected ? levelMap.get(node.id) : null;
    const isRevealed = isAffected && nodeLevel <= revealedLevel;

    if (isTarget) {
      // TARGET SERVICE: Highlighted in RED
      return {
        ...node,
        data: {
          ...node.data,
          isTarget: true,
          isAffected: true,
          recovered: isRecovered,
          status: 'critical', // ServiceNode uses critical for red styling
          statusLabel: isRecovered ? 'RECOVERED' : 'FAILED',
          responseTime: '3,200ms',
          errorRate: '100%',
        },
      };
    }

    if (isRevealed) {
      // DOWNSTREAM AFFECTED SERVICE: Cascading degradation (Amber)
      return {
        ...node,
        data: {
          ...node.data,
          isTarget: false,
          isAffected: true,
          recovered: isRecovered,
          status: 'degraded', // ServiceNode uses degraded for amber styling
          statusLabel: 'DEGRADED',
          responseTime: '1,480ms',
          errorRate: '18.6%',
        },
      };
    }

    // UNAFFECTED SERVICE: Keep unchanged / healthy
    return {
      ...node,
      data: {
        ...node.data,
        isTarget: false,
        isAffected: false,
        recovered: false,
        status: node.data?.originalStatus || 'healthy',
        statusLabel: 'HEALTHY',
        responseTime: node.data?.baselineResponseTime || node.data?.responseTime || '20ms',
        errorRate: '0.0%',
      },
    };
  });

  // Transform edges
  const transformedEdges = edges.map((edge) => {
    const levelInfo = levelEdges.get(edge.id);

    if (levelInfo && levelInfo.toLevel <= revealedLevel) {
      // Highlighted connecting edge along the failure propagation path
      if (levelInfo.fromLevel === 0) {
        // Direct link to the fault target: RED critical flow
        return {
          ...edge,
          animated: true,
          className: 'edge-critical-flow',
          style: {
            stroke: '#DC2626',
            strokeWidth: 2.5,
          },
        };
      }

      // Cascading links to higher-level callers: AMBER degraded flow
      return {
        ...edge,
        animated: true,
        className: 'edge-degraded-flow',
        style: {
          stroke: '#D97706',
          strokeWidth: 2,
        },
      };
    }

    // Unaffected edge: normal subtle style, not animated
    return {
      ...edge,
      animated: false,
      className: '',
      style: {
        stroke: '#334155',
        strokeWidth: 1.5,
      },
    };
  });

  const affectedCount = transformedNodes.filter((n) => n.data?.isAffected).length;
  const unaffectedCount = transformedNodes.length - affectedCount;

  return {
    nodes: transformedNodes,
    edges: transformedEdges,
    maxLevel,
    revealedLevel,
    affectedCount,
    unaffectedCount,
    affectedServiceIds,
    isRecovered,
    isRunning,
    isFailed,
    isImpactActive: true,
  };
}
