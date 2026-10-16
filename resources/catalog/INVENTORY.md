# Auditoría del catálogo de Moyami

Fecha: 2026-10-15. 50 fotografías, 29 referencias, 0 duplicados binarios.

Las 21 tomas adicionales corresponden a otras fotografías de las mismas referencias. Los sabores y las presentaciones se mantienen separados. No se borró ningún original.

La fuente de identificación es la etiqueta visible en cada fotografía. No se infieren ingredientes, alérgenos, certificaciones, país de fabricación, existencia actual ni cantidades que no puedan leerse. La categoría es editorial, no una declaración del fabricante.

Correcciones frente a la revisión preliminar: VINA es sabor yogur; Baolisu es lychee; Xiangpiaopiao de tapa naranja es trigo; Fruit Fun se lee Fruit Fun Fruity; los empaques de Jin y Kimchi muestran la marca OTOKI.

| Referencia | Producto | Sabor | Presentación | Principal | Alternativas | Datos pendientes o notas |
| --- | --- | --- | --- | --- | --- | --- |
| fruit-fun-arandano | Jiashili · Fruit Fun Fruity arándano | Arándano | Paquete individual | Foto 1 | 2, 3 | Peso neto no legible. |
| orion-berry-pie | Orion · Berry Pie | Fresa y frambuesa | Caja de 6 unidades | Foto 4 | Ninguna | Peso neto no visible. |
| sab-chocolate | Sab · Sab chocolate | Chocolate | Caja de 96 g | Foto 5 | 7 | Sin datos adicionales inferidos. |
| orion-cocoa-pie | Orion · Cocoa Pie | Chocolate | Caja de 6 unidades | Foto 6 | Ninguna | Peso neto no visible. |
| vina-yogur | VINA · VINA tres capas | Yogur | Caja de 100 g | Foto 8 | 9 | Sin datos adicionales inferidos. |
| sab-matcha | Sab · Sab matcha | Matcha | Caja de 96 g | Foto 10 | 11, 12 | Sin datos adicionales inferidos. |
| ice-talk-uva-verde | Ice Talk · Ice Talk uva verde | Uva verde | Pouch de 230 ml | Foto 13 | Ninguna | Sin datos adicionales inferidos. |
| rico-bubble-tea-matcha | Rico · Bubble Milk Tea matcha | Matcha | Lata de 350 g | Foto 14 | Ninguna | Se conserva la unidad de masa impresa: 350 g, no 350 ml. |
| rico-grape | Rico · Rico Grape | Uva | Lata | Foto 15 | Ninguna | Volumen no legible; no se infiere si es carbonatada. |
| baolisu-lychee | Baolisu · Bebida de lychee | Lychee | Botella de 300 ml | Foto 16 | 17 | Sin datos adicionales inferidos. |
| lotte-lets-be-mocha | Lotte · Let’s Be mocha latte | Mocha latte | Lata de 175 ml | Foto 18 | 25 | Sin datos adicionales inferidos. |
| lotte-lets-be-cappuccino | Lotte · Let’s Be cappuccino | Cappuccino | Lata de 240 ml | Foto 19 | Ninguna | Sin datos adicionales inferidos. |
| lotte-lets-be-latte | Lotte · Let’s Be Cafetime latte | Latte | Lata | Foto 20 | 21 | Volumen no legible. |
| lotte-milkis-uva | Lotte · Milkis uva | Uva | Lata de 250 ml | Foto 22 | Ninguna | 250 ml según la equivalencia de 8.45 fl oz visible en el empaque. |
| xiangpiaopiao-frijol-rojo | Xiangpiaopiao · Milk Tea frijol rojo | Frijol rojo | Vaso de 64 g | Foto 23 | Ninguna | El empaque indica 64 g y desglosa complementos; no se añade su masa al total sin confirmar. |
| lotte-pepero-choco-cookie | Lotte · Pepero choco cookie | Choco cookie | Caja de 32 g | Foto 24 | 32 | Sin datos adicionales inferidos. |
| lotte-pepero-crunchy | Lotte · Pepero crunchy | Crunchy | Caja de 39 g | Foto 26 | Ninguna | Sin datos adicionales inferidos. |
| xiangpiaopiao-trigo | Xiangpiaopiao · Milk Tea trigo | Trigo | Vaso | Foto 27 | Ninguna | Peso neto no legible. |
| fruit-fun-limon | Jiashili · Fruit Fun Fruity limón | Limón | Bolsa de 85 g | Foto 28 | 29 | Sin datos adicionales inferidos. |
| fruit-fun-fresa | Jiashili · Fruit Fun Fruity fresa | Fresa | Bolsa de 85 g | Foto 30 | 31 | Sin datos adicionales inferidos. |
| otoki-jin-spicy | OTOKI · Jin ramen spicy | Picante | Paquete de 120 g | Foto 33 | Ninguna | Sin datos adicionales inferidos. |
| nongshim-shin-ramyun | Nongshim · Shin Ramyun | Original | Paquete de 120 g | Foto 34 | 37 | Sin datos adicionales inferidos. |
| otoki-jin-mild | OTOKI · Jin ramen mild | Mild | Paquete de 120 g | Foto 35 | 42 | Sin datos adicionales inferidos. |
| otoki-kimchi | OTOKI · Kimchi ramen | Kimchi | Paquete de 120 g | Foto 36 | 38 | Sin datos adicionales inferidos. |
| baixiang-hot-chicken | Baixiang · Classic Hot Chicken | Pollo picante | Paquete de 112 g | Foto 39 | 48 | Nombre chino 白象 visible; línea comercial Super Chili. |
| samyang-buldak-carbonara | Samyang · Buldak carbonara | Carbonara | Paquete de 130 g | Foto 40 | 43 | Sin datos adicionales inferidos. |
| samyang-buldak-original | Samyang · Buldak original | Original | Paquete de 140 g | Foto 41 | 44, 49 | Sin datos adicionales inferidos. |
| paldo-volcano-carbonara | Paldo · Volcano carbonara | Carbonara | Paquete de 130 g | Foto 45 | 46 | Sin datos adicionales inferidos. |
| samyang-buldak-rose | Samyang · Buldak rosé | Rosé | Paquete | Foto 47 | 50 | Peso neto no legible. |

## Trazabilidad fotográfica

inventory.csv contiene una fila por fotografía. inventory.json conserva nombres originales, copias descriptivas y hashes SHA 256. Los números de foto corresponden al orden lexicográfico de los nombres originales.

## Producción de imágenes

Se utiliza la herramienta integrada image_gen. image-jobs.json contiene los prompts completos y las referencias. generation/ registra cada resultado, su procedencia y su revisión. masters/ conserva los PNG generados; src/assets/products conserva los másteres WebP a 1024 px. Astro genera las variantes de 256, 512, 768 y 1024 px durante la compilación.

Cada producto incluye una fotografía frontal retocada y una vista sintética de tres cuartos. La segunda se identifica como generada con IA en la galería. No documenta caras ocultas ni sirve como fuente para datos comerciales.

## Fuentes de consulta

- Fotografías originales: copia íntegra en originals/, con sus hashes en inventory.json.
- Samyang Buldak, catálogo oficial: https://buldak.com/us/product/ . Sirve como referencia de familia; no se trasladan pesos ni claims de presentaciones diferentes.

## Información comercial confirmada

Moyami. Jr. San Martín 316, Caraz. Punto proporcionado por el cliente: latitud -9.0443374, longitud -77.8103607, dentro de Tienda Milagros de Huata. Horarios, teléfonos y redes sin confirmar: no se publican.
