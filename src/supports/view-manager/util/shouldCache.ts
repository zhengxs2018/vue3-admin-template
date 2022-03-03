import type { RouteLocation } from 'vue-router'

import { getRootRoute } from '../shared/router'

export function shouldCacheComponent(route: RouteLocation) {
  // TODO 对父子路由支持有限制
  const root = getRootRoute(route)
  return root.meta.cache !== false
}
