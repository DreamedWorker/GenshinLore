<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

const props = defineProps<{
  n: string | number
  text: string
}>()

const md = MarkdownIt()
const renderedHtml = computed(() => md.renderInline(props.text.replace('<br>', '\n\n')))
</script>

<template>
  <TooltipProvider :delayDuration="0">
    <Tooltip>
      <TooltipTrigger
        as="sup"
        class="inline-block cursor-pointer text-[#D3BC8E] font-bold no-underline hover:underline"
      >
        {{ n }}
      </TooltipTrigger>
      <TooltipContent align="start" :align-offset="0">
        <div class="footnote-tooltip" v-html="renderedHtml" />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped>
.footnote-tooltip :deep(a) {
  color: #d3bc8e;
  text-decoration: underline;
}
.footnote-tooltip :deep(a):hover {
  color: #c4ad7f;
}
</style>
