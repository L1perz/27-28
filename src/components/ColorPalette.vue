<template>
  <div class="palette-section">
    <div class="section-header">
      <h3>🌈 Текущая палитра</h3>
      <div class="palette-stats">
        <span class="stat-item">
          <span class="stat-icon">🎨</span>
          {{ palette.length }} цветов
        </span>
        <span v-if="lockedCount > 0" class="stat-item">
          <span class="stat-icon">🔒</span>
          {{ lockedCount }} заблокировано
        </span>
      </div>
    </div>

    <div v-if="palette.length === 0" class="empty-palette">
      <div class="empty-illustration">
        <span class="empty-icon">🎨</span>
      </div>
      <p class="empty-title">Палитра пуста</p>
      <p class="empty-subtitle">Нажмите "Случайная палитра" для создания новой палитры</p>
    </div>

    <div v-else class="palette-container">
      <ColorCard
          v-for="(color, index) in palette"
          :key="`${color.hex}-${index}`"
          :color="color"
          :color-format="colorFormat"
          @color-click="$emit('color-click', color)"
          @toggle-lock="$emit('toggle-lock', index)"
          @remove="$emit('remove-color', index)"
      />
    </div>
  </div>
</template>

<script>
import ColorCard from './ColorCard.vue'

export default {
  name: 'ColorPalette',

  components: {
    ColorCard
  },

  props: {
    palette: {
      type: Array,
      required: true,
      default: () => []
    },
    colorFormat: {
      type: String,
      default: 'hex'
    }
  },

  emits: ['color-click', 'toggle-lock', 'remove-color'],

  computed: {
    lockedCount() {
      return this.palette.filter(color => color.locked).length
    }
  }
}
</script>

<style scoped>
.palette-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-header h3 {
  font-size: 1.6rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.palette-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #718096;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(226, 232, 240, 0.5);
  border-radius: 20px;
}

.stat-icon {
  font-size: 1rem;
}

.empty-palette {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  border-radius: 16px;
  border: 2px dashed #cbd5e0;
}

.empty-illustration {
  margin-bottom: 20px;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.4rem;
  color: #4a5568;
  margin-bottom: 10px;
  font-weight: 600;
}

.empty-subtitle {
  color: #a0aec0;
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.palette-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .palette-container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .palette-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>