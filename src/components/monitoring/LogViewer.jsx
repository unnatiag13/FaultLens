import React, { useState } from 'react';
import { Terminal, Copy, Check, Filter, Search, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function LogViewer({ logs = [], maxHeight = 'max-h-96' }) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.service.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCopy = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.service}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Logs Copied', 'All filtered log lines copied to clipboard', 'info', 2500);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-space-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs flex flex-col shadow-inner">
      {/* Terminal Header */}
      <div className="bg-space-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-brand-cyan" />
          <span className="font-semibold text-xs tracking-wider uppercase">Isolated Sandbox Container Logs</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Filters and search */}
        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <div className="flex items-center bg-space-950 rounded border border-slate-800 p-0.5 text-[11px]">
            {['ALL', 'ERROR', 'WARN', 'INFO'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filterLevel === level
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-6 pr-2 py-1 bg-space-950 rounded border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:border-brand-primary w-32 sm:w-44"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1 rounded bg-space-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Log lines container */}
      <div className={`p-4 overflow-y-auto space-y-1.5 ${maxHeight} text-[11px] leading-relaxed selection:bg-brand-primary/30`}>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 italic">
            No log entries match the current filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            let levelBadge = 'text-slate-400';
            if (log.level === 'ERROR') levelBadge = 'text-rose-400 bg-rose-950/70 border border-rose-800/60 px-1 rounded font-bold';
            else if (log.level === 'WARN') levelBadge = 'text-amber-400 bg-amber-950/70 border border-amber-800/60 px-1 rounded font-bold';
            else if (log.level === 'INFO') levelBadge = 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1 rounded';

            return (
              <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 p-1 rounded transition-colors group">
                <span className="text-slate-500 select-none shrink-0 font-mono text-[10px] pt-0.5">[{log.timestamp}]</span>
                <span className={`shrink-0 text-[10px] ${levelBadge}`}>{log.level}</span>
                <span className="text-slate-400 font-semibold shrink-0 group-hover:text-slate-200">
                  {log.service}:
                </span>
                <span className={`${log.level === 'ERROR' ? 'text-rose-200' : log.level === 'WARN' ? 'text-amber-200' : 'text-slate-300'} break-all`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
