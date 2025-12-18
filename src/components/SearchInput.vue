<template>
  <div class="search-input">
    <div class="input-container">
      <span class="search-icon">🔍</span>
      <input
          type="text"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
          class="search-field"
          @keyup.enter="$emit('search')"
          @keyup.esc="$emit('clear')"
      />
      <button
          v-if="modelValue"
          @click="$emit('clear')"
          class="clear-btn"
          title="Очистить"
      >
        ✕
      </button>
    </div>

    <div v-if="showFilters" class="search-filters">
      <div class="filter-group">
        <label>
          <input
              type="checkbox"
              v-model="filters.onlyFavorites"
              @change="updateFilters"
          />
          Только избранное
        </label>
        <label>
          <input
              type="checkbox"
              v-model="filters.withTags"
              @change="updateFilters"
          />
          С тегами
        </label>
      </div>

      <div class="sort-group">
        <label>Сортировка:</label>
        <select v-model="filters.sortBy" @change="updateFilters" class="sort-select">
          <option value="date">По дате</option>
          <option value="name">По названию</option>
          <option value="colors">По количеству цветов</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SearchInput',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Поиск палитр...'
    },
    showFilters: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'search', 'clear', 'update-filters'],

  setup(props, { emit }) {
    const filters = ref({
      onlyFavorites: false,
      withTags: false,
      sortBy: 'date'
    })

    const updateFilters = () => {
      emit('update-filters', { ...filters.value })
    }

    return {
      filters,
      updateFilters
    }
  }
}
</script>

<style scoped>
.search-input {
  width: 100%;
}

.input-container {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: var(--text-tertiary);
}

.search-field {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.search-field:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-field::placeholder {
  color: var(--text-tertiary);
}

.clear-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-btn:hover {
  color: #f56565;
  background: rgba(245, 101, 101, 0.1);
}

.search-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: 0.25s;
}

.filter-group {
  display: flex;
  gap: 20px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.filter-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-group label {
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

.sort-select {
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: 0.25s;
}
.sort-select:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
  outline: none;
}

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    gap: 12px;
  }

  .sort-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>