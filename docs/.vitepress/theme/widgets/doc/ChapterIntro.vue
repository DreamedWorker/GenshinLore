<script setup lang="ts">
defineProps<{
  bg: string
  sentence: string
  signature: string
}>()
</script>

<template>
  <div
    class="chapter-intro w-full"
    :style="{
      '--intro-bg': `url(${bg})`,
    }"
  >
    {{sentence}}
  </div>
</template>

<style scoped>
.chapter-intro::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--intro-bg);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
