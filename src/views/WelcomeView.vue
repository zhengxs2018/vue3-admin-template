<template>
  <div class="welcome">
    欢迎, {{ displayUserName }}
    {{ value }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'

import useUserStore from '@/store/user.store'

export default defineComponent({
  name: 'WelcomeView',
  setup() {
    const userStore = useUserStore()
    const { displayUserName } = storeToRefs(userStore)

    const value = Math.random()

    return {
      displayUserName,
      value
    }
  }
})
</script>
