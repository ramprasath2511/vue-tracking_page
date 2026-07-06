<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const stars = [1, 2, 3, 4, 5]
</script>

<template>
  <div class="star-rating">
    <button
      v-for="star in stars"
      :key="star"
      type="button"
      class="star-button"
      :class="{ filled: star <= props.modelValue, 'star-button--readonly': readonly }"
      :aria-label="`${star} stars`"
      :tabindex="readonly ? -1 : 0"
      @click="!readonly && emit('update:modelValue', star)"
    >
      <i class="fas fa-star"></i>
    </button>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  gap: 0.5rem;
}

.star-button {
  background: none;
  border: none;
  padding: 0;
  font-size: 1.5rem;
  color: var(--cloud-grey);
  cursor: pointer;
  transition: color 0.15s;
}

.star-button.filled {
  color: var(--color-accent);
}

.star-button--readonly {
  cursor: default;
}
</style>
