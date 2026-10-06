import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useToast } from '../context/ToastContext';
import { experimentService } from '../services/experimentService';
import {
  Flame,
  Radio,
  Clock,
  StopCircle,
  Zap,
  HelpCircle,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield
} from 'lucide-react';

export function ExperimentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [elapsed, setElapsed] = useState(24);
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadExp() {
      setLoading(true);
      try {
        const [exp, tl] = await Promise.all([
          experimentService.getExperimentById(id),
          experimentService.getTimeline(id),
        ]);
        if (isMounted) {
          setExperiment(exp);
          setTimeline(tl);
          setDuration(exp.duration || 60);
          const running = exp.status === 'Running';
          setIsRunning(running);
          if (running) {
            setElapsed(1);
          } else {
            setElapsed(exp.duration || 60);
          }
        }
      } catch (e) {
        console.error('Failed to load experiment details', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadExp();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Live timer interval if experiment is running
  useEffect(() => {
    let interval = null;
    if (isRunning && elapsed < duration) {
      interval = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= duration) {
            setIsRunning(false);
            addToast('Experiment Completed', 'Controlled fault window ended. Aggregating root-cause signals.', 'info');
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, elapsed, duration, addToast]);

  const handleStop = async () => {
    try {
      await experimentService.stopExperiment(id);
      setIsRunning(false);
      addToast('Experiment Aborted', 'Immediate SIGCONT / sandbox process restoration completed.', 'warning');
      if (experiment) {
        setExperiment((prev) => ({ ...prev, status: 'Completed', result: 'Manually Restored' }));
      }
    } catch (e) {
      addToast('Error', e.message, 'error');
    }
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remaining = Math.max(0, duration - elapsed);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Reading telemetry stream from isolated runner..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title={experiment?.name || 'Controlled Resilience Test'}
        subtitle={`Target service: ${experiment?.targetServiceName} (${experiment?.faultType}) in isolated sandbox environment.`}
        breadcrumbs={[
          { label: 'Experiments', to: '/experiments' },
          { label: experiment?.name || 'Experiment Details' }
        ]}
        badge={
          <Badge variant={isRunning ? 'running' : 'completed'} size="sm">
            {isRunning ? '● RUNNING IN SANDBOX' : 'COMPLETED'}
          </Badge>
        }
        actions={
          isRunning ? (
            <Button variant="danger" size="sm" icon={StopCircle} onClick={handleStop}>
              Stop Experiment
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/analysis/impact">
                <Button variant="secondary" size="sm" icon={Zap}>
                  Impact Analysis
                </Button>
              </Link>
              <Link to="/analysis/root-cause">
                <Button variant="primary" size="sm" icon={HelpCircle}>
                  Root Cause (94%)
                </Button>
              </Link>
            </div>
          )
        }
      />

      {/* COUNTDOWN & TELEMETRY PROGRESS PANEL (when running or completed) */}
      <div className="bg-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {/* Target */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Target Microservice</span>
            <p className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>{experiment?.targetServiceName || 'Payment Service'}</span>
            </p>
            <span className="text-xs text-rose-400 font-mono">{experiment?.faultType}</span>
          </div>

          {/* Elapsed */}
          <div className="space-y-1 pt-4 sm:pt-0">
            <span className="text-[10px] uppercase font-mono text-slate-400">Elapsed Injection Time</span>
            <p className="text-3xl font-extrabold font-mono text-cyan-400">
              {formatSeconds(elapsed)}
            </p>
            <span className="text-[11px] text-slate-500 font-mono">Window: {duration}s Total</span>
          </div>

          {/* Remaining */}
          <div className="space-y-1 pt-4 sm:pt-0">
            <span className="text-[10px] uppercase font-mono text-slate-400">Remaining Teardown Window</span>
            <p className={`text-3xl font-extrabold font-mono ${remaining === 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
              {formatSeconds(remaining)}
            </p>
            <span className="text-[11px] text-slate-500 font-mono">
              {remaining === 0 ? 'Teardown Completed' : 'Auto Sandbox Reset'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-space-950 mt-6 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              remaining === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-rose-500'
            }`}
            style={{ width: `${(elapsed / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* LIVE EVENT LOG & TELEMETRY TIMELINE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Signal Timeline</CardTitle>
              <CardDescription>Chronological sequence of fault injection events and downstream telemetry</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Streaming Telemetry</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full ring-4 ${
                  step.type === 'critical' ? 'bg-rose-500 ring-rose-950' : step.type === 'warning' ? 'bg-amber-500 ring-amber-950' : 'bg-cyan-500 ring-cyan-950'
                }`} />
                <div className="p-3 bg-space-950 rounded-lg border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[11px] font-semibold text-slate-300">{step.time}</span>
                      <span className="font-semibold text-white">{step.event}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{step.detail}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase shrink-0 ${
                    step.type === 'critical' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {step.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* POST-EXPERIMENT ACTION BAR */}
      {!isRunning && (
        <div className="p-5 rounded-xl bg-space-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Resilience Report Ready</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified 1 Probable Root Cause with 94% confidence score. AI remediation patch prepared for developer review.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/analysis/impact">
              <Button variant="secondary" size="sm" icon={Zap}>
                View Impact Blast Radius
              </Button>
            </Link>
            <Link to="/remediation">
              <Button variant="primary" size="sm" icon={Sparkles}>
                Review AI Remediation →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
