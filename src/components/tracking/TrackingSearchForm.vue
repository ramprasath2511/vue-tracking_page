<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const code = ref('')
const submitted = ref(false)

function onSubmit() {
  submitted.value = true
  if (!code.value.trim()) {
    return
  }
  router.push({ path: '/', query: { code: code.value.trim().toUpperCase() } })
}
</script>

<template>
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <div class="row align-items-center g-5">
        <div class="col-12 col-lg-6 hero-copy">
          <p class="hero-eyebrow"><span></span> DELIVERY INTELLIGENCE</p>
          <h1>Every delivery,<br /><em>beautifully clear.</em></h1>
          <p class="hero-intro">From dispatch to doorstep, know exactly where your order is — in real time.</p>
        </div>
        <div class="col-12 col-lg-6">
          <div class="hero-card p-4 p-md-5">
            <h3 class="mb-3">Track</h3>
            <p class="mb-4">Enter your tracking code to see updates and live tracking for your delivery.</p>
            <form novalidate @submit.prevent="onSubmit">
              <label for="inputTrackingCode" class="form-label">Tracking Code</label>
              <input
                id="inputTrackingCode"
                v-model="code"
                type="text"
                class="form-control mt-1"
                :class="{ 'is-invalid': submitted && !code.trim() }"
                placeholder="DAXXXXXX-12345-12345678"
                required
              />
              <div v-if="submitted && !code.trim()" class="invalid-feedback d-block">
                Please enter a tracking code.
              </div>
              <div class="mt-4">
                <button type="submit" class="button-pill">Track your delivery</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: var(--black-blue) url('https://www.zippd.com/wp-content/uploads/2026/05/zippd-homepage-scaled-1.webp')
    center / cover no-repeat;
  min-height: 42rem;
  padding: 5.5rem 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(5, 16, 66, 0.92) 0%, rgba(5, 16, 66, 0.75) 55%, rgba(5, 16, 66, 0.55) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  color: var(--white-van);
  font-size: clamp(2.75rem, 5vw, 4.8rem);
  line-height: 1.2;
}

.hero h1 em { color: var(--barely-blue); font-style: normal; }
.hero-eyebrow { display: flex; align-items: center; gap: .65rem; color: var(--barely-blue); font-size: .72rem; font-weight: 700; letter-spacing: .16em; }
.hero-eyebrow span { width: 2.25rem; height: 1px; background: currentColor; }
.hero-intro { max-width: 31rem; margin: 1.5rem 0 0; color: rgba(255,255,255,.75); font-size: 1.1rem; line-height: 1.65; }

.hero-card {
  position: relative;
  background: rgba(8, 24, 82, 0.64);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(171, 225, 250, 0.22);
  border-radius: 1.25rem;
  color: var(--white-van);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.hero-card::before { content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: inherit; background: linear-gradient(135deg, rgba(255,255,255,.13), transparent 34%); }

.hero-card h3 {
  font-weight: 600;
}

.form-control {
  text-transform: uppercase;
  border: none;
  padding: 0.75rem 1rem;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 61, 237, 0.35);
}
</style>
