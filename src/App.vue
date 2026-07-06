<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Whatever page router-view renders should fill the space between the
   header and footer, so short pages don't leave a bare white gap above
   the footer. Only the last top-level section grows (e.g. the results
   page also renders a fixed-height banner before its content section). */
main > :deep(*:last-child) {
  flex: 1 1 auto;
}
</style>
