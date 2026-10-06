import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, Flame, ShieldCheck } from 'lucide-react';

export function IncidentTimeline({ timeline = [] }) {
  return (
    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {timeline.map((item, idx) => {
        let dotColor = 'bg-slate-500 ring-slate-800';
        let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';

        if (item.type === 'critical') {
          dotColor = 'bg-rose-500 ring-rose-950';
          badgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-800/80';
        } else if (item.type === 'warning') {
          dotColor = 'bg-amber-500 ring-amber-950';
          badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-800/80';
        } else if (item.type === 'system') {
          dotColor = 'bg-cyan-500 ring-cyan-950';
          badgeStyle = 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';
        }

        return (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full ring-4 ${dotColor} transition-transform group-hover:scale-125`}
            />

            {/* Content Card */}
            <div className="bg-space-950/80 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-200">{item.time}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase ${badgeStyle}`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              <h5 className="text-xs font-medium text-slate-100">{item.event}</h5>
              {item.detail && (
                <p className="text-[11px] text-slate-400 mt-1 font-mono leading-relaxed">
                  {item.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
