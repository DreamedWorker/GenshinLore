// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
// @ts-ignore
import '@/styles/index.css'
// @ts-ignore
import 'vue-sonner/style.css'
import MidTitle from '@/widgets/MidTitle.vue'
import Space from '@/widgets/doc/Space.vue'
import Footnote from '@/widgets/doc/Footnote.vue'
import Timeline from '@/widgets/doc/Timeline.vue'
import Intro from '@/widgets/doc/Intro.vue'
import ChapterIntro from '@/widgets/doc/ChapterIntro.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('MidTitle', MidTitle)
    app.component('Space', Space)
    app.component('Footnote', Footnote)
    app.component('Timeline', Timeline)
    app.component('Intro', Intro)
    app.component('ChapterIntro', ChapterIntro)
  },
} satisfies Theme
