<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import Particle from '@/lib/particle'

const videoLoaded = ref(false)
const enterVisible = ref(false)
const quoteVisible = ref(false)
const enterFading = ref(false)
const quoteSmall = ref(false)
const router = useRouter()

let quoteTimer: ReturnType<typeof setTimeout> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null
const countdown = ref(5)

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let isFormed = false
let textAlpha = 0
let particlesExploded = true
let particleFadeOut = 1
let fontSize = 72
let particles: Particle[] = []
let fontLoaded = false

function initParticles() {
  const c = canvas!
  c.width = window.innerWidth
  c.height = window.innerHeight
  particles = []

  if (c.width < 1200) {
    fontSize = Math.min(c.width / 16, 72)
  } else {
    fontSize = 72
  }

  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')!
  tempCanvas.width = c.width
  tempCanvas.height = c.height

  tempCtx.font = `${fontSize}px 'Khaenriah', serif`
  tempCtx.fillStyle = 'white'
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'

  const centerX = c.width / 2
  const centerY = c.height * 0.382
  const titleString = 'All of Sun and Moon'

  for (let i = -2; i <= 2; i++) {
    tempCtx.fillText(titleString, centerX, centerY + i)
  }

  const imageData = tempCtx.getImageData(0, 0, c.width, c.height).data
  const gap = 3

  for (let y = 0; y < c.height; y += gap) {
    for (let x = 0; x < c.width; x += gap) {
      const index = (y * c.width + x) * 4
      const opacity = imageData[index + 3]
      if (opacity > 128) {
        particles.push(new Particle(x, y, c.width, c.height))
      }
    }
  }
}

const drawRealText = (alpha: number) => {
  const c = canvas!
  const cx = ctx!
  cx.save()
  cx.globalAlpha = alpha
  cx.font = `${fontSize}px 'Khaenriah', serif`
  cx.fillStyle = '#D3BC8E'
  cx.textAlign = 'center'
  cx.textBaseline = 'middle'
  cx.shadowColor = 'rgba(211, 188, 142, 0.5)'
  cx.shadowBlur = 20

  const centerX = c.width / 2
  const centerY = c.height * 0.382
  cx.fillText('All of Sun and Moon', centerX, centerY)
  cx.restore()
}

const animateParticles = () => {
  const c = canvas!
  const cx = ctx!
  cx.clearRect(0, 0, c.width, c.height)

  if (isFormed) {
    let almostArrived = true
    particles.forEach((p) => {
      p.x += (p.baseX - p.x) * 0.04
      p.y += (p.baseY - p.y) * 0.04
      if (Math.abs(p.baseX - p.x) > 15 || Math.abs(p.baseY - p.y) > 15) {
        almostArrived = false
      }
    })

    if (almostArrived) {
      textAlpha += 0.03
      if (textAlpha > 1) textAlpha = 1
    }
    particlesExploded = false
  } else {
    textAlpha -= 0.1
    if (textAlpha < 0) textAlpha = 0

    if (textAlpha <= 0.7) {
      if (!particlesExploded) {
        particles.forEach((p) => {
          p.vx = (Math.random() - 0.5) * 45
          p.vy = (Math.random() - 0.5) * 45
        })
        particlesExploded = true
      }
    }

    if (particlesExploded) {
      particleFadeOut -= 0.02
      if (particleFadeOut < 0) particleFadeOut = 0
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += Math.sin(Date.now() * 0.001 + p.baseX) * 0.4
        p.y += Math.cos(Date.now() * 0.001 + p.baseY) * 0.4
      })
    }
  }

  const particleAlpha = (1 - textAlpha) * particleFadeOut
  if (particleAlpha > 0.01) {
    cx.globalAlpha = particleAlpha
    cx.fillStyle = '#D3BC8E'
    cx.beginPath()
    particles.forEach((p) => {
      cx.moveTo(p.x, p.y)
      cx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    })
    cx.fill()
    cx.globalAlpha = 1.0
  }

  if (textAlpha > 0.01) {
    drawRealText(textAlpha)
  }

  animationId = requestAnimationFrame(animateParticles)
}

const startIntroAnimation = () => {
  initParticles()
  animateParticles()

  setTimeout(() => {
    isFormed = true
  }, 500)

  setTimeout(() => {
    enterVisible.value = true
  }, 3500)
}

const handleEnter = () => {
  enterFading.value = true
  isFormed = false

  setTimeout(() => {
    quoteVisible.value = true
    quoteTimer = setTimeout(() => {
      window.location.href = '/home'
    }, 5000)
  }, 1800)
}

const checkScreenArea = () => {
  const area = window.innerWidth * window.innerHeight
  quoteSmall.value = area < 301840
}

const onResize = () => {
  if (fontLoaded) {
    initParticles()
  }
  checkScreenArea()
}

function goHome() {
  if (quoteTimer) {
    clearTimeout(quoteTimer)
    quoteTimer = null
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  router.go('/home', { replace: true })
}

watch(quoteVisible, (visible) => {
  if (visible) {
    countdown.value = 5
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)
    quoteTimer = setTimeout(goHome, 5000)
  }
})

onMounted(async () => {
  canvas = document.getElementById('particle-canvas') as HTMLCanvasElement
  ctx = canvas!.getContext('2d', { willReadFrequently: true })

  // Load Khaenriah font
  try {
    if (document.fonts && document.fonts.load) {
      await document.fonts.load('72px "Khaenriah"')
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  fontLoaded = true

  startIntroAnimation()
  checkScreenArea()
  window.addEventListener('resize', onResize)

  // Attempt autoplay
  const video = document.getElementById('bg-video') as HTMLVideoElement
  if (video) {
    video
      .play()
      .then(() => {
        videoLoaded.value = true
      })
      .catch(() => {
        // Autoplay blocked; user interaction will trigger it
      })
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  if (quoteTimer) clearTimeout(quoteTimer)
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<template>
  <div class="w-screen h-screen relative overflow-hidden bg-black">
    <a href="/home" class="absolute -left-2499.75 -top-2499.75 w-px h-px overflow-hidden opacity-0"
      >Sitemap</a
    >

    <div class="absolute top-0 left-0 w-full h-full z-1">
      <video
        id="bg-video"
        class="w-full h-full object-contain bg-black"
        muted
        loop
        playsinline
        src="https://uploadstatic.mihoyo.com/hk4e/upload/officialsites/202009/%E8%B6%B3%E8%BF%B9_1601249080_8615.mp4"
      />
      <div class="absolute top-0 left-0 w-full h-full bg-[#4D4F5333] z-2 pointer-events-none" />
    </div>

    <canvas id="particle-canvas" class="absolute top-0 left-0 w-full h-full z-5" />

    <button
      class="enter-btn"
      v-if="enterVisible"
      :class="{ 'fade-out': enterFading }"
      @click="handleEnter()"
    >
      进入
    </button>

    <div
      class="quote-overlay fixed top-0 left-0 w-full h-full bg-white z-100 flex items-center justify-center opacity-0 invisible cursor-pointer"
      :class="{ visible: quoteVisible }"
      @click="goHome()"
    >
      <div class="quote-content" :class="{ 'small-screen': quoteSmall }">
        <p>文字之渊源已不可考，穷究言语之滥觞亦是罪责。</p>
        <p>但文字诞生以来，就一直沉默地记录着一切：</p>
        <p>天空，星辰，群山，飞鸟，争执，和平……各式各样的人生。</p>
        <p>无数的文字汇聚成档案，编纂成历史，尘封在岁月中。</p>
        <p>书记官收录真相，也收录真相背后的疑问，</p>
        <p>许多疑问永远不会有答案。</p>
        <br />
        <p>欲答永恒之疑问，唯有永恒之沉默。</p>
        <p class="quote-author">--艾尔海森</p>
        <p class="quote-hint">点击任意位置或者等待{{ countdown }}秒后进入</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enter-btn {
  font-family: 'Genshin', sans-serif;
  font-size: 20px;
  color: #d3bc8e;
  background-color: transparent;
  border: 2px solid #d3bc8e;
  padding: 15px 50px;
  cursor: pointer;
  transition:
    background-color 0.4s ease,
    color 0.4s ease,
    box-shadow 0.4s ease;
  letter-spacing: 3px;
  pointer-events: auto;
  border-radius: 8px;
  position: fixed;
  bottom: 38.2%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.enter-btn:hover {
  background-color: #d3bc8e;
  color: #4d4f53;
  box-shadow: 0 0 20px rgba(211, 188, 142, 0.6);
}

.enter-btn.fade-out {
  opacity: 0 !important;
  pointer-events: none;
  transition: opacity 1s ease;
}

.quote-overlay {
  transition:
    opacity 0.8s ease,
    visibility 0.8s ease;
}

.quote-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.quote-content {
  max-width: 800px;
  padding: 40px;
  text-align: center;
}

.quote-content p {
  font-family: 'Genshin', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  line-height: 2;
  color: #000000;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.quote-author {
  font-family: 'Genshin', 'Microsoft YaHei', sans-serif;
  font-size: 18px !important;
  color: #333333 !important;
  margin-top: 20px !important;
}

.quote-hint {
  font-family: 'Common', 'Microsoft YaHei', sans-serif;
  font-size: 14px !important;
  color: #838383 !important;
  margin-top: 40px !important;
  letter-spacing: 1px !important;
}

@media (max-width: 1199px) {
  .enter-btn {
    font-size: 16px;
    padding: 12px 35px;
    letter-spacing: 2px;
  }

  /* 小屏幕适配：当屏幕面积小于301840px²时缩小字体 */
  .quote-content p {
    font-size: calc(100vw / 50) !important;
    line-height: 1.8 !important;
  }

  .quote-content .quote-author {
    font-size: calc(100vw / 60) !important;
  }

  .quote-content .quote-hint {
    font-size: calc(100vw / 70) !important;
    margin-top: 30px !important;
  }
}
</style>
