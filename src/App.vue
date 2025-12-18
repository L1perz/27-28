<template>
  <div id="app" :class="{ 'dark-theme': isDarkMode }">
    <Header />

    <div class="header-spacer"></div>

    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Notification />

    <div v-if="confirmModalVisible">
      <ConfirmModal
          ref="confirmModalRef"
          :title="confirmModalTitle"
          :message="confirmModalMessage"
          :confirm-text="confirmModalConfirmText"
          :cancel-text="confirmModalCancelText"
          @confirm="handleConfirm"
          @cancel="handleCancel"
      />
    </div>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <span class="footer-logo-text">Palette Generator</span>
          </div>
          <p class="footer-description">
            Мощный инструмент для создания и управления цветовыми палитрами.
            Создавайте гармоничные цветовые схемы для ваших проектов.
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Навигация</h4>
          <div class="footer-links">
            <router-link to="/editor" class="footer-link">
              <span>Редактор палитр</span>
            </router-link>
            <router-link to="/library" class="footer-link">
              <span>Библиотека палитр</span>
            </router-link>
            <router-link to="/export" class="footer-link">
              <span>Экспорт палитр</span>
            </router-link>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Инструменты</h4>
          <div class="footer-links">
            <a href="#" class="footer-link" @click.prevent="exportAllPalettes">
              <span>Экспорт всех</span>
            </a>
            <a href="#" class="footer-link" @click.prevent="clearAllData">
              <span>Очистить всё</span>
            </a>
            <a href="#" class="footer-link" @click.prevent="showHelp">
              <span>Помощь</span>
            </a>
            <a href="#" class="footer-link" @click.prevent="toggleTheme">
              <span>{{ isDarkMode ? 'Светлая тема' : 'Тёмная тема' }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© 2025 Palette Generator. Все права защищены.</p>
        <p class="footer-info">Создано с ❤️ для дизайнеров и разработчиков</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Notification from './components/Notification.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import { PaletteStore } from './utils/paletteStore'
import { notify } from './utils/notifications'

export default {
  name: 'App',
  components: {
    Header,
    Notification,
    ConfirmModal
  },

  setup() {
    const router = useRouter()
    const confirmModalRef = ref(null)
    const isDarkMode = ref(false)

    const confirmModalVisible = ref(false)
    const confirmModalTitle = ref('')
    const confirmModalMessage = ref('')
    const confirmModalConfirmText = ref('Да')
    const confirmModalCancelText = ref('Нет')

    let confirmResolve = null

    // Инициализация темы (светлая по умолчанию)
    const initTheme = () => {
      const savedTheme = localStorage.getItem('paletteTheme')

      // Светлая тема по умолчанию
      isDarkMode.value = savedTheme === 'dark'
      updateThemeClass()
    }

    // Обновление класса темы
    const updateThemeClass = () => {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
    }

    // Переключение темы
    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('paletteTheme', isDarkMode.value ? 'dark' : 'light')
      updateThemeClass()
      notify.success(isDarkMode.value ? 'Тёмная тема включена' : 'Светлая тема включена')
    }

    const showConfirm = (options = {}) => {
      return new Promise((resolve) => {
        confirmModalTitle.value = options.title || 'Подтверждение'
        confirmModalMessage.value = options.message || 'Вы уверены?'
        confirmModalConfirmText.value = options.confirmText || 'Да'
        confirmModalCancelText.value = options.cancelText || 'Нет'

        confirmResolve = resolve
        confirmModalVisible.value = true
      })
    }

    const handleConfirm = () => {
      confirmModalVisible.value = false
      if (confirmResolve) {
        confirmResolve(true)
        confirmResolve = null
      }
    }

    const handleCancel = () => {
      confirmModalVisible.value = false
      if (confirmResolve) {
        confirmResolve(false)
        confirmResolve = null
      }
    }

    // Функции для футера
    const exportAllPalettes = () => {
      const data = PaletteStore.exportToJSON()
      if (!data || data === '[]') {
        notify.warning('Нет палитр для экспорта')
        return
      }

      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `all-palettes-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      notify.success('Все палитры экспортированы!')
    }

    const clearAllData = async () => {
      const confirmed = await showConfirm({
        title: 'Очистка всех данных',
        message: 'Вы уверены, что хотите удалить ВСЕ палитры? Это действие нельзя отменить.',
        confirmText: 'Удалить всё',
        cancelText: 'Отмена'
      })

      if (confirmed) {
        localStorage.removeItem('paletteLibrary')
        localStorage.removeItem('currentPalette')
        notify.success('Все данные очищены')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }

    const showHelp = () => {
      router.push('/')
      notify.info('Документация будет добавлена в будущих обновлениях')
    }

    // Предоставляем глобальные функции
    provide('notify', notify)
    provide('showConfirm', showConfirm)
    provide('toggleTheme', toggleTheme)
    provide('isDarkMode', isDarkMode)

    // Инициализация при монтировании
    onMounted(() => {
      initTheme()
    })

    return {
      isDarkMode,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      confirmModalConfirmText,
      confirmModalCancelText,
      confirmModalRef,
      toggleTheme,
      handleConfirm,
      handleCancel,
      exportAllPalettes,
      clearAllData,
      showHelp
    }
  }
}
</script>

<style scoped>
/* ===== БАЗОВЫЕ СТИЛИ ===== */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== ОСНОВНОЙ КОНТЕНТ ===== */
.app-main {
  flex: 1;
  padding: 2rem 1.5rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

/* ===== АНИМАЦИИ ПЕРЕХОДОВ ===== */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== ФУТЕР ===== */
.app-footer {
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1.5rem;
  }
}

/* Логотип и описание */
.footer-section:first-child {
  padding-right: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.footer-logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.footer-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  max-width: 320px;
}

/* Заголовки секций */
.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Ссылки */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.footer-link:hover {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.footer-link.router-link-active {
  background: var(--accent-color);
  color: white;
  font-weight: 500;
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 2rem 0;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  opacity: 0.8;
}

.footer-info {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  font-style: italic;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}

.header-spacer {
  height: 64px;
}

@media (max-width: 768px) {
  .header-spacer {
    height: 56px;
  }
}
</style>

<style>
/* Глобальные CSS переменные вне scoped блока */
:root {
  /* Светлая тема */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --border-color: #e2e8f0;
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

.dark-theme {
  /* Тёмная тема */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-color: #475569;
  --accent-color: #818cf8;
  --accent-hover: #6366f1;
  --success-color: #34d399;
  --warning-color: #fbbf24;
  --danger-color: #f87171;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
}

/* Глобальные стили для body */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.dark-theme {
  color-scheme: dark;
}
</style>