import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { GitFork, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-bg">
      <div className="w-16 h-16 rounded-2xl bg-space-900 border border-slate-800 flex items-center justify-center text-brand-cyan mb-6 shadow-2xl">
        <GitFork className="w-8 h-8 rotate-90" />
      </div>

      <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="text-lg font-semibold text-slate-300 mt-2">Node / Route Not Discovered</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 font-mono">
        The requested URL was not found in the FaultLens route table or dependency mesh.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="md" icon={ArrowLeft}>
            Home Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
