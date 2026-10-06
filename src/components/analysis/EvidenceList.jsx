import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export function EvidenceList({ evidence = [] }) {
  return (
    <div className="space-y-3">
      {evidence.map((item, idx) => (
        <div
          key={item.id || idx}
          className="p-3.5 rounded-lg bg-space-950/70 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-semibold text-slate-100">{item.title}</h5>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-mono text-[11px]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
