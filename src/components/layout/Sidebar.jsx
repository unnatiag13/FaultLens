import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  GitFork,
  Flame,
  Activity,
  Zap,
  HelpCircle,
  Sparkles,
  History,
  Settings,
  LogOut,
  User,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { user, logout } = useAuth();
  const { selectedApp } = useApp();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Applications', to: '/applications', icon: Layers },
    { label: 'Dependency Graph', to: `/applications/${selectedApp?.id || 'app-ecommerce'}/graph`, icon: GitFork },
    { label: 'Experiments', to: '/experiments', icon: Flame },
    { label: 'Monitoring', to: '/monitoring', icon: Activity },
    { label: 'Impact Analysis', to: '/analysis/impact', icon: Zap },
    { label: 'Root Cause', to: '/analysis/root-cause', icon: HelpCircle },
    { label: 'AI Remediation', to: '/remediation', icon: Sparkles },
    { label: 'History', to: '/history', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-space-900 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700/80 flex items-center justify-center text-brand-cyan shadow-inner">
              <GitFork className="w-4 h-4 text-cyan-400 rotate-90" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white">FAULT<span className="text-brand-cyan">LENS</span></span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">RESILIENCE MISSION CTRL</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
            Control Center
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-primary/15 text-white border border-brand-primary/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Isolation Environment Safety Indicator */}
        <div className="mx-3 mb-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/30 flex items-center gap-2.5 text-[11px] text-emerald-300">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-[11px] leading-tight text-emerald-200">Sandbox Isolation</p>
            <p className="text-[10px] text-emerald-400/80 truncate">Production Bypass Safe</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Platform Settings</span>
          </button>

          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-[10px] font-bold text-brand-cyan flex items-center justify-center">
              {user?.avatar || 'DEV'}
            </div>
            <div className="flex-1 text-left truncate">
              <p className="text-xs text-slate-200 font-medium truncate">{user?.name || 'Developer'}</p>
              <p className="text-[10px] text-slate-300 truncate">{user?.role || 'SRE Engineer'}</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="FaultLens Platform Settings"
        subtitle="Manage chaos test execution boundaries, FastAPI endpoints, and container runtimes."
        footer={
          <Button size="sm" onClick={() => setShowSettings(false)}>
            Done
          </Button>
        }
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3 bg-space-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-semibold text-slate-200">Execution Safety Policy</h4>
            <p className="text-slate-400">
              FaultLens automatically restricts fault injections to verified isolated environments (Docker Compose networks and designated test clusters). Production endpoints are blocked by default.
            </p>
          </div>

          <div className="p-3 bg-space-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-semibold text-slate-200">Backend API URL</h4>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-space-900 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-emerald-400">http://localhost:8000</span>
              <span className="text-slate-600">(FastAPI Gateway - Ready)</span>
            </div>
          </div>

          <div className="p-3 bg-space-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-semibold text-slate-200">AI Remediation Engine</h4>
            <p className="text-slate-400">
              Model: <span className="font-mono text-brand-ai font-medium">FaultLens-RCA-v2.4 (Strict Developer Review Mode)</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Autonomous production code deployment is permanently disabled.
            </p>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Developer Profile"
        subtitle="Active user credentials and engineering permissions."
        footer={
          <Button size="sm" variant="secondary" onClick={() => setShowProfile(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-space-950 rounded-lg border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/40 text-brand-cyan font-bold text-base flex items-center justify-center">
              {user?.avatar || 'DEV'}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{user?.name}</h4>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-brand-cyan font-mono border border-slate-700">
                  {user?.role}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Team: {user?.team}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
