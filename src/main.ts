import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './index.css'
import App from './App.vue'
import router from './router'
import { initUser } from './store/user.store'
import auth from './lib/auth'

const createVue = () => createApp(App).use(ElementPlus).use(createPinia()).use(router)

async function main() {
  const { user, appState } = await auth.prepare()

  const targetUrl = appState ? appState.targetUrl : null
  if (targetUrl) {
    const parsed = new URL(targetUrl)
    await router.replace(parsed.hash.replace('#', ''))
  }

  const app = createVue()

  // 必须先初始化用户
  initUser(user)

  app.mount('#app')
}

main()
