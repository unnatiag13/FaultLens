import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CodeDiffViewer } from '../components/remediation/CodeDiffViewer';
import { ReviewActionModal } from '../components/remediation/ReviewActionModal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import { useToast } from '../context/ToastContext';
import { remediationService } from '../services/remediationService';
import {
  Sparkles,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  FileCode,
  Download,
  Copy,
  ExternalLink,
  RotateCcw,
  Check
} from 'lucide-react';

export function RemediationPage() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState('Approve');

  const loadRemediation = async () => {
    setLoading(true);
    try {
      const res = await remediationService.getRemediation('exp-101');
      setData(res);
    } catch (e) {
      console.error('Failed to load remediation', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemediation();
  }, []);

  const handleReviewSubmit = async ({ decision, notes, reviewerName }) => {
    try {
      const reviewRecord = await remediationService.submitDeveloperReview('exp-101', {
        decision,
        notes,
        reviewerName,
      });

      addToast(
        `Review Recorded: ${decision}`,
        `Decision logged by ${reviewerName}. Status updated to "${reviewRecord.status}".`,
        decision === 'Approve' ? 'success' : decision === 'Reject' ? 'error' : 'info'
      );

      await loadRemediation();
    } catch (e) {
      addToast('Error', e.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Synthesizing architectural recommendation and generating code diff..." size="lg" />
      </div>
    );
  }

  const isApproved = data?.reviewStatus?.includes('Approved');
  const isRejected = data?.reviewStatus?.includes('Rejected');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="AI Remediation & Patch Review"
        subtitle="AI-assisted architectural resilience recommendations and suggested code diffs for human developer evaluation."
        breadcrumbs={[
          { label: 'Platform', to: '/dashboard' },
          { label: 'Remediation' }
        ]}
        badge={
          <Badge variant="ai" size="sm">
            AI Remediation Model v2.4
          </Badge>
        }
        actions={
          <Button
            variant={isApproved ? 'secondary' : 'primary'}
            size="sm"
            icon={UserCheck}
            onClick={() => {
              setReviewDecision('Approve');
              setShowReviewModal(true);
            }}
          >
            {data?.reviewStatus === 'Pending Developer Review' ? 'Submit Developer Review' : 'Update Review'}
          </Button>
        }
      />

      {/* MANDATORY DEVELOPER REVIEW REQUIRED SAFETY BANNER */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/70 shadow-lg shadow-amber-950/20 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-100 text-sm">Developer Review Required</h4>
            <p className="text-amber-300/90 mt-0.5 leading-relaxed">
              FaultLens provides recommendations and suggested patches for developer review. It does not autonomously modify production systems or commit to repositories.
            </p>
          </div>
        </div>

        <div className="shrink-0 font-mono text-[11px] bg-space-950 px-3 py-1.5 rounded-lg border border-amber-800/80 text-amber-300">
          Status: {data?.reviewStatus}
        </div>
      </div>

      {/* RECOMMENDATION DETAILS CARD */}
      <div className="bg-panel border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Root Cause Reference</span>
            <h3 className="text-base font-bold text-white mt-0.5">{data?.rootCause}</h3>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="critical" size="sm">Priority: HIGH</Badge>
            <Badge variant="ai" size="sm">Confidence: High</Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-300 font-mono">Recommended Action:</span>
          <p className="text-sm font-medium text-white leading-relaxed bg-space-950 p-3.5 rounded-xl border border-slate-800">
            {data?.recommendedAction}
          </p>
        </div>

        <div className="space-y-1 text-xs text-slate-400 leading-relaxed font-mono">
          <span className="text-slate-300 block font-semibold text-[11px]">Architectural Rationale:</span>
          <p>{data?.rationale}</p>
        </div>
      </div>

      {/* SUGGESTED CODE PATCH DIFF VIEWER */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-brand-ai" />
              <span>Suggested Code Patch</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target File: <span className="font-mono text-slate-300">{data?.suggestedPatch?.targetFile}</span>
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Human-in-the-Loop Enforced
          </span>
        </div>

        {/* Code Diff Panel */}
        <CodeDiffViewer
          targetFile={data?.suggestedPatch?.targetFile}
          beforeCode={data?.suggestedPatch?.beforeCode}
          afterCode={data?.suggestedPatch?.afterCode}
          language={data?.suggestedPatch?.language}
        />
      </div>

      {/* DEVELOPER REVIEW STATUS & SIGN-OFF ACTIONS */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Developer Review Sign-Off</CardTitle>
              <CardDescription>
                Formal human verification record for auditing compliance
              </CardDescription>
            </div>
            <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
              isApproved
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : isRejected
                ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                : 'bg-amber-950/80 text-amber-300 border-amber-700'
            }`}>
              {data?.reviewStatus}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {data?.reviewDetails ? (
            <div className="p-4 bg-space-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Reviewer: <strong className="text-white">{data.reviewDetails.reviewer}</strong></span>
                <span>Timestamp: <span className="text-slate-500">{new Date(data.reviewDetails.reviewedAt).toLocaleString()}</span></span>
              </div>
              {data.reviewDetails.notes && (
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">Reviewer Notes:</span>
                  <p>{data.reviewDetails.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-slate-400 space-y-3">
              <p>No formal sign-off recorded yet for this suggested patch.</p>
              <Button
                variant="primary"
                size="sm"
                icon={UserCheck}
                onClick={() => setShowReviewModal(true)}
              >
                Perform Developer Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <ReviewActionModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        initialDecision={reviewDecision}
      />
    </div>
  );
}
