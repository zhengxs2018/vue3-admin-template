<template>
  <div class="welcome">
    欢迎, {{ displayUserName }}

    <p>这里的东西会被缓存</p>
    <el-input v-model="message" />
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'

import useUserStore from '@/store/user.store'

export default defineComponent({
  name: 'WelcomeView',
  setup() {
    const userStore = useUserStore()
    const { displayUserName } = storeToRefs(userStore)

    const message = ref(Math.random())

    return {
      displayUserName,
      message
    }
  }
})
</script>
