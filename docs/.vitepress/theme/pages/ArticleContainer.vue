<script setup lang="ts">
import { useData } from 'vitepress'
import useIsMobile from '@/composables/isMobile'
import AppFooter from '@/components/theme/AppFooter.vue'
import AppHeader from '@/components/theme/AppHeader.vue'
import NotFound from '@/components/theme/NotFound.vue'
import ArticleStage from '@/components/theme/ArticleStage.vue'
import UserAgreementModal from '@/components/app/UserAgreementModal.vue'
import NoticeModal from '@/components/app/NoticeModal.vue'
import HomeScreen from '@/pages/HomeScreen.vue'
import BasicLoreScreen from '@/pages/BasicLoreScreen.vue'
import NationScreen from '@/pages/NationScreen.vue'
import TimelineScreen from '@/pages/TimelineScreen.vue'

const { page, frontmatter } = useData()
const isMobile = useIsMobile()
</script>

<template>
  <div class="flex flex-col w-full min-h-screen bg-background">
    <template v-if="!page.isNotFound">
      <AppHeader />
      <main class="w-full flex" :class="isMobile ? 'pt-15' : 'pt-17.5'">
        <HomeScreen v-if="frontmatter.layout == 'home'" />
        <BasicLoreScreen v-else-if="frontmatter.layout == 'basiclore'" />
        <NationScreen v-else-if="frontmatter.layout == 'nations'" />
        <TimelineScreen v-else-if="frontmatter.layout == 'timeline'" />
        <ArticleStage v-else />
      </main>
      <AppFooter v-if="frontmatter.layout == 'doc' || frontmatter.layout == 'home'" />
    </template>
    <template v-else>
      <NotFound />
    </template>
    <UserAgreementModal />
    <NoticeModal />
  </div>
</template>

<style scoped></style>
