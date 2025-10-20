<template>
  <div>
    <!-- Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          {{ $t('system_title') }}
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/employees" active-class="active">
                <i class="bi bi-people me-1"></i>
                {{ $t('employees') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/schedules" active-class="active">
                <i class="bi bi-calendar-check me-1"></i>
                {{ $t('schedules') }}
              </router-link>
            </li>
          </ul>

          <!-- Language Toggle -->
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-globe me-1"></i>
                {{ currentLanguage === 'zh' ? '中文' : 'English' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="setLanguage('zh')" :class="{ active: currentLanguage === 'zh' }">
                    <i class="bi bi-check me-2" v-if="currentLanguage === 'zh'"></i>
                    <span v-else class="me-4"></span>
                    中文
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="setLanguage('en')" :class="{ active: currentLanguage === 'en' }">
                    <i class="bi bi-check me-2" v-if="currentLanguage === 'en'"></i>
                    <span v-else class="me-4"></span>
                    English
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import LanguageService from './services/LanguageService'
import LanguageMixin from './mixins/LanguageMixin'

export default {
  name: "app",
  mixins: [LanguageMixin],
  methods: {
    setLanguage(language) {
      LanguageService.setLanguage(language)
      this.currentLanguage = language
      this.languageUpdateKey++ // Trigger reactivity in mixin
      // Emit event to update child components
      this.$nextTick(() => {
        window.dispatchEvent(new Event('language-changed'))
      })
    }
  },
  provide() {
    return {
      $t: this.$t,
      currentLanguage: () => this.currentLanguage
    }
  }
};
</script>