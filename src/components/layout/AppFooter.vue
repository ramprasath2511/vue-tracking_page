<script setup></script>

<template>
  <footer class="site-footer">
    <div class="container py-4 text-center">
      <p class="mb-0">&copy; {{ new Date().getFullYear() }} Zippd. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--black-blue);
  color: var(--white-van);
}

.site-footer p {
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
