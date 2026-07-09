// Runtime config placeholder for local dev. In Docker, the entrypoint
// regenerates this file from CORE_API_URL so the same built image can be
// deployed to different environments without a rebuild.
window.__APP_CONFIG__ = {
  CORE_API_URL: '',
  DRIVER_LOCATION_SERVICE_URL: '',
}
