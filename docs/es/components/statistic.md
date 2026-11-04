# Statistic estadístico

Muestra valores estadísticos, con soporte para precisión, separación de miles, prefijos/sufijos y números enormes como cadenas.

## Uso básico

```vue
<template>
  <lh-statistic
    title="Visitas anuales"
    :value="2384712"
  />
</template>
```

## Precisión y separador

`precision` controla los decimales (con redondeo) y `separator` controla la separación de miles (pasa una cadena vacía para desactivarla).

```vue
<template>
  <lh-statistic
    title="Puntuación"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="Número"
    :value="8899001"
    separator=""
  />
</template>
```

## Prefijo y sufijo

```vue
<template>
  <lh-statistic
    title="Volumen de transacciones"
    :value="128600"
    prefix="¥"
    suffix="CNY"
  />
  <lh-statistic
    title="Tasa de crecimiento"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## Números enormes y texto no numérico

Un `value` de tipo cadena puede contener números enormes: las cadenas de enteros que superan `Number.MAX_SAFE_INTEGER` pasan por una ruta de formato de cadena sin convertir a Number y sin perder precisión; las cadenas que no se pueden analizar como número se muestran tal cual.

```vue
<template>
  <lh-statistic
    title="Estrellas"
    value="Incontables"
  />
  <lh-statistic
    title="Distancia interestelar"
    value="9007199254740993"
  />
</template>
```

## Slots

Los slots `title` / `prefix` / `suffix` sobrescriben las props del mismo nombre.

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>Título personalizado</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>CNY</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| title | Título del valor (se muestra encima del valor) | `string` | — |
| value | Valor estadístico; una cadena puede contener números enormes o texto con signo | `string \| number` | `0` |
| precision | Decimales | `number` | `0` |
| separator | Separador de miles; una cadena vacía lo desactiva | `string` | `','` |
| prefix | Prefijo del valor, p. ej. un símbolo de moneda | `string` | — |
| suffix | Sufijo del valor, p. ej. una unidad | `string` | — |
| customClass | Nombre de clase personalizado | `string` | — |
| sx | Props rápidas de diseño | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| title | Título personalizado |
| prefix | Prefijo personalizado |
| suffix | Sufijo personalizado |

## Diferencias de plataforma

- Componente puramente de visualización, sin uso de ninguna API de plataforma; se comporta de forma idéntica en H5 y en el Mini Programa de WeChat.
- Toda la lógica de formato (precisión, separación de miles, la ruta de cadenas para números enormes) la produce la función pura `formatStatisticValue` de `@lh-ui/share`; este repositorio solo añade el pegamento reactivo y nunca copia la implementación del core.
- El área del valor lleva `aria-live="polite"`: en H5 los lectores de pantalla anuncian con cortesía el nuevo valor cuando cambia `value`; el soporte de lectura en pantalla del Mini Programa depende de la plataforma.
- Este componente no incluye animación de conteo (count-up). Si se añade en el futuro: tanto `setInterval` como `requestAnimationFrame` están disponibles en el Mini Programa, pero `transitionend` no es fiable, por lo que el final de la animación debe alinearse con `setTimeout` (el mismo enfoque que las transiciones de message / loading).
