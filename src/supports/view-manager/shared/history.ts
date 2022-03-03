// TODO 迁移 favIconUrl 属性
export type HistoryItem = {
  /**
   * 唯一性标识
   */
  name?: string | symbol
  /**
   * 标题
   */
  title: string
  /**
   * 页面 URL
   */
  url: string
  /**
   * 引用来源
   */
  referrer: string
  /**
   * 固定标签页
   *
   * @defaultValue false
   */
  pinned: boolean
  /**
   * 路由组件名称
   */
  componentName?: string
  /**
   * 是否应该使用 keepAlive 缓存
   */
  shouldKeepAlive: boolean
  /**
   * 调用 API 刷新页面的次数
   */
  refreshCount: number
  /**
   * 用户访问页面的次数
   */
  visitCount: number
  /**
   * 最后一次显示的时间
   */
  lastVisitTime: number
}

/**
 * 转换类型
 */
export type TransitionType = 'route' | 'refresh'

/**
 * 创建属性
 */
export type HistoryCreateProperties = {
  /**
   * 唯一性标识
   */
  name?: string | symbol
  title?: string
  url: string
  referrer?: string
  pinned?: boolean
  componentName?: string
  shouldKeepAlive: boolean
  transition?: TransitionType
  visitTime?: Date | number | string
}
