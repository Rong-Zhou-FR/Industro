import { createI18n } from 'vue-i18n'
import en from '../../locales/en.json'
import fr from '../../locales/fr.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: typeof window !== 'undefined' 
      ? (localStorage.getItem('locale') || navigator.language?.split('-')[0] || 'en')
      : 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      fr
    }
  })

  vueApp.use(i18n)

  return {
    provide: {
      i18n: i18n.global
    }
  }
})
