<template>
  <div class="preview-section">
    <div class="section-header">
      <h3>📱 Превью интерфейса</h3>
      <div class="preview-controls">
        <button
            @click="$emit('toggle-theme')"
            class="theme-toggle"
            :title="darkMode ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
        >
          {{ darkMode ? '☀️' : '🌙' }}
        </button>
        <button
            @click="$emit('refresh-preview')"
            class="refresh-btn"
            title="Обновить превью"
        >
          🔄
        </button>
      </div>
    </div>

    <div class="preview-container" :class="{ 'dark-bg': darkMode }">
      <!-- Шапка приложения -->
      <div class="preview-header" :style="{ backgroundColor: getColor(0) }">
        <div class="header-content">
          <div class="app-logo">
            <span class="logo-icon">🎨</span>
            <span class="logo-text">Palette</span>
          </div>
          <div class="header-actions">
            <button class="header-btn" :style="{
              backgroundColor: getColor(1),
              color: getTextColor(getColor(1))
            }">
              Профиль
            </button>
            <button class="header-btn" :style="{
              backgroundColor: getColor(2),
              color: getTextColor(getColor(2))
            }">
              Настройки
            </button>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="preview-content">
        <div class="sidebar" :style="{ backgroundColor: getColor(3) }">
          <div class="sidebar-item">
            <span class="sidebar-icon">🏠</span>
            <span>Главная</span>
          </div>
          <div class="sidebar-item">
            <span class="sidebar-icon">🎨</span>
            <span>Палитры</span>
          </div>
          <div class="sidebar-item">
            <span class="sidebar-icon">⭐</span>
            <span>Избранное</span>
          </div>
          <div class="sidebar-item">
            <span class="sidebar-icon">⚙️</span>
            <span>Настройки</span>
          </div>
        </div>

        <div class="main-area">
          <div class="content-card" :style="{
            backgroundColor: getColor(4),
            color: getTextColor(getColor(4))
          }">
            <h4 class="card-title">Добро пожаловать!</h4>
            <p class="card-text">Это демонстрация интерфейса с текущей цветовой палитрой.</p>
            <button class="card-btn" :style="{
              backgroundColor: getColor(1),
              color: getTextColor(getColor(1))
            }">
              Начать работу
            </button>
          </div>

          <div class="stats-grid">
            <div class="stat-card" :style="{
              backgroundColor: getColor(5),
              color: getTextColor(getColor(5))
            }">
              <span class="stat-value">42</span>
              <span class="stat-label">Палитры</span>
            </div>
            <div class="stat-card" :style="{
              backgroundColor: getColor(6),
              color: getTextColor(getColor(6))
            }">
              <span class="stat-value">128</span>
              <span class="stat-label">Цвета</span>
            </div>
          </div>

          <div class="alert-message" :style="{
            backgroundColor: getColor(2),
            color: getTextColor(getColor(2))
          }">
            <span class="alert-icon">💡</span>
            <span>Совет: Используйте гармоничные цвета для лучшего восприятия</span>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <div class="preview-footer" :style="{ backgroundColor: getColor(0) }">
        <p>© 2025 Palette Generator. Все цвета создаются с ❤️</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PalettePreview',

  props: {
    palette: {
      type: Array,
      required: true,
      default: () => []
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },

  emits: ['toggle-theme', 'refresh-preview'],

  methods: {
    getColor(index) {
      if (this.palette.length > index) {
        return this.palette[index].hex
      }
      // Fallback цвета
      const fallbackColors = [
        '#667eea', '#764ba2', '#f56565', '#48bb78',
        '#ed8936', '#9f7aea', '#4299e1'
      ]
      return fallbackColors[index] || '#718096'
    },

    getTextColor(backgroundColor) {
      // Простая проверка на светлый цвет
      const hex = backgroundColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128 ? '#1a202c' : '#ffffff'
    }
  }
}
</script>

<style scoped>
.preview-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 1.6rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
}

.preview-controls {
  display: flex;
  gap: 12px;
}

.theme-toggle,
.refresh-btn {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover,
.refresh-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: background-color 0.3s;
}

.preview-container.dark-bg {
  background: #1a202c;
}

.preview-header {
  padding: 20px 30px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.4rem;
}

.logo-icon {
  font-size: 1.8rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.header-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.preview-content {
  display: flex;
  min-height: 400px;
}

.sidebar {
  width: 250px;
  padding: 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: white;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-icon {
  font-size: 1.2rem;
}

.main-area {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-card {
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.card-text {
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.9;
}

.card-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.card-btn:hover {
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

.alert-message {
  padding: 18px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.alert-icon {
  font-size: 1.4rem;
}

.preview-footer {
  padding: 20px 30px;
  color: white;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .preview-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar-item {
    display: inline-flex;
    margin-right: 12px;
    margin-bottom: 0;
  }
}
</style>