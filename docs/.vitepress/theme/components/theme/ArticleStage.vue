<script setup lang="ts">
import { Content, useData } from 'vitepress'
import { computed, ref } from 'vue'
import { useWindowScroll, useElementSize } from '@vueuse/core'
import useIsMobile from '@/composables/isMobile'
//import TOC from '@/components/theme/TOC.vue'

const { frontmatter, page } = useData()

const isMobile = useIsMobile()
const title = computed(() => (frontmatter.value.title as string) ?? undefined)
const latin = computed(() => (frontmatter.value.latinScript as string) ?? undefined)
const foreword = computed(() => (frontmatter.value.foreword as string) ?? undefined)

const coverRef = ref<HTMLElement | null>(null)
const { y: scrollY } = useWindowScroll()
const { height: coverHeight } = useElementSize(coverRef)

const coverProgress = computed(() => {
  if (coverHeight.value === 0) return 1
  const progress = 1 - scrollY.value / coverHeight.value
  return Math.max(0, Math.min(1, progress))
})
</script>

<template>
  <article
    v-if="frontmatter.layout != 'chronicle-history'"
    class="relative w-full max-w-250 flex flex-col m-[0_auto] p-[60px_40px]"
  >
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
  <article
    v-else
    class="relative w-full max-w-250 flex flex-col m-[0_auto]"
    :class="isMobile ? 'px-5' : 'px-10'"
  >
    <div
      ref="coverRef"
      class="cover-section flex flex-col overflow-hidden"
      :style="{
        opacity: coverProgress,
        transition: 'opacity 0.35s ease-out',
        height: isMobile
          ? 'calc(100vh - var(--site-header-height-mobile, 60px))'
          : 'calc(100vh - var(--site-header-height-desktop, 70px))',
        paddingTop: isMobile ? '40px' : '60px',
      }"
    >
      <img
        :src="`${frontmatter.illustration0}`"
        alt="国家背景图1"
        draggable="false"
        loading="eager"
        class="flex-1 min-h-0 w-full object-cover"
      />
      <div
        class="country-title relative flex flex-col items-center justify-center mt-4 shrink-0"
        :style="{
          '--logo': `url('/img/logo/country/${frontmatter.country}.png')`,
          minHeight: '200px',
        }"
      >
        <span
          v-if="title != undefined"
          class="relative w-full text-center font-[Genshin] text-[38px] mb-2"
          >{{ title }}</span
        >
        <span v-if="latin != undefined" class="relative w-full text-center font-[Khaenriah]">{{
          latin
        }}</span>
      </div>
      <p v-if="foreword != undefined" class="whitespace-pre-line text-center shrink-0">
        {{ foreword.replaceAll(' ', '\n') }}
      </p>
      <img
        :src="`${frontmatter.illustration1}`"
        alt="国家背景图2"
        draggable="false"
        loading="eager"
        class="flex-1 min-h-0 w-full object-cover"
      />
    </div>
    <div
      class="content-section"
      :style="{
        opacity: 1 - coverProgress,
        transition: 'opacity 0.35s ease-out',
        paddingTop: isMobile ? '40px' : '60px',
        paddingBottom: isMobile ? '40px' : '60px',
      }"
    >
      <Content class="main-text" />
    </div>
  </article>
</template>

<style scoped>
.country-title::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--logo);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.6;
}
</style>
