import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteDescription, siteHead, siteTitle, siteUrl, transformSeoHead } from './seo.mjs'
import * as path from 'node:path'
import { finalizeBuild } from './node/build_end_hooks'
import mirrorCommit from './node/commit_info'

const configDir = dirname(fileURLToPath(import.meta.url))
const docsDir = join(configDir, '..')
const distDir = join(configDir, 'dist')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(__dirname, './theme')

export default defineConfig({
  title: siteTitle,
  description: siteDescription,
  lang: 'zh-CN',
  lastUpdated: true,
  //base: isProd ? '/GenshinLore/' : '/',

  head: siteHead,

  // 渲染md文档的自定义配置
  markdown: {
    headers: true,
    config: (md) => {
      md.renderer.rules.strong_open = () => '<strong class="red-text">'
      md.renderer.rules.strong_close = () => '</strong>'

      const defaultLinkRender =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, _env, self) {
          return self.renderToken(tokens, idx, options)
        }

      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        const href = token.attrGet('href')
        if (href && /^https?:\/\//.test(href)) {
          token.attrSet('target', '_blank')
          token.attrSet('rel', 'noopener noreferrer')
        }
        return defaultLinkRender(tokens, idx, options, env, self)
      }
    },
  },

  sitemap: {
    hostname: `${siteUrl}/`,
  },

  transformHead: transformSeoHead,

  buildEnd: () => finalizeBuild(distDir, docsDir),

  // 国内镜像站备案展示配置（填写备案号即启用显示）
  themeConfig: {
    // @ts-ignore
    compliance: {
      icp: {
        number: '',
      },
      mps: {
        number: '',
      },
    },
  },

  vite: {
    define: {
      __MIRROR_COMMIT__: JSON.stringify(mirrorCommit),
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': clientDir,
      },
    },
  },
})
