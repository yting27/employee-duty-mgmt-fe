import LanguageService from '../services/LanguageService'

export default {
  data() {
    return {
      currentLanguage: LanguageService.getCurrentLanguage(),
      languageUpdateKey: 0 // Force reactivity trigger
    }
  },
  methods: {
    $t(key, params = {}) {
      // Make translations reactive to languageUpdateKey
      // eslint-disable-next-line no-unused-vars
      const forceReactive = this.languageUpdateKey
      return LanguageService.translate(key, params)
    },
    getJobPositions() {
      return LanguageService.getJobPositions()
    },
    handleLanguageChange() {
      this.currentLanguage = LanguageService.getCurrentLanguage()
      this.languageUpdateKey++ // Increment to trigger reactivity
      this.$forceUpdate()
    }
  },
  mounted() {
    // Listen for language change events
    window.addEventListener('language-changed', this.handleLanguageChange)
  },
  beforeUnmount() {
    window.removeEventListener('language-changed', this.handleLanguageChange)
  }
}