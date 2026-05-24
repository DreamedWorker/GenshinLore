<script setup lang="ts">
import { Content, useData } from 'vitepress'
import { computed } from 'vue'
import useIsMobile from '@/composables/isMobile'
//import TOC from '@/components/theme/TOC.vue'

const { frontmatter, page } = useData()

const isMobile = useIsMobile()
const title = computed(() => (frontmatter.value.title as string) ?? undefined)
</script>

<template>
  <article class="relative w-full max-w-250 flex flex-col m-[0_auto] p-[60px_40px]">
    <span
      v-if="title != undefined"
      class="w-full text-center font-[Genshin] text-[42px] mb-10 pb-5 border-b-[3px] border-b-[#D3BC8E]"
      >{{ title }}</span
    >
    <div v-if="(frontmatter.show_toc ?? true) && !isMobile">
      <!--        <TOC />-->
    </div>
    <Content class="main-text" />
  </article>
</template>

<style scoped></style>
