# Diferencias de API frente a la versión Vue3

Esta biblioteca comparte con `@lh-ui/vue3` (plus) las funciones puras del núcleo de `@lh-ui/share`, de modo que **el nombre de las props y de los eventos coincide en lo esencial**. A continuación se recogen las diferencias inevitables que conlleva la plataforma objetivo de uni-app; cualquier API no listada se comporta igual que en la versión Vue3.

## icon: fuente tipográfica en lugar de SVG en línea

| | Versión Vue3 (plus) | Esta biblioteca |
| --- | --- | --- |
| Forma de renderizado | `<svg><path>` en línea | `<text class="lh-iconfont lh-iconfont--<name>">` |
| Color | `currentColor` (hereda el color del padre) | prop `color` explícita / color del padre (color de fuente CSS; semánticamente equivalente) |
| Tamaño | prop `size` | prop `size` (establece font-size) |

El Mini Programa no admite la etiqueta `<svg>`; en tiempo de compilación, el conjunto de SVG path de share se convierte a una fuente iconfont (base64 incrustada en `iconfont.css`, 37 iconos, 24×24, un solo color). Visualmente es el mismo glifo, pero en esencia es una fuente, de modo que en CSS **no** se puede usar `fill` / `stroke`, solo `color`.

## input: el estilo del marcador de posición va por prop

MP no admite el pseudoelemento `::placeholder`. El estilo del marcador de posición se pasa mediante props:

```vue
<lh-input placeholder="Escribe..." placeholder-style="color: #999" />
```

| prop | Descripción |
| --- | --- |
| `placeholder-style` | Cadena de estilos en línea para el texto del marcador de posición |
| `placeholder-class` | Clase del texto del marcador de posición (mutuamente excluyente con style) |

El resto de las APIs (`v-model`, `maxlength`, el conteo de caracteres `show-word-limit`, `type`) coinciden con la versión Vue3.

## select / dialog / tooltip: las capacidades de escritorio solo en H5

| Capacidad | H5 | Mini Programa de WeChat |
| --- | --- | --- |
| Navegación por teclado (flechas / Enter / Esc) | ✅ | ❌ Eliminada en tiempo de compilación |
| focus-trap (círculo de foco del diálogo) | ✅ | ❌ No se invoca en tiempo de compilación |
| lockScroll (bloquear el desplazamiento del fondo) | ✅ | ❌ (la capa de fondo intercepta como alternativa) |
| Disparo por hover (tooltip) | ✅ | ❌, se sustituye por click / touchstart |

**El `trigger` de tooltip**: sigue admitiendo `'click' | 'hover'`, pero en el Mini Programa `hover` no tiene sentido: en la plataforma MP usa `trigger="click"` (o el valor por defecto) y se dispara por clic / toque.

**Los eventos de select** no cambian (`update:modelValue` / `change` / `visible-change`), pero «vaciar» y «seleccionar» en la plataforma MP solo se pueden hacer clicando un elemento del listbox; no hay recorrido por teclado.

## message / loading: patrón de punto de montaje

Es **la mayor diferencia en la forma de uso**. La versión Vue3 usa `createApp + montaje en document.body`: basta con llamar y aparece. El Mini Programa no tiene document, de modo que es obligatorio **colocar primero el componente de punto de montaje**:

```vue
<!-- Se coloca una vez en la página -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: 'Cargando...' })
// ...
loading.close()
```

Para más detalle, consulta [Instalación - Los servicios imperativos necesitan un punto de montaje](/es/guide/installation#los-servicios-imperativos-necesitan-un-punto-de-montaje).

::: tip El componente Notification no está en la primera versión
La versión Vue3 tiene `lh-notification`, pero esta biblioteca **no lo incluye** en la primera versión (su valor en la plataforma del Mini Programa es bajo: las notificaciones suelen ir por capacidades del sistema). Cuando necesites una notificación de este tipo, usa `lh-message` en su lugar.
:::

## config-provider: el modo oscuro por clase, no por document

| | Versión Vue3 | Esta biblioteca |
| --- | --- | --- |
| Cambio a modo oscuro | Añade una clase a `document.documentElement` | Se añade la clase `dark` al nodo contenedor (el Mini Programa no tiene document) |
| prop `theme` | `'light' \| 'dark'` | Igual (la implementación interna es distinta) |

La forma de uso no cambia: `<lh-config-provider :theme="dark">`. En el `theme/index.css` de esta biblioteca las variables del modo oscuro cuelgan de `page.dark, .dark`, de modo que el ámbito del modo oscuro sigue al nodo contenedor de ConfigProvider.

## Unidades: px directos

Esta biblioteca **no hace conversión de px a rpx**: las fuentes de estilos se publican directamente en px, igual que wot-design-uni, uview-plus, uni-ui, TDesign y otras bibliotecas de componentes uni habituales (la compilación oficial de uni tampoco convierte automáticamente px a rpx). Si el proyecto tiene configurado algún complemento como `postcss-px-to-rpx`, los artefactos de esta biblioteca se convertirán junto con el resto, sin que haga falta un tratamiento especial.

## Opciones del Mini Programa incluidas en los SFC de los componentes

El SFC de cada componente declara:

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` — el componente no genera nodos contenedores innecesarios; custom-class / customStyle pueden llegar al elemento de destino.
- `addGlobalClass: true` — dentro del componente se pueden usar estilos globales (`app.wxss` / estilos de la página).
- `styleIsolation: 'shared'` — el aislamiento de estilos es compartido: los estilos del componente y los de la página se ven mutuamente.

**Quien usa la biblioteca no necesita configurar estas tres opciones en pages.json ni en el proyecto**: ya están declaradas en el propio json de cada componente. Si los estilos del componente se comportan de forma anómala (las clases están todas presentes pero los estilos no se aplican), comprueba primero si la configuración `styleIsolation` del proyecto está sobrescribiendo la declaración a nivel de componente.
