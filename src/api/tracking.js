import { coreApi } from './client'
import { mapDeliveryResponse } from '../mappers/delivery'

// GET /api/v1/deliveries/by-code/{code} — public, no auth required
// (confirmed against core-api's routes/api/v1/deliveries.php).
export function getDeliveryByCode(code) {
  return coreApi
    .get(`/api/v1/deliveries/by-code/${encodeURIComponent(code)}`)
    .then((res) => mapDeliveryResponse(res.data))
}
