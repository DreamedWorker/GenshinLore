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
  <div :class="{ toc_visible: !isMobile && (frontmatter.show_toc ?? true) }" class="w-full">
    <article class="relative w-full flex flex-col pt-7.5">
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
  </div>
</template>

<style scoped>
article {
  padding-inline: 2em;
}

@media not (max-width: 1210px) {
  .toc_visible article {
    padding-inline: 2em 0;
    padding-right: 330px;
  }
}
</style>
