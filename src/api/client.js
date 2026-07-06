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
