<template>
  <div
      class="color-card"
      :style="{ backgroundColor: color.hex }"
      @click="$emit('color-click', color)"
  >
    <div class="color-info" :class="{ 'dark-text': color.isLight }">
      <div class="color-value">
        {{ colorFormat === 'hex' ? color.hex : color.rgb }}
      </div>
      <div class="color-actions">
        <button
            @click.stop="$emit('toggle-lock')"
            class="icon-btn"
            :title="color.locked ? 'Разблокировать' : 'Заблокировать'"
        >
          {{ color.locked ? '🔒' : '🔓' }}
        </button>
        <button
            @click.stop="$emit('remove')"
            class="icon-btn"
            title="Удалить"
        >
          🗑️
        </button>
      </div>
    </div>
    <div v-if="color.copied" class="copy-notification">
      Скопировано!
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorCard',

  props: {
    color: {
      type: Object,
      required: true
    },
    colorFormat: {
      type: String,
      default: 'hex'
    }
  },

  emits: ['color-click', 'toggle-lock', 'remove']
}
</script>

<style scoped>
.color-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 180px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.color-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  backdrop-filter: blur(4px);
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.color-card:hover .color-info {
  transform: translateY(0);
}

.dark-text {
  color: #1a202c;
}

.color-value {
  font-family: 'Fira Code', 'Courier New', monospace;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.color-actions {
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.color-card:hover .color-actions {
  opacity: 1;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.copy-notification {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: slideIn 0.3s ease, fadeOut 2s ease 0.7s forwards;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
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
</style>