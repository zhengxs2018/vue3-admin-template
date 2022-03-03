import { noop } from 'lodash-es'

import { provide, inject, onMounted, onBeforeUnmount } from 'vue'

import { createHistory } from './history'
import type { HistoryContext, HistoryOptions } from './history'

import { createCache } from './cache'
import type { CacheContext, CacheOptions } from './cache'

const MANAGER_INJECT_KEY = Symbol.for('view-manager#manager')

export type ManagerContext = {
  history: HistoryContext,
  cache: CacheContext
}

export type ManagerOptions = HistoryOptions & CacheOptions

export function createManagerProvider(options: ManagerOptions) {
  const {
    onBeforeGenerate,
    onGenerateTitle,
    onGenerate: onNextGenerate = noop,
    onBeforeDelete,
    onDeleted,
    onSkipUnknownRoute
  } = options

  const cache = createCache(options)
  const history = createHistory({
    onBeforeGenerate,
    onGenerateTitle,
    onBeforeDelete,
    onDeleted,
    onSkipUnknownRoute,
    onGenerate(details) {
      onNextGenerate(details)

      if (details['shouldKeepAlive']) {
        // TODO 为什么类型会错误？
        cache.addCache(details['componentName']!)
      }
    }
  })

  const context: ManagerContext = {
    history,
    cache,
  }

  provide(MANAGER_INJECT_KEY, context)

  onMounted(() => history.setupListeners())
  onBeforeUnmount(() => history.teardown())

  return context
}

export function useManager() {
  return inject(MANAGER_INJECT_KEY) as ManagerContext
}
