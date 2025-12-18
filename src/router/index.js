// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PaletteLibrary from '../views/PaletteLibrary.vue'
import PaletteDetail from '../views/PaletteDetail.vue'
import PaletteEditor from '../views/PaletteEditor.vue'
import ExportPage from '../views/ExportPage.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
	{ path: '/', name: 'Home', component: HomePage },
	{ path: '/library', name: 'Library', component: PaletteLibrary },
	{ path: '/editor', name: 'Editor', component: PaletteEditor },
	{ path: '/export', name: 'Export', component: ExportPage },
	{ path: '/palette/:id', name: 'PaletteDetail', component: PaletteDetail, props: true },
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
	history: createWebHashHistory(),   // 👈 ВАЖНО
	routes
})

export default router
