# Skills y fuentes de implementación

Se aplicaron landing-page-design, frontend-design, Astro, imagegen y
find-skills. Se consultó scroll-world y se conservó la decisión del usuario de
construir 3D interactivo real en lugar de una cadena de video prerenderizada.

Mediante `pnpm dlx skills find threejs` se verificó el paquete
CloudAI-X/threejs-skills: fundamentals, interaction y animation superan diez mil
instalaciones cada una. El repositorio tenía unas 3.6 mil estrellas al
revisarlo.

- Origen: https://github.com/CloudAI-X/threejs-skills
- Commit fijado: `b1c623076c661fc9b03dac19292e825a5d106823`
- Módulos seleccionados: `threejs-fundamentals`, `threejs-interaction`,
  `threejs-animation`.
- Se inspeccionaron sus instrucciones; son guías de APIs y patrones. No se
  ejecutan scripts del repositorio dentro de la aplicación.
- Las APIs se contrastan con la versión instalada de Three.js; por ejemplo, se
  usa PCFShadowMap en lugar de PCFSoftShadowMap, deprecado en esta versión.

Referencias técnicas: https://docs.astro.build/ , https://threejs.org/docs/ ,
https://openfreemap.org/quick_start/ ,
https://oxc.rs/docs/guide/usage/formatter/language-support.html .
