<template>
  <div class="modal-overlay" @click="cancel">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="cancel" class="close-btn">✕</button>
      </div>

      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-actions">
        <button @click="cancel" class="btn btn-secondary">
          {{ cancelText }}
        </button>
        <button @click="confirm" class="btn btn-danger">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',

  props: {
    title: {
      type: String,
      default: 'Подтверждение'
    },
    message: {
      type: String,
      default: 'Вы уверены?'
    },
    confirmText: {
      type: String,
      default: 'Да'
    },
    cancelText: {
      type: String,
      default: 'Нет'
    }
  },

  emits: ['confirm', 'cancel'],

  methods: {
    confirm() {
      this.$emit('confirm')
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
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
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 24px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f8fafc;
  color: #4a5568;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0;
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
}

.modal-actions {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-danger:hover {
  background: #e53e3e;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Для темной темы */
body.dark-theme .modal-content {
  background: #2d3748;
}

body.dark-theme .modal-header h3 {
  color: #e2e8f0;
}

body.dark-theme .modal-body p {
  color: #cbd5e0;
}

body.dark-theme .modal-actions {
  background: #4a5568;
}

body.dark-theme .close-btn:hover {
  background: #4a5568;
  color: #e2e8f0;
}

body.dark-theme .btn-secondary {
  background: #4a5568;
  color: #e2e8f0;
}

body.dark-theme .btn-secondary:hover {
  background: #718096;
}
</style>