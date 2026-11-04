# TimePicker (selector de hora)

Selector de hora, minutos y segundos. Al pulsar el disparador se abre un panel: cada columna (hora / minutos / segundos) es una lista con desplazamiento vertical independiente; al pulsar un elemento de una columna se selecciona, y los botones «Ahora / Aceptar» del pie confirman la selección.

## Uso básico

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

El `format` predeterminado es `HH:mm:ss`, por lo que el panel muestra tres columnas (hora / minutos / segundos). Al pulsar un elemento de una columna la selección cae inmediatamente (el panel no se cierra); «Aceptar» confirma el `Date` y cierra el panel; «Ahora» rellena las columnas con la hora actual.

## Formato hora y minutos

Cuando `format` no contiene `ss`, el panel solo muestra las columnas de hora y minutos, y el marcador también se genera a partir de `format`:

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Rango horario

`start` / `end` limitan el rango seleccionable de la columna de horas (intersección con 0~23). Una hora almacenada fuera del rango se reconduce al intervalo, y «Ahora» también se reconduce:

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Pasos

`step-hour` / `step-minute` / `step-second` personalizan el paso de las opciones de cada columna:

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Deshabilitado

`disabled` deshabilita todo el selector (el panel no se abre y el icono de borrado tampoco se muestra):

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Marcador y borrado

`placeholder` sobrescribe el texto del marcador (si no se pasa, se genera a partir de `format` con las claves de idioma `timepicker.hour/minute/second`). Cuando hay un valor, aparece un icono de borrado a la derecha del disparador; al pulsarlo se vacía el valor (`clearable` es `true` por defecto):

```vue
<template>
  <lh-time-picker v-model="value" placeholder="Elige la hora del recordatorio" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## API de TimePicker

### Props

| Prop | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| modelValue | Hora vinculada | `Date \| null` | `null` |
| size | Tamaño | `LhTimePickerSize` | `'medium'` |
| disabled | Deshabilitar todo el selector | `boolean` | `false` |
| clearable | Mostrar el botón de borrado | `boolean` | `true` |
| placeholder | Marcador (si no se pasa, se genera desde format con las claves de idioma `timepicker.hour/minute/second`) | `string` | — |
| format | Formato de hora (la columna de segundos solo aparece con `ss`) | `string` | `'HH:mm:ss'` |
| readonly | Marcador de solo lectura (el disparador es una view autodibujada sin estado de entrada, por lo que es siempre solo lectura) | `boolean` | `false` |
| arrowControl | Mostrar botones de flecha (solo se renderiza en H5, junto con el paso por teclado) | `boolean` | `false` |
| start | Hora de inicio (intersección con 0~23) | `number` | `0` |
| end | Hora de fin (intersección con 0~23) | `number` | `24` |
| stepHour | Paso de la columna de horas | `number` | `1` |
| stepMinute | Paso de la columna de minutos | `number` | `1` |
| stepSecond | Paso de la columna de segundos | `number` | `1` |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Props de diseño rápido (se aplican a la raíz del disparador; el panel flotante no se ve afectado) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Se emite cuando cambia el valor vinculado | `(value: Date \| null)` |
| change | Se emite al pulsar «Aceptar» o el icono de borrado | `(value: Date \| null)` |

### Accesibilidad

- El disparador lleva `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` (el paquete de atributos lo produce `getTimePickerTriggerAria` de share y se vincula clave a clave)
- El panel es `role="dialog"`; cada columna es `role="listbox"` (su `aria-label` viene de las claves de idioma `timepicker.hourLabel/minuteLabel/secondLabel`), y cada elemento es `role="option"` con `aria-selected` / `aria-disabled`
- El motor de posicionamiento es una función pura escrita a mano (flip / shift para evitar desbordes), sin dependencias de ejecución de terceros

::: tip Diferencias de plataforma (diferencias respecto a la versión Vue3)
- **La rueda pasa a ser un panel de columnas scroll-view**: plus usa contenedores `div` con `overflow-y: auto`, intercepta la rueda con `@wheel.prevent` para avanzar el paso y lleva el elemento seleccionado a la vista con `scrollIntoView`; en uni-app cada columna es un `scroll-view` vertical independiente (`scroll-y`) — la `view` del MP no tiene un desbordamiento fiable — y el elemento seleccionado se trae a la vista con `scroll-into-view` (el MP no tiene API `scrollIntoView`). La interacción es la misma: pulsar un elemento de una columna para seleccionar y confirmar con los botones «Ahora / Aceptar» del pie.
- **El paso con rueda no se ha portado**: el desplazamiento dentro de la columna se delega al desplazamiento nativo de `scroll-view` (en H5 la rueda desplaza la lista larga de forma natural); ya no se intercepta el evento wheel para saltar según el paso. La generación de opciones con paso (`step-hour`, etc.) coincide con plus.
- **La navegación por teclado es solo para H5**: el disparador abre el panel con Enter/Space/flecha abajo y mueve el foco a la primera columna; dentro del panel ↑↓ avanzan según el paso configurado (la hora se reinicia y luego se reconduce al rango start/end), ←→ mueven el foco entre las columnas, Enter/Space confirman y cierran, y Escape cierra mediante un listener a nivel de documento (cuando hay varias superposiciones apiladas solo se cierra la superior). Todo el bloque se elimina mediante compilación condicional, sin código muerto en el paquete del MP.
- **arrowControl es solo para H5**: los botones de flecha dependen de la semántica del paso por teclado y no se renderizan en el MP (el `v-if` de la plantilla lo protege el `LH_IS_H5` de tiempo de compilación).
- **Cierre por clic exterior**: plus escucha los clics del document; uni-app usa una máscara transparente dentro de la página (pulsar la máscara cierra sin emitir change).
- **Disparador autodibujado**: el disparador de plus es un `<input>` editable; en uni-app el disparador se dibuja con `<view>` + `<text>` (el MP no tiene semántica de foco dentro del disparador, el color del marcador viene de una clase modificadora y `readonly` está, por tanto, siempre activo).
- **Icono del disparador**: plus usa el icono `date`; esta biblioteca usa el icono `clock`, más apropiado.
- **Sin transición de entrada/salida**: `Transition` no es fiable en el MP — el panel simplemente se muestra y se oculta, de forma consistente con tooltip / dropdown / popover / cascader.
:::
