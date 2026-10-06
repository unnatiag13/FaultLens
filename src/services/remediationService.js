import { MOCK_REMEDIATION } from '../data/mockData';

const REVIEW_STORAGE_KEY = 'faultlens_remediation_reviews';

function getStoredReviews() {
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {};
}

export const remediationService = {
  async getRemediation(experimentId = 'exp-101') {
    // FastAPI: GET /api/remediation/:experimentId
    await new Promise((r) => setTimeout(r, 200));
    const reviews = getStoredReviews();
    const reviewData = reviews[experimentId];

    return {
      ...MOCK_REMEDIATION,
      reviewStatus: reviewData ? reviewData.status : 'Pending Developer Review',
      reviewDetails: reviewData || null,
    };
  },

  async submitDeveloperReview(experimentId, { decision, notes, reviewerName }) {
    // FastAPI: POST /api/remediation/:experimentId/review
    await new Promise((r) => setTimeout(r, 300));
    const reviews = getStoredReviews();
    const record = {
      decision, // 'Approved' | 'Modified' | 'Rejected'
      status: decision === 'Approved' ? 'Approved for Staging Deployment' : decision === 'Modified' ? 'Revision Requested' : 'Rejected by Developer',
      notes: notes || '',
      reviewer: reviewerName || 'Alex Rivera (SRE)',
      reviewedAt: new Date().toISOString(),
    };
    reviews[experimentId] = record;
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
    return record;
  }
};
