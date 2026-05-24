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

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('MidTitle', MidTitle)
    app.component('Space', Space)
    app.component('Footnote', Footnote)
  }
} satisfies Theme
