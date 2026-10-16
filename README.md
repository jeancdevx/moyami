# Moyami

Landing y catálogo informativo de snacks, bebidas y ramen asiáticos en Caraz.
Astro estático, Tailwind CSS, TypeScript, Three.js y MapLibre. Sin carrito,
pagos, cuentas ni backend.

## Desarrollo

Usa Node **24.22.0** (`.node-version`) y pnpm **10.33.2**. Las dependencias
directas tienen versiones exactas y el lockfile está versionado. `engines.node`
selecciona **24.x**, la rama LTS admitida por Vercel, que gestiona sus propias
actualizaciones menores y de parche. Si tu terminal todavía utiliza Node 26,
cambia a la versión del proyecto antes de instalar.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm dev:status
pnpm dev:logs
pnpm dev:stop
```

`pnpm dev` ejecuta `astro dev --background`. El servidor queda en segundo plano,
por defecto en http://localhost:4321.

El formato se configura en `.oxfmtrc.json`: comillas simples, sin punto y coma,
sin comas finales, dos espacios y ancho de 80 caracteres. Oxfmt ordena los
imports por módulos de Node, dependencias externas, configuración, layouts,
componentes, scripts, assets y rutas relativas; conserva el orden de los imports
con efectos secundarios. Oxlint comprueba errores de código.

```sh
pnpm format
pnpm format:check
pnpm lint
```

## Commits y hooks de Git

`pnpm install` activa Husky automáticamente en desarrollo. Los hooks no se
instalan en Vercel, CI, instalaciones de producción o copias sin `.git`.

| Hook         | Comprobación                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | lint-staged ejecuta Oxlint con correcciones y después Oxfmt sobre el código preparado para el commit. Astro, estilos y documentación pasan por Oxfmt. |
| `commit-msg` | commitlint valida el mensaje según Conventional Commits.                                                                                              |
| `pre-push`   | `pnpm validate` verifica el catálogo, lint, formato, tipos, pruebas y compilación antes de subir cambios.                                             |

Prepara archivos concretos y usa mensajes con el formato
`tipo(alcance): descripción`. El alcance es opcional y la descripción puede
estar en español:

```sh
git add src/components/Catalog/Catalog.astro
git commit -m "fix(catalogo): centrar el detalle del producto"
git push
```

Tipos habituales: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore` y `revert`. Otros ejemplos:

```text
feat(catalogo): agregar una bebida
docs: actualizar la información del local
build(vercel): preparar el despliegue estático
```

lint-staged conserva por defecto los cambios que no preparaste para el commit y
vuelve a preparar los archivos corregidos. No hace falta ejecutar `git add`
desde los hooks. Puedes ejecutar sus herramientas manualmente:

```sh
pnpm lint:staged
printf '%s\n' 'feat(catalogo): agregar una bebida' | pnpm commitlint
```

`.gitignore` excluye entornos y credenciales locales, cachés, dependencias,
reportes de pruebas, los lanzadores generados por Husky y el kit original
`moyami-identidad`. Los hooks, `.env.example`, lockfile, recursos copiados,
auditoría y fotografías necesarias permanecen disponibles para versionarse.

## Organización

Se adapta la
[estructura de Josh W. Comeau](https://www.joshwcomeau.com/react/file-structure/)
a Astro: organización por función y archivos privados colocados junto a su
componente.

| Carpeta                  | Responsabilidad                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `src/components/Nombre/` | Componente Astro, scripts, helpers y tipos propios; exportación local en `index.ts` |
| `src/pages/`             | Composición de rutas estáticas, fichas de producto y metadatos de rastreo           |
| `src/layouts/`           | Documento HTML, metadatos y estructura de páginas informativas                      |
| `src/content/products/`  | Una ficha JSON validada por referencia                                              |
| `src/config/site.ts`     | Información comercial confirmada                                                    |
| `src/assets/`            | Logos, mascotas y fotografías optimizadas, sin depender del kit recibido            |
| `src/styles/`            | Tokens de marca y estilos compartidos                                               |
| `resources/catalog/`     | Inventario, originales, prompts, procedencia y másteres de producción               |
| `docs/brand/`            | Guía de identidad, paleta original y licencias                                      |
| `tests/`                 | Comportamientos del catálogo y pruebas en navegador                                 |

`moyami-identidad` se conserva intacta como entrega original. Ningún import del
sitio depende de ella. Los recursos no utilizados que se copiaron al árbol de
assets no se envían al navegador.

## Catálogo e imágenes

La [auditoría](resources/catalog/INVENTORY.md) identifica **29 referencias en 50
fotografías**. El [CSV](resources/catalog/inventory.csv) tiene una fila por
foto; `inventory.json` contiene sus hashes SHA 256 y los datos pendientes.

Para actualizar textos, edita la ficha correspondiente en
`src/content/products/`. Para cambiar información comercial, edita
`src/config/site.ts`. No completes campos desconocidos mediante suposiciones.

La producción inicial de imágenes utilizó la herramienta integrada `image_gen`,
sin CLI ni claves API. `resources/catalog/image-jobs.json` contiene los prompts
completos. `generation/` registra procedencia y revisión de cada resultado. La
vista frontal es una referencia retocada y la segunda vista es una
reconstrucción identificada como generada con IA.

Después de revisar un nuevo máster:

1. Conserva la foto original y su hash en `resources/catalog/originals/` e
   `inventory.json`.
2. Guarda los PNG como `masters/{referencia}-frontal.png` y
   `masters/{referencia}-tres-cuartos.png`.
3. Actualiza los metadatos de generación y registra una revisión real antes de
   marcarla como `accepted`.
4. Ejecuta `pnpm assets:build` para generar los WebP de 1024 px y las fichas
   desde el inventario. Este comando sobrescribe las fichas con los datos del
   inventario: actualízalo también si usas este flujo.
5. Ejecuta `node scripts/render-audit.mjs` y `pnpm audit:check`.

Astro genera WebP de 256, 512, 768 y 1024 px para el catálogo y la galería. No
se genera ni se envía información de precios o disponibilidad actual.

## 3D, movimiento y mapa

El minimundo se construye con geometría propia en `World.scene.ts`; las mascotas
y logos conservan el arte original. Se importa dinámicamente, limita la densidad
de píxeles y se detiene fuera de pantalla. Movimiento reducido, ahorro de datos,
pérdida de contexto y ausencia de WebGL conservan el póster estático. Los
controles HTML no capturan el desplazamiento táctil.

El mapa utiliza MapLibre y OpenFreeMap con carga diferida, worker empaquetado
localmente, atribución visible y un marcador en **-77.8103607, -9.0443374**
(longitud, latitud). Si falta WebGL, se pierde su contexto o falla el proveedor
vectorial, carga Leaflet con teselas de OpenStreetMap. Ambos motores comparten
marcador y controles accesibles. Los proveedores se configuran en
`Location.config.ts`. La alternativa respeta la
[política de teselas de OSM](https://operations.osmfoundation.org/policies/tiles/):
carga únicamente la vista activa, usa la caché del navegador y conserva la
atribución. El mapa no solicita geolocalización. Una dirección legible y un
botón para reintentar permanecen disponibles si ambos proveedores fallan.

Los filtros y diálogos mejoran el HTML estático. Sin JavaScript, las fichas
conservan enlaces reales a las páginas de producto y sus dos vistas.

## Comprobaciones

```sh
pnpm validate
pnpm dev
pnpm test:e2e
pnpm dev:stop
```

`validate` comprueba integridad del catálogo, lint, formato, tipos, pruebas
unitarias y compilación. Playwright cubre escritorio y móvil, navegación,
centrado del diálogo, galería, filtros, movimiento reducido, ausencia de
JavaScript y WebGL, recuperación del mapa y accesibilidad con axe. Las pruebas
simulan respuestas y fallos de los proveedores para ser reproducibles sin acceso
a mapas externos.

Para instalar Chromium si no está disponible:
`pnpm exec playwright install chromium`. Se puede probar una compilación servida
en otro puerto usando `PLAYWRIGHT_BASE_URL`.

## Desplegar en Vercel

El proyecto se despliega como Astro estático. `vercel.json` fija el preset
`astro`, la instalación con lockfile congelado, `pnpm validate` como comando de
construcción y `dist` como salida. No necesita un adaptador de servidor. Vercel
no publica una construcción que falle estas comprobaciones.

1. Cambia a Node **24.22.0**, ejecuta `pnpm install --frozen-lockfile` y prepara
   tus commits. El hook `pre-push` verificará el proyecto antes del primer push
   a tu repositorio remoto.
2. Importa ese repositorio como un proyecto nuevo en Vercel. Usa la raíz del
   repositorio como Root Directory y **24.x** como Node.js Version. Conserva las
   opciones de construcción definidas en `vercel.json`.
3. En Environment Variables, configura lo siguiente antes de desplegar:

| Variable                       | Production                                                            | Preview                    |
| ------------------------------ | --------------------------------------------------------------------- | -------------------------- |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`                                                                   | `1`                        |
| `SITE_URL`                     | URL canónica completa del dominio final                               | La misma URL de producción |
| `PUBLIC_INDEXABLE`             | `true` al habilitar la indexación; `false` mientras preparas el sitio | `false`                    |

Corepack utiliza `packageManager` para instalar pnpm **10.33.2**. Si aún no
tienes dominio propio, puedes omitir `SITE_URL`: se utiliza el dominio de
producción de Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) o la URL del despliegue.
Conserva activada la exposición de las variables de sistema de Vercel. Las
previews y los entornos personalizados permanecen sin indexar, incluso si
reciben accidentalmente `PUBLIC_INDEXABLE=true`.

4. Despliega desde Vercel. Los siguientes pushes a la rama de producción crearán
   nuevos despliegues; las demás ramas generan previews. Después de cambiar
   variables o el dominio, vuelve a desplegar para regenerar HTML, canonical y
   sitemap.

El despliegue utiliza los WebP preparados en `src/assets/products`, sin generar
nuevas fotografías. `.vercelignore` evita subir mediante la CLI el kit original,
másteres, renders de producción y archivos locales. Conserva las fotos
originales y los metadatos utilizados por `audit:check`.

Puedes comprobar localmente una compilación equivalente a producción:

```sh
VERCEL=1 VERCEL_ENV=production SITE_URL=https://dominio-definitivo.pe PUBLIC_INDEXABLE=true pnpm validate
```

`dist/` es el artefacto estático. El dominio anterior es un ejemplo de comando,
no una dirección configurada en el sitio. La indexación requiere una URL del
sitio, `PUBLIC_INDEXABLE=true` y un entorno de producción.

El sitio incluye favicon, Open Graph, datos estructurados del local, páginas
informativas y 404. No añade analítica ni cookies propias. Antes de publicar
deben mantenerse correctos el dominio y los datos comerciales; los horarios y
contactos todavía no proporcionados se omiten.
