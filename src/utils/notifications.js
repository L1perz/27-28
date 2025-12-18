import Notification from '../components/Notification.vue'

// Создаем глобальную систему уведомлений
let notificationInstance = null

export const setNotificationInstance = (instance) => {
	notificationInstance = instance
}

export const notify = {
	success(message, duration = 3000) {
		if (notificationInstance) {
			return notificationInstance.showNotification(message, 'success', duration)
		} else {
			console.log('✅', message)
		}
	},
	error(message, duration = 4000) {
		if (notificationInstance) {
			return notificationInstance.showNotification(message, 'error', duration)
		} else {
			console.error('❌', message)
		}
	},
	warning(message, duration = 4000) {
		if (notificationInstance) {
			return notificationInstance.showNotification(message, 'warning', duration)
		} else {
			console.warn('⚠️', message)
		}
	},
	info(message, duration = 3000) {
		if (notificationInstance) {
			return notificationInstance.showNotification(message, 'info', duration)
		} else {
			console.info('ℹ️', message)
		}
	}
}