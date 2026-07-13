<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="site-header">
    <div class="container py-3 d-flex align-items-center justify-content-between">
      <RouterLink to="/" class="brand">
        <img src="https://www.zippd.com/wp-content/uploads/2026/02/zippd-logo-blue.png" alt="Zippd" height="28" />
      </RouterLink>
      <RouterLink v-if="route.query.code" to="/" class="button-pill button-pill--outline">
        Track another order
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--white-van);
  border-bottom: 1px solid var(--cloud-grey);
}

.brand img {
  display: block;
}

.button-pill--outline {
  padding: 0.5rem 1.25rem;
  font-size: 0.9375rem;
  background: transparent;
  color: var(--zippd-blue);
  border-color: var(--zippd-blue);
}

.button-pill--outline:hover,
.button-pill--outline:focus {
  background: var(--zippd-blue);
  color: var(--white-van);
}
</style>
