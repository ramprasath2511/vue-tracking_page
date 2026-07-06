<script setup>
import { ref } from 'vue'
import StarRating from './StarRating.vue'
import { hideBrokenImage } from '../../utils/dom'
import { submitDriverReview } from '../../api/reviews'

const props = defineProps({
  courier: {
    type: Object,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  existingReview: {
    type: Object,
    default: null,
  },
})

const rating = ref(0)
const message = ref('')
const submitting = ref(false)
const submitError = ref(null)
const validationError = ref(false)

// Once submitted in this session, show the same "thanks" state as an
// existingReview loaded from the API — both mean there's nothing left to rate.
const justSubmitted = ref(null)

async function onSubmit() {
  if (!rating.value) {
    validationError.value = true
    return
  }
  if (message.value && message.value.trim().length < 3) {
    validationError.value = false
    submitError.value = 'Feedback must be at least 3 characters, or left blank.'
    return
  }

  validationError.value = false
  submitError.value = null
  submitting.value = true

  try {
    await submitDriverReview(props.code, { rating: rating.value, message: message.value.trim() })
    justSubmitted.value = { rating: rating.value, message: message.value.trim() }
  } catch (err) {
    submitError.value =
      err.response?.status === 422
        ? 'Please check your rating and feedback and try again.'
        : 'Something went wrong submitting your review. Please try again.'
  } finally {
    submitting.value = false
  }
}

const displayedReview = () => props.existingReview ?? justSubmitted.value
</script>

<template>
  <div class="rating-card bg-white-van p-4 p-md-5">
    <h5 class="section-heading pb-2">Rate your driver</h5>
    <div class="row g-4 align-items-start">
      <div class="col-12 col-lg-6">
        <div class="d-flex align-items-center mb-4">
          <img
            v-if="courier.photoUrl"
            :src="courier.photoUrl"
            alt="Driver photo"
            class="driver-photo me-4"
            @error="hideBrokenImage"
          />
          <div class="driver-info">
            <h4 class="driver-name mb-3">{{ courier.name }}</h4>
            <div class="d-flex gap-4">
              <div>
                <h4 class="mb-0">{{ courier.deliveries }}</h4>
                <p class="mb-0">Deliveries</p>
              </div>
              <div>
                <h4 class="mb-0">{{ courier.rating.toFixed(1) }} <i class="fas fa-star star-icon"></i></h4>
                <p class="mb-0">Rating</p>
              </div>
            </div>
          </div>
        </div>

        <template v-if="!displayedReview()">
          <p class="mb-2">Rate your delivery with {{ courier.name }}:</p>
          <StarRating v-model="rating" />
          <div v-if="validationError" class="text-danger mt-2">Please select a star rating.</div>
        </template>
        <template v-else>
          <p class="mb-1">Thanks for your feedback!</p>
          <StarRating :model-value="displayedReview().rating" readonly />
          <p v-if="displayedReview().message" class="mt-2 mb-0">&ldquo;{{ displayedReview().message }}&rdquo;</p>
        </template>
      </div>

      <div v-if="!displayedReview()" class="col-12 col-lg-6">
        <form @submit.prevent="onSubmit">
          <label for="reviewMessage" class="form-label">Add additional feedback (optional):</label>
          <textarea id="reviewMessage" v-model="message" class="form-control" rows="3" :disabled="submitting"></textarea>
          <div v-if="submitError" class="text-danger mt-2">{{ submitError }}</div>
          <button type="submit" class="button-pill mt-4" :disabled="submitting">
            {{ submitting ? 'Submitting…' : 'Submit Review' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rating-card {
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
  overflow-wrap: anywhere;
}

.driver-photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.driver-info {
  min-width: 0;
}

.driver-name {
  overflow-wrap: anywhere;
}

.star-icon {
  color: var(--color-accent);
  font-size: 1rem;
}
</style>
