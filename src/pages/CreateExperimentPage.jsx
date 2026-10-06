import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { experimentService } from '../services/experimentService';
import { applicationService } from '../services/applicationService';
import {
  Flame,
  AlertTriangle,
  Radio,
  Clock,
  Shield,
  Layers,
  CheckCircle2,
  ArrowRight,
  Server
} from 'lucide-react';

export function CreateExperimentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applications, selectedApp } = useApp();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const initialTargetService = queryParams.get('targetService') || 'payment-service';
  const initialFault = queryParams.get('fault') || 'Service Failure';

  const [applicationId, setApplicationId] = useState(selectedApp?.id || 'app-ecommerce');
  const [targetServiceId, setTargetServiceId] = useState(initialTargetService);
  const [faultType, setFaultType] = useState(initialFault);
  const [duration, setDuration] = useState('60');
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('Simulate a payment service outage in the staging sandbox to observe checkout failure cascades.');
  const [services, setServices] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadAppServices() {
      try {
        const srvs = await applicationService.getServices(applicationId);
        setServices(srvs);
        if (srvs.length > 0 && !srvs.find((s) => s.id === targetServiceId)) {
          setTargetServiceId(srvs[0].id);
        }
      } catch (e) {
        console.error('Failed to load services', e);
      }
    }
    loadAppServices();
  }, [applicationId]);

  const selectedTargetService = services.find((s) => s.id === targetServiceId);
  const selectedAppObj = applications.find((a) => a.id === applicationId) || selectedApp;

  const handleReview = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleExecuteExperiment = async () => {
    setIsSubmitting(true);
    try {
      const newExp = await experimentService.createExperiment({
        name: `${selectedTargetService?.name || 'Payment Service'} ${faultType} Simulation`,
        applicationId,
        applicationName: selectedAppObj?.name || 'E-Commerce Platform',
        targetServiceId,
        targetServiceName: selectedTargetService?.name || 'Payment Service',
        faultType,
        severity,
        duration,
        description,
      });

      addToast('Experiment Injected', `Chaos injection running on ${newExp.targetServiceName}`, 'success');
      setShowConfirmModal(false);
      navigate(`/experiments/${newExp.id}`);
    } catch (err) {
      addToast('Execution Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Create Controlled Experiment"
        subtitle="Configure an isolated resilience test to evaluate failure cascades, circuit-breaker fallbacks, and recovery behavior."
        breadcrumbs={[
          { label: 'Experiments', to: '/experiments' },
          { label: 'New Experiment' }
        ]}
      />

      <form onSubmit={handleReview} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Experiment Scope & Target</CardTitle>
            <CardDescription>
              Select the application boundary and target microservice container.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Application */}
            <Select
              label="Application"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              options={applications.map((a) => ({ value: a.id, label: a.name }))}
            />

            {/* Target Service */}
            <Select
              label="Target Service"
              value={targetServiceId}
              onChange={(e) => setTargetServiceId(e.target.value)}
              options={services.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.type} • Port ${s.port})`
              }))}
            />

            {/* Fault Type */}
            <Select
              label="Fault Type"
              value={faultType}
              onChange={(e) => setFaultType(e.target.value)}
              options={[
                { value: 'Service Failure', label: 'Service Failure (SIGTERM Process Termination)' },
                { value: 'High Latency', label: 'High Latency (1500ms Synthetic TCP Delay)' },
                { value: 'HTTP/API Failure', label: 'HTTP/API Failure (503 Service Unavailable Intermittent)' },
                { value: 'Database Failure', label: 'Database Failure (Connection Pool Saturation)' },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <Select
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                options={[
                  { value: '30', label: '30 seconds' },
                  { value: '60', label: '60 seconds (Standard)' },
                  { value: '90', label: '90 seconds' },
                  { value: '120', label: '120 seconds' },
                ]}
              />

              {/* Severity */}
              <Select
                label="Severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                options={[
                  { value: 'Low', label: 'Low (Mild perturbation)' },
                  { value: 'Medium', label: 'Medium (Intermittent degradation)' },
                  { value: 'High', label: 'High (Total process outage)' },
                  { value: 'Critical', label: 'Critical (Multi-node cascade)' },
                ]}
              />
            </div>

            {/* Description */}
            <Textarea
              label="Description & Hypothesis"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Verify that Order Service falls back to async dead-letter queue without dropping checkout transactions."
            />

            {/* Isolation Guard Banner */}
            <div className="p-3.5 rounded-lg bg-space-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Sandbox Boundary Verification</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Experiments should run only in the configured isolated environment. FaultLens automatically confirms Docker container sandbox markers before transmitting fault signals.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link to="/experiments">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="md" icon={ArrowRight}>
            Review Experiment
          </Button>
        </div>
      </form>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Chaos Experiment Execution"
        subtitle="Review parameters before initiating synthetic failure injection."
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Flame}
              onClick={handleExecuteExperiment}
              isLoading={isSubmitting}
            >
              Run Experiment
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs font-mono">
          <p className="text-slate-300 font-sans text-xs">
            You are about to run:
          </p>

          <div className="p-3.5 rounded-lg bg-space-950 border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Application:</span>
              <span className="text-white font-semibold">{selectedAppObj?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Service:</span>
              <span className="text-rose-400 font-semibold">{selectedTargetService?.name || 'Payment Service'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fault Type:</span>
              <span className="text-slate-200">{faultType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="text-slate-200">{duration} seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Severity:</span>
              <span className="text-rose-400 font-bold">{severity}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              <strong>Warning:</strong> This experiment will intentionally introduce a controlled failure in the configured environment.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
