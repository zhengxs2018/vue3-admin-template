import './shim-router'
import type { App } from 'vue'

import ViewProvider from './components/ViewProvider.vue'
import ViewOutlet from './components/ViewOutlet.vue'

import { useManager } from './composables/manager'
import { useHistory } from './composables/history'
import { useCache } from './composables/cache'

export {
  // components
  ViewProvider,
  ViewOutlet,
  // composables
  useManager,
  useHistory,
  useCache,
}

export default {
  install(app: App) {
    app.component('view-provider', ViewProvider)
    app.component('view-outlet', ViewOutlet)
  }
}
