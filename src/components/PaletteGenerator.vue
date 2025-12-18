<template>
  <div class="palette-generator">
    <!-- Заголовок -->
    <div class="page-header">
      <h1>Генератор цветовых палитр</h1>
      <p class="page-subtitle">Создавайте, сохраняйте и тестируйте гармоничные цветовые схемы для ваших проектов</p>
    </div>

    <!-- Панель управления -->
    <div class="controls-section">
      <!-- Первая строка настроек -->
      <div class="controls-row">
        <div class="control-group">
          <label class="control-label">Количество цветов</label>
          <div class="number-buttons">
            <button
                v-for="count in [3, 4, 5, 6, 7]"
                :key="count"
                :class="['count-btn', { active: colorCount === count }]"
                @click="setColorCount(count)"
            >
              {{ count }}
            </button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">Формат цвета</label>
          <div class="number-buttons">
            <button
                v-for="format in ['hex', 'rgb', 'hsl']"
                :key="format"
                :class="['count-btn', { active: colorFormat === format }]"
                @click="colorFormat = format"
            >
              {{ format.toUpperCase() }}
            </button>
          </div>
        </div>
      </div>

      <!-- Вторая строка - базовый цвет -->
      <div class="controls-row">
        <div class="control-group">
          <label class="control-label">Базовый цвет</label>
          <div class="base-color-picker">
            <input
                v-model="baseColor"
                type="color"
                class="color-picker-input"
                @change="generateFromBaseColor"
            >
            <span class="color-hex">{{ baseColor }}</span>
            <button
                @click="generateFromBaseColor"
                class="action-btn secondary small"
            >
              Сгенерировать
            </button>
          </div>
        </div>
      </div>

      <!-- Третья строка кнопок -->
      <div class="controls-row">
        <div class="action-buttons">
          <button @click="generatePalette" class="action-btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 7C15 4.23858 12.7614 2 10 2C7.23858 2 5 4.23858 5 7C5 9.76142 7.23858 12 10 12C12.7614 12 15 9.76142 15 7Z" stroke="currentColor" stroke-width="2"/>
              <path d="M19 19C19 16.2386 16.7614 14 14 14C11.2386 14 9 16.2386 9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ paletteType === 'random' ? 'Случайная' : 'Сгенерировать' }}
          </button>
          <button @click="saveToLibrary" class="action-btn success" :disabled="!canSave">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H14L21 10V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 3V9H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Сохранить в библиотеку
          </button>
          <button @click="clearPalette" class="action-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M10 11V17M14 11V17M5 6L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Очистить
          </button>
          <button @click="exportPalette" class="action-btn secondary" :disabled="!canSave">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Экспорт
          </button>
        </div>
      </div>
    </div>

    <!-- Палитра цветов -->
    <div v-if="currentPalette.length > 0" class="palette-container">
      <div class="palette-grid">
        <div
            v-for="(color, index) in currentPalette"
            :key="`color-${color.hex}-${index}`"
            class="color-item"
            :style="{ backgroundColor: color.hex }"
            @click="copyToClipboard(color)"
        >
          <div class="color-info" :class="{ 'text-dark': !color.isLight, 'text-light': color.isLight }">
            <div class="color-value">
              {{
                colorFormat === 'hex'
                    ? color.hex
                    : colorFormat === 'rgb'
                        ? color.rgb
                        : color.hsl
              }}
            </div>
            <div class="color-actions">
              <button
                  @click.stop="toggleLock(index)"
                  class="color-action-btn"
                  :title="color.locked ? 'Разблокировать' : 'Заблокировать'"
              >
                <svg v-if="color.locked" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8M5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8M5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button
                  @click.stop="removeColor(index)"
                  class="color-action-btn"
                  title="Удалить"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M10 11V17M14 11V17M5 6L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div v-if="color.copied" class="copied-badge" :class="{ 'text-dark': !color.isLight, 'text-light': color.isLight }">
            Скопировано!
          </div>
        </div>
      </div>

      <div class="palette-actions-bottom">
        <button @click="shuffleColors" class="action-btn secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M16 3H21V8M20 14L21 15L22 14M3 6C3 6 3.5 8 6 10C8.5 12 11 12 13 10C15 8 15 6 15 6M21 21V16M10 4L9 3L8 4M14 20L15 21L16 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Перемешать
        </button>
        <button @click="invertColors" class="action-btn secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Инвертировать
        </button>
      </div>
    </div>

    <!-- Контрастность -->
    <div v-if="currentPalette.length > 0" class="contrast-section">
      <div class="section-header">
        <h3 class="section-title">Контрастность WCAG</h3>
      </div>

      <div v-if="contrastPairs.length > 0" class="contrast-grid">
        <div
            v-for="(pair, idx) in contrastPairs"
            :key="idx"
            class="contrast-item"
        >
          <div class="contrast-colors">
            <div
                class="contrast-color"
                :style="{ backgroundColor: pair.color1 }"
                :title="pair.color1"
            ></div>
            <div
                class="contrast-color"
                :style="{ backgroundColor: pair.color2 }"
                :title="pair.color2"
            ></div>
          </div>
          <div class="contrast-info">
            <div class="contrast-value">Контраст: {{ pair.contrast }}</div>
            <div
                class="contrast-rating"
                :style="{ color: pair.rating.color }"
            >
              {{ pair.rating.level }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-contrast">
        <p>Добавьте больше цветов для проверки контрастности</p>
      </div>
    </div>

    <!-- Палитры из библиотеки -->
    <div v-if="savedPalettes.length > 0" class="saved-palettes-section">
      <div class="section-header">
        <h3 class="section-title">Палитры из библиотеки</h3>
        <button @click="refreshSavedPalettes" class="refresh-btn" title="Обновить">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M23 4V10H17M1 20V14H7M1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="palettes-grid">
        <div
            v-for="palette in savedPalettes"
            :key="palette.id"
            class="saved-palette-card"
        >
          <div class="palette-header">
            <h4 class="palette-name">{{ palette.name }}</h4>
            <div class="palette-badges">
              <span v-if="palette.featured" class="badge featured">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </span>
              <span class="badge count">{{ palette.colors.length }} цветов</span>
            </div>
          </div>

          <div class="palette-colors">
            <div
                v-for="(color, idx) in palette.colors.slice(0, 5)"
                :key="idx"
                class="palette-color"
                :style="{ backgroundColor: color }"
                :title="color"
            ></div>
            <div v-if="palette.colors.length > 5" class="more-colors">
              +{{ palette.colors.length - 5 }}
            </div>
          </div>

          <div class="palette-actions">
            <button @click="loadPalette(palette)" class="palette-action-btn" title="Загрузить">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13.5 4.5L21 12M13.5 19.5L21 12M21 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button @click="copyPalette(palette)" class="palette-action-btn" title="Копировать">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button @click="toggleFavorite(palette)" class="palette-action-btn" :title="palette.featured ? 'Убрать из избранного' : 'В избранное'">
              <svg v-if="palette.featured" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button @click="deletePalette(palette)" class="palette-action-btn" title="Удалить">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H21M10 11V17M14 11V17M5 6L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Предпросмотр интерфейса -->
    <div class="preview-section" :class="{ 'dark-mode': previewDarkMode }">
      <div class="preview-header">
        <h3>Предпросмотр интерфейса</h3>
        <div class="preview-controls">
          <button @click="previewDarkMode = !previewDarkMode" class="toggle-theme-btn">
            <svg v-if="previewDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
            {{ previewDarkMode ? 'Светлая тема' : 'Тёмная тема' }}
          </button>
        </div>
      </div>

      <div class="preview-content full-preview">
        <!-- Header -->
        <header class="preview-header-bar"
                :style="{
                  backgroundColor: previewColors.accent,
                  color: isLightColor(previewColors.accent) ? '#000' : '#fff'
                }">
          <div class="ph-logo">MyApp</div>
          <nav class="ph-nav">
            <a href="javascript:void(0)" class="ph-link">Главная</a>
            <a href="javascript:void(0)" class="ph-link">Каталог</a>
            <a href="javascript:void(0)" class="ph-link">Контакты</a>
          </nav>
          <button class="ph-login-btn"
                  :style="{
                    backgroundColor: previewColors.primary,
                    color: isLightColor(previewColors.primary) ? '#000' : '#fff'
                  }">
            Войти
          </button>
        </header>

        <div class="preview-layout">
          <!-- Sidebar -->
          <aside class="ph-sidebar"
                 :style="{
                   backgroundColor: previewColors.surface,
                   borderColor: previewColors.border,
                   color: previewColors.text
                 }">
            <div class="ph-side-title">Меню</div>
            <ul class="ph-side-menu">
              <li class="ph-item">Профиль</li>
              <li class="ph-item">Проекты</li>
              <li class="ph-item">Статистика</li>
              <li class="ph-item">Настройки</li>
            </ul>
          </aside>

          <!-- Main Content -->
          <main class="ph-main">
            <h2 class="ph-title">Попробуйте вашу палитру в интерфейсе</h2>
            <div class="ph-card"
                 :style="{
                   backgroundColor: previewColors.surface,
                   borderColor: previewColors.border,
                   color: previewColors.text
                 }">
              <h3>Карточка товара</h3>
              <p>Это демонстрация текстов, кнопок и тегов в вашем цветовом наборе.</p>
              <div class="ph-tags">
                <span class="ph-tag"
                      :style="{
                        backgroundColor: previewColors.secondary,
                        color: isLightColor(previewColors.secondary) ? '#000' : '#fff'
                      }">
                  New
                </span>
                <span class="ph-tag"
                      :style="{
                        backgroundColor: previewColors.primary,
                        color: isLightColor(previewColors.primary) ? '#000' : '#fff'
                      }">
                  -50%
                </span>
              </div>
              <div class="ph-buttons">
                <button class="ph-btn primary"
                        :style="{
                          backgroundColor: previewColors.primary,
                          color: isLightColor(previewColors.primary) ? '#000' : '#fff'
                        }">
                  Купить
                </button>
                <button class="ph-btn secondary"
                        :style="{
                          backgroundColor: previewColors.secondary,
                          color: isLightColor(previewColors.secondary) ? '#000' : '#fff'
                        }">
                  В корзину
                </button>
              </div>
            </div>
          </main>
        </div>

        <!-- Footer -->
        <footer class="ph-footer"
                :style="{
                  backgroundColor: previewColors.secondary,
                  color: isLightColor(previewColors.secondary) ? '#000' : '#fff'
                }">
          © 2025 Demo interface preview
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { PaletteStore } from '../utils/paletteStore'

export default {
  name: 'PaletteGenerator',

  setup() {
    const router = useRouter()
    const notify = inject('notify')
    const showConfirm = inject('showConfirm')

    // Основные реактивные переменные
    const colorCount = ref(5)
    const colorFormat = ref('hex')
    const previewDarkMode = ref(false)
    const currentPalette = ref([])
    const savedPalettes = ref([])
    const baseColor = ref('#667eea')
    const paletteType = ref('random')

    // Типы палитр
    const paletteTypes = ref([
      { value: 'random', name: 'Случайная' },
      { value: 'analogous', name: 'Аналогичная' },
      { value: 'complementary', name: 'Комплементарная' },
      { value: 'triadic', name: 'Триадная' },
      { value: 'monochromatic', name: 'Монохромная' }
    ])

    const hexToHslString = (hex) => {
      const { h, s, l } = hexToHsl(hex)
      return `hsl(${h}, ${s}%, ${l}%)`
    }

    // Компьютед свойства
    const canSave = computed(() => {
      return currentPalette.value.length > 0
    })

    const previewColors = computed(() => {
      const p = currentPalette.value

      return {
        bg: p[0]?.hex || "#ffffff",
        primary: p[1]?.hex || "#667eea",
        secondary: p[2]?.hex || "#e2e8f0",
        accent: p[3]?.hex || p[1]?.hex || "#764ba2",
        text: p[4]?.hex || (p[0]?.isLight ? "#000" : "#fff"),
        border: p[5]?.hex || "rgba(0,0,0,0.15)",
        surface: p[6]?.hex || "#f1f5f9"
      }
    })

    const accessibilityScore = computed(() => {
      if (currentPalette.value.length === 0) return 85
      const scores = currentPalette.value.map(color => color.isLight ? 90 : 80)
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    })

    const contrastRating = computed(() => {
      if (currentPalette.value.length < 2) return 'A'
      const contrasts = []
      for (let i = 0; i < Math.min(currentPalette.value.length, 3); i++) {
        for (let j = i + 1; j < Math.min(currentPalette.value.length, 3); j++) {
          const contrast = calculateContrast(currentPalette.value[i].hex, currentPalette.value[j].hex)
          if (contrast >= 7) contrasts.push('AAA')
          else if (contrast >= 4.5) contrasts.push('AA')
          else contrasts.push('A')
        }
      }
      return contrasts.includes('AAA') ? 'AAA' : contrasts.includes('AA') ? 'AA' : 'A'
    })

    const colorHarmony = computed(() => {
      if (currentPalette.value.length < 2) return 'Хорошая'
      const harmonies = ['Отличная', 'Хорошая', 'Удовлетворительная']
      const avgSaturation = currentPalette.value.reduce((sum, color) => {
        const hsl = hexToHsl(color.hex)
        return sum + hsl.s
      }, 0) / currentPalette.value.length

      return avgSaturation > 50 ? harmonies[0] : avgSaturation > 30 ? harmonies[1] : harmonies[2]
    })

    // Контрастные пары для WCAG проверки
    const contrastPairs = computed(() => {
      const pairs = []
      if (currentPalette.value.length < 2) return pairs

      for (let i = 0; i < Math.min(currentPalette.value.length, 3); i++) {
        for (let j = i + 1; j < Math.min(currentPalette.value.length, 3); j++) {
          const contrast = calculateContrast(
              currentPalette.value[i].hex,
              currentPalette.value[j].hex
          )
          pairs.push({
            color1: currentPalette.value[i].hex,
            color2: currentPalette.value[j].hex,
            contrast: contrast.toFixed(2),
            rating: getContrastRating(contrast)
          })
        }
      }
      return pairs
    })

    const previewCardStyle = computed(() => {
      return {
        backgroundColor: previewDarkMode.value ? "#1a1e29" : previewColors.value.bg,
        color: previewColors.value.text,
        border: `1px solid ${previewColors.value.border}`
      }
    })

    const previewButtonStyle = computed(() => ({
      backgroundColor: previewColors.value.primary,
      color: isLightColor(previewColors.value.primary) ? "#000" : "#fff"
    }))

    const previewSecondaryButtonStyle = computed(() => ({
      backgroundColor: previewColors.value.secondary,
      color: isLightColor(previewColors.value.secondary) ? "#000" : "#fff"
    }))

    // Вспомогательные функции
    const generateRandomColor = () => {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ?
          `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` :
          null
    }

    const rgbToHex = (r, g, b) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }

    const hexToHsl = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      let r = parseInt(result[1], 16) / 255
      let g = parseInt(result[2], 16) / 255
      let b = parseInt(result[3], 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2

      if (max === min) {
        h = s = 0 // achromatic
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }

        h /= 6
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      }
    }

    const hslToHex = (h, s, l) => {
      h /= 360
      s /= 100
      l /= 100

      let r, g, b

      if (s === 0) {
        r = g = b = l
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1/6) return p + (q - p) * 6 * t
          if (t < 1/2) return q
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
          return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q

        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }

      const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const adjustColor = (hex, saturationDelta = 0, brightnessDelta = 0) => {
      const hsl = hexToHsl(hex)
      let newS = Math.max(0, Math.min(100, hsl.s + saturationDelta))
      let newL = Math.max(0, Math.min(100, hsl.l + brightnessDelta))

      return hslToHex(hsl.h, newS, newL)
    }

    const isLightColor = (hex) => {
      const rgb = hexToRgb(hex)
      if (!rgb) return false
      const [r, g, b] = rgb.match(/\d+/g).map(Number)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128
    }

    const calculateContrast = (color1, color2) => {
      const rgb1 = hexToRgb(color1).match(/\d+/g).map(Number)
      const rgb2 = hexToRgb(color2).match(/\d+/g).map(Number)

      const lum1 = (0.2126 * rgb1[0] + 0.7152 * rgb1[1] + 0.0722 * rgb1[2]) / 255
      const lum2 = (0.2126 * rgb2[0] + 0.7152 * rgb2[1] + 0.0722 * rgb2[2]) / 255

      const brightest = Math.max(lum1, lum2)
      const darkest = Math.min(lum1, lum2)

      return (brightest + 0.05) / (darkest + 0.05)
    }

    // Рейтинг контрастности для WCAG
    const getContrastRating = (contrast) => {
      if (contrast >= 7) return { level: 'AAA', color: '#10b981' }
      if (contrast >= 4.5) return { level: 'AA', color: '#f59e0b' }
      return { level: 'Недостаточно', color: '#ef4444' }
    }

    const generateHarmoniousPalette = (type, baseColor = null) => {
      const baseHex = baseColor || generateRandomColor()
      const baseHsl = hexToHsl(baseHex)
      const colors = [baseHex]

      switch (type) {
        case 'analogous':
          // 30 градусов разницы
          for (let i = 1; i < colorCount.value; i++) {
            const hue = (baseHsl.h + i * 30) % 360
            colors.push(hslToHex(hue, baseHsl.s, baseHsl.l))
          }
          break

        case 'complementary':
          // Основной цвет + противоположный
          colors.push(hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l))
          // Дополнительные цвета
          for (let i = 2; i < colorCount.value; i++) {
            const hue = (baseHsl.h + i * 60) % 360
            colors.push(hslToHex(hue, baseHsl.s, baseHsl.l))
          }
          break

        case 'triadic':
          // Триадная схема (120 градусов)
          for (let i = 1; i < colorCount.value; i++) {
            const hue = (baseHsl.h + i * 120) % 360
            colors.push(hslToHex(hue, baseHsl.s, baseHsl.l))
          }
          break

        case 'monochromatic':
          // Оттенки одного цвета
          for (let i = 1; i < colorCount.value; i++) {
            const lightness = Math.max(10, Math.min(90, baseHsl.l + (i * 15 - 30)))
            colors.push(hslToHex(baseHsl.h, baseHsl.s, lightness))
          }
          break

        default: // random
          for (let i = 1; i < colorCount.value; i++) {
            colors.push(generateRandomColor())
          }
      }

      return colors.map(hex => ({
        hex,
        rgb: hexToRgb(hex),
        hsl: hexToHslString(hex),
        locked: false,
        copied: false,
        isLight: isLightColor(hex)
      }))
    }

    // Генерация на основе базового цвета
    // Генерация на основе базового цвета
    // Заменяем функцию generateFromBaseColor на эту:
    const generateFromBaseColor = () => {
      console.log('generateFromBaseColor called', {
        baseColor: baseColor.value,
        paletteType: paletteType.value,
        colorCount: colorCount.value
      })

      // Оставляем заблокированные цвета
      const lockedColors = currentPalette.value.filter(color => color.locked)
      console.log('Locked colors:', lockedColors.length)

      // Создаем объект базового цвета
      const baseColorObj = {
        hex: baseColor.value,
        rgb: hexToRgb(baseColor.value),
        hsl: hexToHslString(baseColor.value),
        locked: false,
        copied: false,
        isLight: isLightColor(baseColor.value)
      }

      console.log('Base color object:', baseColorObj)

      // Генерируем новую палитру в зависимости от типа
      let newColors = []

      if (paletteType.value === 'random') {
        // Для случайной палитры - генерируем разнообразные цвета
        const baseHsl = hexToHsl(baseColor.value)

        // Первый цвет всегда базовый
        newColors.push(baseColorObj)

        // Генерируем остальные цвета с вариациями
        for (let i = 1; i < colorCount.value; i++) {
          let newHue, newSat, newLight

          // Разнообразные стратегии генерации
          if (i % 3 === 0) {
            // Аналогичные цвета (+30 градусов)
            newHue = (baseHsl.h + i * 30) % 360
            newSat = Math.min(100, Math.max(30, baseHsl.s + (Math.random() * 20 - 10)))
            newLight = Math.min(90, Math.max(20, baseHsl.l + (Math.random() * 30 - 15)))
          } else if (i % 3 === 1) {
            // Комплементарные вариации
            newHue = (baseHsl.h + 180 + (Math.random() * 60 - 30)) % 360
            newSat = Math.min(100, Math.max(40, baseHsl.s + (Math.random() * 30 - 15)))
            newLight = Math.min(85, Math.max(25, baseHsl.l + (Math.random() * 40 - 20)))
          } else {
            // Полностью случайные с ограничениями
            newHue = (baseHsl.h + 90 + (Math.random() * 180 - 90)) % 360
            newSat = 30 + Math.random() * 70
            newLight = 25 + Math.random() * 60
          }

          const newHex = hslToHex(newHue, newSat, newLight)
          newColors.push({
            hex: newHex,
            rgb: hexToRgb(newHex),
            hsl: `hsl(${Math.round(newHue)}, ${Math.round(newSat)}%, ${Math.round(newLight)}%)`,
            locked: false,
            copied: false,
            isLight: isLightColor(newHex)
          })
        }
      } else {
        // Для гармоничных палитр используем существующую логику
        const tempPaletteType = paletteType.value === 'random' ? 'analogous' : paletteType.value
        console.log('Using palette type for harmonious:', tempPaletteType)

        const harmoniousPalette = generateHarmoniousPalette(tempPaletteType, baseColor.value)
        newColors = harmoniousPalette.map(color => ({
          ...color,
          locked: false,
          copied: false
        }))
      }

      console.log('Generated colors:', newColors.map(c => c.hex))

      // Начинаем с базового цвета
      const finalPalette = [baseColorObj]
      console.log('Final palette starts with base:', finalPalette[0].hex)

      // Добавляем заблокированные цвета (кроме базового, если он заблокирован)
      const lockedWithoutBase = lockedColors.filter(c => c.hex !== baseColor.value)
      if (lockedWithoutBase.length > 0) {
        finalPalette.push(...lockedWithoutBase)
        console.log('Added locked colors:', lockedWithoutBase.map(c => c.hex))
      }

      // Добавляем остальные цвета из новой палитры, исключая дубликаты
      const usedHexes = new Set(finalPalette.map(c => c.hex))

      // Исключаем базовый цвет из новых цветов (он уже есть первым)
      const otherColors = newColors
          .filter(color => color.hex !== baseColor.value)
          .filter(color => !usedHexes.has(color.hex))

      console.log('Other colors available:', otherColors.map(c => c.hex))

      // Заполняем до нужного количества
      const remainingSlots = colorCount.value - finalPalette.length
      console.log('Remaining slots:', remainingSlots)

      if (remainingSlots > 0) {
        const toAdd = otherColors.slice(0, remainingSlots)
        finalPalette.push(...toAdd)
        console.log('Added colors:', toAdd.map(c => c.hex))
      }

      console.log('Final palette before slice:', finalPalette.map(c => c.hex))
      currentPalette.value = finalPalette.slice(0, colorCount.value)
      console.log('Current palette after update:', currentPalette.value.map(c => c.hex))

      const paletteName = paletteType.value === 'random' ? 'Случайная' : getPaletteTypeName(paletteType.value)
      notify.success(`Палитра "${paletteName}" сгенерирована!`)
    }

// Также добавьте в computed секцию для отображения названия типа палитры в кнопке:
    const paletteButtonText = computed(() => {
      if (paletteType.value === 'random') return 'Случайная'
      return `Сгенерировать (${getPaletteTypeName(paletteType.value)})`
    })
    // Название типа палитры
    const getPaletteTypeName = (type) => {
      const typeObj = paletteTypes.value.find(t => t.value === type)
      return typeObj ? typeObj.name : type
    }

    // Основные методы (старый функционал не менялся)
    const setColorCount = (count) => {
      colorCount.value = count
      if (currentPalette.value.length > count) {
        currentPalette.value = currentPalette.value.slice(0, count)
      } else if (currentPalette.value.length < count) {
        const needed = count - currentPalette.value.length
        for (let i = 0; i < needed; i++) {
          addColor()
        }
      }
    }

    const generatePalette = () => {
      if (paletteType.value !== 'random') {
        generateFromBaseColor()
        return
      }

      // Оставляем заблокированные цвета
      const lockedColors = currentPalette.value.filter(color => color.locked)

      const newPalette = []

      // Если есть заблокированные цвета - оставляем их
      if (lockedColors.length > 0) {
        newPalette.push(...lockedColors)
      }

      // Добавляем случайные цвета до нужного количества
      const needed = colorCount.value - newPalette.length
      for (let i = 0; i < needed; i++) {
        const hex = generateRandomColor()
        newPalette.push({
          hex,
          rgb: hexToRgb(hex),
          hsl: hexToHslString(hex),
          locked: false,
          copied: false,
          isLight: isLightColor(hex)
        })
      }

      currentPalette.value = newPalette
      notify.success('Палитра сгенерирована!')
    }

    const copyToClipboard = async (color) => {
      const textToCopy =
          colorFormat.value === 'hex'
              ? color.hex
              : colorFormat.value === 'rgb'
                  ? color.rgb
                  : color.hsl

      try {
        await navigator.clipboard.writeText(textToCopy)
        color.copied = true
        notify.success('Цвет скопирован!')

        setTimeout(() => {
          color.copied = false
        }, 2000)
      } catch (err) {
        console.error('Ошибка копирования:', err)
        // Fallback
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        color.copied = true
        notify.success('Цвет скопирован!')
        setTimeout(() => {
          color.copied = false
        }, 2000)
      }
    }

    const toggleLock = (index) => {
      currentPalette.value[index].locked = !currentPalette.value[index].locked
    }

    const removeColor = (index) => {
      if (currentPalette.value.length > 1) {
        currentPalette.value.splice(index, 1)
      } else {
        notify.warning('Палитра должна содержать хотя бы один цвет')
      }
    }

    const addColor = () => {
      const hex = generateRandomColor()
      currentPalette.value.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: hexToHslString(hex),
        locked: false,
        copied: false,
        isLight: isLightColor(hex)
      })
    }

    const shuffleColors = () => {
      const unlockedColors = currentPalette.value.filter(c => !c.locked)
      const lockedColors = currentPalette.value.filter(c => c.locked)

      // Перемешиваем только разблокированные цвета
      for (let i = unlockedColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unlockedColors[i], unlockedColors[j]] = [unlockedColors[j], unlockedColors[i]]
      }

      currentPalette.value = [...lockedColors, ...unlockedColors].slice(0, colorCount.value)
    }

    const invertColors = () => {
      currentPalette.value.forEach((color, index) => {
        if (!color.locked) {
          const rgb = hexToRgb(color.hex).match(/\d+/g).map(Number)
          const inverted = rgbToHex(255 - rgb[0], 255 - rgb[1], 255 - rgb[2])
          currentPalette.value[index].hex = inverted
          currentPalette.value[index].rgb = hexToRgb(inverted)
          currentPalette.value[index].hsl = hexToHslString(inverted)
          currentPalette.value[index].isLight = isLightColor(inverted)
        }
      })
    }

    const saveToLibrary = async () => {
      if (currentPalette.value.length === 0) {
        notify.warning('Добавьте цвета в палитру')
        return
      }

      const name = prompt('Введите название для палитры:', `Палитра ${new Date().toLocaleDateString('ru-RU')}`)
      if (!name) return

      const description = prompt('Введите описание (необязательно):', '')
      const tagsInput = prompt('Введите теги через запятую (необязательно):', '')

      const tags = tagsInput
          ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []

      const newPalette = {
        id: Date.now(),
        name: name.trim(),
        description: description?.trim() || '',
        colors: currentPalette.value.map(c => c.hex),
        tags,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      PaletteStore.add(newPalette)
      refreshSavedPalettes()
      notify.success(`Палитра "${name}" сохранена в библиотеку!`)
    }

    const loadPalette = (palette) => {
      currentPalette.value = palette.colors.map(color => ({
        hex: color,
        rgb: hexToRgb(color),
        hsl: hexToHslString(color),
        locked: false,
        copied: false,
        isLight: isLightColor(color)
      }))
      PaletteStore.setCurrent(currentPalette.value)
      notify.success(`Палитра "${palette.name}" загружена!`)
    }

    const copyPalette = (palette) => {
      const paletteString = JSON.stringify(palette, null, 2)
      navigator.clipboard.writeText(paletteString)
          .then(() => notify.success('Палитра скопирована в буфер!'))
          .catch(err => {
            console.error('Ошибка копирования:', err)
            notify.error('Ошибка копирования')
          })
    }

    const previewCardBackground = computed(() => {
      if (!currentPalette.value.length) return '#ffffff'

      const base = currentPalette.value[0]
      return previewDarkMode.value
          ? base.isLight ? '#1a1a1a' : '#2a2a2a'
          : '#ffffff'
    })

    const toggleFavorite = (palette) => {
      const updated = { ...palette, featured: !palette.featured }
      PaletteStore.update(palette.id, updated)
      refreshSavedPalettes()
      notify.success(updated.featured ? 'Добавлено в избранное' : 'Убрано из избранного')
    }

    const deletePalette = async (palette) => {
      const confirmed = await showConfirm({
        title: 'Удаление палитры',
        message: `Вы уверены, что хотите удалить палитру "${palette.name}"?`,
        confirmText: 'Удалить',
        cancelText: 'Отмена'
      })

      if (confirmed) {
        PaletteStore.delete(palette.id)
        refreshSavedPalettes()
        notify.success('Палитра удалена!')
      }
    }

    const exportPalette = () => {
      if (currentPalette.value.length === 0) {
        notify.warning('Добавьте цвета в палитру')
        return
      }

      const paletteData = {
        name: `Палитра ${new Date().toLocaleDateString('ru-RU')}`,
        colors: currentPalette.value.map(c => ({
          hex: c.hex,
          rgb: c.rgb,
          isLight: c.isLight
        })),
        exportedAt: new Date().toISOString(),
        source: 'Генератор палитр'
      }

      const dataStr = JSON.stringify(paletteData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

      const exportFileDefaultName = `palette-${new Date().toISOString().split('T')[0]}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      document.body.appendChild(linkElement)
      linkElement.click()
      document.body.removeChild(linkElement)

      notify.success('Палитра экспортирована!')
    }

    const clearPalette = async () => {
      if (currentPalette.value.length === 0) return

      const confirmed = await showConfirm({
        title: 'Очистка палитры',
        message: 'Вы уверены, что хотите очистить текущую палитру?',
        confirmText: 'Очистить',
        cancelText: 'Отмена'
      })

      if (confirmed) {
        currentPalette.value = []
        PaletteStore.setCurrent([])
        notify.success('Палитра очищена!')
      }
    }

    const refreshSavedPalettes = () => {
      // Загружаем последние 6 палитр из библиотеки
      savedPalettes.value = PaletteStore.getAll()
          .slice(0, 6)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Сохранение текущей палитры при изменении
    watch(currentPalette, (newPalette) => {
      if (newPalette.length > 0) {
        PaletteStore.setCurrent(newPalette.map(color => ({
          hex: color.hex,
          rgb: color.rgb,
          isLight: color.isLight
        })))
      }
    }, { deep: true })

    // Загрузка данных при монтировании
    onMounted(() => {
      refreshSavedPalettes()

      const savedCurrent = PaletteStore.getCurrent()
      if (savedCurrent && savedCurrent.length > 0) {
        currentPalette.value = savedCurrent.map(color => ({
          hex: color.hex,
          rgb: color.rgb || hexToRgb(color.hex),
          hsl: hexToHslString(color.hex),
          locked: false,
          copied: false,
          isLight: typeof color.isLight === 'boolean' ? color.isLight : isLightColor(color.hex),
        }))
      } else {
        generatePalette()
      }
    })

    return {
      colorCount,
      colorFormat,
      previewDarkMode,
      currentPalette,
      savedPalettes,
      baseColor,
      paletteType,
      paletteTypes,
      canSave,
      accessibilityScore,
      contrastRating,
      colorHarmony,
      contrastPairs,
      previewCardStyle,
      previewButtonStyle,
      previewSecondaryButtonStyle,
      setColorCount,
      generatePalette,
      copyToClipboard,
      toggleLock,
      removeColor,
      addColor,
      shuffleColors,
      invertColors,
      saveToLibrary,
      loadPalette,
      copyPalette,
      toggleFavorite,
      deletePalette,
      exportPalette,
      clearPalette,
      refreshSavedPalettes,
      isLightColor,
      previewColors,
      generateFromBaseColor,
      getPaletteTypeName,
      getContrastRating
    }
  }
}
</script>

<style scoped>
/* ===== CSS ПЕРЕМЕННЫЕ ===== */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --border-color: #e2e8f0;
  --accent-color: #3b82f6;
  --accent-hover: #2563eb;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

body.dark-theme {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-color: #475569;
}

/* ===== ОСНОВНОЙ КОНТЕЙНЕР ===== */
.palette-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== ЗАГОЛОВОК СТРАНИЦЫ ===== */
.page-header {
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ===== ПАНЕЛЬ УПРАВЛЕНИЯ ===== */
.controls-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.controls-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.controls-row:last-child {
  margin-bottom: 0;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* КНОПКИ ВЫБОРА КОЛИЧЕСТВА И ФОРМАТА */
.number-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.count-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 44px;
}

.count-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.count-btn.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

/* ВЫБОР БАЗОВОГО ЦВЕТА */
.base-color-picker {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-picker-input {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 0;
  background: transparent;
}

.color-hex {
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  color: var(--text-secondary);
  min-width: 70px;
}

/* ОСНОВНЫЕ КНОПКИ ДЕЙСТВИЙ */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.action-btn.success {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.action-btn.success:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.action-btn.secondary:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--text-tertiary);
  transform: translateY(-1px);
}

.action-btn.small {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* ===== ПАЛИТРА ЦВЕТОВ ===== */
.palette-container {
  margin-bottom: 3rem;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.color-item {
  height: 160px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
}

.color-item:hover {
  transform: translateY(-2px);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
}

.text-dark {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.text-light {
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.color-value {
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.color-actions {
  display: flex;
  gap: 0.5rem;
}

.color-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.color-action-btn svg {
  width: 14px;
  height: 14px;
}

.copied-badge {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.palette-actions-bottom {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* ===== КОНТРАСТНОСТЬ ===== */
.contrast-section {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.contrast-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all 0.2s ease;
}

.contrast-item:hover {
  border-color: var(--accent-color);
}

.contrast-colors {
  display: flex;
  height: 40px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.contrast-color {
  flex: 1;
}

.contrast-info {
  font-size: 0.875rem;
}

.contrast-value {
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

.contrast-rating {
  font-weight: 600;
}

.empty-contrast {
  text-align: center;
  padding: 2rem;
  color: var(--text-tertiary);
  font-style: italic;
}

/* ===== СОХРАНЕННЫЕ ПАЛИТРЫ ===== */
.saved-palettes-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.refresh-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.saved-palette-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  transition: all 0.2s ease;
}

.saved-palette-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.palette-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.palette-badges {
  display: flex;
  gap: 0.375rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.featured {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.badge.count {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.palette-colors {
  display: flex;
  height: 32px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 1rem;
}

.palette-color {
  flex: 1;
  transition: flex 0.2s ease;
}

.palette-color:hover {
  flex: 1.2;
}

.more-colors {
  flex: 1;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.palette-actions {
  display: flex;
  gap: 0.5rem;
}

.palette-action-btn {
  flex: 1;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.palette-action-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* ===== ПРЕДПРОСМОТР ИНТЕРФЕЙСА ===== */
.preview-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-top: 2rem;
  /* Локальные переменные для предпросмотра */
  --preview-bg: #ffffff;
  --preview-surface: #f8fafc;
  --preview-text: #0f172a;
}

.preview-section.dark-mode {
  background: #0f172a;
  border-color: #475569;
  --preview-bg: #0f172a;
  --preview-surface: #1e293b;
  --preview-text: #f1f5f9;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.preview-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.toggle-theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-theme-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* FULL PREVIEW */
.full-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-header-bar {
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ph-logo {
  font-size: 1.25rem;
  font-weight: 700;
}

.ph-nav {
  display: flex;
  gap: 1.5rem;
}

.ph-link {
  text-decoration: none;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.ph-link:hover {
  opacity: 1;
}

.ph-login-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.ph-login-btn:hover {
  opacity: 0.9;
}

.preview-layout {
  display: flex;
  gap: 1.5rem;
}

.ph-sidebar {
  width: 200px;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid;
  flex-shrink: 0;
  background: var(--preview-surface);
  border-color: var(--border-color);
  color: var(--preview-text);
}

.ph-side-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.ph-side-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ph-item {
  padding: 0.5rem 0;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.ph-item:hover {
  opacity: 1;
}

.ph-main {
  flex: 1;
}

.ph-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--preview-text);
  margin-bottom: 1rem;
}

.ph-card {
  border: 1px solid;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  background: var(--preview-surface);
  border-color: var(--border-color);
  color: var(--preview-text);
}

.preview-section.dark-mode .ph-card {
  background: #1e293b !important;
  border-color: #475569 !important;
  color: #e2e8f0 !important;
}

.preview-section.dark-mode .ph-sidebar {
  background: #1e293b !important;
  border-color: #475569 !important;
  color: #e2e8f0 !important;
}

.ph-tags {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.ph-tag {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ph-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.ph-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.ph-btn:hover {
  opacity: 0.9;
}

.ph-footer {
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  text-align: center;
  font-weight: 500;
  opacity: 0.9;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 768px) {
  .palette-generator {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .controls-row {
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .palette-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .contrast-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .palettes-grid {
    grid-template-columns: 1fr;
  }

  .preview-layout {
    flex-direction: column;
  }

  .ph-sidebar {
    width: 100%;
  }

  .base-color-picker {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .palette-generator {
    padding: 1rem;
  }

  .color-item {
    height: 140px;
  }

  .number-buttons {
    justify-content: center;
  }

  .palette-grid {
    grid-template-columns: 1fr;
  }

  .contrast-grid {
    grid-template-columns: 1fr;
  }

  .full-preview {
    font-size: 0.875rem;
  }

  .ph-nav {
    gap: 0.75rem;
  }

  .ph-sidebar {
    padding: 1rem;
  }

  .color-picker-input {
    width: 36px;
    height: 36px;
  }
}
</style>