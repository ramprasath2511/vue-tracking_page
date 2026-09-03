<script setup>
import { ref } from 'vue'
import { formatDate, formatTime } from '../../utils/format'

const props = defineProps({
  proofOfDelivery: {
    type: Object,
    default: null,
  },
  deliveredAt: {
    type: String,
    default: null,
  },
  timeZone: {
    type: String,
    default: undefined,
  },
})

const photoFailed = ref(false)
const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function staticMapUrl(location) {
  if (!mapsApiKey || !location) return null
  const center = `${location.lat},${location.lng}`
  return `https://maps.googleapis.com/maps/api/staticmap?key=${mapsApiKey}&size=400x250&zoom=16&center=${center}&markers=color:blue|${center}`
}
</script>

<template>
  <div class="pod-card bg-white-van p-4 p-md-5">
    <h5 class="section-heading pb-2 mb-4">
      <i class="fas fa-check-circle text-completed me-2"></i>Proof of delivery
    </h5>

    <div v-if="deliveredAt" class="pod-timestamp mb-4">
      <i class="fas fa-calendar-check me-2"></i>
      Delivered on {{ formatDate(deliveredAt, timeZone) }} at {{ formatTime(deliveredAt, timeZone) }}
    </div>

    <div class="row g-4">
      <div v-if="proofOfDelivery?.photoUrl && !photoFailed" class="col-12 col-md-6">
        <p class="pod-label mb-2"><strong>Delivery photo</strong></p>
        <img
          :src="proofOfDelivery.photoUrl"
          alt="Photo proof of delivery"
          class="pod-photo"
          @error="photoFailed = true"
        />
      </div>

      <div v-if="proofOfDelivery?.location" class="col-12 col-md-6">
        <p class="pod-label mb-2"><strong>GPS location</strong></p>
        <img
          v-if="staticMapUrl(proofOfDelivery.location)"
          :src="staticMapUrl(proofOfDelivery.location)"
          alt="Delivery location marked on a map"
          class="pod-photo"
        />
        <p v-else class="text-muted small mb-0">
          Map unavailable (set VITE_GOOGLE_MAPS_API_KEY to enable).
        </p>
      </div>

      <div
        v-if="(!proofOfDelivery?.photoUrl || photoFailed) && !proofOfDelivery?.location"
        class="col-12"
      >
        <p class="text-muted mb-0">No photo or GPS proof of delivery was captured for this delivery.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pod-card {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.text-completed {
  color: var(--color-accent);
}

.pod-timestamp {
  font-size: 0.9375rem;
  color: color-mix(in srgb, var(--black-blue) 70%, transparent);
}

.pod-timestamp i {
  color: var(--color-accent);
}

.pod-label {
  font-size: 0.875rem;
  color: color-mix(in srgb, var(--black-blue) 60%, transparent);
}

.pod-photo {
  max-width: 100%;
  width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  object-fit: cover;
  box-shadow: 0 2px 12px rgba(5, 16, 66, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pod-photo:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(5, 16, 66, 0.15);
}
</style>
