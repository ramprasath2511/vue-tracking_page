<script setup>
import { onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTracking } from '../composables/useTracking'
import { useDriverLocation } from '../composables/useDriverLocation'
import { LIVE_TRACKING_STATUSES, REVIEWABLE_STATUSES } from '../constants/tracking'
import TrackingSearchForm from '../components/tracking/TrackingSearchForm.vue'
import DeliveryHeaderBanner from '../components/tracking/DeliveryHeaderBanner.vue'
import DeliveryDetailsCard from '../components/tracking/DeliveryDetailsCard.vue'
import DriverTrackingMap from '../components/tracking/DriverTrackingMap.vue'
import DriverRatingCard from '../components/tracking/DriverRatingCard.vue'
import ProofOfDeliveryCard from '../components/tracking/ProofOfDeliveryCard.vue'
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
            <div class="result-content mb-4">
              <LoadingSpinner v-if="loading" />
              <ErrorState v-else-if="error" :message="error" />
            </div>

            <template v-if="delivery && !loading && !error">
              <div class="tracking-grid">
                <div class="tracking-column">
                  <section class="content-card">
                    <div class="content-card-heading"><span><i class="fas fa-truck"></i></span><h2>Tracking progress</h2></div>
                    <DeliveryTimeline :timeline="delivery.timeline" :proof-of-delivery="delivery.proofOfDelivery" :code="delivery.code" :time-zone="delivery.timeZone" />
                  </section>
                  <ProofOfDeliveryCard
                    v-if="delivery.status === 'delivered' && delivery.proofOfDelivery"
                    :proof-of-delivery="delivery.proofOfDelivery"
                    :delivered-at="delivery.deliveredAt"
                    :time-zone="delivery.timeZone"
                  />
                </div>
                <aside class="tracking-column tracking-column--side">
                  <section class="content-card"><div class="content-card-heading"><span><i class="fas fa-file-lines"></i></span><h2>Order details</h2></div><DeliveryDetailsCard :delivery="delivery" /></section>
                  <section v-if="delivery.courier && REVIEWABLE_STATUSES.includes(delivery.status)" class="content-card"><div class="content-card-heading"><span><i class="fas fa-user"></i></span><h2>Courier</h2></div><DriverRatingCard :courier="delivery.courier" :code="delivery.code" :existing-review="delivery.existingReview" /></section>
                </aside>
              </div>
              <DriverTrackingMap
                v-if="LIVE_TRACKING_STATUSES.includes(delivery.status)"
                :driver-position="driverLocation.driverPosition.value"
                :tracking-status="driverLocation.trackingStatus.value"
                class="map-section"
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

.result-content:empty { display: none; }

.tracking-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(19rem, .62fr); gap: 1.5rem; }
.tracking-column { display: grid; align-content: start; gap: 1.5rem; }
.content-card { padding: 1.5rem; background: var(--white-van); border: 1px solid rgba(5, 16, 66, .08); border-radius: 1rem; box-shadow: var(--shadow-card); }
.content-card-heading { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }.content-card-heading span { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: .7rem; background: var(--color-accent-subtle); color: var(--color-accent); }.content-card-heading h2 { margin: 0; color: var(--color-ink); font-size: 1.05rem; font-weight: 600; }
.content-card :deep(.timeline-card), .content-card :deep(.details-card), .content-card :deep(.driver-rating-card) { padding: 0; border-radius: 0; box-shadow: none; background: transparent; }.content-card :deep(.timeline-card h5) { display: none; }.content-card :deep(.details-card h5) { display: none; }.content-card :deep(.driver-rating-card) { margin: 0; }
.map-section { margin-top: 1.5rem; }
@media (max-width: 900px) { .tracking-grid { grid-template-columns: 1fr; } }
</style>
