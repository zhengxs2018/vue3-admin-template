import 'vue-router'

// hack 拓展 RouteMeta 属性
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 页面标题
     *
     * @defaultValue 新建标签页
     */
    title?: string;
    /**
     * 是否固定标签页额
     *
     * @defaultValue false
     */
    pinned?: boolean;
    /**
     * 设置为 false 可以取消缓存
     *
     * @defaultValue true
     */
    cache?: boolean
  }
}
