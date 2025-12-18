<template>
  <div class="export-page">
    <!-- Заголовок -->
    <div class="page-header">
      <h1>Экспорт палитр</h1>
      <p class="page-subtitle">Конвертируйте палитры в различные форматы для использования в проектах</p>
    </div>

    <!-- Основной контейнер -->
    <div class="export-container">
      <!-- Боковая панель выбора -->
      <aside class="export-sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Выбор палитры</h2>
          <button v-if="selectedPalette" @click="clearSelection" class="clear-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Очистить
          </button>
        </div>

        <div class="palette-list">
          <div
              v-for="palette in palettes"
              :key="palette.id"
              class="palette-item"
              :class="{ 'selected': selectedPalette?.id === palette.id }"
              @click="selectPalette(palette)"
          >
            <div class="palette-colors">
              <div
                  v-for="(color, index) in palette.colors.slice(0, 5)"
                  :key="index"
                  class="palette-color"
                  :style="{ backgroundColor: color }"
              />
            </div>
            <div class="palette-info">
              <h3 class="palette-name">{{ palette.name }}</h3>
              <span class="palette-count">{{ palette.colors.length }} цветов</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Основной контент -->
      <main class="export-main">
        <!-- Состояние без выбора -->
        <div v-if="!selectedPalette" class="empty-state">
          <div class="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-tertiary)" stroke-width="2"/>
              <rect x="7" y="7" width="10" height="2" fill="var(--accent-color)"/>
              <rect x="7" y="11" width="8" height="2" fill="var(--accent-color)"/>
              <rect x="7" y="15" width="6" height="2" fill="var(--accent-color)"/>
            </svg>
          </div>
          <h3 class="empty-state-title">Выберите палитру</h3>
          <p class="empty-state-description">Выберите палитру из списка слева для просмотра вариантов экспорта</p>
        </div>

        <!-- Контент с выбранной палитрой -->
        <div v-else class="export-content">
          <!-- Выбранная палитра -->
          <section class="selected-section">
            <div class="section-header">
              <h2 class="section-title">{{ selectedPalette.name }}</h2>
              <div class="section-badge">{{ selectedPalette.colors.length }} цветов</div>
            </div>
            <div class="palette-preview">
              <div
                  v-for="(color, index) in selectedPalette.colors"
                  :key="index"
                  class="preview-color"
                  :style="{ backgroundColor: color }"
                  :title="color"
              >
                <span class="color-hex">{{ color }}</span>
              </div>
            </div>
          </section>

          <!-- Форматы экспорта -->
          <section class="formats-section">
            <h3 class="section-title">Форматы экспорта</h3>
            <div class="formats-grid">
              <div
                  v-for="format in exportFormats"
                  :key="format.id"
                  class="format-card"
                  :class="{ 'active': selectedFormat === format.id }"
                  @click="selectFormat(format.id)"
              >
                <div class="format-icon">
                  <component :is="format.icon" />
                </div>
                <div class="format-info">
                  <h4 class="format-name">{{ format.name }}</h4>
                  <p class="format-desc">{{ format.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Предпросмотр кода -->
          <section class="preview-section">
            <div class="section-header">
              <h3 class="section-title">Предпросмотр</h3>
              <div class="section-actions">
                <button @click="copyCode" class="action-btn" title="Скопировать код">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Копировать
                </button>
                <button @click="downloadCode" class="action-btn" title="Скачать файл">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Скачать
                </button>
              </div>
            </div>

            <div class="code-container">
              <pre class="code-preview"><code>{{ previewCode }}</code></pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

// Компоненты SVG иконок для форматов
const CssIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 3L5.777 20.089L12 22L18.223 20.089L20 3H4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M7 7H16.5L15.5 12.5L12 13.5L8.5 12.5L8 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const ScssIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 19L6.777 3.911L12 2L18.223 3.911L20 19L12 22L5 19Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M12 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M9 8.5L15 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
}

const JsonIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M8 8H16V16H8V8Z" fill="currentColor"/>
      <path d="M11 8V16" stroke="var(--bg-primary)" stroke-width="2"/>
      <path d="M13 8V16" stroke="var(--bg-primary)" stroke-width="2"/>
    </svg>
  `
}

const SwiftIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

const AndroidIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
      <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
    </svg>
  `
}

const TailwindIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6Z" stroke="currentColor" stroke-width="2"/>
      <path d="M12 12L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 12L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
}

export default {
  name: 'ExportPage',
  components: {
    CssIcon,
    ScssIcon,
    JsonIcon,
    SwiftIcon,
    AndroidIcon,
    TailwindIcon
  },

  setup() {
    const palettes = ref([])
    const selectedPalette = ref(null)
    const selectedFormat = ref('css')

    const exportFormats = ref([
      { id: 'css', name: 'CSS Variables', icon: 'CssIcon', description: 'CSS custom properties' },
      { id: 'scss', name: 'SCSS Variables', icon: 'ScssIcon', description: 'SCSS variables with preprocessing' },
      { id: 'tailwind', name: 'Tailwind Config', icon: 'TailwindIcon', description: 'Tailwind CSS configuration' },
      { id: 'json', name: 'JSON', icon: 'JsonIcon', description: 'Universal JSON format' },
      { id: 'swift', name: 'Swift', icon: 'SwiftIcon', description: 'SwiftUI color extensions' },
      { id: 'android', name: 'Android', icon: 'AndroidIcon', description: 'Android XML resources' }
    ])

    // Загрузка палитр
    const loadPalettes = () => {
      const library = localStorage.getItem('paletteLibrary')
      if (library) {
        try {
          palettes.value = JSON.parse(library)
        } catch (e) {
          console.error('Ошибка загрузки палитр:', e)
        }
      }
    }

    // Предпросмотр кода
    const previewCode = computed(() => {
      if (!selectedPalette.value) return '// Выберите палитру для экспорта'

      const colors = selectedPalette.value.colors
      const paletteName = selectedPalette.value.name.replace(/\s+/g, '-').toLowerCase()

      switch (selectedFormat.value) {
        case 'css':
          return `:root {
${colors.map((color, i) => `  --${paletteName}-${i + 1}: ${color};`).join('\n')}
}`
        case 'scss':
          return `$${paletteName}: (
${colors.map((color, i) => `  ${i + 1}: ${color},`).join('\n')}
);`
        case 'tailwind':
          return `module.exports = {
  theme: {
    extend: {
      colors: {
        '${paletteName}': {
${colors.map((color, i) => `          ${i + 1}: '${color}',`).join('\n')}
        }
      }
    }
  }
}`
        case 'json':
          return JSON.stringify({
            name: selectedPalette.value.name,
            colors: selectedPalette.value.colors
          }, null, 2)
        case 'swift':
          return `extension Color {
${colors.map((color, i) => `  static let ${paletteName}${i + 1} = Color("${color}")`).join('\n')}
}`
        case 'android':
          return `<resources>
${colors.map((color, i) => `  <color name="${paletteName}_${i + 1}">${color}</color>`).join('\n')}
</resources>`
        default:
          return '// Неизвестный формат'
      }
    })

    // Методы
    const selectPalette = (palette) => {
      selectedPalette.value = palette
    }

    const selectFormat = (format) => {
      selectedFormat.value = format
    }

    const copyCode = async () => {
      try {
        await navigator.clipboard.writeText(previewCode.value)
        alert('Код скопирован в буфер обмена')
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }

    const downloadCode = () => {
      const blob = new Blob([previewCode.value], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedPalette.value.name.replace(/\s+/g, '-')}.${getFileExtension()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const clearSelection = () => {
      selectedPalette.value = null
    }

    const getFileExtension = () => {
      const extensions = {
        'css': 'css',
        'scss': 'scss',
        'tailwind': 'js',
        'json': 'json',
        'swift': 'swift',
        'android': 'xml'
      }
      return extensions[selectedFormat.value] || 'txt'
    }

    onMounted(() => {
      loadPalettes()
    })

    return {
      palettes,
      selectedPalette,
      selectedFormat,
      exportFormats,
      previewCode,
      selectPalette,
      selectFormat,
      copyCode,
      downloadCode,
      clearSelection
    }
  }
}
</script>

<style scoped>
/* ===== БАЗОВЫЕ СТИЛИ ===== */
.export-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== ЗАГОЛОВОК СТРАНИЦЫ ===== */
.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== ОСНОВНОЙ КОНТЕЙНЕР ===== */
.export-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  min-height: 600px;
}

@media (max-width: 1024px) {
  .export-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* ===== БОКОВАЯ ПАНЕЛЬ ===== */
.export-sidebar {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  height: fit-content;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

/* Список палитр */
.palette-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.palette-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-primary);
}

.palette-item:hover {
  border-color: var(--accent-color);
  transform: translateX(4px);
}

.palette-item.selected {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
}

.palette-colors {
  display: flex;
  height: 24px;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.palette-color {
  flex: 1;
}

.palette-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.palette-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-count {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

/* ===== ОСНОВНОЙ КОНТЕНТ ===== */
.export-main {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  min-height: 600px;
}

/* Состояние без выбора */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  text-align: center;
}

.empty-state-icon {
  margin-bottom: 1.5rem;
  color: var(--text-tertiary);
  opacity: 0.5;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-state-description {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  max-width: 300px;
  margin: 0;
  line-height: 1.5;
}

/* ===== КОНТЕНТ С ВЫБРАННОЙ ПАЛИТРОЙ ===== */
.export-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Заголовки секций */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-badge {
  padding: 0.25rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
}

/* Превью палитры */
.palette-preview {
  display: flex;
  height: 64px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.preview-color {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-color:hover {
  flex: 1.2;
}

.preview-color:hover .color-hex {
  opacity: 1;
}

.color-hex {
  position: absolute;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

/* ===== ФОРМАТЫ ЭКСПОРТА ===== */
.formats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.format-card {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-primary);
}

.format-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.format-card.active {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
}

.format-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.format-card.active .format-icon {
  color: var(--accent-color);
}

.format-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.format-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* ===== ПРЕДПРОСМОТР КОДА ===== */
.section-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

/* Контейнер с кодом */
.code-container {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
  overflow: auto;
  max-height: 300px;
}

.code-preview {
  margin: 0;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-all;
}

.code-preview code {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 768px) {
  .export-page {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.9375rem;
  }

  .export-main,
  .export-sidebar {
    padding: 1.25rem;
  }

  .formats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .section-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .empty-state {
    height: 400px;
    padding: 1rem;
  }

  .action-btn {
    padding: 0.5rem;
  }

  .action-btn span {
    display: none;
  }

  .action-btn svg {
    margin: 0;
  }
}
</style>