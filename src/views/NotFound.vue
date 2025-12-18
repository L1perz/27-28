<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>Страница не найдена</h1>
      <p>Запрошенная страница не существует или была перемещена.</p>
      <div class="actions">
        <router-link to="/" class="btn btn-primary">
          🏠 На главную
        </router-link>
        <router-link to="/library" class="btn btn-secondary">
          📚 В библиотеку
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
}

.not-found-content h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 16px;
  font-weight: 700;
}

.not-found-content p {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 32px;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}
</style>