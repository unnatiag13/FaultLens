import urllib.request
import json

app_id = "app-1a11d3fccf8"

# Test Services endpoint
req_srv = urllib.request.Request(f"http://127.0.0.1:8000/api/v1/applications/{app_id}/services")
with urllib.request.urlopen(req_srv) as res:
    services = json.loads(res.read().decode("utf-8"))
    print(f"Retrieved {len(services)} services for {app_id}:")
    for s in services:
        print(f"  - {s['name']} ({s['type']} on port {s['port']})")

# Test Dependencies graph endpoint
req_graph = urllib.request.Request(f"http://127.0.0.1:8000/api/v1/applications/{app_id}/dependencies")
with urllib.request.urlopen(req_graph) as res:
    graph = json.loads(res.read().decode("utf-8"))
    print(f"\nRetrieved dependency graph: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges.")
