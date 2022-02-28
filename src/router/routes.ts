import { RouteRecordRaw } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: WelcomeView
  },
  {
    path: '/about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

export default routes
