export default {
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': [
    'oxlint --fix --deny-warnings',
    'oxfmt --write --no-error-on-unmatched-pattern'
  ],
  '*.{astro,css,scss,less,json,jsonc,json5,md,mdx,yml,yaml,html}':
    'oxfmt --write --no-error-on-unmatched-pattern'
}
