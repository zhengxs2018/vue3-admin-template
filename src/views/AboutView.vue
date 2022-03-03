<template>
  <div class="about">
    <h1>This is an about page</h1>

    <p>这里的东西不会被缓存</p>
    <el-input v-model="message" />
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const message = ref(Math.random())
</script>
