import { existsSync } from 'node:fs'

const skip =
  process.env.CI === 'true' ||
  process.env.CI === '1' ||
  process.env.VERCEL === '1' ||
  process.env.HUSKY === '0' ||
  process.env.NODE_ENV === 'production' ||
  !existsSync('.git')

if (!skip) {
  const { default: husky } = await import('husky')
  const result = husky()
  if (result) throw new Error(result)
}
