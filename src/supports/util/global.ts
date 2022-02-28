import { inNodeJS } from '../runtime-env'

const fallbackGlobalObject = {}

/**
 * 从不同的 JavaScript 环境中获取全局对象
 *
 * 参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis
 *
 * @returns 一定会返回对象
 */
export function getGlobalObject<T = Window, U = T & typeof globalThis>(): U {
  if (typeof globalThis === 'undefined') {
    return (
      inNodeJS
        ? global
        : typeof window !== 'undefined' // eslint-disable-line no-restricted-globals
        ? window // eslint-disable-line no-restricted-globals
        : typeof self !== 'undefined'
        ? self
        : fallbackGlobalObject
    ) as U
  }

  return globalThis as unknown as U
}
