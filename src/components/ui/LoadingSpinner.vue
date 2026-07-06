<script setup></script>

<template>
  <div class="loading-state bg-white-van p-5 text-center">
    <div class="spinner"></div>
    <p class="mt-3 mb-0">Looking up your delivery&hellip;</p>
  </div>
</template>

<style scoped>
.loading-state {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto;
  border: 3px solid var(--cloud-grey);
  border-top-color: var(--zippd-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
