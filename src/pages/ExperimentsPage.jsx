import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { experimentService } from '../services/experimentService';
import {
  Flame,
  PlusCircle,
  Clock,
  Radio,
  Zap,
  CheckCircle2,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

export function ExperimentsPage() {
  const { selectedApp } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);
  const [filterFault, setFilterFault] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadExperiments() {
      setLoading(true);
      try {
        const data = await experimentService.getExperiments();
        if (isMounted) setExperiments(data);
      } catch (e) {
        console.error('Failed to load experiments', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadExperiments();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExperiments = experiments.filter((exp) => {
    const matchesFault = filterFault === 'ALL' || exp.faultType === filterFault;
    const matchesSearch =
      !searchQuery ||
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.targetServiceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFault && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Retrieving chaos experiment registry..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Experiments"
        subtitle="Manage and launch controlled chaos experiments to observe failure propagation in isolated test sandbox environments."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'Experiments' }
        ]}
        actions={
          <Link to="/experiments/new">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              + New Experiment
            </Button>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-3 bg-panel border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search experiments by name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-space-950 rounded-lg border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">Fault Type:</span>
          {['ALL', 'Service Failure', 'High Latency', 'Database Failure'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterFault(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                filterFault === f
                  ? 'bg-slate-700 text-white font-medium'
                  : 'bg-space-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Experiments Table */}
      {filteredExperiments.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No experiments found"
          description="Create your first controlled fault experiment to evaluate distributed system resilience."
          actionLabel="Create Experiment"
          onAction={() => navigate('/experiments/new')}
        />
      ) : (
        <div className="bg-panel border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-space-900/60 border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3 px-4 font-semibold">Experiment</th>
                  <th className="py-3 px-4 font-semibold">Application</th>
                  <th className="py-3 px-4 font-semibold">Target Service</th>
                  <th className="py-3 px-4 font-semibold">Fault</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredExperiments.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => navigate(`/experiments/${exp.id}`)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-4 font-sans font-medium text-slate-200 group-hover:text-brand-cyan">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{exp.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-300">
                      {exp.applicationName}
                    </td>

                    <td className="py-4 px-4 text-slate-200 font-semibold">
                      {exp.targetServiceName}
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {exp.faultType}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`text-[11px] font-semibold ${
                        exp.severity === 'Critical' || exp.severity === 'High' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {exp.severity}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant={exp.status === 'Running' ? 'running' : 'completed'} size="sm">
                        {exp.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {exp.date}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="text-xs text-brand-cyan group-hover:underline inline-flex items-center gap-1 font-sans">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
