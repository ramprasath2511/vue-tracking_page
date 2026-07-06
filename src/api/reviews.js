import { coreApi } from './client'

// POST /api/v1/order-reviews — public, no auth required when submitting by
// tracking code (confirmed against core-api's OrderReviewController@store).
export function submitDriverReview(code, { rating, message }) {
  return coreApi
    .post('/api/v1/order-reviews', { code, rating, message: message || undefined })
    .then((res) => res.data)
}
