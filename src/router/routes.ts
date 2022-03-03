import { RouteRecordRaw } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    component: WelcomeView,
    meta: {
      title: '欢迎页',
      pinned: true
    }
  },
  {
    name: 'about',
    path: '/about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
      title: '关于我们'
    }
  }
]

export default routes
