import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-space-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-brand-cyan group-hover:border-brand-primary transition-colors shadow-inner">
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-base text-white">FAULT<span className="text-brand-cyan">LENS</span></span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Platform</span>
          </div>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Platform
          </Link>
          <Link
            to="/how-it-works"
            className={`transition-colors ${
              location.pathname === '/how-it-works'
                ? 'text-brand-cyan font-medium'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            How It Works
          </Link>
          <a
            href="#architecture"
            onClick={(e) => {
              if (location.pathname !== '/') return;
              e.preventDefault();
              document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-300 hover:text-white transition-colors"
          >
            Architecture
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
