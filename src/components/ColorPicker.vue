<template>
  <div class="color-picker">
    <div class="picker-header">
      <label v-if="label" class="picker-label">{{ label }}</label>
      <div class="current-color" :style="{ backgroundColor: modelValue }"></div>
    </div>

    <div class="picker-body">
      <div class="color-grid">
        <div
            v-for="color in presetColors"
            :key="color"
            class="color-option"
            :style="{ backgroundColor: color }"
            :class="{ active: modelValue === color }"
            @click="$emit('update:modelValue', color)"
            :title="color"
        ></div>
      </div>

      <div class="custom-color">
        <input
            type="color"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="color-input"
        />
        <div class="color-inputs">
          <input
              type="text"
              :value="modelValue"
              @input="handleHexInput"
              placeholder="#RRGGBB"
              class="hex-input"
              maxlength="7"
          />
          <div class="color-sliders">
            <div class="slider-group">
              <label>R</label>
              <input
                  type="range"
                  min="0"
                  max="255"
                  :value="rgb.r"
                  @input="updateFromRgb('r', $event.target.value)"
                  class="slider red-slider"
              />
              <span class="slider-value">{{ rgb.r }}</span>
            </div>
            <div class="slider-group">
              <label>G</label>
              <input
                  type="range"
                  min="0"
                  max="255"
                  :value="rgb.g"
                  @input="updateFromRgb('g', $event.target.value)"
                  class="slider green-slider"
              />
              <span class="slider-value">{{ rgb.g }}</span>
            </div>
            <div class="slider-group">
              <label>B</label>
              <input
                  type="range"
                  min="0"
                  max="255"
                  :value="rgb.b"
                  @input="updateFromRgb('b', $event.target.value)"
                  class="slider blue-slider"
              />
              <span class="slider-value">{{ rgb.b }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="picker-footer">
      <button @click="$emit('cancel')" class="btn btn-secondary">Отмена</button>
      <button @click="$emit('confirm', modelValue)" class="btn btn-primary">Применить</button>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'

export default {
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: '#667eea'
    },
    label: {
      type: String,
      default: ''
    },
    presetColors: {
      type: Array,
      default: () => [
        '#667eea', '#764ba2', '#f56565', '#48bb78',
        '#ed8936', '#9f7aea', '#4299e1', '#38b2ac',
        '#e53e3e', '#d69e2e', '#68d391', '#4fd1c5'
      ]
    }
  },

  emits: ['update:modelValue', 'confirm', 'cancel'],

  setup(props, { emit }) {
    const rgb = ref({ r: 102, g: 126, b: 234 })

    // Конвертация HEX в RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 }
    }

    // Конвертация RGB в HEX
    const rgbToHex = (r, g, b) => {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }

    // Обновление RGB при изменении значения
    watch(() => props.modelValue, (newHex) => {
      rgb.value = hexToRgb(newHex)
    }, { immediate: true })

    // Обработчик ввода HEX
    const handleHexInput = (event) => {
      let value = event.target.value
      if (!value.startsWith('#')) {
        value = '#' + value
      }
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        emit('update:modelValue', value.toUpperCase())
      }
    }

    // Обновление из RGB слайдеров
    const updateFromRgb = (channel, value) => {
      rgb.value[channel] = parseInt(value)
      const newHex = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b)
      emit('update:modelValue', newHex)
    }

    // Вычисляемый цвет текста для метки
    const textColor = computed(() => {
      const { r, g, b } = rgb.value
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128 ? '#1a202c' : '#ffffff'
    })

    return {
      rgb,
      handleHexInput,
      updateFromRgb,
      textColor
    }
  }
}
</script>

<style scoped>
.color-picker {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 320px;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.picker-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

.current-color {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: transform 0.2s;
}

.current-color:hover {
  transform: scale(1.1);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.color-option.active {
  border-color: #2d3748;
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.custom-color {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-input {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.hex-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  text-align: center;
  transition: border-color 0.3s;
}

.hex-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.color-sliders {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-group label {
  width: 20px;
  font-weight: 600;
  color: #4a5568;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #cbd5e0;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.red-slider::-webkit-slider-thumb {
  border-color: #f56565;
}

.green-slider::-webkit-slider-thumb {
  border-color: #48bb78;
}

.blue-slider::-webkit-slider-thumb {
  border-color: #4299e1;
}

.slider-value {
  width: 30px;
  text-align: right;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #718096;
}

.picker-footer {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}
</style>