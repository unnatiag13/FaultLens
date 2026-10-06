import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { experimentService } from '../services/experimentService';
import { applicationService } from '../services/applicationService';
import {
  History,
  Search,
  Filter,
  Flame,
  ChevronRight,
  RotateCcw,
  Download,
  Calendar,
  Layers
} from 'lucide-react';

export function HistoryPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);
  const [applications, setApplications] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('ALL');
  const [faultFilter, setFaultFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [exps, apps] = await Promise.all([
          experimentService.getExperiments(),
          applicationService.getApplications(),
        ]);
        if (isMounted) {
          setExperiments(exps);
          setApplications(apps);
        }
      } catch (e) {
        console.error('Failed to load history', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      !search ||
      exp.name.toLowerCase().includes(search.toLowerCase()) ||
      exp.targetServiceName.toLowerCase().includes(search.toLowerCase());
    const matchesApp = appFilter === 'ALL' || exp.applicationId === appFilter;
    const matchesFault = faultFilter === 'ALL' || exp.faultType === faultFilter;
    const matchesSeverity = severityFilter === 'ALL' || exp.severity === severityFilter;

    return matchesSearch && matchesApp && matchesFault && matchesSeverity;
  });

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Querying archived resilience testing logs and telemetry..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Experiment History"
        subtitle="Complete audit trail of chaos resilience tests, telemetry blast-radius outcomes, and root-cause conclusions."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'History' }
        ]}
      />

      {/* FILTER BAR */}
      <div className="p-4 bg-panel border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search experiments by name, target service, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-space-950 rounded-lg border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <button
            onClick={() => {
              setSearch('');
              setAppFilter('ALL');
              setFaultFilter('ALL');
              setSeverityFilter('ALL');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-space-950 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block mb-1">Application:</span>
            <select
              value={appFilter}
              onChange={(e) => setAppFilter(e.target.value)}
              className="w-full bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
            >
              <option value="ALL">All Applications</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block mb-1">Fault Type:</span>
            <select
              value={faultFilter}
              onChange={(e) => setFaultFilter(e.target.value)}
              className="w-full bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
            >
              <option value="ALL">All Fault Types</option>
              <option value="Service Failure">Service Failure</option>
              <option value="High Latency">High Latency</option>
              <option value="HTTP/API Failure">HTTP/API Failure</option>
              <option value="Database Failure">Database Failure</option>
            </select>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block mb-1">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* EXPERIMENTS HISTORY TABLE */}
      {filteredExperiments.length === 0 ? (
        <EmptyState
          icon={History}
          title="No experiment history matches filter"
          description="Try broadening your search query or reset your filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setAppFilter('ALL');
            setFaultFilter('ALL');
            setSeverityFilter('ALL');
          }}
        />
      ) : (
        <div className="bg-panel border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-space-900/60 border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3 px-4 font-semibold">Experiment</th>
                  <th className="py-3 px-4 font-semibold">Application</th>
                  <th className="py-3 px-4 font-semibold">Service</th>
                  <th className="py-3 px-4 font-semibold">Fault</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Result</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Report</th>
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
                      <span className={`text-[11px] font-bold ${
                        exp.result.includes('Impact') ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {exp.result}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {exp.date}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="text-xs text-brand-cyan group-hover:underline inline-flex items-center gap-1 font-sans font-medium">
                        View <ChevronRight className="w-3 h-3" />
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
