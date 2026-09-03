<script setup>
import { computed } from 'vue'
import { hideBrokenImage } from '../../utils/dom'
import { STATUS_META } from '../../constants/tracking'
import { formatDate, formatTime } from '../../utils/format'

const props = defineProps({
  delivery: {
    type: Object,
    required: true,
  },
})

const meta = computed(() => STATUS_META[props.delivery.status] ?? STATUS_META['status-unknown'])
const expectedArrival = computed(() => props.delivery.driverEta?.from ? formatTime(props.delivery.driverEta.from, props.delivery.timeZone) : null)
</script>

<template>
  <section class="banner bg-black-blue"><div class="container"><div class="banner-content">
    <div class="banner-top"><div class="sender"><img v-if="delivery.sender?.logoUrl" :src="delivery.sender.logoUrl" alt="Sender logo" class="sender-logo" @error="hideBrokenImage" /><span>{{ delivery.sender?.name ?? 'Your retailer' }}</span></div><span class="status-chip"><i class="fas fa-circle-notch"></i> {{ meta.title }}</span></div>
    <p class="eyebrow">DELIVERY STATUS</p><h1>{{ meta.title }}</h1><p class="subtitle">{{ meta.description }}</p>
    <div class="meta-bar"><div class="meta-item"><i class="fas fa-box"></i><span><small>Tracking ID</small><strong>{{ delivery.code }}</strong></span></div><div v-if="delivery.fulfilmentDate" class="meta-item"><i class="fas fa-calendar"></i><span><small>Delivery date</small><strong>{{ formatDate(delivery.fulfilmentDate, delivery.timeZone) }}</strong></span></div><div v-if="delivery.deliveredAt" class="meta-item"><i class="fas fa-circle-check"></i><span><small>Delivered at</small><strong>{{ formatTime(delivery.deliveredAt, delivery.timeZone) }}</strong></span></div><div v-else-if="expectedArrival" class="meta-item"><i class="fas fa-clock"></i><span><small>Expected arrival</small><strong>{{ expectedArrival }}</strong></span></div></div>
  </div></div>
  </section>
</template>

<style scoped>
.banner { padding: 3.25rem 0 2.5rem; background: radial-gradient(circle at 90% 0%, rgba(49,135,255,.42), transparent 34%), var(--black-blue); }
.banner-content { max-width: 68rem; }.banner-top { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:2.5rem; }.sender { display:flex; align-items:center; gap:.7rem; color:rgba(255,255,255,.86); font-size:.95rem; font-weight:600; }.sender-logo { width:2.35rem; height:2.35rem; object-fit:contain; background:var(--white-van); border-radius:.55rem; padding:.35rem; }.status-chip { display:inline-flex; align-items:center; gap:.45rem; padding:.55rem .85rem; border:1px solid rgba(171,225,250,.4); border-radius:var(--radius-pill); background:rgba(171,225,250,.12); color:var(--barely-blue); font-size:.78rem; font-weight:600; }.status-chip i { font-size:.7rem; }.eyebrow { margin-bottom:.65rem; color:var(--barely-blue); font-size:.72rem; font-weight:700; letter-spacing:.14em; } h1 { margin:0; font-size:clamp(2rem,4vw,3.25rem); line-height:1.12; }.subtitle { max-width:41rem; margin:.8rem 0 0; color:rgba(255,255,255,.75); font-size:1.05rem; line-height:1.55; }.meta-bar { display:flex; flex-wrap:wrap; gap:1.6rem 2.6rem; margin-top:2.25rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,.16); }.meta-item { display:flex; align-items:center; gap:.65rem; color:var(--barely-blue); }.meta-item > i { width:1rem; text-align:center; }.meta-item span { display:grid; gap:.1rem; }.meta-item small { color:rgba(255,255,255,.55); font-size:.7rem; }.meta-item strong { color:white; font-size:.9rem; }
@media (max-width:575px) { .banner { padding:2rem 0; }.banner-top { align-items:flex-start; margin-bottom:2rem; }.status-chip { max-width:11rem; }.meta-bar { gap:1rem; }.meta-item { flex-basis:100%; } }
</style>
