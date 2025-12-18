<template>
  <div class="saved-section">
    <div class="section-header">
      <h3>💾 Сохранённые палитры</h3>
      <div class="section-stats">
        <span class="stat-item">
          <span class="stat-icon">📚</span>
          {{ palettes.length }} палитр
        </span>
      </div>
    </div>

    <div v-if="palettes.length === 0" class="empty-saved">
      <div class="empty-illustration">
        <span class="empty-icon">📂</span>
      </div>
      <p class="empty-title">Нет сохранённых палитр</p>
      <p class="empty-subtitle">Сохраните текущую палитру, чтобы она появилась здесь</p>
    </div>

    <div v-else class="saved-grid">
      <div
          v-for="(palette, index) in palettes"
          :key="index"
          class="saved-palette-card"
          @click="$emit('load-palette', palette)"
      >
        <div class="palette-colors">
          <div
              v-for="(color, colorIndex) in palette"
              :key="colorIndex"
              class="saved-color"
              :style="{ backgroundColor: color.hex }"
              :title="color.hex"
          ></div>
        </div>
        <div class="palette-info">
          <div class="palette-name">
            Палитра #{{ index + 1 }}
          </div>
          <div class="palette-meta">
            <span>{{ palette.length }} цветов</span>
            <span class="meta-separator">•</span>
            <span>{{ formatDate(index) }}</span>
          </div>
        </div>
        <div class="palette-actions">
          <button
              @click.stop="$emit('load-palette', palette)"
              class="action-btn load-btn"
              title="Загрузить"
          >
            📂
          </button>
          <button
              @click.stop="$emit('remove-palette', index)"
              class="action-btn delete-btn"
              title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavedPalettes',

  props: {
    palettes: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  emits: ['load-palette', 'remove-palette'],

  methods: {
    formatDate(index) {
      // Простое форматирование даты на основе индекса
      const now = new Date()
      now.setMinutes(now.getMinutes() - index * 5) // Для демонстрации
      return now.toLocaleDateString('ru-RU')
    }
  }
}
</script>

<style scoped>
.saved-section {
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
}

.section-stats {
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

.empty-saved {
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
  font-size: 3.5rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.3rem;
  color: #4a5568;
  margin-bottom: 10px;
  font-weight: 600;
}

.empty-subtitle {
  color: #a0aec0;
  font-size: 0.95rem;
  max-width: 300px;
  margin: 0 auto;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.saved-palette-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.saved-palette-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.palette-colors {
  display: flex;
  height: 80px;
}

.saved-color {
  flex: 1;
  transition: flex 0.3s;
}

.saved-palette-card:hover .saved-color {
  flex: 1.2;
}

.palette-info {
  padding: 20px;
}

.palette-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.palette-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #718096;
}

.meta-separator {
  opacity: 0.5;
}

.palette-actions {
  padding: 0 20px 20px;
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-btn {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.load-btn:hover {
  background: rgba(72, 187, 120, 0.2);
  transform: translateY(-2px);
}

.delete-btn {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.delete-btn:hover {
  background: rgba(245, 101, 101, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .saved-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>