import axios from 'axios'

// Runtime config (Docker, injected via public/config.js) wins over the
// build-time Vite env var (local dev), since a static build must be able to
// point at different Core API environments without rebuilding.
const baseURL = window.__APP_CONFIG__?.CORE_API_URL || import.meta.env.VITE_CORE_API_URL || ''

export const coreApi = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
})

// driver-location-service — only used to mint a short-lived live-tracking
// auth token (see src/api/driverLocation.js); the WebSocket itself is a
// plain connection derived from this same base URL.
const locationServiceBaseURL =
  window.__APP_CONFIG__?.DRIVER_LOCATION_SERVICE_URL ||
  import.meta.env.VITE_DRIVER_LOCATION_SERVICE_URL ||
  ''

export const locationServiceApi = axios.create({
  baseURL: locationServiceBaseURL,
  headers: {
    Accept: 'application/json',
  },
})
