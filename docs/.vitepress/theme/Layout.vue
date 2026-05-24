<script setup lang="ts">
import { useData } from 'vitepress'
import Sonner from '@/components/ui/sonner/Sonner.vue'
import SplashScreen from '@/pages/SplashScreen.vue'
import ArticleContainer from '@/pages/ArticleContainer.vue'

const { frontmatter } = useData()
</script>

<template>
  <div id="web_root">
    <SplashScreen v-if="frontmatter.layout == 'splash'" />
    <ArticleContainer v-else />
    <Sonner position="top-center" />
  </div>
</template>
