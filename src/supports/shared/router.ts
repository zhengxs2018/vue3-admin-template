import type { RouteComponent, RouteLocation, RouteRecordNormalized } from 'vue-router'

export type LazyRouteComponent = () => Promise<RouteComponent>;

export type RawRouteComponent = RouteComponent | LazyRouteComponent

export function getRootRoute(route: RouteLocation): RouteRecordNormalized {
  return route.matched[0]
}

export function getRootRouteName(route: RouteLocation): string | symbol | undefined {
  return getRootRoute(route).name
}

export function getRootRouteComponent(route: RouteLocation): RawRouteComponent {
  const rootRoute = getRootRoute(route)
  return rootRoute.components['default']
}

export function getRootRouteComponentName(route: RouteLocation): string | undefined {
  const Component = getRootRouteComponent(route)
  return Component.name
}

/**
 * 是否未定义路由
 */
export function isUnknownRoute(route: RouteLocation): boolean {
  // TODO 需要考虑自定义的404页面?
  return route.matched.length === 0
}

/**
 * 重复进入
 * TODO 有内置的函数么？
 */
export function isNavigationDuplicated(to: RouteLocation, form: RouteLocation): boolean {
  if (isUnknownRoute(form)) return false
  return to.fullPath === form.fullPath
}
