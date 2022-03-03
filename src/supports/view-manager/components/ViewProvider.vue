<template>
  <slot v-bind="provider"></slot>
</template>

<script lang="ts" setup>
import type { PropType, KeepAliveProps } from 'vue'

import { createManagerProvider } from '../composables/manager'
import type {
  BeforeGenerateHook,
  GenerateHook,
  GenerateTitle
} from '../composables/history'
import type { SkipUnknownRoute } from '../util/skip'

const props = defineProps({
  /**
   * 需要排除缓存的页面
   */
  exclude: [String, RegExp, Array] as PropType<KeepAliveProps['exclude']>,
  /**
   * 最大缓存数量
   */
  max: [String, Number] as PropType<KeepAliveProps['max']>,
  /**
   * 数据生成前的处理
   */
  onBeforeGenerate: Function as PropType<BeforeGenerateHook>,
  /**
   * 接管数据生成
   */
  onGenerate: Function as PropType<GenerateHook>,
  /**
   * 接管视图标题生成
   */
  onGenerateTitle: Function as PropType<GenerateTitle>,
  /**
   * 跳过未定义路由
   */
  onSkipUnknownRoute: Function as PropType<SkipUnknownRoute>
})

const provider = createManagerProvider(props)

defineExpose(provider)
</script>

