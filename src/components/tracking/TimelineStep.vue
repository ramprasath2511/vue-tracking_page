<script setup>
import { formatDateTime } from '../../utils/format'

defineProps({
  step: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
  timeZone: {
    type: String,
    default: undefined,
  },
})

defineEmits(['toggle'])
</script>

<template>
  <div class="timeline-step" :class="{ completed: step.completed, pending: !step.completed }">
    <h2 class="step-header">
      <button
        type="button"
        class="step-toggle"
        :class="{ 'step-toggle--disabled': !step.completed }"
        :aria-expanded="isOpen"
        :disabled="!step.completed"
        @click="step.completed && $emit('toggle')"
      >
        <i
          :class="[
            step.completed ? 'fas fa-check-circle' : 'far fa-circle',
            step.completed && step.key === 'delivered' ? 'text-completed' : '',
          ]"
        ></i>
        <span class="ms-2">{{ step.label }}</span>
        <i v-if="step.completed" class="fas fa-chevron-down chevron ms-auto" :class="{ open: isOpen }"></i>
      </button>
    </h2>
    <div v-show="isOpen && step.completed" class="step-body">
      <div class="d-flex">
        <div class="pe-3 timeline-rail" v-if="!isLast">
          <div class="vertical-line"></div>
        </div>
        <div class="pt-2">
          <p class="mb-2">
            <strong v-if="step.timestamp">{{ formatDateTime(step.timestamp, timeZone) }} &mdash; </strong>{{ step.description }}
          </p>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-step {
  border-bottom: 1px solid var(--cloud-grey);
}

.step-header {
  margin: 0;
}

.step-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--black-blue);
  cursor: pointer;
  text-align: left;
}

.text-completed {
  color: var(--color-accent);
}

.pending .step-toggle {
  color: var(--cloud-grey);
  color: color-mix(in srgb, var(--black-blue) 45%, transparent);
}

.step-toggle--disabled {
  cursor: default;
}

.chevron {
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.step-body {
  padding-bottom: 1.5rem;
}

.vertical-line {
  width: 1px;
  height: 100%;
  background: var(--black-blue);
  margin-left: 6px;
}
</style>
