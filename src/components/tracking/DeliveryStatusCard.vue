<script setup>
import { computed } from 'vue'
import { STATUS_META } from '../../constants/tracking'
import { formatDate, formatTime } from '../../utils/format'

const props = defineProps({
  delivery: {
    type: Object,
    required: true,
  },
})

const meta = computed(() => STATUS_META[props.delivery.status] ?? STATUS_META['status-unknown'])
const isDelivered = computed(() => props.delivery.status === 'delivered')
const isOutForDelivery = computed(() => props.delivery.status === 'out-for-delivery')

const statusIcon = computed(() => {
  const map = {
    'items-expected': 'fas fa-warehouse',
    'items-received': 'fas fa-box-open',
    'order-received': 'fas fa-receipt',
    'driver-on-the-way-to-pickup': 'fas fa-route',
    'driver-arrived-at-first-pickup': 'fas fa-store',
    'out-for-delivery': 'fas fa-truck-fast',
    delivered: 'fas fa-circle-check',
    'delivery-partially-successful': 'fas fa-circle-half-stroke',
    'delivery-attempted': 'fas fa-triangle-exclamation',
    'delivery-unsuccessful': 'fas fa-circle-xmark',
    'status-unknown': 'fas fa-circle-question',
  }
  return map[props.delivery.status] ?? 'fas fa-circle-question'
})

function formatEta(eta) {
  if (!eta) return null
  const from = formatTime(eta.from, props.delivery.timeZone)
  const to = eta.to ? formatTime(eta.to, props.delivery.timeZone) : null
  return to ? `${from} – ${to}` : from
}
</script>

<template>
  <div class="status-card bg-white-van p-4 p-md-5">
    <div class="status-banner" :class="{ 'status-banner--delivered': isDelivered }">
      <i :class="statusIcon" class="status-icon"></i>
      <span>{{ meta.title }}</span>
    </div>
    <div class="row g-4 mt-1">
      <div class="col-12 col-md-6">
        <p class="mb-4">{{ meta.description }}</p>
        <div v-if="isOutForDelivery && delivery.driverEta" class="eta-box">
          <i class="fas fa-clock me-2"></i>
          <div>
            <p class="eta-label mb-0">Estimated delivery window</p>
            <p class="eta-value mb-0">{{ formatEta(delivery.driverEta) }}</p>
          </div>
        </div>
        <div v-if="isDelivered && delivery.deliveredAt" class="d-flex">
          <div class="pe-5">
            <h6 class="mb-1">Delivered on:</h6>
            <p class="mb-0">{{ formatDate(delivery.deliveredAt, delivery.timeZone) }}</p>
          </div>
          <div>
            <h6 class="mb-1">Delivered at:</h6>
            <p class="mb-0">{{ formatTime(delivery.deliveredAt, delivery.timeZone) }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <template v-if="delivery.address">
          <h2 class="intro-text mb-3">Delivered to:</h2>
          <p class="mb-4">
            <template v-for="line in delivery.address.lines" :key="line">{{ line }}<br /></template>
            {{ delivery.address.postcode }}
          </p>
          <a v-if="isDelivered && delivery.proofOfDelivery" href="#proof-of-delivery" class="button-pill">Proof of delivery</a>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-card {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.status-banner {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-subtle);
  color: var(--black-blue);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status-banner--delivered {
  background: #d1f5e3;
}

.status-icon {
  font-size: 1.25rem;
  color: var(--color-accent);
}

.status-banner--delivered .status-icon {
  color: #198754;
}

.eta-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--cloud-grey);
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
}

.eta-box > i {
  font-size: 1.5rem;
  color: var(--zippd-blue);
}

.eta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--black-blue) 55%, transparent);
  font-weight: 600;
}

.eta-value {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--black-blue);
}
</style>
