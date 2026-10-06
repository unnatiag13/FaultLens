import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { CheckCircle2, Edit3, XCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ReviewActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialDecision = 'Approve',
}) {
  const { user } = useAuth();
  const [decision, setDecision] = useState(initialDecision);
  const [notes, setNotes] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || 'Alex Rivera (SRE)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ decision, notes, reviewerName });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Developer Review Sign-Off"
      subtitle="FaultLens enforces human-in-the-loop validation for all AI remediation proposals."
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={decision === 'Approve' ? 'primary' : decision === 'Reject' ? 'danger' : 'secondary'}
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit Review Decision
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Decision Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Review Outcome
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDecision('Approve')}
              className={`p-3 rounded-lg border text-center transition-all ${
                decision === 'Approve'
                  ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300 font-semibold shadow-sm'
                  : 'border-slate-800 bg-space-950 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <span className="text-xs block">Approve</span>
              <span className="text-[10px] text-slate-500 font-mono">Stage testing</span>
            </button>

            <button
              type="button"
              onClick={() => setDecision('Modify')}
              className={`p-3 rounded-lg border text-center transition-all ${
                decision === 'Modify'
                  ? 'border-amber-600 bg-amber-950/40 text-amber-300 font-semibold shadow-sm'
                  : 'border-slate-800 bg-space-950 text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <span className="text-xs block">Modify</span>
              <span className="text-[10px] text-slate-500 font-mono">Request changes</span>
            </button>

            <button
              type="button"
              onClick={() => setDecision('Reject')}
              className={`p-3 rounded-lg border text-center transition-all ${
                decision === 'Reject'
                  ? 'border-rose-600 bg-rose-950/40 text-rose-300 font-semibold shadow-sm'
                  : 'border-slate-800 bg-space-950 text-slate-400 hover:text-white'
              }`}
            >
              <XCircle className="w-4 h-4 mx-auto mb-1 text-rose-400" />
              <span className="text-xs block">Reject</span>
              <span className="text-[10px] text-slate-500 font-mono">Dismiss patch</span>
            </button>
          </div>
        </div>

        {/* Reviewer Name */}
        <Input
          label="Reviewing Engineer"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="e.g. Alex Rivera (SRE)"
          required
        />

        {/* Review Notes */}
        <Textarea
          label="Reviewer Notes & Justification"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Verified circuit breaker parameters with architecture guidelines. Exponential backoff capped at 2.0s matches our SLA."
        />

        <div className="p-3 bg-space-950 rounded-lg border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Approving this patch designates it for sandbox integration branch PR creation. FaultLens will not autonomously apply modifications to production repositories.
          </p>
        </div>
      </form>
    </Modal>
  );
}
