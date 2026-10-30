---
layout: home

hero:
  name: lh-ui uniapp
  text: Biblioteca de componentes uni-app
  tagline: Una base de código, H5 + Mini Programa de WeChat; la lógica de los componentes y las fuentes de estilos se comparten con las versiones Vue3 / Vue2 / React
  actions:
    - theme: brand
      text: Primeros pasos
      link: /es/guide/installation
    - theme: alt
      text: Soporte de plataformas
      link: /es/guide/platform

features:
  - title: Un núcleo, reutilizado entre plataformas
    details: La lógica de los componentes (máquinas de estados, validación, cálculo de popper e i18n) vive en @lh-ui/share como funciones puras; esta biblioteca solo añade el pegamento reactivo, de modo que el comportamiento coincide con las versiones Vue3 / Vue2 / React.
  - title: H5 + Mini Programa de WeChat
    details: La primera versión cubre ambas plataformas. Las restricciones de estilos del Mini Programa (lista blanca de WXSS, sin svg, sin document) las gestiona de forma uniforme una capa de sanitización en tiempo de compilación, de modo que no hay dependencias de sass por parte de quien la usa.
  - title: easycom bajo demanda
    details: Se instala desde npm, se añade una regla a pages.json y se escriben las etiquetas directamente en las plantillas; también se puede registrar todo con app.use.
  - title: Servicios imperativos disponibles
    details: Message / Loading usan un patrón de punto de montaje, de modo que las llamadas imperativas también funcionan en el Mini Programa; cuando no hay punto de montaje, en desarrollo se emite una advertencia clara en lugar de degradarse silenciosamente.
---

::: tip Relación con las demás plataformas de la familia
Esta biblioteca es la plataforma uni-app del linaje web de la familia lh-ui. Comparte con `@lh-ui/vue3` (plus), `@lh-ui/vue2` y `@lh-ui/react` las funciones puras del núcleo y las fuentes de estilos de `@lh-ui/share`. El nombre de las props coincide en lo esencial con la versión Vue3; para las diferencias de plataforma, consulta [Diferencias de API frente a la versión Vue3](/es/guide/differences).
:::
