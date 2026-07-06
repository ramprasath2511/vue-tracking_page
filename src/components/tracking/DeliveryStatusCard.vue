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
</script>

<template>
  <div class="status-card bg-white-van p-4 p-md-5">
    <div class="row g-4">
      <div class="col-12 col-md-6">
        <h2 class="intro-text mb-3">{{ meta.title }}</h2>
        <p class="mb-4">{{ meta.description }}</p>
        <div v-if="isDelivered && delivery.deliveredAt" class="d-flex">
          <div class="pe-5">
            <h6 class="mb-1">Delivered on:</h6>
            <p class="mb-0">{{ formatDate(delivery.deliveredAt) }}</p>
          </div>
          <div>
            <h6 class="mb-1">Delivered at:</h6>
            <p class="mb-0">{{ formatTime(delivery.deliveredAt) }}</p>
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
          <a v-if="isDelivered" href="#proof-of-delivery" class="button-pill">Proof of delivery</a>
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
</style>
