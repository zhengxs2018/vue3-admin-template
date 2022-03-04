import './shims-vue-router'

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
