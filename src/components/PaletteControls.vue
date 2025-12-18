<template>
  <div class="controls-section">
    <div class="controls-header">
      <h3>⚙️ Настройки палитры</h3>
      <p>Настройте параметры генерации и отображения</p>
    </div>

    <div class="controls-grid">
      <div class="control-group">
        <label for="color-count" class="control-label">
          <span class="label-icon">🎨</span>
          Количество цветов
        </label>
        <div class="select-wrapper">
          <select id="color-count" v-model="colorCount" class="control-select">
            <option value="3">3 цвета</option>
            <option value="5">5 цветов</option>
            <option value="7">7 цветов</option>
          </select>
          <span class="select-arrow">▼</span>
        </div>
      </div>

      <div class="control-group">
        <label for="color-format" class="control-label">
          <span class="label-icon">📋</span>
          Формат цвета
        </label>
        <div class="select-wrapper">
          <select id="color-format" v-model="colorFormat" class="control-select">
            <option value="hex">HEX (#FFFFFF)</option>
            <option value="rgb">RGB (255,255,255)</option>
          </select>
          <span class="select-arrow">▼</span>
        </div>
      </div>

      <div class="control-group">
        <div class="control-label">
          <span class="label-icon">🌓</span>
          Настройки превью
        </div>
        <div class="checkbox-group">
          <label class="checkbox-label fancy-checkbox">
            <input type="checkbox" v-model="darkMode">
            <span class="checkmark"></span>
            Тёмный фон
          </label>
          <label class="checkbox-label fancy-checkbox">
            <input type="checkbox" v-model="showAnimations">
            <span class="checkmark"></span>
            Анимации
          </label>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="$emit('generate')" class="btn btn-generate">
        <span class="btn-icon">🎲</span>
        Случайная палитра
      </button>
      <button
          @click="$emit('save')"
          :disabled="!canSave"
          class="btn btn-save"
      >
        <span class="btn-icon">💾</span>
        Сохранить палитру
      </button>
      <button @click="$emit('clear')" class="btn btn-clear">
        <span class="btn-icon">🗑️</span>
        Очистить
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PaletteControls',

  props: {
    canSave: {
      type: Boolean,
      default: false
    }
  },

  emits: ['generate', 'save', 'clear', 'update:colorCount', 'update:colorFormat', 'update:darkMode'],

  setup(props, { emit }) {
    const colorCount = ref('5')
    const colorFormat = ref('hex')
    const darkMode = ref(false)
    const showAnimations = ref(true)

    // Отслеживаем изменения и эмитим события
    watch(colorCount, (value) => emit('update:colorCount', value))
    watch(colorFormat, (value) => emit('update:colorFormat', value))
    watch(darkMode, (value) => emit('update:darkMode', value))

    return {
      colorCount,
      colorFormat,
      darkMode,
      showAnimations
    }
  }
}
</script>

<style scoped>
.controls-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.controls-header {
  margin-bottom: 28px;
}

.controls-header h3 {
  font-size: 1.4rem;
  color: #2d3748;
  margin-bottom: 6px;
  font-weight: 700;
}

.controls-header p {
  color: #718096;
  font-size: 0.95rem;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 28px;
}

.control-group {
  display: flex;
  flex-direction: column;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.2rem;
}

.select-wrapper {
  position: relative;
}

.control-select {
  width: 100%;
  padding: 14px 16px;
  padding-right: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.control-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #a0aec0;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fancy-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 10px 0;
  transition: color 0.2s;
}

.fancy-checkbox:hover {
  color: #667eea;
}

.fancy-checkbox input {
  display: none;
}

.checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.fancy-checkbox input:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.fancy-checkbox input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 160px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  letter-spacing: 0.3px;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn:active {
  transform: translateY(-1px);
}

.btn-generate {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
}

.btn-generate:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-save {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(72, 187, 120, 0.4);
}

.btn-save:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.5);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-clear {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(245, 101, 101, 0.4);
}

.btn-clear:hover {
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.5);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }

  .btn {
    min-width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>