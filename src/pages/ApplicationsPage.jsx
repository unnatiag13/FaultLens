import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useApp } from '../context/AppContext';
import { applicationService } from '../services/applicationService';
import {
  PlusCircle,
  Layers,
  ArrowRight,
  GitFork,
  Flame,
  Shield,
  Clock,
  ExternalLink
} from 'lucide-react';

export function ApplicationsPage() {
  const { applications, setSelectedAppId, refreshApplications } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Manage connected distributed systems, inspect service inventories, and launch isolated resilience testing sessions."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'Applications' }
        ]}
        actions={
          <Link to="/applications/new">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              + Add Application
            </Button>
          </Link>
        }
      />

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-xl bg-space-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            FaultLens establishes strict network isolation per application. Fault simulations are prevented from escaping designated Docker bridges.
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Isolation Enforced</span>
      </div>

      {/* Applications Table */}
      <div className="bg-panel border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-space-900/60 border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-semibold">Application</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Services</th>
                <th className="py-3 px-4 font-semibold">Last Experiment</th>
                <th className="py-3 px-4 font-semibold">Last Updated</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-900/50 transition-colors group"
                >
                  {/* Name and Environment */}
                  <td className="py-4 px-4 font-sans">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700/80 flex items-center justify-center text-brand-cyan shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-brand-cyan transition-colors truncate">
                          {app.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{app.environment}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <Badge variant={app.statusType || 'healthy'} size="sm">
                      {app.status}
                    </Badge>
                  </td>

                  {/* Services & Topology */}
                  <td className="py-4 px-4 text-slate-300">
                    <span className="font-semibold">{app.servicesCount}</span> services
                    <span className="text-slate-500 block text-[10px]">{app.dependenciesCount} dependencies</span>
                  </td>

                  {/* Last Experiment */}
                  <td className="py-4 px-4 text-slate-300">
                    {app.lastExperiment ? (
                      <div>
                        <span className="font-sans font-medium text-slate-200 block truncate max-w-[180px]">
                          {app.lastExperiment.name}
                        </span>
                        <span className="text-slate-500 text-[10px] block">{app.lastExperiment.time}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">None yet</span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="py-4 px-4 text-slate-400 text-[11px]">
                    {app.lastUpdated}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedAppId(app.id);
                          navigate(`/applications/${app.id}/graph`);
                        }}
                        className="p-1.5 rounded-lg bg-space-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="View Dependency Graph"
                      >
                        <GitFork className="w-3.5 h-3.5 rotate-90" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAppId(app.id);
                          navigate(`/applications/${app.id}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium transition-colors"
                      >
                        Open
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
