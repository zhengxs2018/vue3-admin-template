<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="include" :exclude="exclude" :max="max">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>

<script lang="ts" setup>
import { useCache } from '../composables/cache'

const { include, exclude, max } = useCache()
</script>
