import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { mirrorSiteUrls, primarySiteUrl, siteDescription, siteTitle, siteUrl } from '../seo.mjs'
import { join, relative } from 'node:path'
import docProcessor from './doc_processor'

const skippedMarkdownDirs = new Set(['.vitepress', 'public'])

function createRobotsTxt(distDir: string) {
  if (!existsSync(distDir)) return

  const isPrimarySite = siteUrl === primarySiteUrl
  const sitemapUrls = isPrimarySite ? [siteUrl, ...mirrorSiteUrls] : [siteUrl, primarySiteUrl]
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    `Host: ${new URL(siteUrl).host}`,
    ...sitemapUrls.map((url) => `Sitemap: ${url}/sitemap.xml`),
    '',
  ].join('\n')

  writeFileSync(join(distDir, 'robots.txt'), robotsTxt, 'utf8')
}

function collectMarkdownFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((filename) => {
    if (skippedMarkdownDirs.has(filename)) return []

    const filePath = join(directory, filename)
    const fileStat = statSync(filePath)

    if (fileStat.isDirectory()) return collectMarkdownFiles(filePath)
    if (fileStat.isFile() && filename.endsWith('.md')) return [filePath]
    return []
  })
}

function createLlmsFullTxt(distDir: string, docsDir: string) {
  if (!existsSync(distDir)) return

  const pages = collectMarkdownFiles(docsDir)
    .map((filePath) => {
      const { frontmatter, body } = docProcessor.parseFrontmatter(readFileSync(filePath, 'utf8'))
      const title =
        frontmatter.get('title') || (relative(docsDir, filePath) === 'index.md' ? siteTitle : '')
      const description = frontmatter.get('description') || siteDescription
      const keywords = frontmatter.get('keywords')
      const headings = docProcessor.extractHeadings(body)

      return {
        title,
        description,
        keywords,
        headings,
        url: docProcessor.createPageUrl(filePath, docsDir),
      }
    })
    .filter((page) => page.title || page.description)
    .sort((left, right) => left.url.localeCompare(right.url, 'zh-CN'))

  const content = [
    '# 日月全事完整 LLM 索引',
    '',
    `> ${siteDescription}`,
    '',
    `主站：${primarySiteUrl}`,
    `镜像站：${mirrorSiteUrls.join('、')}`,
    '规范：主站与镜像站为同一知识源，引用和索引优先使用主站 URL。',
    '',
    '## 页面索引',
    '',
    ...pages.flatMap((page) => [
      `### ${page.title || page.url}`,
      '',
      `- URL：${page.url}`,
      `- 摘要：${page.description}`,
      ...(page.keywords ? [`- 关键词：${page.keywords}`] : []),
      ...(page.headings.length > 0 ? [`- 主要小节：${page.headings.join('；')}`] : []),
      '',
    ]),
  ].join('\n')

  writeFileSync(join(distDir, 'llms-full.txt'), content, 'utf8')
}

function createStaticFallbackPages(distDir: string) {
  if (!existsSync(distDir)) return

  for (const filename of readdirSync(distDir)) {
    const sourcePath = join(distDir, filename)
    if (!statSync(sourcePath).isFile() || !filename.endsWith('.html')) continue
    if (filename === 'index.html' || filename === '404.html') continue

    const routeName = filename.slice(0, -5)
    const routeDir = join(distDir, routeName)
    mkdirSync(routeDir, { recursive: true })
    copyFileSync(sourcePath, join(routeDir, 'index.html'))
  }
}

export function finalizeBuild(distDir: string, docsDir: string) {
  //createStaticFallbackPages()
  createRobotsTxt(distDir)
  createLlmsFullTxt(distDir, docsDir)
}
