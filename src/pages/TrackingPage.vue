<script setup>
import { onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTracking } from '../composables/useTracking'
import { useDriverLocation } from '../composables/useDriverLocation'
import { LIVE_TRACKING_STATUSES, REVIEWABLE_STATUSES } from '../constants/tracking'
import TrackingSearchForm from '../components/tracking/TrackingSearchForm.vue'
import DeliveryHeaderBanner from '../components/tracking/DeliveryHeaderBanner.vue'
import DeliveryStatusCard from '../components/tracking/DeliveryStatusCard.vue'
import DriverTrackingMap from '../components/tracking/DriverTrackingMap.vue'
import DriverRatingCard from '../components/tracking/DriverRatingCard.vue'
import DeliveryTimeline from '../components/tracking/DeliveryTimeline.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'

const route = useRoute()
const { delivery, loading, error, fetchByCode, stopPolling } = useTracking()
const driverLocation = useDriverLocation()

watch(
  () => route.query.code,
  (code) => {
    if (code) {
      fetchByCode(code)
    }
  },
  { immediate: true },
)

// Starts/stops live driver-location tracking as the (already-polling)
// delivery status enters or leaves the "driver is en route" window, and
// keeps fleetable coordinates fresh on every subsequent poll tick.
let trackedCode = null

watch(
  () => delivery.value,
  (current) => {
    if (!current || !LIVE_TRACKING_STATUSES.includes(current.status)) {
      if (trackedCode) driverLocation.stop()
      trackedCode = null
      return
    }

    if (trackedCode !== current.code) {
      trackedCode = current.code
      driverLocation.start(current)
    } else {
      driverLocation.update(current)
    }
  },
)

onUnmounted(() => {
  stopPolling()
  driverLocation.stop()
})
</script>

<template>
  <TrackingSearchForm v-if="!route.query.code" />

  <template v-else>
    <DeliveryHeaderBanner v-if="delivery" :delivery="delivery" />

    <section class="bg-cloud-grey pb-5">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-10 offset-md-1">
            <div class="overlap-card mb-5">
              <LoadingSpinner v-if="loading" />
              <ErrorState v-else-if="error" :message="error" />
              <DeliveryStatusCard v-else-if="delivery" :delivery="delivery" />
            </div>

            <template v-if="delivery && !loading && !error">
              <DriverTrackingMap
                v-if="LIVE_TRACKING_STATUSES.includes(delivery.status)"
                :driver-position="driverLocation.driverPosition.value"
                :tracking-status="driverLocation.trackingStatus.value"
              />
              <DriverRatingCard
                v-if="delivery.courier && REVIEWABLE_STATUSES.includes(delivery.status)"
                :courier="delivery.courier"
                :code="delivery.code"
                :existing-review="delivery.existingReview"
                class="mb-5"
              />
              <DeliveryTimeline
                :timeline="delivery.timeline"
                :proof-of-delivery="delivery.proofOfDelivery"
                :code="delivery.code"
                :time-zone="delivery.timeZone"
              />
            </template>
          </div>
        </div>
      </div>
    </section>
  </template>
</template>

<style scoped>
section.bg-cloud-grey {
  display: flex;
  align-items: center;
}

section.bg-cloud-grey > .container {
  width: 100%;
}

.overlap-card {
  position: relative;
  z-index: 2;
  margin-top: -3rem;
}

@media (min-width: 768px) {
  .overlap-card {
    margin-top: -4rem;
  }
}
</style>
