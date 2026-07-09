<script setup>
import { onMounted, ref, watch } from 'vue'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

const props = defineProps({
  driverPosition: {
    type: Object,
    default: null,
  },
  trackingStatus: {
    type: String,
    default: 'unavailable',
  },
})

const STATUS_LABELS = {
  unavailable: 'unavailable',
  connecting: 'connecting…',
  live: 'live',
  offline: 'offline',
}

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapContainer = ref(null)
let map = null
let marker = null
let optionsSet = false

async function ensureMap() {
  if (map || !mapsApiKey || !mapContainer.value) return

  if (!optionsSet) {
    setOptions({ key: mapsApiKey })
    optionsSet = true
  }

  const { Map } = await importLibrary('maps')
  const { Marker } = await importLibrary('marker')

  map = new Map(mapContainer.value, {
    center: props.driverPosition ?? { lat: 51.5074, lng: -0.1278 },
    zoom: 15,
    disableDefaultUI: true,
  })

  if (props.driverPosition) {
    marker = new Marker({ map, position: props.driverPosition })
  }
}

watch(
  () => props.driverPosition,
  async (position) => {
    if (!position) return

    await ensureMap()
    if (!map) return

    if (marker) {
      marker.setPosition(position)
    } else {
      const { Marker } = await importLibrary('marker')
      marker = new Marker({ map, position })
    }

    map.panTo(position)
  },
)

onMounted(() => {
  if (props.driverPosition) ensureMap()
})
</script>

<template>
  <div class="tracking-map-card bg-white-van p-3 p-md-4 mb-4">
    <p class="tracking-status mb-2">
      Driver tracking:
      <strong :class="`status-${trackingStatus}`">{{ STATUS_LABELS[trackingStatus] ?? trackingStatus }}</strong>
    </p>
    <div v-if="mapsApiKey" ref="mapContainer" class="tracking-map"></div>
    <p v-else class="text-muted small mb-0">Map unavailable (set VITE_GOOGLE_MAPS_API_KEY to enable).</p>
  </div>
</template>

<style scoped>
.tracking-map-card {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.tracking-map {
  height: 300px;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}

.status-live {
  color: #198754;
}

.status-connecting {
  color: #b8860b;
}

.status-offline,
.status-unavailable {
  color: #6c757d;
}
</style>
