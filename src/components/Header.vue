<template>
  <header class="header">
    <div class="header-container">
      <!-- Логотип -->
      <div class="logo" @click="goHome">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="4" stroke="var(--accent-color)" stroke-width="2"/>
            <circle cx="8" cy="8" r="2" fill="var(--accent-color)"/>
            <circle cx="16" cy="8" r="2" fill="var(--accent-color)"/>
            <circle cx="8" cy="16" r="2" fill="var(--accent-color)"/>
            <circle cx="16" cy="16" r="2" fill="var(--accent-color)"/>
          </svg>
        </div>
        <h1 class="logo-text">Palette Generator</h1>
      </div>

      <!-- Навигация -->
      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active" exact>
          <span class="nav-text">Генератор</span>
        </router-link>

        <router-link to="/editor" class="nav-link" active-class="active">
          <span class="nav-text">Редактор</span>
        </router-link>

        <router-link to="/library" class="nav-link" active-class="active">
          <span class="nav-text">Библиотека</span>
        </router-link>

        <router-link to="/export" class="nav-link" active-class="active">
          <span class="nav-text">Экспорт</span>
        </router-link>
      </nav>

      <!-- Переключатель темы -->
      <button class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Включить светлую тему' : 'Включить тёмную тему'">
        <div class="theme-toggle-inner" :class="{ 'dark': isDarkMode }">
          <span class="theme-toggle-icon">
            <svg v-if="!isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
          </span>
          <span class="theme-toggle-text">{{ isDarkMode ? 'Светлая' : 'Тёмная' }}</span>
        </div>
      </button>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const toggleTheme = inject('toggleTheme')
const isDarkMode = inject('isDarkMode')
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* ===== ОСНОВНОЙ ХЕДЕР ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

@media (max-width: 768px) {
  .header-container {
    height: 56px;
    padding: 0 1rem;
    gap: 1rem;
  }
}

/* ===== ЛОГОТИП ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.025em;
}

@media (max-width: 640px) {
  .logo-text {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
}

/* ===== НАВИГАЦИЯ ===== */
.nav {
  display: flex;
  gap: 2rem;
  flex: 1;
  max-width: 500px;
  justify-content: center;
}

@media (max-width: 768px) {
  .nav {
    gap: 1rem;
    max-width: 400px;
  }
}

@media (max-width: 640px) {
  .nav {
    gap: 0.75rem;
  }
}

/* Навигационные ссылки */
.nav-link {
  position: relative;
  padding: 0.5rem 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--accent-color);
}

.nav-link.active {
  color: var(--accent-color);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-color);
  border-radius: 1px;
}

@media (max-width: 640px) {
  .nav-link {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .nav-link {
    font-size: 0.8125rem;
  }
}

/* ===== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ===== */
.theme-toggle {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.theme-toggle:hover {
  opacity: 0.8;
}

.theme-toggle-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.theme-toggle-inner:hover {
  background-color: var(--bg-secondary);
}

.theme-toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}

.theme-toggle-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .theme-toggle-text {
    display: none;
  }

  .theme-toggle-inner {
    padding: 0.5rem;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
}

/* ===== АДАПТИВНОСТЬ ДЛЯ ОЧЕНЬ МАЛЕНЬКИХ ЭКРАНОВ ===== */
@media (max-width: 400px) {
  .header-container {
    gap: 0.75rem;
  }

  .nav {
    gap: 0.5rem;
  }

  .nav-link {
    font-size: 0.75rem;
  }

  .theme-toggle-inner {
    width: 32px;
    height: 32px;
  }
}
</style>