<template>
  <div class="container">
    <div class="card text-center fade-in">
      <LanguageSwitcher />
      <h1>🏭 {{ t('home.title') }}</h1>
      <p class="author">{{ t('home.author') }}</p>
      <p class="description">{{ t('home.description') }}</p>

      <div class="datetime">
        <p>{{ currentDate }}</p>
        <p class="clock">{{ currentTime }}</p>
      </div>

      <nav class="nav-buttons">
        <NuxtLink to="/reliability-calculator" class="btn">
          {{ t('home.reliabilityCalculator') }}
        </NuxtLink>
        <NuxtLink to="/consignment" class="btn">
          {{ t('home.consignmentProcedure') }}
        </NuxtLink>
        <NuxtLink to="/spec-sheet" class="btn">
          {{ t('home.specificationSheet') }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentDate = ref('')
const currentTime = ref('')
let timeInterval = null

const updateDateTime = () => {
  const now = new Date()
  
  const days = [
    t('home.days.sunday'), t('home.days.monday'), t('home.days.tuesday'), 
    t('home.days.wednesday'), t('home.days.thursday'), t('home.days.friday'), 
    t('home.days.saturday')
  ]
  
  const months = [
    t('home.months.january'), t('home.months.february'), t('home.months.march'), 
    t('home.months.april'), t('home.months.may'), t('home.months.june'), 
    t('home.months.july'), t('home.months.august'), t('home.months.september'), 
    t('home.months.october'), t('home.months.november'), t('home.months.december')
  ]

  currentDate.value = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
  currentTime.value = now.toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateDateTime()
  timeInterval = setInterval(updateDateTime, 1000)
})

// Update date/time when locale changes
watch(locale, () => {
  updateDateTime()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  max-width: 600px;
  width: 100%;
}

.author {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 30px;
  font-style: italic;
}

.description {
  color: #666;
  margin: 20px 0;
  line-height: 1.6;
}

.datetime {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 30px 0;
}

.datetime p {
  color: #666;
  font-size: 1.1em;
  margin: 5px 0;
}

.clock {
  font-size: 2em !important;
  font-weight: bold;
  color: #667eea !important;
  margin: 10px 0;
}

.nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.nav-buttons .btn {
  display: block;
  text-align: center;
  text-decoration: none;
}
</style>
