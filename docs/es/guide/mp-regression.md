# Lista de regresión manual del Mini Programa de WeChat

> Para que quien usa la biblioteca (o quien la mantiene) haga el recorrido en las herramientas para desarrolladores de WeChat. La prueba de humo de la compilación solo garantiza que el WXSS es válido y compila; **la corrección de comportamiento se debe regresar a mano**: vitest prueba la semántica de H5 y las diferencias de eventos y renderizado de la plataforma MP no se pueden detectar ahí.
>
> Compilación: `pnpm dev:mp-weixin` (o `pnpm build:mp-weixin`); el resultado queda en `dist/dev/mp-weixin` (o `dist/build/mp-weixin`). Abre ese directorio con las herramientas para desarrolladores de WeChat.
>
> Requisito previo: base library **≥ 2.25.2** (dependencia de root-portal; las versiones anteriores usan la rama de degradación `fixed` dentro de la página. Si se quiere validar expresamente la ruta de degradación, baja la base library por debajo de 2.25.2 y vuelve a pasar los tres elementos de «capa flotante»).

## Base general (revisar en cada página)

| # | Elemento | Criterio de aprobación |
| --- | --- | --- |
| G1 | Apertura | La página renderiza sin quedar en blanco y sin el error «componente no registrado» |
| G2 | Modo oscuro | Al cambiar a modo oscuro desde la entrada, todos los componentes de la página cambian de color (no solo el fondo) |
| G3 | Chino / inglés | Al cambiar de idioma desde la entrada, los textos internos de los componentes (p. ej. mensajes de validación del formulario, textos de los botones) se adaptan al nuevo idioma |
| G4 | Consola | Sin ningún `console.error` en todo el recorrido (en particular, no debe aparecer la advertencia de «falta el punto de montaje» de message/loading) |

## Lista de componentes

| Ruta de la página | Componente | Interacciones clave (además de la base general) |
| --- | --- | --- |
| `pages/button/button` | button | El clic tiene estado de retroalimentación; loading / disabled / plain / round / circle / block se renderizan todos; el iconfont del botón con icono se muestra correctamente |
| `pages/icon/icon` | icon | Los 37 iconos se muestran todos (no son cuadros en blanco); size / color surten efecto; el icono loading gira |
| `pages/tag/tag` | tag | Los colores de cada type son correctos; alternar round / hit; closable dispara el cierre al clic y la retrollamada se recibe |
| `pages/input/input` | input | v-model bidireccional; el estilo del marcador de posición funciona con `placeholder-style` (**no se comprueba `::placeholder`**); textarea autoajusta la altura; conteo de caracteres; clearable vacía el campo; en estado error el borde se pone rojo |
| `pages/switch/switch` | switch | El cambio por clic tiene animación del control deslizante; loading / disabled no responden al clic; se muestran activeText/inactiveText |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | El clic marca la casilla; la selección múltiple dentro del group no interfiere entre elementos; los elementos disabled no responden; estado indeterminado (semi-seleccionado) |
| `pages/radio/radio` | radio / radio-group | Las opciones se excluyen mutuamente (clicar una cancela la anterior); los elementos disabled no responden |
| `pages/form/form` | form / form-item | blur / input disparan la validación; el texto de error se muestra con `<text>`; la Promise devuelta por `validate()` se resuelve correctamente en el botón «Enviar»; el asterisco de obligatorio se muestra |
| `pages/select/select` | select | El clic abre el listbox (**root-portal, por encima de la capa de fondo**); el clic en una opción la selecciona y se cierra; clearable vacía la selección; con filterable el campo de entrada dentro de la capa flotante se puede usar; **la ausencia de navegación por teclado es lo normal** (eliminada en MP) |
| `pages/tooltip/tooltip` | tooltip | El clic en el trigger abre la burbuja; la posición coincide con placement (tras la medición en dos fotogramas, **en el primer fotograma no debe verse parpadeo ni desplazamiento**); el clic fuera cierra; que trigger="hover" no funcione en MP se considera normal |
| `pages/dialog/dialog` | dialog | Al abrir hay capa de fondo y transición; el clic en la capa de fondo cierra según `closeOnClick-modal`; con la posición bottom, `safe-area-inset-bottom` se aplica en pantallas completas; **que Esc y lockScroll no funcionen en MP es normal**; el modo a pantalla completa la cubre por completo |
| `pages/services/services` | message / loading | Ver la sección siguiente |

## Pruebas específicas de message / loading

| # | Elemento | Criterio de aprobación |
| --- | --- | --- |
| S1 | Mensajes de cada tipo | Aparecen los cinco tipos success / info / warning / danger / loading, con el icono y el color correctos |
| S2 | Cierre automático | Desaparece a los 3 segundos por defecto, con animación de transición al desaparecer (**no es instantáneo**) |
| S3 | Cierre manual | El tipo loading no se cierra solo; desaparece tras `handle.close()` |
| S4 | Apilado de varios mensajes | Al llamar varios mensajes seguidos se apilan en vertical sin solaparse; al superar max, los más antiguos se salen de la pila |
| S5 | Capa de fondo a pantalla completa | loading.show muestra una capa de fondo a pantalla completa; mientras está, la capa inferior no se puede clicar |
| S6 | Retrollamada de cierre | La retrollamada onClose se dispara cuando el mensaje desaparece |
| S7 | Advertencia de ausencia de montaje | (Prueba específica: eliminar `<lh-message />` de la página y volver a llamar) La consola debe mostrar una advertencia clara mediante `console.error`, **sin degradación silenciosa** |

## «No defectos» conocidos de la plataforma MP (si los detectas, no reportes un bug)

- select / dialog / tooltip **no tienen navegación por teclado / Esc / focus-trap / lockScroll**: se eliminan en tiempo de compilación; consulta [Soporte de plataformas](/es/guide/platform).
- El `trigger="hover"` de tooltip no se dispara en la plataforma MP: no hay semántica de hover; se usa click.
- message / loading requieren colocar primero el punto de montaje: es una decisión de diseño, no un bug.
- icon se renderiza como fuente; `fill` / `stroke` en CSS no tienen efecto, solo `color`.

## Registro de resultados de la regresión

Añade una columna a la derecha de las tablas con «Aprobado / No aprobado (síntoma)». Para los elementos no aprobados, pega primero la captura del panel Console y del panel WXML de las herramientas para desarrolladores y, a continuación, compara con la matriz de capacidades de `docs/uniapp/uniapp组件库计划.md` para decidir si se trata de una «degradación prevista» o de un defecto real.
