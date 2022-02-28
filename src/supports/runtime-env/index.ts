/**
 * 是否处于浏览器环境
 */
export const inBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

/**
 * 是否处于 Web Worker 环境
 */
export const inWebWorker =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'

/**
 * 是否处于 NodeJS 环境
 */
export const inNodeJS = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

/**
 * 是否处于 JSDOM 环境
 */
export const inJsDom = typeof window !== 'undefined' && window.name === 'nodejs'
