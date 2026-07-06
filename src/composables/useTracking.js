import { ref } from 'vue'
import { getDeliveryByCode } from '../api/tracking'

export function useTracking() {
  const delivery = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchByCode(code) {
    loading.value = true
    error.value = null
    delivery.value = null

    try {
      delivery.value = await getDeliveryByCode(code)
    } catch (err) {
      error.value =
        err.response?.status === 404
          ? "We couldn't find a delivery with that tracking code."
          : 'Something went wrong while looking up your delivery. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return { delivery, loading, error, fetchByCode }
}
