import { provide, inject, ref, KeepAliveProps, toRef } from 'vue'
import type { Ref } from 'vue'

import type { MaybeRef } from '@/supports/shared/reactive'

const CACHE_INJECT_KEY = Symbol.for('view-manager#cache')

export type CacheContext = {
  include: Ref<string[]>
  exclude?: Ref<KeepAliveProps['exclude']>
  max?: Ref<KeepAliveProps['max']>
  addCache: (item: string) => void
  removeCache: (item: string) => void
}

export type CacheOptions = {
  exclude?: MaybeRef<KeepAliveProps['exclude']>
  max?: MaybeRef<KeepAliveProps['max']>
}

export function createCache(options: CacheOptions) {
  const exclude = toRef(options, 'exclude') as Ref<KeepAliveProps['exclude']>
  const max = toRef(options, 'max') as Ref<KeepAliveProps['max']>

  // 关闭标签页之后才允许关闭页面
  // 但这是用户的主动行为
  // 所以只能内部维护一个数组用来控制缓存的页面
  const include = ref<string[]>([])

  const addCache = (item?: string) => {
    // TODO 不推荐传递空
    if (item == null) return

    const cache = include.value
    const index = cache.indexOf(item)

    if (index > -1) return
    cache.push(item)
  }

  const removeCache = (item?: string) => {
    // TODO 不推荐传递空
    if (item == null) return

    const cache = include.value
    const index = cache.indexOf(item)

    if (index === -1) return
    cache.splice(index, 1)
  }

  const context: CacheContext = {
    include,
    exclude,
    max,
    addCache,
    removeCache,
  }

  provide(CACHE_INJECT_KEY, context)

  return context
}

export function useCache() {
  return inject(CACHE_INJECT_KEY) as CacheContext
}
