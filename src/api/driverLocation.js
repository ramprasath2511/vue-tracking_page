import { locationServiceApi } from './client'

// POST /api/auth/recipient — public, no auth required beyond the tracking
// code itself (driver-location-service resolves it via core-api to confirm
// a valid delivery/driver before minting a token).
export function authRecipient(code) {
  return locationServiceApi
    .post('/api/auth/recipient', { code })
    .then((res) => res.data.data) // { location_auth_token, expires }
}
