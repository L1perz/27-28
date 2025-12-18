<template>
    <PaletteGenerator />
</template>

<script>
import PaletteGenerator from '../components/PaletteGenerator.vue'
import { PaletteStore } from '../utils/paletteStore'

export default {
  name: 'HomePage',
  components: {
    PaletteGenerator
  }
}
</script>

<style scoped>
.home-page {
  padding: 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 20px 20px;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 15px;
    border-radius: 0 0 16px 16px;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
</style>