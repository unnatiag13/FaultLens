import React from 'react';
import { Link } from 'react-router-dom';
import { Network, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-space-950/90 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-brand-cyan">
                <Network className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold tracking-tight text-white text-sm">FAULT<span className="text-brand-cyan">LENS</span></span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Graph-driven chaos and resilience testing platform with AI-assisted root-cause analysis and developer-reviewed remediation recommendations.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Isolated Environment Sandbox Protection Active</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-slate-200 transition-colors">Platform</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-slate-200 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-slate-200 transition-colors">Dependency Mapping</Link>
              </li>
              <li>
                <Link to="/experiments" className="hover:text-slate-200 transition-colors">Resilience Testing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Access</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-slate-200 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-slate-200 transition-colors">Create Account</Link>
              </li>
              <li>
                <a href="#docs" onClick={(e) => { e.preventDefault(); alert('FastAPI backend integration docs: Connect your FastAPI/Docker runtime in the Applications tab.'); }} className="hover:text-slate-200 transition-colors">
                  API & FastAPI Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FaultLens. Built for controlled resilience testing and developer-driven analysis.</p>
          <p className="font-mono text-slate-400">Strict Isolation Architecture • Non-destructive</p>
        </div>
      </div>
    </footer>
  );
}
