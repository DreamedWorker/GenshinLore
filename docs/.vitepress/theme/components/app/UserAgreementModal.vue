<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { EULA_MARKDOWN } from '../../../data/eulaContent'
import cookies from '@/lib/cookies'
import MarkdownIt from 'markdown-it'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'vue-sonner'

const API_URL = 'https://genshinlore.cn/useragreementversion.json'
const COOKIE_NAME = 'user_agreement_version'
const md = MarkdownIt()

const visible = ref(false)
const currentVersion = ref<number | null>(null)

const renderedHtml = computed(() => md.render(EULA_MARKDOWN))

// --- 版本检查 ---
async function checkVersion() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) {
      toast.error('无法获取用户协议版本')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      handleDecline()
      return
    }
    const data = await res.json()
    currentVersion.value = data.version

    const agreed = cookies.getCookie(COOKIE_NAME)
    const agreedVersion = agreed ? parseInt(agreed, 10) : null

    if (agreedVersion === null || agreedVersion !== currentVersion.value) {
      visible.value = true
    }
  } catch (e) {
    toast.error('处理用户协议版本失败')
    await new Promise((resolve) => setTimeout(resolve, 2000))
    handleDecline()
  }
}

// --- 按钮处理 ---
function handleAgree() {
  if (currentVersion.value !== null) {
    cookies.setCookie(COOKIE_NAME, currentVersion.value.toString())
  }
  visible.value = false
}

function handleDecline() {
  window.open('', '_self')?.close()
  window.location.href = 'about:blank'
}

onMounted(() => {
  checkVersion()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-9999 flex items-center justify-center bg-black/70"
      @click.self="() => {}"
    >
      <div
        class="relative flex flex-col w-full max-w-175 max-h-[85vh] mx-4 rounded-lg shadow-2xl bg-background"
      >
        <!-- 标题栏 -->
        <div
          class="shrink-0 p-[15px_20px] border-b border-gray-200 bg-[#4d4f53] rounded-tl-lg rounded-tr-lg"
        >
          <h2 class="font-[Genshin] text-lg text-[#D3BC8E] m-0">用户协议</h2>
        </div>

        <!-- 协议正文 -->
        <ScrollArea class="grow px-6 py-4 overflow-y-auto">
          <div class="doc-normal" v-html="renderedHtml"></div>
        </ScrollArea>

        <!-- 底部按钮 -->
        <div
          class="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
        >
          <button class="btn btn-decline" @click="handleDecline">不同意</button>
          <button class="btn btn-agree" @click="handleAgree">同意</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-family: 'Genshin', sans-serif;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.btn-agree {
  background-color: #d3bc8e;
  color: #4d4f53;
}

.btn-agree:hover {
  background-color: #c4ad7f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 188, 142, 0.3);
}

.btn-decline {
  background-color: #e8e8e8;
  color: #6d6f73;
}

.btn-decline:hover {
  background-color: #d8d8d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
