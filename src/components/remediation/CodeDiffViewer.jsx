import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink, ShieldAlert } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

export function CodeDiffViewer({
  targetFile = 'services/order/payment_client.py',
  beforeCode,
  afterCode,
  language = 'python',
}) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'unified'
  const { addToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(afterCode);
    setCopied(true);
    addToast('Patch Copied', 'Suggested patch copied to clipboard for IDE review', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const patchContent = `--- a/${targetFile}\n+++ b/${targetFile}\n@@ -1,10 +1,28 @@\n${afterCode}`;
    const blob = new Blob([patchContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `faultlens-remediation-${Date.now()}.patch`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Patch Downloaded', 'Git patch file downloaded for local review', 'success');
  };

  return (
    <div className="bg-space-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* Top File Bar */}
      <div className="bg-space-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <FileCode className="w-4 h-4 text-brand-ai" />
          <span className="font-semibold text-xs text-slate-200">{targetFile}</span>
          <span className="text-[10px] text-slate-400 bg-space-950 px-2 py-0.5 rounded border border-slate-800">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-space-950 rounded border border-slate-800 p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'split' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'unified' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unified Diff
            </button>
          </div>

          <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy Patch'}
          </Button>

          <Button variant="secondary" size="sm" icon={Download} onClick={handleDownload}>
            Download .patch
          </Button>
        </div>
      </div>

      {/* Code Display Area */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 text-[11px] leading-relaxed">
          {/* Before Column */}
          <div className="p-4 bg-rose-950/10">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-900/30 text-rose-400 font-semibold text-[10px] uppercase tracking-wider">
              <span>Original (Unprotected Synchronous Call)</span>
              <span className="text-rose-500 font-bold">- Original</span>
            </div>
            <pre className="text-rose-200/90 whitespace-pre-wrap font-mono overflow-x-auto">
              {beforeCode}
            </pre>
          </div>

          {/* After Column */}
          <div className="p-4 bg-emerald-950/15">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-900/30 text-emerald-400 font-semibold text-[10px] uppercase tracking-wider">
              <span>Suggested Patch (Circuit Breaker & Exponential Backoff)</span>
              <span className="text-emerald-400 font-bold">+ Proposed Patch</span>
            </div>
            <pre className="text-emerald-200 whitespace-pre-wrap font-mono overflow-x-auto">
              {afterCode}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-space-950 text-[11px] leading-relaxed overflow-x-auto">
          <div className="text-slate-500 pb-2 mb-2 border-b border-slate-800">
            @@ -1,10 +1,28 @@ Suggested Patch for Developer Review
          </div>
          <div className="space-y-0.5 font-mono">
            {beforeCode.split('\n').map((line, i) => (
              <div key={`rem-${i}`} className="bg-rose-950/30 text-rose-300 px-2 py-0.5 rounded">
                - {line}
              </div>
            ))}
            {afterCode.split('\n').map((line, i) => (
              <div key={`add-${i}`} className="bg-emerald-950/30 text-emerald-300 px-2 py-0.5 rounded">
                + {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="bg-space-900/90 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Non-autonomous safeguard: FaultLens will never push code to VCS or deploy to production without manual engineer review.</span>
        </div>
      </div>
    </div>
  );
}
