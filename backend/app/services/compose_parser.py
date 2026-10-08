import yaml
import re
from typing import Dict, Any, List, Tuple, Optional
from app.models.application import ServiceDetail, GraphNode, GraphNodeData, GraphEdge, DependencyGraphResponse

def parse_port_value(val) -> Optional[int]:
    if isinstance(val, int):
        return val if 1 <= val <= 65535 else None
    if isinstance(val, str):
        clean_val = val.strip().replace('"', '').replace("'", "")
        # Format "host:container" or "host:container/tcp" or "port"
        parts = clean_val.split(":")
        for part in reversed(parts):
            sub = part.split("/")[0].strip()
            match = re.search(r'\d+', sub)
            if match:
                num = int(match.group(0))
                if 1 <= num <= 65535:
                    return num
    return None

def infer_service_type(srv_name: str, image: str) -> str:
    combined = (srv_name + " " + image).lower()
    if any(k in combined for k in ["postgres", "mysql", "redis", "mongo", "db", "database", "mariadb"]):
        return "Database"
    if any(k in combined for k in ["gateway", "proxy", "nginx", "envoy", "ingress"]):
        return "Gateway"
    if any(k in combined for k in ["worker", "queue", "kafka", "notif", "consumer", "job"]):
        return "Worker"
    return "Microservice"

def extract_service_port(srv_id: str, srv_config: dict, srv_type: str, used_ports: set, index: int) -> int:
    srv_config = srv_config or {}

    # 1. Inspect 'ports' array
    ports_list = srv_config.get("ports", [])
    if isinstance(ports_list, list) and len(ports_list) > 0:
        parsed = parse_port_value(ports_list[0])
        if parsed:
            used_ports.add(parsed)
            return parsed

    # 2. Inspect 'expose' array
    expose_list = srv_config.get("expose", [])
    if isinstance(expose_list, list) and len(expose_list) > 0:
        parsed = parse_port_value(expose_list[0])
        if parsed:
            used_ports.add(parsed)
            return parsed

    # 3. Inspect 'environment' variables
    env_vars = srv_config.get("environment", [])
    if isinstance(env_vars, list):
        for env in env_vars:
            if isinstance(env, str) and "=" in env:
                k, v = env.split("=", 1)
                if k.strip().upper() in ["PORT", "SERVER_PORT", "APP_PORT", "HTTP_PORT"]:
                    parsed = parse_port_value(v)
                    if parsed:
                        used_ports.add(parsed)
                        return parsed
    elif isinstance(env_vars, dict):
        for k, v in env_vars.items():
            if str(k).strip().upper() in ["PORT", "SERVER_PORT", "APP_PORT", "HTTP_PORT"]:
                parsed = parse_port_value(v)
                if parsed:
                    used_ports.add(parsed)
                    return parsed

    # 4. Smart technology / service type defaults
    image = str(srv_config.get("image", "")).lower()
    combined = (srv_id + " " + image).lower()

    if "postgres" in combined:
        base_port = 5432
    elif "redis" in combined:
        base_port = 6379
    elif "mysql" in combined or "mariadb" in combined:
        base_port = 3306
    elif "mongo" in combined:
        base_port = 27017
    elif "kafka" in combined:
        base_port = 9092
    elif srv_type == "Database":
        base_port = 5432
    elif srv_type == "Gateway":
        base_port = 8080
    else:
        # Microservice / Worker fallback starting at 8081 + index
        base_port = 8081 + index

    # Prevent port collision across services
    candidate = base_port
    while candidate in used_ports:
        candidate += 1

    used_ports.add(candidate)
    return candidate

def parse_docker_compose_yaml(compose_yaml_str: str) -> Tuple[List[ServiceDetail], DependencyGraphResponse, List[str], List[str]]:
    """
    Parses docker-compose.yml string and generates:
    1. ServiceDetail list (with distinct, accurate ports)
    2. DependencyGraphResponse (nodes + edges for @xyflow/react)
    3. discoveredServices formatted text array
    4. discoveredDependencies formatted text array
    """
    try:
        parsed_yaml = yaml.safe_load(compose_yaml_str)
    except Exception:
        parsed_yaml = None

    services_data = {}
    if isinstance(parsed_yaml, dict) and "services" in parsed_yaml and isinstance(parsed_yaml["services"], dict):
        services_data = parsed_yaml["services"]

    if not services_data:
        # Regex extraction fallback
        service_blocks = re.findall(r'^\s\s([a-zA-Z0-9_-]+):', compose_yaml_str, re.MULTILINE)
        for srv in service_blocks:
            services_data[srv] = {"image": f"custom/{srv}:latest"}

    service_details: List[ServiceDetail] = []
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []
    discovered_services: List[str] = []
    discovered_dependencies: List[str] = []

    # Track dependencies, dependents, and assigned ports
    deps_map: Dict[str, List[str]] = {}
    dependents_map: Dict[str, List[str]] = {srv: [] for srv in services_data.keys()}
    used_ports = set()
    service_ports: Dict[str, int] = {}

    # First pass: parse dependencies and compute unique ports per service
    for index, (srv_id, srv_config) in enumerate(services_data.items()):
        srv_config = srv_config or {}
        image = str(srv_config.get("image", ""))
        srv_type = infer_service_type(srv_id, image)

        # Assign unique port
        port = extract_service_port(srv_id, srv_config, srv_type, used_ports, index)
        service_ports[srv_id] = port

        # Parse depends_on
        raw_deps = srv_config.get("depends_on", [])
        deps = []
        if isinstance(raw_deps, list):
            deps = [str(d) for d in raw_deps]
        elif isinstance(raw_deps, dict):
            deps = [str(d) for d in raw_deps.keys()]

        deps_map[srv_id] = deps
        for dep in deps:
            if dep not in dependents_map:
                dependents_map[dep] = []
            dependents_map[dep].append(srv_id)

    # Second pass: construct ServiceDetails and XyFlow graph layout
    type_counts = {"Gateway": 0, "Microservice": 0, "Worker": 0, "Database": 0}
    type_y_positions = {"Gateway": 30, "Microservice": 170, "Worker": 320, "Database": 470}

    for index, (srv_id, srv_config) in enumerate(services_data.items()):
        srv_config = srv_config or {}
        image = str(srv_config.get("image", ""))
        srv_type = infer_service_type(srv_id, image)
        port = service_ports[srv_id]

        display_name = srv_id.replace("-", " ").replace("_", " ").title()

        # Build ServiceDetail object
        srv_detail = ServiceDetail(
            id=srv_id,
            name=display_name,
            type=srv_type,
            status="healthy",
            statusLabel="Healthy",
            port=port,
            protocol="HTTP / REST",
            cpu="18%",
            memory="32%",
            responseTime="24ms",
            baselineResponseTime="20ms",
            errorRate="0.0%",
            baselineErrorRate="0.0%",
            requestRate="320 req/s",
            dependencies=deps_map.get(srv_id, []),
            dependents=dependents_map.get(srv_id, []),
            description=f"Isolated container service derived from docker-compose ({srv_id}).",
            runtime=f"Docker / {image if image else 'Container'}",
            containerId=f"cnt_{srv_id[:8]}"
        )
        service_details.append(srv_detail)
        discovered_services.append(f"{display_name} (port: {port})")

        # Position node cleanly on @xyflow/react canvas
        col = type_counts[srv_type]
        type_counts[srv_type] += 1
        x_pos = 140 + (col * 240) + ((index % 2) * 20)
        y_pos = type_y_positions.get(srv_type, 170)

        # Build GraphNode for @xyflow/react
        node = GraphNode(
            id=srv_id,
            type="serviceNode",
            position={"x": x_pos, "y": y_pos},
            data=GraphNodeData(
                label=display_name,
                serviceType=srv_type,
                status="healthy",
                port=port,
                responseTime="24ms",
                errorRate="0.0%",
                isTarget=False,
                isAffected=False
            )
        )
        nodes.append(node)

        # Build GraphEdges
        for dep_id in deps_map.get(srv_id, []):
            edge_id = f"e-{srv_id}-{dep_id}"
            edge = GraphEdge(
                id=edge_id,
                source=srv_id,
                target=dep_id,
                animated=False,
                style={"stroke": "#334155", "strokeWidth": 1.5}
            )
            edges.append(edge)

            dep_display = dep_id.replace("-", " ").replace("_", " ").title()
            discovered_dependencies.append(f"{display_name} → {dep_display}")

    graph = DependencyGraphResponse(nodes=nodes, edges=edges)
    return service_details, graph, discovered_services, discovered_dependencies
