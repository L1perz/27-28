<template>
  <div class="palette-library">
    <!-- Заголовок -->
    <div class="page-header">
      <h1>Библиотека палитр</h1>
      <p class="page-subtitle">Управляйте вашими сохранёнными цветовыми схемами</p>
    </div>

    <!-- Панель управления -->
    <div class="controls-section">
      <!-- Поиск -->
      <div class="search-container">
        <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Поиск по названию или тегам..."
        />
        <button @click="clearSearch" class="clear-search-btn" title="Очистить поиск">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Действия -->
      <div class="actions-section">
        <button @click="showCreateModal = true" class="action-btn primary">
          Создать палитру
        </button>
        <button @click="importPalettes" class="action-btn secondary">
          Импорт
        </button>
        <button @click="exportPalettes" class="action-btn secondary">
          Экспорт
        </button>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filters.onlyFavorites" />
          Только избранные
        </label>
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filters.withTags" />
          С тегами
        </label>
        <select v-model="filters.sortBy" class="sort-select">
          <option value="date">По дате</option>
          <option value="name">По названию</option>
          <option value="colors">По количеству цветов</option>
        </select>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="filteredPalettes.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-tertiary)" stroke-width="2"/>
          <path d="M8 8H16V16H8V8Z" fill="var(--text-tertiary)" fill-opacity="0.2"/>
          <path d="M12 12L16 8M12 12L8 16M12 12V8M12 12V16" stroke="var(--text-tertiary)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 v-if="searchQuery || filters.onlyFavorites || filters.withTags">
        Палитры не найдены
      </h3>
      <h3 v-else>
        Библиотека пуста
      </h3>
      <p v-if="searchQuery || filters.onlyFavorites || filters.withTags">
        Попробуйте изменить поисковый запрос или очистить фильтры
      </p>
      <p v-else>
        Создайте вашу первую палитру или импортируйте существующие
      </p>
      <button @click="showCreateModal = true" class="empty-state-btn">
        Создать первую палитру
      </button>
    </div>

    <!-- Сетка палитр -->
    <div v-else class="library-grid">
      <div
          v-for="palette in filteredPalettes"
          :key="palette.id"
          class="palette-card"
      >
        <div class="palette-header">
          <div class="palette-colors">
            <div
                v-for="(color, index) in palette.colors.slice(0, 5)"
                :key="index"
                class="palette-color"
                :style="{ backgroundColor: color }"
                :title="color"
            />
          </div>
          <button
              @click="toggleFavorite(palette)"
              class="favorite-btn"
              :class="{ 'favorited': palette.featured }"
          >
            <svg v-if="palette.featured" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="palette-content">
          <h3 class="palette-name">{{ palette.name }}</h3>
          <p v-if="palette.description" class="palette-description">
            {{ palette.description }}
          </p>
          <div class="palette-meta">
            <span class="color-count">{{ palette.colors.length }} цветов</span>
            <span class="palette-date">{{ formatDate(palette.createdAt) }}</span>
          </div>
          <div v-if="palette.tags && palette.tags.length" class="palette-tags">
            <span v-for="tag in palette.tags.slice(0, 3)" :key="tag" class="tag">
              {{ tag }}
            </span>
            <span v-if="palette.tags.length > 3" class="tag-more">
              +{{ palette.tags.length - 3 }}
            </span>
          </div>
        </div>

        <div class="palette-actions">
          <button @click="usePalette(palette)" class="action-icon" title="Использовать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13.5 4.5L21 12M13.5 19.5L21 12M21 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click="editPalette(palette)" class="action-icon" title="Редактировать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click="copyPalette(palette)" class="action-icon" title="Копировать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button @click="deletePalette(palette)" class="action-icon delete" title="Удалить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M10 11V17M14 11V17M5 6L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingPalette ? 'Редактирование палитры' : 'Создание палитры' }}</h3>
          <button @click="cancelEdit" class="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-form">
          <div class="form-group">
            <label>Название палитры *</label>
            <input v-model="newPalette.name" placeholder="Моя палитра" class="form-input" />
            <div v-if="nameError" class="error-message">{{ nameError }}</div>
          </div>

          <div class="form-group">
            <label>Описание</label>
            <textarea
                v-model="newPalette.description"
                placeholder="Описание палитры..."
                class="form-textarea"
                rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Теги (через запятую)</label>
            <input
                v-model="newPalette.tagsInput"
                placeholder="веб, интерфейс, тёмная тема"
                class="form-input"
            />
          </div>

          <div class="form-group">
            <div class="colors-header">
              <label>Цвета палитры *</label>
              <span class="colors-count">{{ newPalette.colors.length }} цветов</span>
            </div>
            <div v-if="colorsError" class="error-message">{{ colorsError }}</div>

            <div class="colors-grid">
              <div
                  v-for="(color, index) in newPalette.colors"
                  :key="index"
                  class="color-item"
                  :style="{ backgroundColor: color }"
                  @click="editColor(index)"
              >
                <span class="color-hex">{{ color }}</span>
                <button @click.stop="removeColor(index)" class="remove-color-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <button @click="addColor" class="add-color-btn" title="Добавить цвет">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div class="color-actions">
              <button @click="addRandomColor" class="action-btn small secondary">
                Случайный цвет
              </button>
              <button @click="shuffleColors" class="action-btn small secondary">
                Перемешать
              </button>
              <button @click="clearColors" class="action-btn small danger">
                Очистить
              </button>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="cancelEdit" class="action-btn secondary">Отмена</button>
            <button @click="savePalette" class="action-btn primary">
              {{ editingPalette ? 'Сохранить' : 'Создать' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно выбора цвета -->
    <div v-if="showColorPicker" class="modal-overlay" @click="showColorPicker = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Выберите цвет</h3>
          <button @click="showColorPicker = false" class="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="color-picker-wrapper">
          <input v-model="selectedColor" type="color" class="color-input" />
          <input
              v-model="selectedColor"
              type="text"
              class="color-text-input"
              placeholder="#000000"
              maxlength="7"
          />
        </div>
        <div class="color-preview" :style="{ backgroundColor: selectedColor }">
          {{ selectedColor }}
        </div>
        <div class="modal-actions">
          <button @click="showColorPicker = false" class="action-btn secondary">Отмена</button>
          <button @click="confirmColor" class="action-btn primary">Выбрать</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно импорта -->
    <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Импорт палитр</h3>
          <button @click="showImportModal = false" class="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="import-options">
          <button @click="importFromFile" class="import-option">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9M13 3L20 10M13 3V7C13 8.10457 13.8954 9 15 9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="import-info">
              <h4>Из файла JSON</h4>
              <p>Выберите файл с палитрами в формате JSON</p>
            </div>
          </button>

          <button @click="importFromText" class="import-option">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="import-info">
              <h4>Вставить JSON</h4>
              <p>Вставьте JSON текст с палитрами</p>
            </div>
          </button>
        </div>

        <div v-if="importError" class="error-message">{{ importError }}</div>
        <div v-if="importSuccess" class="success-message">
          Успешно импортировано {{ importedCount }} палитр
        </div>

        <div class="modal-actions">
          <button @click="showImportModal = false" class="action-btn secondary">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PaletteStore, initializePaletteStore } from '../utils/paletteStore'

export default {
  name: 'PaletteLibrary',

  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const filters = ref({
      onlyFavorites: false,
      withTags: false,
      sortBy: 'date'
    })

    const palettes = ref([])
    const showCreateModal = ref(false)
    const showColorPicker = ref(false)
    const showImportModal = ref(false)
    const editingPalette = ref(null)
    const editingColorIndex = ref(null)
    const nameError = ref('')
    const colorsError = ref('')
    const importError = ref('')
    const importSuccess = ref(false)
    const importedCount = ref(0)

    const newPalette = ref({
      name: '',
      description: '',
      tagsInput: '',
      colors: ['#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936']
    })

    const selectedColor = ref('#667eea')

    // Загрузка палитр
    const loadPalettes = () => {
      palettes.value = PaletteStore.getAll()
    }

    // Отфильтрованные палитры
    const filteredPalettes = computed(() => {
      if (!palettes.value || !Array.isArray(palettes.value)) {
        return []
      }

      let filtered = [...palettes.value]

      // Поиск по названию и тегам
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(palette => {
          if (!palette) return false

          const nameMatch = palette.name &&
              palette.name.toLowerCase().includes(query)

          const tagsMatch = palette.tags &&
              Array.isArray(palette.tags) &&
              palette.tags.some(tag =>
                  tag && tag.toLowerCase().includes(query)
              )

          const descMatch = palette.description &&
              palette.description.toLowerCase().includes(query)

          return nameMatch || tagsMatch || descMatch
        })
      }

      // Фильтр по избранному
      if (filters.value.onlyFavorites) {
        filtered = filtered.filter(palette => palette && palette.featured)
      }

      // Фильтр по тегам
      if (filters.value.withTags) {
        filtered = filtered.filter(palette =>
            palette && palette.tags &&
            Array.isArray(palette.tags) &&
            palette.tags.length > 0
        )
      }

      // Сортировка
      filtered.sort((a, b) => {
        if (!a || !b) return 0

        switch (filters.value.sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '')
          case 'colors':
            return (b.colors?.length || 0) - (a.colors?.length || 0)
          case 'date':
          default:
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
            return dateB - dateA
        }
      })

      return filtered
    })

    // Форматирование даты
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    // Валидация
    const validatePalette = () => {
      nameError.value = ''
      colorsError.value = ''

      if (!newPalette.value.name.trim()) {
        nameError.value = 'Введите название палитры'
        return false
      }

      if (newPalette.value.colors.length === 0) {
        colorsError.value = 'Добавьте хотя бы один цвет'
        return false
      }

      if (!editingPalette.value) {
        const exists = palettes.value.some(p =>
            p.name.toLowerCase() === newPalette.value.name.toLowerCase()
        )
        if (exists) {
          nameError.value = 'Палитра с таким названием уже существует'
          return false
        }
      }

      return true
    }

    // Методы (сохраняем все ваши методы без изменений)
    const performSearch = () => {
      console.log('Поиск:', searchQuery.value)
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const editPalette = (palette) => {
      editingPalette.value = palette
      newPalette.value = {
        name: palette.name,
        description: palette.description || '',
        tagsInput: palette.tags?.join(', ') || '',
        colors: [...palette.colors]
      }
      showCreateModal.value = true
    }

    const copyPalette = (palette) => {
      const paletteString = JSON.stringify(palette, null, 2)
      navigator.clipboard.writeText(paletteString)
          .then(() => {
            alert('Палитра скопирована в буфер!')
            const copy = {
              ...palette,
              id: Date.now(),
              name: `${palette.name} (копия)`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            PaletteStore.add(copy)
            loadPalettes()
          })
          .catch(err => console.error('Ошибка копирования:', err))
    }

    const toggleFavorite = (palette) => {
      const updated = { ...palette, featured: !palette.featured }
      PaletteStore.update(palette.id, updated)
      loadPalettes()
    }

    const deletePalette = (palette) => {
      if (confirm(`Удалить палитру "${palette.name}"?`)) {
        PaletteStore.delete(palette.id)
        loadPalettes()
      }
    }

    const usePalette = (palette) => {
      PaletteStore.setCurrent(palette.colors.map(color => ({
        hex: color,
        rgb: hexToRgb(color),
        isLight: isLightColor(color)
      })))
      router.push('/')
    }

    const sharePalette = (palette) => {
      const paletteData = {
        ...palette,
        source: 'Color Palette Generator'
      }

      const shareText = `Палитра: ${palette.name}\n`
      const colorsText = palette.colors.map(c => c).join('\n')
      const tagsText = palette.tags?.length ? `\nТеги: ${palette.tags.join(', ')}` : ''

      const text = `${shareText}${colorsText}${tagsText}\n\nСоздано в Color Palette Generator`

      navigator.clipboard.writeText(text)
          .then(() => alert('Палитра скопирована для sharing!'))
          .catch(err => console.error('Ошибка копирования:', err))
    }

    const addColor = () => {
      selectedColor.value = '#667eea'
      editingColorIndex.value = null
      showColorPicker.value = true
    }

    const editColor = (index) => {
      selectedColor.value = newPalette.value.colors[index]
      editingColorIndex.value = index
      showColorPicker.value = true
    }

    const removeColor = (index) => {
      newPalette.value.colors.splice(index, 1)
    }

    const addRandomColor = () => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      newPalette.value.colors.push(randomColor)
    }

    const shuffleColors = () => {
      newPalette.value.colors = [...newPalette.value.colors].sort(() => Math.random() - 0.5)
    }

    const clearColors = () => {
      if (confirm('Очистить все цвета?')) {
        newPalette.value.colors = []
      }
    }

    const confirmColor = () => {
      if (!selectedColor.value.startsWith('#')) {
        selectedColor.value = '#' + selectedColor.value
      }

      if (editingColorIndex.value !== null) {
        newPalette.value.colors[editingColorIndex.value] = selectedColor.value
      } else {
        newPalette.value.colors.push(selectedColor.value)
      }

      showColorPicker.value = false
      editingColorIndex.value = null
    }

    const cancelEdit = () => {
      showCreateModal.value = false
      resetNewPalette()
    }

    const savePalette = () => {
      if (!validatePalette()) {
        return
      }

      const tags = newPalette.value.tagsInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)

      const paletteData = {
        id: editingPalette.value?.id || Date.now(),
        name: newPalette.value.name.trim(),
        description: newPalette.value.description.trim(),
        colors: [...newPalette.value.colors],
        tags,
        featured: editingPalette.value?.featured || false,
        createdAt: editingPalette.value?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (editingPalette.value) {
        PaletteStore.update(editingPalette.value.id, paletteData)
      } else {
        PaletteStore.add(paletteData)
      }

      loadPalettes()
      showCreateModal.value = false
      resetNewPalette()
    }

    const resetNewPalette = () => {
      newPalette.value = {
        name: '',
        description: '',
        tagsInput: '',
        colors: ['#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936']
      }
      editingPalette.value = null
      nameError.value = ''
      colorsError.value = ''
    }

    const importPalettes = () => {
      showImportModal.value = true
      importError.value = ''
      importSuccess.value = false
    }

    const importFromFile = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,application/json'

      input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const result = PaletteStore.importFromJSON(e.target.result)
            if (result.success) {
              importedCount.value = result.count
              importSuccess.value = true
              importError.value = ''
              loadPalettes()

              setTimeout(() => {
                showImportModal.value = false
                importSuccess.value = false
              }, 2000)
            } else {
              importError.value = `Ошибка импорта: ${result.error}`
            }
          } catch (error) {
            importError.value = `Ошибка чтения файла: ${error.message}`
          }
        }
        reader.readAsText(file)
      }

      input.click()
    }

    const importFromText = () => {
      const jsonText = prompt('Введите JSON текст с палитрами:')
      if (!jsonText) return

      const result = PaletteStore.importFromJSON(jsonText)
      if (result.success) {
        importedCount.value = result.count
        importSuccess.value = true
        importError.value = ''
        loadPalettes()

        setTimeout(() => {
          showImportModal.value = false
          importSuccess.value = false
        }, 2000)
      } else {
        importError.value = `Ошибка импорта: ${result.error}`
      }
    }

    const exportPalettes = () => {
      const data = PaletteStore.exportToJSON()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `palettes-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    // Вспомогательные функции
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ?
          `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` :
          null
    }

    const isLightColor = (hex) => {
      const rgb = hexToRgb(hex)
      if (!rgb) return false
      const [r, g, b] = rgb.match(/\d+/g).map(Number)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128
    }

    // Инициализация
    onMounted(() => {
      initializePaletteStore()
      loadPalettes()
    })

    return {
      searchQuery,
      filters,
      filteredPalettes,
      showCreateModal,
      showColorPicker,
      showImportModal,
      editingPalette,
      newPalette,
      selectedColor,
      nameError,
      colorsError,
      importError,
      importSuccess,
      importedCount,
      formatDate,
      performSearch,
      clearSearch,
      editPalette,
      copyPalette,
      toggleFavorite,
      deletePalette,
      usePalette,
      sharePalette,
      addColor,
      editColor,
      removeColor,
      addRandomColor,
      shuffleColors,
      clearColors,
      confirmColor,
      cancelEdit,
      savePalette,
      importPalettes,
      importFromFile,
      importFromText,
      exportPalettes
    }
  }
}
</script>

<style scoped>
/* ===== ОСНОВНЫЕ СТИЛИ ===== */
.palette-library {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== ЗАГОЛОВОК ===== */
.page-header {
  margin-bottom: 2.5rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

/* ===== ПАНЕЛЬ УПРАВЛЕНИЯ ===== */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.clear-search-btn svg {
  width: 16px;
  height: 16px;
}

.actions-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.action-btn.primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.action-btn.secondary:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.action-btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.action-btn.danger {
  background: var(--danger-color);
  color: white;
  border-color: var(--danger-color);
}

.action-btn.danger:hover {
  background: var(--danger-color-hover);
  border-color: var(--danger-color-hover);
  transform: translateY(-1px);
}

/* ===== ФИЛЬТРЫ ===== */
.filters-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  user-select: none;
}

.filter-checkbox input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-color);
}

.sort-select {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23475569' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  transition: all 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.1);
}

/* ===== СОСТОЯНИЕ ПУСТОЙ БИБЛИОТЕКИ ===== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin: 2rem 0;
}

.empty-icon {
  margin-bottom: 1.5rem;
  color: var(--text-tertiary);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  max-width: 400px;
  margin: 0 auto 1.5rem;
  line-height: 1.5;
}

.empty-state-btn {
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-state-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

/* ===== СЕТКА ПАЛИТР ===== */
.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .library-grid {
    grid-template-columns: 1fr;
  }
}

/* Карточка палитры */
.palette-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.2s ease;
}

.palette-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.palette-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0;
}

.palette-colors {
  display: flex;
  height: 40px;
  flex: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.palette-color {
  flex: 1;
  transition: flex 0.2s ease;
}

.palette-color:hover {
  flex: 1.2;
}

.favorite-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  color: var(--warning-color);
  background: var(--bg-tertiary);
}

.favorite-btn.favorited {
  color: var(--warning-color);
}

.palette-content {
  padding: 1rem;
}

.palette-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.palette-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
}

.color-count {
  color: var(--text-tertiary);
}

.palette-date {
  color: var(--text-tertiary);
}

.palette-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-more {
  padding: 0.25rem 0.5rem;
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-style: italic;
}

.palette-actions {
  display: flex;
  padding: 0.75rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  gap: 0.5rem;
}

.action-icon {
  flex: 1;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-icon:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--accent-color);
}

.action-icon.delete:hover {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.action-icon svg {
  width: 16px;
  height: 16px;
}

/* ===== МОДАЛЬНЫЕ ОКНА ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.success-message {
  color: var(--success-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.colors-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.colors-count {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.color-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-item:hover {
  transform: scale(1.05);
}

.color-item:hover .remove-color-btn {
  opacity: 1;
}

.color-hex {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.remove-color-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-color-btn {
  aspect-ratio: 1;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-color-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: var(--bg-secondary);
}

.add-color-btn svg {
  width: 20px;
  height: 20px;
}

.color-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-picker-wrapper {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.color-input {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 0;
}

.color-text-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-family: monospace;
}

.color-preview {
  width: 100%;
  height: 60px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  margin: 1.5rem 0;
  font-family: monospace;
}

.import-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.import-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.import-option:hover {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.import-option svg {
  width: 24px;
  height: 24px;
}

.import-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
  margin: 0 0 0.25rem 0;
}

.import-info p {
  font-size: 0.875rem;
  color: inherit;
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 768px) {
  .palette-library {
    padding: 1.5rem 1rem;
  }

  .controls-section {
    gap: 1rem;
  }

  .actions-section {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
    margin: 1.5rem 0;
  }

  .library-grid {
    gap: 1rem;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .colors-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.9375rem;
  }

  .empty-state h3 {
    font-size: 1.125rem;
  }

  .empty-state p {
    font-size: 0.875rem;
  }

  .palette-name {
    font-size: 1rem;
  }

  .modal-form {
    padding: 1rem;
  }

  .modal-actions {
    padding: 1rem;
  }
}
</style>