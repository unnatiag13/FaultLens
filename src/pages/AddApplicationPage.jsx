import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { applicationService } from '../services/applicationService';
import { MOCK_COMPOSE_TEMPLATE } from '../data/mockData';
import {
  UploadCloud,
  FileCode,
  Shield,
  CheckCircle2,
  Loader2,
  GitFork,
  ArrowRight,
  Server,
  Layers
} from 'lucide-react';

export function AddApplicationPage() {
  const navigate = useNavigate();
  const { refreshApplications, setSelectedAppId } = useApp();
  const { addToast } = useToast();

  const [name, setName] = useState('Payment Gateway Sandbox');
  const [description, setDescription] = useState('Distributed payment orchestration cluster with Postgres and worker replicas.');
  const [connectionType, setConnectionType] = useState('docker-compose');
  const [environment, setEnvironment] = useState('Testing');
  const [composeYaml, setComposeYaml] = useState(MOCK_COMPOSE_TEMPLATE);
  const [isolationEnabled, setIsolationEnabled] = useState(true);

  // Connection Workflow Progress State
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdApp, setCreatedApp] = useState(null);

  const stages = [
    { id: 1, label: 'Connecting to isolated runtime harness' },
    { id: 2, label: 'Reading and validating configuration YAML' },
    { id: 3, label: 'Discovering microservices & container ports' },
    { id: 4, label: 'Building inter-service dependency relationships' },
    { id: 5, label: 'Preparing application topology graph' },
  ];

  const discoveredServices = [
    'API Gateway (port: 8080)',
    'Auth Service (port: 8081)',
    'Order Service (port: 8082)',
    'Payment Service (port: 8083)',
    'Inventory Service (port: 8084)',
    'Database (port: 5432)',
  ];

  const discoveredDependencies = [
    'API Gateway → Auth Service',
    'API Gateway → Order Service',
    'Order Service → Payment Service',
    'Order Service → Inventory Service',
    'Payment Service → Database',
  ];

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsConnecting(true);
    setCurrentStep(1);

    // Simulate progressive connection stages
    const advanceStage = (step) =>
      new Promise((res) => {
        setTimeout(() => {
          setCurrentStep(step);
          res();
        }, 600);
      });

    await advanceStage(2);
    await advanceStage(3);
    await advanceStage(4);
    await advanceStage(5);

    try {
      const app = await applicationService.connectApplication({
        name,
        description,
        composeYaml,
        environment,
        isolation: isolationEnabled,
      });

      await refreshApplications();
      setSelectedAppId(app.id);
      setCreatedApp(app);
      setIsCompleted(true);
      addToast('Application Connected', `${app.name} registered into isolated sandbox.`, 'success');
    } catch (err) {
      addToast('Connection Failed', err.message, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Connect Your Application"
        subtitle="Add your application to FaultLens for service discovery, dependency analysis, and controlled resilience experiments."
        breadcrumbs={[
          { label: 'Applications', to: '/applications' },
          { label: 'Connect Application' }
        ]}
      />

      {/* STAGE 1: CONFIGURATION FORM (Shown before progress is completed) */}
      {!isCompleted && !isConnecting && (
        <form onSubmit={handleConnect} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Define the isolated boundary for resilience testing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Application Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. E-Commerce Platform"
                required
              />

              <Input
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of service tier and purpose"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Connection Type"
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  options={[
                    { value: 'docker-compose', label: 'Docker Compose (Primary MVP)' },
                    { value: 'endpoint', label: 'Application Endpoint (Test Harness)' },
                    { value: 'k8s', label: 'Configuration Import (Manifests)' },
                  ]}
                />

                <Select
                  label="Target Environment"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  options={[
                    { value: 'Development', label: 'Development Sandbox' },
                    { value: 'Testing', label: 'Testing / CI Sandbox' },
                    { value: 'Staging', label: 'Staging Replica' },
                  ]}
                />
              </div>

              {/* Compose upload / editor */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Upload or Paste docker-compose.yml
                </label>
                <div className="border border-dashed border-slate-700 rounded-lg p-4 bg-space-950/70 text-center mb-3">
                  <UploadCloud className="w-6 h-6 text-brand-cyan mx-auto mb-1.5" />
                  <p className="text-xs text-slate-300">
                    Drag and drop your compose file, or edit configuration below
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Supports compose versions 3.x with network aliases</p>
                </div>

                <Textarea
                  rows={8}
                  value={composeYaml}
                  onChange={(e) => setComposeYaml(e.target.value)}
                  placeholder="Paste docker-compose.yml here..."
                />
              </div>

              {/* Isolation Switch & Notice */}
              <div className="p-3.5 rounded-lg bg-space-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">Environment Isolation</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Mandatory: Enabled
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  FaultLens is designed to operate against isolated environments and should not directly modify production systems.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link to="/applications">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md" icon={ArrowRight}>
              Connect Application
            </Button>
          </div>
        </form>
      )}

      {/* STAGE 2: PROGRESS SIMULATION */}
      {isConnecting && (
        <Card className="p-8">
          <div className="text-center max-w-md mx-auto space-y-6">
            <div className="w-12 h-12 rounded-xl bg-space-950 border border-slate-700 flex items-center justify-center text-brand-cyan mx-auto shadow-inner">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Connecting Application...</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Executing automated topology scanner on {name}
              </p>
            </div>

            {/* Stages Tracker */}
            <div className="space-y-3 text-left font-mono text-xs">
              {stages.map((stage) => {
                const isPassed = currentStep > stage.id;
                const isCurrent = currentStep === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                      isPassed
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                        : isCurrent
                        ? 'bg-blue-950/40 border-blue-700/60 text-blue-200'
                        : 'bg-space-950/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>{stage.label}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* STAGE 3: APPLICATION CONNECTED SUCCESSFULLY & DISCOVERY REVIEW */}
      {isCompleted && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/80 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Application Connected Successfully</h3>
                <p className="text-xs text-emerald-300 font-mono">
                  Sandbox isolation verified. Topological analysis completed.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={GitFork}
              onClick={() => navigate(`/applications/${createdApp?.id || 'app-ecommerce'}/graph`)}
            >
              Review Dependency Graph →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services Discovered */}
            <Card>
              <CardHeader>
                <CardTitle>
  Services Discovered ({createdApp?.discoveredServices?.length ?? createdApp?.servicesCount ?? 0})
</CardTitle>
                <CardDescription>Identified processes with exposed ports and health endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-xs">
                  {(createdApp?.discoveredServices ?? []).map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-space-950 border border-slate-800 text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dependencies Discovered */}
            <Card>
              <CardHeader>
                <CardTitle>
  Dependencies Discovered ({createdApp?.discoveredDependencies?.length ?? createdApp?.dependenciesCount ?? 0})
</CardTitle>
                <CardDescription>Mapped communication edges and container link cascades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-xs">
                  {(createdApp?.discoveredDependencies ?? []).map((dep, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-space-950 border border-slate-800 text-brand-cyan">
                      <span className="text-slate-400">→</span>
                      <span>{dep}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
