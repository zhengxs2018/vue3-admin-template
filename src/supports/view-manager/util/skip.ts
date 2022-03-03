import { stubTrue } from 'lodash-es'
import type { RouteLocation } from 'vue-router'

import { isUnknownRoute } from '../shared/router'

export type SkipUnknownRoute = (route: RouteLocation) => boolean

export type SkipGenerate = (route: RouteLocation, onSkipUnknownRoute?: SkipUnknownRoute) => boolean

/**
 * 允许外部接管标签页的生成
 *
 * @param route - 路由对象
 * @returns
 */
export const skipCustom = (route: RouteLocation): boolean => {
  return route.matched.length > 0 && route.meta.skip === true
}

/**
 * 跳过视图生成，返回 true 将不生成视图数据
 *
 * @param route - 路由对象
 * @returns
 */
export const skip: SkipGenerate = (route, onSkipUnknownRoute = stubTrue) => {
  return isUnknownRoute(route) ? onSkipUnknownRoute(route) : skipCustom(route)
}
