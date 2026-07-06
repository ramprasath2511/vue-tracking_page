<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="site-header">
    <div class="container py-3">
      <RouterLink to="/tracking" class="brand">
        <img src="https://www.zippd.com/wp-content/uploads/2026/02/zippd-logo-blue.png" alt="Zippd" height="28" />
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
</style>
