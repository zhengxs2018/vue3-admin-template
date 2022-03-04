import { noop, stubTrue } from 'lodash-es'

import { provide, inject, ref } from 'vue'
import type { Ref } from 'vue'

import { useRouter } from 'vue-router'
import type { RouteLocation, NavigationGuardWithThis, NavigationHookAfter } from 'vue-router'

import { isNavigationDuplicated, getRootRoute, getRootRouteComponentName } from '@/supports/shared/router'

import type { HistoryItem, HistoryCreateProperties } from '../shared/history'

import { shouldCacheComponent } from '../util/shouldCache'
import { skip } from '../util/skip'
import type { SkipUnknownRoute } from '../util/skip'

const VIEW_HISTORY_INJECT_KEY = Symbol.for('view-manager#history')

export type BeforeGenerateHook = (route: RouteLocation) => boolean
export type GenerateHook = (details: HistoryCreateProperties) => void
export type GenerateTitle = (route: RouteLocation) => string | null | undefined
export type BeforeDeleteHook = (item: HistoryItem) => void
export type DeletedHook = (item: HistoryItem) => void

export type HistoryContext = {
  data: Ref<HistoryItem[]>
  addUrl: (details: HistoryCreateProperties) => void
  deleteUrl: (details: { url: string }) => void
  setupListeners: () => void
  teardown: () => void
}

export type HistoryOptions = {
  onBeforeGenerate?: BeforeGenerateHook
  onGenerate?: GenerateHook
  onGenerateTitle?: GenerateTitle
  onSkipUnknownRoute?: SkipUnknownRoute
  onBeforeDelete?: BeforeDeleteHook,
  onDeleted?: DeletedHook,
}

const generateTitle: GenerateTitle = route => (route.query.title || route.meta.title) as string | undefined

export function createHistory(options: HistoryOptions) {
  const {
    onBeforeGenerate = noop as BeforeGenerateHook,
    onGenerateTitle = generateTitle,
    onGenerate = noop,
    onBeforeDelete = noop,
    onDeleted = noop,
    onSkipUnknownRoute = stubTrue,
  } = options

  const data = ref<HistoryItem[]>([])

  const search = (details: { name?: string | symbol, url: string }) => {
    const { name, url } = details

    const matchUrl = (item: HistoryItem) => item.url === url
    const matchIdOrUrl = (item: HistoryItem) => item.name === name || item.url === url

    const history = data.value
    const index = history.findIndex(name == null ? matchUrl : matchIdOrUrl)
    return index === -1 ? null : history[index]
  }

  const addUrl = (details: HistoryCreateProperties) => {
    const history = data.value

    const {
      name,
      url,
      title = '新建标签页',
      referrer = '/',
      transition = 'route',
      pinned = false,
      visitTime = Date.now(),
      componentName,
      shouldKeepAlive
    } = details

    // TODO 需要确保数据正确
    const lastVisitTime = new Date(visitTime).getTime()

    const oldItem = search({ name, url })

    if (oldItem == null) {
      history.push({
        name,
        title,
        url,
        referrer,
        pinned,
        refreshCount: 0,
        visitCount: 1,
        componentName,
        lastVisitTime,
        shouldKeepAlive,
      })
      return
    }

    if (name != null) oldItem.name = name
    if (title != null) oldItem.title = title
    if (componentName != null) oldItem.componentName = componentName

    oldItem.url = url
    oldItem.referrer = referrer
    oldItem.shouldKeepAlive = shouldKeepAlive

    oldItem.visitCount++
    oldItem.lastVisitTime = lastVisitTime

    if (transition === 'refresh') {
      oldItem.refreshCount++
    }
  }

  const deleteUrl = ({ url }: { url: string }) => {
    const history = data.value
    const index = history.findIndex(item => item.url === url)
    if (index === -1) return

    const item = history[index]
    onBeforeDelete(item)
    history.splice(index, 1)[0]
    onDeleted(item)
  }

  const router = useRouter();
  const registerRouterHooks: Array<() => void> = []

  const onBeforeRouteEnter: NavigationGuardWithThis<undefined> = (to, form) => {
    if (isNavigationDuplicated(to, form)) return
    if (onBeforeGenerate(to) === false || skip(to, onSkipUnknownRoute)) return

    // TODO 为了防止闪烁，需要延迟添加
    addUrl({
      title: '新标签页',
      url: 'about：blank',
      referrer: form.fullPath,
      shouldKeepAlive: false
    })
  }

  // TODO 还要处理路由进入失败的问题？
  // TODO 对父子路由支持有问题
  const onAfterRouteEnter: NavigationHookAfter = (to, form) => {
    if (isNavigationDuplicated(to, form)) return
    if (onBeforeGenerate(to) === false || skip(to, onSkipUnknownRoute)) return

    deleteUrl({ url: 'about：blank' })

    const root = getRootRoute(to)
    const componentName = getRootRouteComponentName(to)
    const shouldKeepAlive = componentName !== null && shouldCacheComponent(to)

    const details: HistoryCreateProperties = {
      name: root.name || componentName,
      title: onGenerateTitle(to) || '未设置标题',
      url: to.fullPath,
      referrer: form.fullPath,
      componentName,
      shouldKeepAlive,
      pinned: root.meta.pinned === true
    }

    onGenerate(details)
    addUrl(details)
  }

  const setupListeners = () => {
    if (registerRouterHooks.length > 0) return

    registerRouterHooks.push(
      router.beforeEach(onBeforeRouteEnter),
      router.afterEach(onAfterRouteEnter)
    )
  }

  const teardown = () => {
    while (registerRouterHooks.length) {
      const unregister = registerRouterHooks.pop()
      unregister!()
    }
  }

  const context: HistoryContext = {
    data,
    addUrl,
    deleteUrl,
    teardown,
    setupListeners
  }

  provide(VIEW_HISTORY_INJECT_KEY, context)

  return context
}

export function useHistory() {
  return inject(VIEW_HISTORY_INJECT_KEY) as HistoryContext
}

