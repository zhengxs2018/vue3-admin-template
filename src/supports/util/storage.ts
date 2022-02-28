import { serializer, deserializer } from './json'
import type { Serializer, Deserializer } from './json'

export interface UserStorageOptions {
  store?: Storage
  prefix?: string
  serialize?: Serializer
  deserialize?: Deserializer
}

export class WebStorageSync {
  prefix: string
  store: Storage

  serialize: Serializer
  deserialize: Deserializer

  options: UserStorageOptions

  constructor(options: UserStorageOptions = {}) {
    const {
      prefix = 'custom',
      store = window.localStorage,
      serialize = serializer,
      deserialize = deserializer
    } = options

    this.store = store
    this.prefix = prefix
    this.serialize = serialize
    this.deserialize = deserialize
    this.options = options
  }

  set(key: string, value: unknown) {
    const item = this.serialize(value)
    if (item == null) return this.remove(key)
    return this.store.setItem(`${this.prefix}${key}`, item)
  }

  get<T = unknown>(key: string): T {
    const item = this.store.getItem(`${this.prefix}${key}`)
    return this.deserialize(item)
  }

  remove<T = unknown>(key: string): T {
    const name = `${this.prefix}${key}`
    const store = this.store

    const item = this.get<T>(name)
    store.removeItem(name)

    return item
  }

  *[Symbol.iterator]() {
    const store = this.store
    const prefix = this.prefix

    for (let index = 0, len = store.length; index < len; index++) {
      const key = store.key(index)

      if (key == null || key.indexOf(prefix) !== 0) continue

      yield key.slice(prefix.length)
    }
  }

  forEach(callback: (key: string) => unknown) {
    for (const key of this) {
      if (callback(key) === false) break
    }
  }

  size() {
    return this.keys().length
  }

  keys() {
    const keys: string[] = []
    this.forEach(key => keys.push(key))
    return keys
  }
}
