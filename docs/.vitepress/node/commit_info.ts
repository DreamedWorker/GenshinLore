import { execSync } from 'node:child_process'

export default function mirrorCommit(): string {
  return (
    process.env.GITHUB_SHA?.slice(0, 7) ||
    process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ||
    (() => {
      try {
        return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
      } catch {
        return 'local'
      }
    })()
  )
}
