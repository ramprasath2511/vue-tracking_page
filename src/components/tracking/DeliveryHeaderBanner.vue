<script setup>
import { hideBrokenImage } from '../../utils/dom'

defineProps({
  delivery: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="banner bg-black-blue pt-5 text-center">
    <div class="container">
      <img
        v-if="delivery.sender?.logoUrl"
        :src="delivery.sender.logoUrl"
        alt="Sender logo"
        class="sender-logo mb-4"
        @error="hideBrokenImage"
      />
      <h1 class="mb-3">Your delivery from {{ delivery.sender?.name ?? 'your retailer' }}</h1>
      <h4 class="mb-4">
        Powered by
        <img
          src="https://www.zippd.com/wp-content/themes/zippd/images/zippd-logo-white.svg"
          alt="Zippd"
          class="powered-by-logo"
        />
      </h4>
      <div class="d-flex justify-content-center align-items-center">
        <i class="fas fa-box me-3"></i>
        <strong>{{ delivery.code }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  padding-bottom: 5rem;
}

@media (min-width: 768px) {
  .banner {
    padding-bottom: 6rem;
  }
}

.sender-logo {
  max-height: 120px;
  max-width: 300px;
  object-fit: contain;
  background: var(--white-van);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.powered-by-logo {
  height: 1.4em;
  margin-left: 0.1em;
  vertical-align: middle;
}
</style>
