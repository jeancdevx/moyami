import assert from 'node:assert/strict'
import { test } from 'node:test'

import { matchesProduct } from '../../src/components/Catalog/Catalog.helpers.ts'

test('encuentra un sabor con y sin tildes, sin distinguir mayúsculas', () => {
  assert.equal(
    matchesProduct('Jiashili Fruit Fun Fruity limón Bolsa de 85 g', 'LIMON'),
    true
  )
  assert.equal(matchesProduct('Samyang Buldak rosé Paquete', 'rose'), true)
})
test('combina palabras de marca y sabor, independientemente del orden', () => {
  assert.equal(
    matchesProduct('Rico Bubble Milk Tea matcha Lata de 350 g', 'matcha rico'),
    true
  )
  assert.equal(
    matchesProduct('Rico Bubble Milk Tea matcha Lata de 350 g', 'rico fresa'),
    false
  )
})
test('acepta apóstrofos tipográficos y espacios del visitante', () => {
  assert.equal(
    matchesProduct('Lotte Let’s Be mocha latte', "  let's    mocha  "),
    true
  )
})
test('búsqueda vacía permite recuperar el catálogo completo', () => {
  assert.equal(matchesProduct('Nongshim Shin Ramyun', '   '), true)
  assert.equal(
    matchesProduct('Nongshim Shin Ramyun', 'producto inexistente'),
    false
  )
})
