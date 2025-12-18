<template>
  <div class="palette-editor">
    <!-- Заголовок -->
    <div class="editor-header">
      <h1>Редактор палитры</h1>
      <p>Создавайте и редактируйте идеальные цветовые схемы</p>
    </div>

    <!-- Основной контейнер -->
    <div class="editor-container">
      <!-- Боковая панель -->
      <div class="editor-sidebar">
        <h3>Инструменты</h3>

        <!-- Тип палитры -->
        <div class="tool-section">
          <h4>Тип палитры</h4>
          <div class="palette-types">
            <button
                v-for="type in paletteTypes"
                :key="type.id"
                class="type-btn"
                :class="{ active: selectedType.id === type.id }"
                @click="selectPaletteType(type)"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- Настройки -->
        <div class="tool-section">
          <h4>Настройки</h4>

          <label class="checkbox-option">
            <input type="checkbox" v-model="settings.harmony">
            Автогармония
          </label>

          <label class="checkbox-option">
            <input type="checkbox" v-model="settings.contrast">
            Контраст текста
          </label>

          <div class="range-group">
            <label>Насыщенность: {{ settings.saturation }}%</label>
            <input type="range" v-model="settings.saturation" min="0" max="100" @input="applySettings">
          </div>

          <div class="range-group">
            <label>Яркость: {{ settings.lightness }}%</label>
            <input type="range" v-model="settings.lightness" min="0" max="100" @input="applySettings">
          </div>
        </div>
      </div>

      <!-- Основная область -->
      <div class="editor-main">
        <!-- Сетка цветов -->
        <div class="color-canvas">
          <div
              v-for="(color, index) in paletteColors"
              :key="index"
              class="canvas-color"
              :style="{ backgroundColor: color }"
              @click="openColorPicker(index)"
          >
            <div class="color-info">
              <span class="color-hex">{{ color }}</span>
              <div class="color-hsl" v-if="showDebugInfo">
                H: {{ getOriginalHsl(index).h }}° S: {{ getOriginalHsl(index).s }}% L: {{ getOriginalHsl(index).l }}%
              </div>
              <div class="color-actions">
                <button @click.stop="toggleLock(index)" class="canvas-action-btn" :title="lockedColors[index] ? 'Разблокировать' : 'Заблокировать'">
                  <svg v-if="lockedColors[index]" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8M5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8M5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button @click.stop="removeColor(index)" class="canvas-action-btn" title="Удалить">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H21M10 11V17M14 11V17M5 6L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <button class="add-canvas-color" @click="addColor" title="Добавить цвет">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Кнопки действий -->
        <div class="editor-actions">
          <button @click="generatePalette" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px">
              <path d="M15 7C15 4.23858 12.7614 2 10 2C7.23858 2 5 4.23858 5 7C5 9.76142 7.23858 12 10 12C12.7614 12 15 9.76142 15 7Z" stroke="currentColor" stroke-width="2"/>
              <path d="M19 19C19 16.2386 16.7614 14 14 14C11.2386 14 9 16.2386 9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Сгенерировать
          </button>
          <button @click="savePalette" class="btn btn-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px">
              <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H14L21 10V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 3V9H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Сохранить
          </button>
          <button @click="resetPalette" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px">
              <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Сбросить
          </button>
          <button @click="exportPalette" class="btn btn-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Экспорт
          </button>
        </div>

        <!-- Предпросмотр -->
        <div class="palette-preview">
          <h3>Предпросмотр</h3>
          <div class="preview-elements">
            <div
                class="preview-element"
                v-for="(color, index) in paletteColors.slice(0, 5)"
                :key="index"
            >
              <div class="element-color" :style="{ backgroundColor: color }"></div>
              <span class="element-label">Цвет {{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно выбора цвета -->
    <div v-if="activeColorIndex !== null" class="color-modal">
      <div class="modal-content">
        <ColorPicker
            v-model="paletteColors[activeColorIndex]"
            label="Изменить цвет"
            @confirm="closeColorPicker"
            @cancel="closeColorPicker"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import ColorPicker from '../components/ColorPicker.vue'
import { PaletteStore } from '../utils/paletteStore'

export default {
  name: 'PaletteEditor',
  components: { ColorPicker },

  setup() {
    const baseColor = ref('#667eea')
    const paletteColors = ref([
      '#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936'
    ])
    const lockedColors = ref([false, false, false, false, false])

    const basePaletteColors = ref([...paletteColors.value])

    const generationBaseColor = ref(null)

    const selectedType = ref({
      id: 'analogous',
      name: 'Аналогичная'
    })

    const paletteTypes = [
      { id: 'analogous', name: 'Аналогичная' },
      { id: 'monochromatic', name: 'Монохромная' },
      { id: 'triadic', name: 'Триадная' },
      { id: 'complementary', name: 'Комплементарная' },
      { id: 'random', name: 'Случайная' }
    ]

    const settings = ref({
      harmony: true,
      contrast: true,
      saturation: 60,
      lightness: 50
    })

    const activeColorIndex = ref(null)

    const showDebugInfo = ref(false)

    /* ========================
       COLOR GENERATORS
    =========================== */

    const randomHex = () =>
        '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

    const hexToHsl = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)

      let h, s
      let l = (max + min) / 2

      if (max === min) {
        h = s = 0
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

      const toHex = x => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const shiftHue = (hex, deg) => {
      const hsl = hexToHsl(hex)
      let h = (hsl.h + deg) % 360
      if (h < 0) h += 360
      return hslToHex(h, hsl.s, hsl.l)
    }

    const lightenColor = (hex, amount) => {
      const hsl = hexToHsl(hex)
      return hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + amount))
    }

    const darkenColor = (hex, amount) => {
      const hsl = hexToHsl(hex)
      return hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - amount))
    }

    const adjustSaturation = (hex, targetSaturation) => {
      const hsl = hexToHsl(hex)
      return hslToHex(hsl.h, targetSaturation, hsl.l)
    }

    const adjustLightness = (hex, targetLightness) => {
      const hsl = hexToHsl(hex)
      return hslToHex(hsl.h, hsl.s, targetLightness)
    }

    const applyAllSettings = (color) => {
      let processedColor = color

      if (settings.value.harmony) {
        if (settings.value.saturation !== 60) {
          processedColor = adjustSaturation(processedColor, settings.value.saturation)
        }
        if (settings.value.lightness !== 50) {
          processedColor = adjustLightness(processedColor, settings.value.lightness)
        }
      }

      if (settings.value.contrast) {
        const hsl = hexToHsl(processedColor)
        const contrastAmount = 20
        if (hsl.l > 60) {
          processedColor = adjustLightness(processedColor, Math.max(0, hsl.l - contrastAmount))
        } else {
          processedColor = adjustLightness(processedColor, Math.min(100, hsl.l + contrastAmount))
        }
      }

      return processedColor
    }

    /* ========================
       PROCESS COLOR
    =========================== */

    const processColor = (hex) => {
      let c = hex

      if (settings.value.harmony) {
        c = adjustSaturation(c, settings.value.saturation)
        c = adjustLightness(c, settings.value.lightness)
      }

      if (settings.value.contrast) {
        const hsl = hexToHsl(c)
        c = hsl.l > 60 ? darkenColor(c, 20) : lightenColor(c, 20)
      }

      return c
    }

    /* ========================
       GENERATION
    =========================== */

    const generatePalette = () => {
      console.log('Generating new palette of type:', selectedType.value.id)

      // Получаем базовый цвет для генерации
      const baseHex = getGenerationBaseColor()
      const baseHsl = hexToHsl(baseHex)

      console.log('Base color for generation:', {
        hex: baseHex,
        hsl: baseHsl
      })

      const result = []
      const type = selectedType.value.id
      const N = paletteColors.value.length // Текущее количество цветов

      if (type === 'analogous') {
        // Аналогичная: цвета с шагом 30 градусов
        for (let i = 0; i < N; i++) {
          const hue = (baseHsl.h + i * 30) % 360
          result.push(hslToHex(hue, baseHsl.s, baseHsl.l))
        }

      } else if (type === 'monochromatic') {
        // Монохромная: разные оттенки яркости
        for (let i = 0; i < N; i++) {
          // Равномерно распределяем яркость от 20 до 80
          const lightness = 20 + (i * 60 / Math.max(1, N - 1))
          result.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(100, Math.max(0, lightness))))
        }

      } else if (type === 'triadic') {
        // Триадная: 120 градусов
        for (let i = 0; i < N; i++) {
          const hue = (baseHsl.h + i * 120) % 360
          // Чередуем яркость для разнообразия
          const lightness = i % 2 === 0 ? baseHsl.l : Math.min(100, baseHsl.l + 20)
          result.push(hslToHex(hue, baseHsl.s, lightness))
        }

      } else if (type === 'complementary') {
        // Комплементарная: противоположные + соседние
        for (let i = 0; i < N; i++) {
          if (i === 0) {
            result.push(baseHex) // Первый цвет - базовый
          } else if (i === 1) {
            // Второй - противоположный
            result.push(hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l))
          } else {
            // Остальные - смежные цвета
            const offset = i % 2 === 0 ? 30 : -30
            const hue = (baseHsl.h + offset * Math.floor(i / 2)) % 360
            result.push(hslToHex(hue, baseHsl.s, baseHsl.l))
          }
        }

      } else if (type === 'random') {
        // Случайная палитра на основе базового цвета
        for (let i = 0; i < N; i++) {
          if (i === 0) {
            result.push(baseHex)
          } else {
            const hue = (baseHsl.h + Math.random() * 120 - 60) % 360
            const sat = Math.min(100, Math.max(30, baseHsl.s + Math.random() * 40 - 20))
            const light = Math.min(90, Math.max(20, baseHsl.l + Math.random() * 40 - 20))
            result.push(hslToHex(hue, sat, light))
          }
        }
      }

      console.log('Generated colors before settings:', result)

      // Сохраняем базовые цвета только для незаблокированных позиций
      for (let i = 0; i < N; i++) {
        if (!lockedColors.value[i]) {
          basePaletteColors.value[i] = result[i]
        }
      }

      // Применяем настройки к новой палитре
      applySettingsToNewPalette(result)
    }

    const applySettingsToNewPalette = (newColors) => {
      console.log('Applying settings to new palette:', {
        newColors,
        locked: lockedColors.value
      })

      paletteColors.value = newColors.map((color, i) => {
        if (lockedColors.value[i]) {
          // Для заблокированных цветов сохраняем текущее значение
          console.log(`Color ${i} is locked, keeping:`, paletteColors.value[i])
          return paletteColors.value[i]
        }

        // Для остальных применяем настройки
        const processedColor = applyAllSettings(color)
        console.log(`Color ${i} processed:`, color, '->', processedColor)
        return processedColor
      })
    }

    const applySettings = () => {
      console.log('Applying settings to current palette', {
        saturation: settings.value.saturation,
        lightness: settings.value.lightness,
        harmony: settings.value.harmony,
        contrast: settings.value.contrast
      })

      // Применяем настройки только к текущим базовым цветам
      paletteColors.value = basePaletteColors.value.map((color, index) => {
        if (lockedColors.value[index]) return paletteColors.value[index]

        let processedColor = color

        // Если гармония выключена, оставляем оригинальный цвет (или применяем только контраст)
        if (!settings.value.harmony) {
          // Если гармония выключена, но контраст включен
          if (settings.value.contrast) {
            const hsl = hexToHsl(processedColor)
            const contrastAmount = 20
            if (hsl.l > 60) {
              processedColor = adjustLightness(processedColor, Math.max(0, hsl.l - contrastAmount))
            } else {
              processedColor = adjustLightness(processedColor, Math.min(100, hsl.l + contrastAmount))
            }
          }
          return processedColor
        }

        // ГАРМОНИЯ ВКЛЮЧЕНА: применяем насыщенность и яркость

        // Важно: сначала получаем оригинальный цвет из basePaletteColors
        const originalColor = basePaletteColors.value[index]
        let tempColor = originalColor

        // Шаг 1: Применяем насыщенность
        tempColor = adjustSaturation(originalColor, settings.value.saturation)

        // Шаг 2: Применяем яркость к цвету с УЖЕ ПРИМЕНЕННОЙ насыщенностью
        processedColor = adjustLightness(tempColor, settings.value.lightness)

        // Шаг 3: Применяем контраст (если включен)
        if (settings.value.contrast) {
          const hsl = hexToHsl(processedColor)
          const contrastAmount = 20
          if (hsl.l > 60) {
            processedColor = adjustLightness(processedColor, Math.max(0, hsl.l - contrastAmount))
          } else {
            processedColor = adjustLightness(processedColor, Math.min(100, hsl.l + contrastAmount))
          }
        }

        return processedColor
      })
    }

    const getOriginalHsl = (index) => {
      return hexToHsl(basePaletteColors.value[index])
    }

    const selectPaletteType = (type) => {
      selectedType.value = type
      generatePalette()
    }

    /* ========================
       COLOR PICKER
    =========================== */

    const openColorPicker = index => {
      activeColorIndex.value = index
      // При открытии пикера обновляем базовый цвет для генерации
      if (lockedColors.value[index]) {
        generationBaseColor.value = paletteColors.value[index]
      }
    }
    const closeColorPicker = () => activeColorIndex.value = null

    /* ========================
       OTHER
    =========================== */

    const addColor = () => {
      // При добавлении цвета используем текущий базовый цвет
      const baseHsl = generationBaseColor.value
          ? hexToHsl(generationBaseColor.value)
          : hexToHsl('#667eea')

      const newColor = hslToHex(
          (baseHsl.h + Math.random() * 60 - 30) % 360,
          baseHsl.s,
          baseHsl.l
      )

      paletteColors.value.push(newColor)
      basePaletteColors.value.push(newColor)
      lockedColors.value.push(false)
    }

    const removeColor = index => {
      paletteColors.value.splice(index, 1)
      basePaletteColors.value.splice(index, 1)
      lockedColors.value.splice(index, 1)
    }

    const toggleLock = index => {
      const wasLocked = lockedColors.value[index]
      lockedColors.value[index] = !wasLocked

      if (!wasLocked) {
        // Когда цвет блокируется, сохраняем его как базовый для генерации
        generationBaseColor.value = paletteColors.value[index]
        // Сохраняем его текущее состояние как базовый (без настроек)
        basePaletteColors.value[index] = paletteColors.value[index]
      } else {
        // Когда цвет разблокируется, сбрасываем базовый цвет для генерации
        // если не осталось заблокированных цветов
        if (!lockedColors.value.some(locked => locked)) {
          generationBaseColor.value = null
        }
      }
    }

    const resetPalette = () => {
      baseColor.value = '#667eea'
      paletteColors.value = ['#667eea','#764ba2','#f56565','#48bb78','#ed8936']
      basePaletteColors.value = ['#667eea','#764ba2','#f56565','#48bb78','#ed8936']
      lockedColors.value = [false,false,false,false,false]
      generationBaseColor.value = null // Сбрасываем базовый цвет для генерации
      selectedType.value = paletteTypes[0]
      settings.value = {
        harmony: true,
        contrast: true,
        saturation: 60,
        lightness: 50
      }
    }

    const getGenerationBaseColor = () => {
      // Если есть заблокированные цвета, используем первый из них
      for (let i = 0; i < lockedColors.value.length; i++) {
        if (lockedColors.value[i]) {
          console.log('Using locked color as generation base:', paletteColors.value[i])
          return paletteColors.value[i]
        }
      }

      // Если нет заблокированных цветов, но есть сохраненный базовый
      if (generationBaseColor.value) {
        console.log('Using saved generation base:', generationBaseColor.value)
        return generationBaseColor.value
      }

      // Иначе генерируем случайный
      const randomColor = randomHex()
      console.log('Using random color as base:', randomColor)
      return randomColor
    }

    const savePalette = () => {
      PaletteStore.add({
        id: Date.now(),
        name: `Палитра ${new Date().toLocaleDateString()}`,
        colors: paletteColors.value,
        type: selectedType.value.name
      })
      alert('Палитра сохранена!')
    }

    const exportPalette = () => {
      const data = JSON.stringify({
        baseColor: baseColor.value,
        type: selectedType.value.name,
        colors: paletteColors.value
      }, null, 2)

      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'palette.json'
      a.click()
      URL.revokeObjectURL(url)
    }

    /* INIT */
    generatePalette()

    return {
      baseColor,
      paletteColors,
      lockedColors,
      selectedType,
      paletteTypes,
      settings,
      activeColorIndex,
      showDebugInfo,
      generationBaseColor,

      selectPaletteType,
      generatePalette,
      addColor,
      removeColor,
      toggleLock,
      resetPalette,
      savePalette,
      exportPalette,

      openColorPicker,
      closeColorPicker,
      applySettings,
      getOriginalHsl
    }
  }
}
</script>

<style scoped>
/* ===== ОСНОВНЫЕ СТИЛИ ===== */
.palette-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== ЗАГОЛОВОК ===== */
.editor-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.editor-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.editor-header p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

/* ===== ОСНОВНОЙ КОНТЕЙНЕР ===== */
.editor-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}

/* ===== БОКОВАЯ ПАНЕЛЬ ===== */
.editor-sidebar {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  height: fit-content;
}

.editor-sidebar h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.tool-section {
  margin-bottom: 2rem;
}

.tool-section h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

/* Типы палитр */
.palette-types {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-btn {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.type-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

/* Чекбоксы */
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}

.checkbox-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-color);
}

/* Слайдеры */
.range-group {
  margin-bottom: 1.25rem;
}

.range-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.range-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
}

.range-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  border: 2px solid var(--bg-primary);
}

.range-group span {
  display: block;
  text-align: right;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-top: 0.25rem;
}

/* ===== ОСНОВНАЯ ОБЛАСТЬ ===== */
.editor-main {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

/* Сетка цветов */
.color-canvas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.canvas-color {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.canvas-color:hover {
  transform: translateY(-2px);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.75rem;
  transform: translateY(100%);
  transition: transform 0.2s ease;
}

.canvas-color:hover .color-info {
  transform: translateY(0);
}

.color-hex {
  display: block;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  margin-bottom: 0.5rem;
}

.color-actions {
  display: flex;
  gap: 0.5rem;
}

.canvas-action-btn {
  flex: 1;
  padding: 0.375rem;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.canvas-action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Кнопка добавления цвета */
.add-canvas-color {
  aspect-ratio: 1;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-canvas-color:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: var(--bg-secondary);
}

/* ===== КНОПКИ ДЕЙСТВИЙ ===== */
.editor-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-success {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.btn-success:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.btn-info {
  background: var(--info-color);
  color: white;
  border-color: var(--info-color);
}

.btn-info:hover {
  background: var(--info-color-hover);
  border-color: var(--info-color-hover);
  transform: translateY(-1px);
}

/* ===== ПРЕДПРОСМОТР ===== */
.palette-preview {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.palette-preview h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.preview-elements {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preview-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.element-color {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.element-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* ===== МОДАЛЬНОЕ ОКНО ЦВЕТА ===== */
.color-modal {
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
  max-width: 400px;
  width: 100%;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 768px) {
  .palette-editor {
    padding: 1.5rem 1rem;
  }

  .editor-header h1 {
    font-size: 1.75rem;
  }

  .color-canvas {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .editor-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .preview-elements {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .editor-header h1 {
    font-size: 1.5rem;
  }

  .editor-header p {
    font-size: 0.9375rem;
  }

  .color-canvas {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .canvas-action-btn {
    padding: 0.25rem;
    font-size: 0.75rem;
  }
}

.color-hsl {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 2px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  color: white;
}
</style>

<style>
/* Глобальные стили для редактора в темной теме */
body.dark-theme .palette-editor .editor-sidebar,
body.dark-theme .palette-editor .editor-main {
  background: var(--bg-primary);
  border-color: var(--border-color);
}

body.dark-theme .palette-editor .color-info {
  background: rgba(0, 0, 0, 0.9);
}

body.dark-theme .palette-editor .range-group input[type="range"] {
  background: var(--bg-tertiary);
}

body.dark-theme .palette-editor .range-group input[type="range"]::-webkit-slider-thumb {
  background: var(--accent-color);
  border-color: var(--bg-primary);
}

body.dark-theme .palette-editor .add-canvas-color {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--text-tertiary);
}

body.dark-theme .palette-editor .add-canvas-color:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: var(--bg-secondary);
}

body.dark-theme .palette-editor .palette-preview {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

body.dark-theme .palette-editor .element-label {
  color: var(--text-secondary);
}
</style>