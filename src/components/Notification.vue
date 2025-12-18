<template>
  <div class="notification-container">
    <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
        @click="removeNotification(notification.id)"
    >
      <span class="notification-message">{{ notification.message }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { setNotificationInstance } from '../utils/notifications'

export default {
  name: 'Notification',

  setup() {
    const notifications = ref([])
    let nextId = 1

    const showNotification = (message, type = 'info', duration = 3000) => {
      const id = nextId++
      const notification = { id, message, type }
      notifications.value.push(notification)

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }

      return id
    }

    const removeNotification = (id) => {
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    }

    onMounted(() => {
      setNotificationInstance({
        showNotification,
        removeNotification
      })
    })

    return {
      notifications,
      showNotification,
      removeNotification
    }
  }
}
</script>

<style scoped>
/* Стили из предыдущего кода */
.notification-container {
  position: fixed;
  top: 90px; /* ниже хедера */
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  animation: slideIn 0.3s ease;
  border-left: 4px solid #667eea;
  transition: transform 0.2s, opacity 0.2s;
}

body.dark-theme .notification {
  background: #2d3748;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.notification:hover {
  transform: translateY(-2px);
}

.notification.success {
  border-left-color: #48bb78;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.notification.error {
  border-left-color: #f56565;
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
}

.notification.warning {
  border-left-color: #ed8936;
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.notification.info {
  border-left-color: #4299e1;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.notification-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .notification-container {
    top: 80px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .notification {
    padding: 14px 16px;
  }
}
</style>