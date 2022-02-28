<template>
  <div class="welcome">欢迎, {{ displayUserName }}</div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import useUserStore from '@/store/user.store'

const userStore = useUserStore()

const { displayUserName } = storeToRefs(userStore)
</script>
