import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  Search,
  Bell,
  Check,
  AlertTriangle,
  Flame,
  PlusCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export function Topbar({ setMobileOpen }) {
  const { applications, selectedApp, setSelectedAppId } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 'n1',
      title: 'Payment Service Fault Active',
      desc: 'Process SIGTERM injected in isolated sandbox.',
      type: 'critical',
      time: '12m ago',
    },
    {
      id: 'n2',
      title: 'Order Service Degraded',
      desc: 'Cascade latency triggered 18.6% error rate.',
      type: 'warning',
      time: '10m ago',
    },
    {
      id: 'n3',
      title: 'Root Cause Confidence Calculated',
      desc: '94% correlation with payment-service process crash.',
      type: 'info',
      time: '4m ago',
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/applications/${selectedApp?.id || 'app-ecommerce'}/graph?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-space-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + Application Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Application Selector */}
        <div className="relative">
          <button
            onClick={() => setAppDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-panel border border-slate-700/80 hover:border-slate-600 text-left transition-colors text-xs"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Active Application</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{selectedApp?.name || 'Select Application'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Application Selector Dropdown */}
          {appDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setAppDropdownOpen(false)} />
              <div className="absolute left-0 mt-1.5 w-72 bg-space-900 border border-slate-700/90 rounded-xl shadow-2xl shadow-black z-40 p-1.5 animate-fade-in">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800/80">
                  Switch Target Application
                </div>
                <div className="py-1 space-y-0.5">
                  {applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setAppDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left ${
                        selectedApp?.id === app.id
                          ? 'bg-brand-primary/20 text-white font-medium border border-brand-primary/30'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-medium">{app.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{app.servicesCount} services • {app.environment.split(' ')[0]}</p>
                      </div>
                      {selectedApp?.id === app.id && <Check className="w-4 h-4 text-brand-cyan shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="pt-1.5 mt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setAppDropdownOpen(false);
                      navigate('/applications/new');
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-brand-cyan hover:bg-slate-800/70 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Connect New Application</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Quick Search */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search service, topology node, or experiment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-panel border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </form>
      </div>

      {/* Right side: Notifications + Fast Quick Action + User */}
      <div className="flex items-center gap-3">
        {/* Quick Launch Chaos Button */}
        <button
          onClick={() => navigate('/experiments/new')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-medium transition-colors"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>New Experiment</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {notifDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifDropdownOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-80 bg-space-900 border border-slate-700/80 rounded-xl shadow-2xl shadow-black z-40 p-2 animate-fade-in">
                <div className="px-2 py-1.5 flex items-center justify-between border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">Incident Signals</span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">3 Active</span>
                </div>
                <div className="py-1 space-y-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        navigate('/analysis/impact');
                      }}
                      className="p-2 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar display */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-brand-primary/20 border border-brand-primary/50 text-brand-cyan text-xs font-bold flex items-center justify-center">
            {user?.avatar || 'DEV'}
          </div>
          <span className="hidden xl:inline text-xs font-medium text-slate-300 truncate max-w-[100px]">
            {user?.name || 'Developer'}
          </span>
        </div>
      </div>
    </header>
  );
}
