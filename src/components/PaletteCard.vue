<template>
  <div class="palette-card" :class="{ featured: featured }">
    <div class="palette-header">
      <div class="palette-colors">
        <div
            v-for="(color, index) in colors"
            :key="index"
            class="palette-color"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
            :title="color"
        >
          <span class="color-tooltip">{{ color }}</span>
        </div>
      </div>
      <div v-if="featured" class="featured-badge">
        <span class="badge-icon">⭐</span>
        Избранное
      </div>
    </div>

    <div class="palette-body">
      <h4 class="palette-name">{{ name }}</h4>
      <p v-if="description" class="palette-description">{{ description }}</p>

      <div class="palette-meta">
        <span class="meta-item">
          <span class="meta-icon">🎨</span>
          {{ colors.length }} цветов
        </span>
        <span v-if="date" class="meta-item">
          <span class="meta-icon">📅</span>
          {{ formatDate(date) }}
        </span>
        <span v-if="tags && tags.length" class="meta-item">
          <span class="meta-icon">🏷️</span>
          {{ tags.join(', ') }}
        </span>
      </div>
    </div>

    <div class="palette-footer">
      <slot name="actions">
        <div class="default-actions">
          <button @click="$emit('edit')" class="action-btn edit-btn" title="Редактировать">
            ✏️
          </button>
          <button @click="$emit('copy')" class="action-btn copy-btn" title="Скопировать">
            📋
          </button>
          <button
              @click="$emit('toggle-favorite')"
              class="action-btn favorite-btn"
              :title="featured ? 'Убрать из избранного' : 'В избранное'"
          >
            {{ featured ? '★' : '☆' }}
          </button>
          <button @click="$emit('delete')" class="action-btn delete-btn" title="Удалить">
            🗑️
          </button>
        </div>
      </slot>
    </div>

    <div v-if="showCopyNotification" class="copy-notification">
      Цвет скопирован!
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PaletteCard',

  props: {
    name: {
      type: String,
      required: true
    },
    colors: {
      type: Array,
      required: true,
      default: () => []
    },
    description: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => []
    },
    featured: {
      type: Boolean,
      default: false
    }
  },

  emits: ['edit', 'copy', 'toggle-favorite', 'delete'],

  setup(props) {
    const showCopyNotification = ref(false)

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

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

    return {
      showCopyNotification,
      formatDate,
      copyColor
    }
  }
}
</script>

<style scoped>
.palette-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.palette-card.featured {
  border: 2px solid #f6e05e;
  box-shadow: 0 10px 15px -3px rgba(246, 224, 94, 0.3), 0 4px 6px -2px rgba(246, 224, 94, 0.1);
}

.palette-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.palette-header {
  position: relative;
}

.palette-colors {
  display: flex;
  height: 120px;
}

.palette-color {
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: flex 0.3s;
}

.palette-color:hover {
  flex: 1.5;
}

.palette-color:hover .color-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.color-tooltip {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: 'Fira Code', monospace;
  opacity: 0;
  transition: all 0.3s;
  white-space: nowrap;
  pointer-events: none;
}

.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(246, 224, 94, 0.95);
  color: #744210;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(4px);
}

.badge-icon {
  font-size: 0.9rem;
}

.palette-body {
  padding: 20px;
}

.palette-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.palette-description {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

.palette-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #a0aec0;
}

.meta-icon {
  font-size: 0.9rem;
}

.palette-footer {
  padding: 0 20px 20px;
}

.default-actions {
  display: flex;
  gap: 8px;
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

.edit-btn {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.edit-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.copy-btn {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.copy-btn:hover {
  background: rgba(72, 187, 120, 0.2);
  transform: translateY(-2px);
}

.favorite-btn {
  background: rgba(246, 224, 94, 0.1);
  color: #d69e2e;
}

.favorite-btn:hover {
  background: rgba(246, 224, 94, 0.2);
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

.copy-notification {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  animation: slideIn 0.3s ease, fadeOut 2s ease 0.7s forwards;
  z-index: 10;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>