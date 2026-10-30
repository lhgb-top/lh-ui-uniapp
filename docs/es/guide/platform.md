# Soporte de plataformas

## Plataformas de la primera versión

| Plataforma | Estado | Notas |
| --- | --- | --- |
| **H5** | ✅ Completo | Todos los componentes con funcionalidad integral |
| **Mini Programa de WeChat** | ✅ Completo (con degradaciones parciales) | Las capacidades de escritorio de los componentes de capa flotante se degradan; ver la tabla siguiente |
| Mini Programas de Alipay / Douyin | 🚫 No admitido en la primera versión | Se añadirán columnas tras validar cada plataforma con compilación condicional |
| App (nvue) | 🚫 No se admitirá | El sistema de renderizado nvue es distinto del de webview y no está en la hoja de ruta |

## Matriz de capacidades por componente

«Degradado» significa que **la capacidad no admitida por la plataforma se elimina directamente mediante salvaguardas de compilación** (no queda código muerto en el paquete del Mini Programa); no es un fallo en tiempo de ejecución.

| Componente | H5 | Mini Programa de WeChat | Estrategia de degradación / notas |
| --- | --- | --- | --- |
| config-provider | Completo | Completo | provide/inject + variables CSS en línea, disponibles en todas las plataformas; el modo oscuro se basa en la clase `page.dark` (sin document) |
| button / tag | Completo | Completo | — |
| icon | Completo | Completo | Fuente iconfont (en la versión web es SVG en línea; ver más abajo «Diferencias de renderizado de icon») |
| input | Completo | Completo | El estilo del marcador de posición va por la prop `placeholder-style` (MP no admite `::placeholder`) |
| checkbox / radio / switch | Completo | Completo | **view dibujado a medida** (sin componentes nativos, para unificar el lenguaje visual lh) |
| form / form-item | Completo | Completo | La lógica de validación está en funciones puras del núcleo, sin dependencias de plataforma |
| select | Completo | Degradado | root-portal + medición en dos fotogramas; **la navegación por teclado solo en H5**, en MP se usa clic + scroll-view |
| dialog | Completo | Degradado | root-portal; **focus-trap / lockScroll solo en H5**, en MP la capa de fondo intercepta como alternativa |
| tooltip | Completo | Degradado | Medición en dos fotogramas; **sin hover**, en MP se dispara por clic / toque |
| message / loading | Completo | Completo | Patrón de punto de montaje (el Mini Programa no tiene document y no puede crear DOM mediante JS) |

## Restricciones concretas del Mini Programa de WeChat y alternativas

| Restricción | Alternativa |
| --- | --- |
| No admite la etiqueta `<svg>` | Los iconos se convierten en tiempo de compilación a una fuente iconfont (base64 incrustada); se renderizan con `<text class="lh-iconfont">` |
| No admite `::placeholder` | Las props `placeholder-style` / `placeholder-class` de input |
| No admite el comodín `*`, ni selectores de atributo, ni `:not()`, ni `:nth-*` | Sanitización en tiempo de compilación: el comodín `*` se mapea a flex + gap; el resto se sustituye por clases equivalentes |
| Sin `document` / `document.body` | Las capas flotantes usan `root-portal`; los servicios imperativos usan el patrón de punto de montaje |
| Sin semántica de foco por teclado | focus-trap y la navegación por teclado no se invocan, protegidos por `LH_IS_H5`; los atributos aria siguen emitiéndose para los lectores de pantalla |
| `transitionend` no es fiable | Las animaciones de entrada y salida usan CSS transition + setTimeout para alinear la duración |
| En la fase `onLoad` los componentes aún no se han creado | Todas las llamadas a refs / medición deben hacerse después de `onReady` |

## Versión de la base library

- **root-portal requiere base library ≥ 2.25.2** (el montaje de las capas flotantes de select / dialog / tooltip depende de él).
- Las versiones anteriores degradan automáticamente a la alternativa de **posicionamiento `fixed` dentro de la página** (decidido por `getLhLibVersion()`); la capa flotante sigue existiendo, solo que su nivel queda sujeto al flujo de la página.

## root-portal y plataformas como DingTalk

`lh-root-portal` usa internamente una compilación condicional en tres ramas: H5 usa `<teleport to="body">`, WeChat usa `<root-portal>` y las plataformas que no admiten root-portal, como DingTalk, usan `fixed` dentro de la página. **Es un componente interno; quien usa la biblioteca no necesita preocuparse por él**; se documenta aquí únicamente para explicar el origen de las diferencias de comportamiento de las capas flotantes entre plataformas.
