<template>
  <div class="flex flex-col h-full">
    <!-- 有毒，plus 还不支持单个 tabPane 启用 closable 属性 -->
    <el-tabs
      class="tabs-view__nav"
      type="card"
      :model-value="currentRoute.fullPath"
      @tab-click="handleClick"
      @tab-remove="handleRemove"
    >
      <el-tab-pane
        v-for="item in views"
        :key="item.url"
        :label="item.title"
        :name="item.url"
        :cloasable="item.pinned === false"
      >
      </el-tab-pane>
    </el-tabs>

    <div class="flex-1">
      <ViewOutlet />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ViewOutlet, useHistory } from '@/supports/view-manager'

const router = useRouter()
const currentRoute = useRoute()
const { data } = useHistory()

// 将固定标签页排到前面
const views = computed(() =>
  data.value.sort((a, b) => Number(b.pinned) - Number(a.pinned))
)

const handleClick = (pane: { paneName: string }) => {
  router.push(pane.paneName)
}

const handleRemove = (name: string) => {
  // 待迁移
}
</script>
