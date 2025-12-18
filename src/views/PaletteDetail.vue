<template>
  <div class="palette-detail">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка палитры...</p>
    </div>

    <div v-else-if="palette" class="palette-content">
      <div class="detail-header">
        <router-link to="/library" class="back-link">
          ← Назад к библиотеке
        </router-link>
        <div class="header-actions">
          <button @click="toggleFavorite" class="btn btn-favorite" :title="palette.featured ? 'Убрать из избранного' : 'В избранное'">
            {{ palette.featured ? '★' : '☆' }}
          </button>
          <button @click="editPalette" class="btn btn-edit" title="Редактировать">
            ✏️
          </button>
          <button @click="sharePalette" class="btn btn-share" title="Поделиться">
            🔗
          </button>
          <button @click="deletePalette" class="btn btn-delete" title="Удалить">
            🗑️
          </button>
        </div>
      </div>

      <div class="palette-info">
        <h1 class="palette-title">{{ palette.name }}</h1>
        <p v-if="palette.description" class="palette-description">{{ palette.description }}</p>

        <div class="palette-meta">
          <div class="meta-item">
            <span class="meta-icon">🎨</span>
            <span class="meta-label">Цветов:</span>
            <span class="meta-value">{{ palette.colors.length }}</span>
          </div>
          <div v-if="palette.createdAt" class="meta-item">
            <span class="meta-icon">📅</span>
            <span class="meta-label">Создано:</span>
            <span class="meta-value">{{ formatDate(palette.createdAt) }}</span>
          </div>
          <div v-if="palette.tags && palette.tags.length" class="meta-item">
            <span class="meta-icon">🏷️</span>
            <span class="meta-label">Теги:</span>
            <div class="tags-list">
              <span v-for="tag in palette.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="palette-visual">
        <h2>Цветовая палитра</h2>
        <div class="color-grid">
          <div
              v-for="(color, index) in palette.colors"
              :key="index"
              class="color-item"
              :style="{ backgroundColor: color }"
              @click="copyColor(color)"
          >
            <div class="color-info">
              <span class="color-index">{{ index + 1 }}</span>
              <span class="color-value">{{ color }}</span>
              <button
                  @click.stop="copyColor(color)"
                  class="copy-btn"
                  :title="`Скопировать ${color}`"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="palette-preview">
        <h2>Превью интерфейса</h2>
        <div class="preview-container">
          <div class="preview-header" :style="{ backgroundColor: getColor(0) }">
            <h3>Заголовок</h3>
            <p>Пример текста на фоне первого цвета</p>
          </div>
          <div class="preview-body">
            <div class="preview-sidebar" :style="{ backgroundColor: getColor(1) }">
              <div class="sidebar-item">Меню 1</div>
              <div class="sidebar-item">Меню 2</div>
              <div class="sidebar-item">Меню 3</div>
            </div>
            <div class="preview-content">
              <div class="content-card" :style="{ backgroundColor: getColor(2) }">
                <h4>Карточка</h4>
                <p>Контент карточки с текстом</p>
              </div>
              <button class="preview-button" :style="{ backgroundColor: getColor(3) }">
                Кнопка действия
              </button>
            </div>
          </div>
          <div class="preview-footer" :style="{ backgroundColor: getColor(4) }">
            <p>Футер страницы</p>
          </div>
        </div>
      </div>

      <div class="export-options">
        <h2>Экспорт палитры</h2>
        <div class="format-buttons">
          <button @click="exportFormat('css')" class="format-btn">
            <span class="format-icon">🎨</span>
            CSS
          </button>
          <button @click="exportFormat('scss')" class="format-btn">
            <span class="format-icon">⚡</span>
            SCSS
          </button>
          <button @click="exportFormat('tailwind')" class="format-btn">
            <span class="format-icon">🌊</span>
            Tailwind
          </button>
          <button @click="exportFormat('json')" class="format-btn">
            <span class="format-icon">📄</span>
            JSON
          </button>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Палитра не найдена</h2>
      <p>Запрошенная палитра не существует или была удалена.</p>
      <router-link to="/library" class="btn btn-primary">
        Вернуться в библиотеку
      </router-link>
    </div>

    <div v-if="showCopyNotification" class="copy-notification">
      Цвет скопирован в буфер!
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'PaletteDetail',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const palette = ref(null)
    const showCopyNotification = ref(false)

    // Загрузка палитры по ID
    const loadPalette = () => {
      const paletteId = parseInt(route.params.id)
      const library = JSON.parse(localStorage.getItem('paletteLibrary') || '[]')

      palette.value = library.find(p => p.id === paletteId)
      loading.value = false
    }

    // Форматирование даты
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    // Получение цвета по индексу
    const getColor = (index) => {
      if (palette.value && palette.value.colors.length > index) {
        return palette.value.colors[index]
      }
      return '#718096' // Fallback цвет
    }

    // Копирование цвета
    const copyColor = async (color) => {
      try {
        await navigator.clipboard.writeText(color)
        showCopyNotification.value = true
        setTimeout(() => {
          showCopyNotification.value = false
        }, 2000)
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }

    // Переключение избранного
    const toggleFavorite = () => {
      palette.value.featured = !palette.value.featured
      updatePaletteInLibrary()
    }

    // Редактирование палитры
    const editPalette = () => {
      router.push(`/editor?palette=${palette.value.id}`)
    }

    // Поделиться палитрой
    const sharePalette = () => {
      const url = `${window.location.origin}/palette/${palette.value.id}`
      navigator.clipboard.writeText(url)
          .then(() => alert('Ссылка на палитру скопирована в буфер!'))
          .catch(err => console.error('Ошибка копирования:', err))
    }

    // Удаление палитры
    const deletePalette = () => {
      if (confirm('Вы уверены, что хотите удалить эту палитру?')) {
        const library = JSON.parse(localStorage.getItem('paletteLibrary') || '[]')
        const updatedLibrary = library.filter(p => p.id !== palette.value.id)
        localStorage.setItem('paletteLibrary', JSON.stringify(updatedLibrary))
        router.push('/library')
      }
    }

    // Экспорт в разных форматах
    const exportFormat = (format) => {
      let content = ''
      const paletteName = palette.value.name.replace(/\s+/g, '-').toLowerCase()

      switch (format) {
        case 'css':
          content = `/* CSS Variables for ${palette.value.name} */
:root {
${palette.value.colors.map((color, i) => `  --${paletteName}-${i + 1}: ${color};`).join('\n')}
}`
          break

        case 'scss':
          content = `// SCSS Variables for ${palette.value.name}
${palette.value.colors.map((color, i) => `$${paletteName}-${i + 1}: ${color};`).join('\n')}`
          break

        case 'tailwind':
          content = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${paletteName}': {
${palette.value.colors.map((color, i) => `          ${i + 1}: '${color}',`).join('\n')}
        }
      }
    }
  }
}`
          break

        case 'json':
          content = JSON.stringify(palette.value, null, 2)
          break
      }

      // Копирование в буфер
      navigator.clipboard.writeText(content)
          .then(() => alert(`Код для формата ${format.toUpperCase()} скопирован в буфер!`))
          .catch(err => console.error('Ошибка копирования:', err))
    }

    // Обновление палитры в библиотеке
    const updatePaletteInLibrary = () => {
      const library = JSON.parse(localStorage.getItem('paletteLibrary') || '[]')
      const index = library.findIndex(p => p.id === palette.value.id)
      if (index !== -1) {
        library[index] = palette.value
        localStorage.setItem('paletteLibrary', JSON.stringify(library))
      }
    }

    // Инициализация
    onMounted(() => {
      loadPalette()
    })

    return {
      loading,
      palette,
      showCopyNotification,
      formatDate,
      getColor,
      copyColor,
      toggleFavorite,
      editPalette,
      sharePalette,
      deletePalette,
      exportFormat
    }
  }
}
</script>

<style scoped>
.palette-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #764ba2;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-favorite {
  background: rgba(246, 224, 94, 0.1);
  color: #d69e2e;
}

.btn-favorite:hover {
  background: rgba(246, 224, 94, 0.2);
  transform: translateY(-2px);
}

.btn-edit {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.btn-edit:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.btn-share {
  background: rgba(159, 122, 234, 0.1);
  color: #9f7aea;
}

.btn-share:hover {
  background: rgba(159, 122, 234, 0.2);
  transform: translateY(-2px);
}

.btn-delete {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.btn-delete:hover {
  background: rgba(245, 101, 101, 0.2);
  transform: translateY(-2px);
}

.palette-info {
  margin-bottom: 40px;
}

.palette-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 16px;
  font-weight: 800;
}

.palette-description {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 24px;
}

.palette-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  background: #f7fafc;
  padding: 20px;
  border-radius: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  font-size: 1.2rem;
}

.meta-label {
  font-weight: 600;
  color: #4a5568;
}

.meta-value {
  color: #2d3748;
  font-weight: 500;
}

.tags-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.palette-visual {
  margin-bottom: 40px;
}

.palette-visual h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 24px;
  font-weight: 700;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.color-item {
  height: 150px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.color-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.color-item:hover .color-info {
  opacity: 1;
  transform: translateY(0);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 16px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-index {
  font-weight: 700;
  font-size: 1.1rem;
}

.color-value {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  font-weight: 600;
}

.copy-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.palette-preview {
  margin-bottom: 40px;
}

.palette-preview h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 24px;
  font-weight: 700;
}

.preview-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.preview-header {
  padding: 30px;
  color: white;
}

.preview-header h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.preview-body {
  display: flex;
  min-height: 300px;
}

.preview-sidebar {
  width: 200px;
  padding: 20px;
  color: white;
}

.sidebar-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background 0.2s;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-content {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-card {
  padding: 20px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-card h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.preview-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  align-self: flex-start;
}

.preview-button:hover {
  transform: translateY(-2px);
}

.preview-footer {
  padding: 20px 30px;
  color: white;
  text-align: center;
}

.export-options {
  margin-bottom: 40px;
}

.export-options h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 24px;
  font-weight: 700;
}

.format-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.format-btn {
  flex: 1;
  min-width: 150px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.format-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.format-icon {
  font-size: 2rem;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found h2 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 16px;
  font-weight: 700;
}

.not-found p {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.copy-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  animation: slideIn 0.3s ease, fadeOut 2s ease 1.7s forwards;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .palette-title {
    font-size: 2rem;
  }

  .color-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .preview-body {
    flex-direction: column;
  }

  .preview-sidebar {
    width: 100%;
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 15px;
  }

  .sidebar-item {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .format-buttons {
    flex-direction: column;
  }

  .format-btn {
    min-width: 100%;
  }
}
</style>