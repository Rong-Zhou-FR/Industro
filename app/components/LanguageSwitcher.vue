<template>
  <div class="language-switcher">
    <button
      v-for="localeOption in availableLocales"
      :key="localeOption.code"
      :class="['lang-btn', { active: currentLocale === localeOption.code }]"
      @click="switchLanguage(localeOption.code)"
    >
      {{ localeOption.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
] as const

const currentLocale = computed(() => locale.value)

const switchLanguage = (code: string): void => {
  locale.value = code
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', code)
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.lang-btn {
  padding: 8px 16px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.lang-btn.active {
  background: #667eea;
  color: white;
}
</style>
