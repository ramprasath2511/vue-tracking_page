<script setup>
import { formatDate, formatTime } from '../../utils/format'

const props = defineProps({
  delivery: {
    type: Object,
    required: true,
  },
})

function formatEta(eta, timeZone) {
  if (!eta) return null
  const from = formatTime(eta.from, timeZone)
  const to = eta.to ? formatTime(eta.to, timeZone) : null
  return to ? `${from} – ${to}` : from
}
</script>

<template>
  <div class="details-card bg-white-van p-4 p-md-5">
    <h5 class="section-heading pb-2 mb-4">Delivery details</h5>
    <div class="row g-4">
      <div class="col-12 col-md-6">
        <div v-if="delivery.recipient" class="detail-group">
          <h6 class="detail-label"><i class="fas fa-user me-2"></i>Recipient</h6>
          <p class="detail-value mb-1">{{ delivery.recipient.contactName ?? '—' }}</p>
          <p v-if="delivery.recipient.companyName" class="detail-sub mb-1">{{ delivery.recipient.companyName }}</p>
          <p v-if="delivery.recipient.phoneNumber" class="detail-sub mb-1">
            <i class="fas fa-phone-alt me-1"></i>{{ delivery.recipient.phoneNumber }}
          </p>
          <p v-if="delivery.recipient.email" class="detail-sub mb-0">
            <i class="fas fa-envelope me-1"></i>{{ delivery.recipient.email }}
          </p>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div v-if="delivery.address" class="detail-group">
          <h6 class="detail-label"><i class="fas fa-map-marker-alt me-2"></i>Delivery address</h6>
          <p class="detail-value mb-0">
            <template v-for="line in delivery.address.lines" :key="line">{{ line }}<br /></template>
            <span v-if="delivery.address.postcode">{{ delivery.address.postcode }}</span>
          </p>
        </div>
      </div>

      <div v-if="delivery.fulfilmentDate" class="col-12 col-md-6">
        <div class="detail-group">
          <h6 class="detail-label"><i class="fas fa-calendar me-2"></i>Scheduled date</h6>
          <p class="detail-value mb-0">{{ formatDate(delivery.fulfilmentDate, delivery.timeZone) }}</p>
        </div>
      </div>

      <div v-if="delivery.driverEta" class="col-12 col-md-6">
        <div class="detail-group">
          <h6 class="detail-label"><i class="fas fa-clock me-2"></i>Estimated delivery window</h6>
          <p class="detail-value mb-0">{{ formatEta(delivery.driverEta, delivery.timeZone) }}</p>
        </div>
      </div>

      <div v-if="delivery.instruction" class="col-12">
        <div class="detail-group">
          <h6 class="detail-label"><i class="fas fa-directions me-2"></i>Delivery instructions</h6>
          <p class="detail-value mb-0">{{ delivery.instructionDetails ?? delivery.instruction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-card {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.detail-group {
  padding: 0.5rem 0;
}

.detail-label {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--black-blue) 55%, transparent);
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--black-blue);
  line-height: 1.5;
}

.detail-sub {
  font-size: 0.875rem;
  color: color-mix(in srgb, var(--black-blue) 70%, transparent);
}

.detail-sub i {
  width: 1rem;
  text-align: center;
  color: var(--zippd-blue);
}
</style>
