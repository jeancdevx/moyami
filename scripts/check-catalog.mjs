import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'

import sharp from 'sharp'

const audit = JSON.parse(
  await readFile('resources/catalog/inventory.json', 'utf8')
)
const ids = new Set()
const photoNumbers = new Set()
const hashes = new Set()
for (const product of audit.products) {
  assert(!ids.has(product.id), `Referencia duplicada: ${product.id}`)
  ids.add(product.id)
  assert.equal(product.sources.filter(s => s.role === 'principal').length, 1)
  for (const source of product.sources) {
    assert(
      !photoNumbers.has(source.originalIndex),
      `Foto asignada dos veces: ${source.originalIndex}`
    )
    photoNumbers.add(source.originalIndex)
    const data = await readFile(source.file)
    const hash = createHash('sha256').update(data).digest('hex')
    assert.equal(hash, source.sha256, `Se modificó el original ${source.file}`)
    hashes.add(hash)
  }
  const content = JSON.parse(
    await readFile(`src/content/products/${product.id}.json`, 'utf8')
  )
  assert.equal(content.name, product.name)
  assert.equal(content.category, product.category)
  assert.equal(content.images.length, 2, `Falta una vista de ${product.id}`)
  assert.deepEqual(
    content.images.map(i => i.kind),
    ['retouched-reference', 'synthetic-angle']
  )
  for (const angle of ['frontal', 'tres-cuartos']) {
    const image = await sharp(
      `src/assets/products/${product.id}/${angle}-1024.webp`
    ).metadata()
    assert.equal(image.width, 1024)
    assert.equal(image.height, 1024)
    assert.equal(image.format, 'webp')
    const generation = JSON.parse(
      await readFile(
        `resources/catalog/generation/${product.id}-${angle}.json`,
        'utf8'
      )
    )
    assert.equal(
      generation.review,
      'accepted',
      `Revisión pendiente: ${product.id}-${angle}`
    )
  }
}
assert.equal(ids.size, audit.productCount)
assert.equal(photoNumbers.size, audit.originalCount)
assert.equal(hashes.size, audit.originalCount - audit.exactDuplicateCount)
assert.equal(
  (await readdir('resources/catalog/originals')).length,
  audit.originalCount
)
assert.equal(
  (await readdir('src/content/products')).filter(f => f.endsWith('.json'))
    .length,
  audit.productCount
)
console.log(
  `Catálogo verificado: ${ids.size} referencias, ${photoNumbers.size} originales íntegros, ${ids.size * 2} imágenes revisadas.`
)
