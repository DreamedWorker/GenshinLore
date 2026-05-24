import { relative, sep } from 'node:path'
import { primarySiteUrl } from '../seo.mjs'

function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { frontmatter: new Map<string, string>(), body: content }

  const frontmatter = new Map<string, string>()
  const lines = match[1].split(/\r?\n/)

  for (const line of lines) {
    const field = line.match(/^([\w-]+):\s*(.*)$/)
    if (field) frontmatter.set(field[1], field[2].replace(/^['"]|['"]$/g, ''))
  }

  return { frontmatter, body: content.slice(match[0].length) }
}

function extractHeadings(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) =>
      line
        .match(/^(#{2,4})\s+(.+)$/)?.[2]
        ?.replace(/<[^>]+>/g, '')
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 8) as string[]
}

function createPageUrl(filePath: string, docsDir: string) {
  const routePath = relative(docsDir, filePath).split(sep).join('/')
  if (routePath === 'index.md') return `${primarySiteUrl}/`
  return `${primarySiteUrl}/${routePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')}`
}

const docProcessor = { parseFrontmatter, createPageUrl, extractHeadings }

export default docProcessor
