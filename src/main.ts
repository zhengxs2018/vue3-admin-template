import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './index.css'
import App from './App.vue'
import router from './router'
import { initUser } from './store/user.store'
import auth from './lib/auth'
import type { OidcUser } from './supports/vendors/authing'

async function mountApp(user: OidcUser) {
  const app = createApp(App).use(createPinia()).use(router)

  // 必须先初始化用户
  initUser(user)

  app.mount('#app')
}

async function main() {
  const { user, appState } = await auth.prepare()

  const targetUrl = appState ? appState.targetUrl : null
  if (targetUrl) history.replaceState(null, '', targetUrl)

  mountApp(user)
}

main()
