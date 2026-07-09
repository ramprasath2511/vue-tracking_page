import { ref } from 'vue'
import { getDeliveryByCode } from '../api/tracking'
import { STATUS_POLL_INTERVAL_MS, TERMINAL_STATUSES } from '../constants/tracking'

export function useTracking() {
  const delivery = ref(null)
  const loading = ref(false)
  const error = ref(null)

  let pollTimer = null

  function isTerminal() {
    return TERMINAL_STATUSES.includes(delivery.value?.status)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function startPolling(code) {
    stopPolling()
    if (isTerminal()) return

    pollTimer = setInterval(async () => {
      try {
        delivery.value = await getDeliveryByCode(code)
        if (isTerminal()) stopPolling()
      } catch {
        // Transient poll failure — keep showing the last known-good delivery.
      }
    }, STATUS_POLL_INTERVAL_MS)
  }

  async function fetchByCode(code) {
    stopPolling()
    loading.value = true
    error.value = null
    delivery.value = null

    try {
      delivery.value = await getDeliveryByCode(code)
      startPolling(code)
    } catch (err) {
      error.value =
        err.response?.status === 404
          ? "We couldn't find a delivery with that tracking code."
          : 'Something went wrong while looking up your delivery. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return { delivery, loading, error, fetchByCode, stopPolling }
}
