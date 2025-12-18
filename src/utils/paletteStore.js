// src/utils/paletteStore.js
export const PaletteStore = {
	// Получить все палитры
	getAll() {
		try {
			const saved = localStorage.getItem('paletteLibrary')
			return saved ? JSON.parse(saved) : []
		} catch (e) {
			console.error('Ошибка загрузки палитр:', e)
			return []
		}
	},
	
	// Сохранить все палитры
	saveAll(palettes) {
		try {
			localStorage.setItem('paletteLibrary', JSON.stringify(palettes))
		} catch (e) {
			console.error('Ошибка сохранения палитр:', e)
		}
	},
	
	// Добавить новую палитру
	add(palette) {
		const palettes = this.getAll()
		
		// Проверяем уникальность ID
		const existingIds = palettes.map(p => p.id)
		let newId = palette.id || Date.now()
		while (existingIds.includes(newId)) {
			newId++
		}
		
		const newPalette = {
			...palette,
			id: newId,
			createdAt: palette.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
		
		palettes.unshift(newPalette)
		this.saveAll(palettes)
		return newPalette
	},
	
	// Обновить палитру
	update(id, updatedPalette) {
		const palettes = this.getAll()
		const index = palettes.findIndex(p => p.id === id)
		if (index !== -1) {
			palettes[index] = {
				...palettes[index],
				...updatedPalette,
				updatedAt: new Date().toISOString(),
				id: palettes[index].id // Сохраняем оригинальный ID
			}
			this.saveAll(palettes)
			return true
		}
		return false
	},
	
	// Удалить палитру
	delete(id) {
		const palettes = this.getAll()
		const filtered = palettes.filter(p => p.id !== id)
		this.saveAll(filtered)
		return filtered
	},
	
	// Получить текущую палитру (для генератора)
	getCurrent() {
		try {
			const saved = localStorage.getItem('currentPalette')
			return saved ? JSON.parse(saved) : null
		} catch (e) {
			console.error('Ошибка загрузки текущей палитры:', e)
			return null
		}
	},
	
	// Сохранить текущую палитру (для генератора)
	setCurrent(colors) {
		try {
			localStorage.setItem('currentPalette', JSON.stringify(colors))
		} catch (e) {
			console.error('Ошибка сохранения текущей палитры:', e)
		}
	},
	
	// Импорт палитр
	importFromJSON(jsonData) {
		try {
			const importedPalettes = JSON.parse(jsonData)
			if (!Array.isArray(importedPalettes)) {
				throw new Error('Invalid format: expected array')
			}
			
			// Валидация импортированных палитр
			const validPalettes = importedPalettes.filter(palette => {
				return palette &&
					typeof palette === 'object' &&
					palette.name &&
					Array.isArray(palette.colors) &&
					palette.colors.length > 0
			})
			
			const existingPalettes = this.getAll()
			const newPalettes = [...validPalettes, ...existingPalettes]
			this.saveAll(newPalettes)
			
			return {
				success: true,
				count: validPalettes.length,
				total: validPalettes.length,
				invalid: importedPalettes.length - validPalettes.length
			}
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Unknown error'
			}
		}
	},
	
	// Экспорт палитр
	exportToJSON() {
		return JSON.stringify(this.getAll(), null, 2)
	},
	
	// Получить избранные палитры
	getFeatured() {
		return this.getAll().filter(p => p.featured)
	},
	
	// Поиск палитр
	search(query) {
		const palettes = this.getAll()
		if (!query) return palettes
		
		const q = query.toLowerCase()
		return palettes.filter(palette => {
			if (!palette) return false
			
			const nameMatch = palette.name && palette.name.toLowerCase().includes(q)
			const tagsMatch = palette.tags &&
				Array.isArray(palette.tags) &&
				palette.tags.some(tag => tag && tag.toLowerCase().includes(q))
			const descMatch = palette.description &&
				palette.description.toLowerCase().includes(q)
			
			return nameMatch || tagsMatch || descMatch
		})
	}
}

// Демо палитры для инициализации
export const demoPalettes = [
	{
		id: 1,
		name: 'Градиентное небо',
		description: 'Палитра для интерфейсов с градиентами',
		colors: ['#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936'],
		tags: ['градиент', 'интерфейс', 'модерн'],
		featured: true,
		createdAt: '2025-01-15T10:30:00.000Z',
		updatedAt: '2025-01-15T10:30:00.000Z'
	},
	{
		id: 2,
		name: 'Пастельные тона',
		description: 'Мягкие цвета для спокойных интерфейсов',
		colors: ['#ffd6e7', '#ffef9f', '#c1fba4', '#7bf1a8', '#90f1ef'],
		tags: ['пастель', 'спокойствие', 'минимализм'],
		featured: false,
		createdAt: '2025-01-10T14:20:00.000Z',
		updatedAt: '2025-01-10T14:20:00.000Z'
	},
	{
		id: 3,
		name: 'Тёмная тема',
		description: 'Контрастные цвета для тёмных интерфейсов',
		colors: ['#1a202c', '#2d3748', '#4a5568', '#718096', '#a0aec0'],
		tags: ['тёмная', 'контраст', 'ночной'],
		featured: true,
		createdAt: '2025-01-05T09:15:00.000Z',
		updatedAt: '2025-01-05T09:15:00.000Z'
	}
]

// Инициализация хранилища
export function initializePaletteStore() {
	const existing = PaletteStore.getAll()
	if (existing.length === 0) {
		PaletteStore.saveAll(demoPalettes)
	}
}