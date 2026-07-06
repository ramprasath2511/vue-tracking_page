<script setup>
import { computed, ref } from 'vue'
import TimelineStep from './TimelineStep.vue'

const props = defineProps({
  timeline: {
    type: Array,
    required: true,
  },
  proofOfDelivery: {
    type: Object,
    default: null,
  },
  code: {
    type: String,
    required: true,
  },
})

const photoFailed = ref(false)

const lastCompletedKey = computed(() => {
  const completed = props.timeline.filter((step) => step.completed)
  return completed.length ? completed[completed.length - 1].key : null
})

const openKey = ref(lastCompletedKey.value)

function toggle(key) {
  openKey.value = openKey.value === key ? null : key
}

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function staticMapUrl(location) {
  if (!mapsApiKey || !location) return null
  const center = `${location.lat},${location.lng}`
  return `https://maps.googleapis.com/maps/api/staticmap?key=${mapsApiKey}&size=300x200&zoom=15&center=${center}&markers=${center}`
}
</script>

<template>
  <div class="timeline-card bg-white-van p-4 p-md-5">
    <h5 id="proof-of-delivery" class="section-heading pb-4 mb-0"><strong>Tracking code: {{ code }}</strong></h5>
    <div>
      <TimelineStep
        v-for="(step, index) in timeline"
        :key="step.key"
        :step="step"
        :is-open="openKey === step.key"
        :is-last="index === timeline.length - 1"
        @toggle="toggle(step.key)"
      >
        <div v-if="step.key === 'delivered' && step.completed && proofOfDelivery" class="d-flex flex-wrap mt-4 gap-4">
          <div v-if="proofOfDelivery.photoUrl && !photoFailed">
            <p class="mb-1"><strong>Delivery photo</strong></p>
            <img
              :src="proofOfDelivery.photoUrl"
              alt="Photo proof of delivery"
              class="proof-photo"
              @error="photoFailed = true"
            />
          </div>
          <div v-if="proofOfDelivery.location">
            <p class="mb-1"><strong>GPS location</strong></p>
            <img
              v-if="staticMapUrl(proofOfDelivery.location)"
              :src="staticMapUrl(proofOfDelivery.location)"
              alt="Delivery location marked on a map"
              class="proof-photo"
            />
            <p v-else class="text-muted small mb-0">
              Map unavailable (set VITE_GOOGLE_MAPS_API_KEY to enable).
            </p>
          </div>
        </div>
      </TimelineStep>
    </div>
  </div>
</template>

<style scoped>
.timeline-card {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.proof-photo {
  max-width: 300px;
  width: 100%;
  border-radius: 0.5rem;
  object-fit: cover;
}
</style>
