import { readFile, writeFile } from 'node:fs/promises'

const audit = JSON.parse(
  await readFile('resources/catalog/inventory.json', 'utf8')
)
const escapeCsv = value => `"${String(value ?? '').replaceAll('"', '""')}"`
const headers = [
  'referencia',
  'nombre',
  'marca',
  'categoria',
  'sabor',
  'presentacion',
  'archivo_original',
  'archivo_copiado',
  'rol',
  'sha256',
  'datos_pendientes'
]
const rows = audit.products.flatMap(p =>
  p.sources.map(s => [
    p.id,
    p.name,
    p.brand,
    p.category,
    p.flavor,
    p.presentation,
    s.originalFilename,
    s.file,
    s.role,
    s.sha256,
    p.notes
  ])
)
await writeFile(
  'resources/catalog/inventory.csv',
  '\ufeff' +
    [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n') +
    '\n'
)
const lines = [
  '# Auditoría del catálogo de Moyami',
  '',
  `Fecha: ${audit.date}. ${audit.originalCount} fotografías, ${audit.productCount} referencias, ${audit.exactDuplicateCount} duplicados binarios.`,
  '',
  'Las 21 tomas adicionales corresponden a otras fotografías de las mismas referencias. Los sabores y las presentaciones se mantienen separados. No se borró ningún original.',
  '',
  'La fuente de identificación es la etiqueta visible en cada fotografía. No se infieren ingredientes, alérgenos, certificaciones, país de fabricación, existencia actual ni cantidades que no puedan leerse. La categoría es editorial, no una declaración del fabricante.',
  '',
  'Correcciones frente a la revisión preliminar: VINA es sabor yogur; Baolisu es lychee; Xiangpiaopiao de tapa naranja es trigo; Fruit Fun se lee Fruit Fun Fruity; los empaques de Jin y Kimchi muestran la marca OTOKI.',
  '',
  '| Referencia | Producto | Sabor | Presentación | Principal | Alternativas | Datos pendientes o notas |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...audit.products.map(
    p =>
      `| ${p.id} | ${p.brand} · ${p.name} | ${p.flavor} | ${p.presentation} | Foto ${p.sources[0].originalIndex} | ${
        p.sources
          .slice(1)
          .map(s => s.originalIndex)
          .join(', ') || 'Ninguna'
      } | ${p.notes || 'Sin datos adicionales inferidos.'} |`
  ),
  '',
  '## Trazabilidad fotográfica',
  '',
  'inventory.csv contiene una fila por fotografía. inventory.json conserva nombres originales, copias descriptivas y hashes SHA 256. Los números de foto corresponden al orden lexicográfico de los nombres originales.',
  '',
  '## Producción de imágenes',
  '',
  'Se utiliza la herramienta integrada image_gen. image-jobs.json contiene los prompts completos y las referencias. generation/ registra cada resultado, su procedencia y su revisión. masters/ conserva los PNG generados; src/assets/products conserva los másteres WebP a 1024 px. Astro genera las variantes de 256, 512, 768 y 1024 px durante la compilación.',
  '',
  'Cada producto incluye una fotografía frontal retocada y una vista sintética de tres cuartos. La segunda se identifica como generada con IA en la galería. No documenta caras ocultas ni sirve como fuente para datos comerciales.',
  '',
  '## Fuentes de consulta',
  '',
  '- Fotografías originales: copia íntegra en originals/, con sus hashes en inventory.json.',
  '- Samyang Buldak, catálogo oficial: https://buldak.com/us/product/ . Sirve como referencia de familia; no se trasladan pesos ni claims de presentaciones diferentes.',
  '',
  '## Información comercial confirmada',
  '',
  'Moyami. Jr. San Martín 316, Caraz. Punto proporcionado por el cliente: latitud -9.0443374, longitud -77.8103607, dentro de Tienda Milagros de Huata. Horarios, teléfonos y redes sin confirmar: no se publican.',
  ''
]
await writeFile('resources/catalog/INVENTORY.md', lines.join('\n'))
console.log(`Inventario generado: ${rows.length} fotografías.`)
