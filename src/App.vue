<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import SideMenu from '@/components/SideMenu.vue'
import TabsView from '@/components/TabsView.vue'

import { ViewProvider } from '@/supports/view-manager'
import useUserStore from '@/store/user.store'

const userStore = useUserStore()
const { displayUserName } = storeToRefs(userStore)
</script>

<template>
  <el-container class="h-full">
    <el-header class="layout-header">
      <div class="layout-toolbar">
        <span>{{ displayUserName }}</span>
      </div>
    </el-header>

    <el-container class="flex-1">
      <el-aside class="layout-sidebar">
        <el-scrollbar>
          <SideMenu />
        </el-scrollbar>
      </el-aside>

      <el-main class="p-0">
        <ViewProvider>
          <TabsView />
        </ViewProvider>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.layout-header {
  position: relative;
  padding: 0;
  background-color: #b3c0d1;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
}

.layout-toolbar {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.layout-sidebar {
  width: 240px;
  border-right: 1px solid #e6e6e6;
  box-sizing: border-box;
}
</style>
