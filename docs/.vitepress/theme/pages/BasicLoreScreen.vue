<script setup lang="ts">
import Grid from '@/widgets/Grid.vue'
import DocCard from '@/widgets/DocCard.vue'
import MidTitle from '@/widgets/MidTitle.vue'
</script>

<template>
  <div class="bg-[#f5f5f5] w-full">
    <article class="relative w-full flex flex-col max-w-200 m-[0_auto] p-[60px_40px]">
      <span
        class="w-full text-center font-[Genshin] text-[42px] mb-10 pb-5 border-b-[3px] border-b-[#D3BC8E]"
        >基本设定</span
      >
      <div class="intro-text">
        <p>战争已经开始了，</p>
        <p>是上一场战争的延续。</p>
        <p>众神为欲望的轮廓镀上七种光辉，</p>
        <p>以此昭示，</p>
        <p>他们的权柄可被企及。</p>
        <p>而现实的基底埋藏着阴燃的残骸，</p>
        <p>那是对僭越者的警示：</p>
        <p>「高天之上的神座，</p>
        <p>「从来不是为你预留的位置。」</p>
        <p>但僭越之人啊，</p>
        <p>不要就此驻足，</p>
        <p>谁都不能隔岸观火。</p>
        <p>欢迎来到世界。</p>
      </div>
      <MidTitle>各方势力</MidTitle>
      <Grid>
        <DocCard dest="/basiclore/lightrelam/base.html">
          <template #icon>🐉</template>
          <template #title>龙/龙蜥/光界</template>
        </DocCard>
        <DocCard dest="/basiclore/descenders/base.html">
          <template #icon>⭐</template>
          <template #title>降临者</template>
        </DocCard>
        <DocCard dest="/basiclore/principles/base.html">
          <template #icon>⚖️</template>
          <template #title>天理/人界</template>
        </DocCard>
        <DocCard dest="/basiclore/god/base.html">
          <template #icon>🔱</template>
          <template #title>魔神</template>
        </DocCard>
        <DocCard dest="/nations.html">
          <template #icon>👹</template>
          <template #title>人和怪物</template>
          <template #subtitle>参见八国中的组织和游戏图鉴</template>
        </DocCard>
        <DocCard dest="/basiclore/void/base.html">
          <template #icon>🌑</template>
          <template #title>深渊/虚界</template>
        </DocCard>
      </Grid>
      <MidTitle style="margin-top: 2rem">地脉与世界规律</MidTitle>
      <Grid>
        <DocCard dest="/basiclore/stars/base.html">
          <template #icon>✨</template>
          <template #title>星空</template>
        </DocCard>
        <DocCard dest="/basiclore/facilities/base.html">
          <template #icon>🏛️</template>
          <template #title>大地及装置</template>
        </DocCard>
      </Grid>
    </article>
  </div>
</template>

<style scoped>
.intro-text {
  font-size: 18px !important;
  color: rgb(77, 79, 83) !important;
  text-align: center !important;
  line-height: 2 !important;
  margin-bottom: 50px !important;
  padding: 30px !important;
  background: linear-gradient(135deg, rgb(248, 248, 248) 0%, rgb(240, 240, 240) 100%) !important;
  border-radius: 12px !important;
  border-left: 4px solid rgb(211, 188, 142) !important;
  border-right: 4px solid rgb(211, 188, 142) !important;
}

.intro-text :deep(p) {
  margin: 0 !important;
  padding: 3px 0 !important;
  text-align: center !important;
}
</style>
