import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const inventory = JSON.parse(
  await readFile('resources/catalog/inventory.json', 'utf8')
)
const partial = process.argv.includes('--available')
let prepared = 0
for (const product of inventory.products) {
  const output = path.join('src/assets/products', product.id)
  await mkdir(output, { recursive: true })
  const images = []
  for (const angle of ['frontal', 'tres-cuartos']) {
    const master = `resources/catalog/masters/${product.id}-${angle}.png`
    const filename = `${angle}-1024.webp`
    try {
      await sharp(master)
        .rotate()
        .resize(1024, 1024, { fit: 'contain', background: '#ffffff' })
        .flatten({ background: '#ffffff' })
        .webp({ quality: 87, effort: 6 })
        .toFile(path.join(output, filename))
    } catch (error) {
      if (partial && error.message.includes('missing')) continue
      throw new Error(`No se pudo preparar ${master}`, { cause: error })
    }
    images.push({
      src: `../../assets/products/${product.id}/${filename}`,
      alt: `${product.name}, ${product.presentation.toLocaleLowerCase('es')}, ${angle === 'frontal' ? 'vista frontal retocada' : 'vista de tres cuartos generada con IA'}`,
      kind: angle === 'frontal' ? 'retouched-reference' : 'synthetic-angle'
    })
  }
  if (!images.length) continue
  const { name, brand, category, flavor, presentation, description, order } =
    product
  await writeFile(
    `src/content/products/${product.id}.json`,
    JSON.stringify(
      {
        name,
        brand,
        category,
        flavor,
        presentation,
        description,
        order,
        images
      },
      null,
      2
    ) + '\n'
  )
  prepared++
}
console.log(
  `Imágenes preparadas para ${prepared}/${inventory.productCount} referencias.`
)
