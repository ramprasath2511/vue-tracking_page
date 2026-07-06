<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="error-state bg-white-van p-4 p-md-5 text-center">
    <i class="fas fa-triangle-exclamation error-icon mb-3"></i>
    <p class="mb-4">{{ message }}</p>
    <router-link to="/tracking" class="button-pill">Try another code</router-link>
  </div>
</template>

<style scoped>
.error-state {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
}

.error-icon {
  font-size: 2rem;
  color: var(--color-danger);
}
</style>
