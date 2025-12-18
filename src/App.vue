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
/* ===== NEO-BRUTALISM STYLE ===== */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  /* Используем моноширинный шрифт для характерного вида */
  font-family: 'Space Grotesk', 'Segoe UI', monospace;
}

.app-main {
  flex: 1;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ===== АНИМАЦИИ (Резкие) ===== */
.fade-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-enter-from {
  opacity: 0;
  transform: rotate(-1deg) scale(0.95);
}

/* ===== ФУТЕР В СТИЛЕ КАРТОЧКИ ===== */
.app-footer {
  background: var(--bg-secondary);
  border-top: 4px solid var(--text-primary); /* Жирная граница */
  padding: 5rem 0 2rem;
  margin-top: 6rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-logo-text {
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  background: var(--accent-color);
  color: #000;
  padding: 5px 15px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0px #000; /* Жесткая тень */
  display: inline-block;
  transform: rotate(-2deg);
}

.footer-description {
  margin-top: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.4;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-decoration: underline;
  text-decoration-thickness: 3px;
}

.footer-link {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  padding: 8px 0;
  transition: 0.1s;
}

.footer-link:hover {
  color: var(--accent-color);
  transform: skewX(-10deg); /* Эффект наклона */
}

/* Нижняя панель */
.footer-bottom {
  margin-top: 4rem;
  padding: 2rem;
  border: 3px solid #000;
  background: var(--bg-primary);
  box-shadow: 8px 8px 0px #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 1rem;
  }
}
</style>

<style>
:root {
  /* Яркая, "кислотная" палитра необрутализма */
  --bg-primary: #f1f1f1;
  --bg-secondary: #ffffff;
  --text-primary: #000000;
  --accent-color: #00ff66; /* Ярко-зеленый */
  --border-color: #000000;
  
  --shadow-neo: 6px 6px 0px #000000;
}

.dark-theme {
  --bg-primary: #1a1a1a;
  --bg-secondary: #262626;
  --text-primary: #ffffff;
  --accent-color: #ff3e00; /* Ярко-оранжевый */
  --border-color: #ffffff;
  
  --shadow-neo: 6px 6px 0px var(--accent-color);
}

body {
  margin: 0;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 500;
}

/* Кнопки и интерактивные элементы в этом стиле обычно имеют жирные рамки */
button, .card {
  border: 3px solid #000;
  box-shadow: var(--shadow-neo);
  transition: all 0.2s;
}

button:active {
  box-shadow: 0px 0px 0px #000;
  transform: translate(4px, 4px);
}
</style>