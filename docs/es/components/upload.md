# Upload

Selección de archivos y subida. La validación de la selección (accept / maxSize /
maxCount), la máquina de estados de los archivos (ready → uploading → success /
fail) y la lógica de parcheo de la lista se consumen por completo de las funciones
puras del core de `@lh-ui/share` (`normalizeUploadAccept` / `isFileRejected` /
`exceedsMaxSize` / `exceedsMaxCount` / `patchUploadFile`, entre otras); la capa del
componente solo se ocupa del renderizado, los eventos y la adaptación de selección
de la plataforma. La subida no incluye un cliente HTTP: el prop `request` lo controla
el consumidor y puede generarse con el `createLhUploadRequest` del adapter.

## Uso básico

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// Mini Programa: uni.uploadFile; H5: XHR + FormData; el nombre del campo por
// defecto es file. En un dispositivo real el dominio de destino debe registrarse
// en "Dominios de servidor - uploadFile" de WeChat.
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

Al pulsar el área del disparador se abre el selector nativo (chooseMedia /
chooseImage / chooseVideo). Cuando un archivo entra en la lista, se ejecuta
`request` de inmediato: durante la subida se muestra una barra de progreso, en
caso de éxito aparecen una ✓ y la URL del servidor, y en caso de error se muestra
el motivo (el evento `error` lleva el archivo fallido y el texto del motivo).
Si no se pasa `request`, el componente solo selecciona y valida localmente: la
lista se queda en estado `ready` y el consumidor gestiona el canal de subida.

El área del disparador renderiza un texto de ayuda por defecto ("Seleccionar
archivo", o "Suelta los archivos aquí o haz clic para subirlos" en modo drag;
los textos provienen de las claves `upload.*` de share locales, disponibles en
diez idiomas). Pasa el slot por defecto para personalizar el contenido del
disparador.

## Selección múltiple y límites de cantidad / tamaño

```vue
<template>
  <lh-upload
    :request="request"
    accept="image/*"
    multiple
    :max-count="3"
    :max-size="2 * 1024 * 1024"
  />
</template>
```

`multiple` activa la selección múltiple del selector nativo; cuando se alcanza
`maxCount`, nuevas selecciones muestran "Excede el límite de cantidad" y dejan de
añadirse; los archivos que superan `maxSize` se omiten con "El archivo supera el
límite de tamaño" (5MB por defecto). Ambos mensajes se renderizan en el nodo de
texto de error bajo la lista (`role="alert"`).

## Filtrado por tipo accept

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept` acepta un array `['.png', 'image/*']` o una cadena separada por comas
`'.png,.jpg'`. Consulta "Diferencias de plataforma" más abajo para ver cómo se
mapean las reglas en el lado uni: el panel del selector nativo solo puede filtrar
por tipo de medio, por lo que las reglas de extensión no llegan al panel y se
aplican después mediante `isFileRejected` como red de seguridad.

## Arrastrar y soltar (solo H5)

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag` convierte el área del disparador en una zona de soltar (`dragover` /
`dragleave` / `drop` funcionan en H5; los Files soltados se envuelven en
`LhUniFile` y siguen el mismo flujo). El Mini Programa no dispone de arrastrar y
soltar HTML5, por lo que `drag` no surte efecto en MP y el área del disparador
pasa a ser de clic para subir.

## Deshabilitado

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled` deshabilita toda la subida: tanto los clics en el área del disparador
como la activación por teclado (Enter / Space, solo H5) se suprimen, y el área
expone `aria-disabled`.

## API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| multiple | Permitir selección múltiple | `boolean` | `false` |
| drag | Zona de arrastrar y soltar (solo H5: MP sin drag and drop HTML5) | `boolean` | `false` |
| disabled | Deshabilitar | `boolean` | `false` |
| accept | Extensiones / MIME permitidos: array `['.png', 'image/*']` o cadena por comas `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | Límite de tamaño por archivo (bytes) | `number` | `5242880` (5MB) |
| maxCount | Límite de cantidad (0 = sin límite) | `number` | `0` |
| request | Función de petición de subida (omitir para solo seleccionar y validar localmente) | `LhUniUploadRequest` | — |
| customClass | Clase personalizada (reenviada al nodo raíz) | `string` | — |
| sx | props de diseño rápido sx | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| change | La lista de archivos cambió (tras seleccionar / completar subida / eliminar) | `(files: LhUploadFile[])` |
| success | Un archivo se subió correctamente | `(file: LhUploadFile)` |
| error | Un archivo falló al subirse | `(file: LhUploadFile, reason: string)` |
| remove | Se eliminó un archivo | `(uid: string)` |

### Slots

| Nombre | Descripción |
| --- | --- |
| default | Contenido del área del disparador (por defecto el texto de ayuda) |

### LhUploadFile

| Campo | Descripción | Tipo |
| --- | --- | --- |
| uid | Identificador único (generado internamente) | `string` |
| name | Nombre del archivo | `string` |
| size | Tamaño en bytes | `number` |
| status | Estado | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | Progreso de subida 0-100 | `number` |
| url | URL del servidor (en caso de éxito) | `string` |
| error | Motivo del fallo | `string` |

### Adaptador (`@lh-ui/uniapp/src/adapter/upload`)

| Exportación | Descripción |
| --- | --- |
| `LhUniFile` | Descriptor de archivo del lado uni: `{ path, name, size, type }` (path es una ruta temporal: un blob / data URL en H5, una ruta temporal wxfile:// en WeChat) |
| `LhUniUploadRequest` | Firma de la función del prop request: recibe `{ file: LhUniFile, onProgress }` y devuelve `Promise<LhUploadResult>` |
| `LhUploadResult` | Resultado de la subida: `{ url?, data? }` (si falta url, data transporta el cuerpo de la respuesta original para que lo analices) |
| `LhUploadConfig` | Configuración de `createLhUploadRequest`: `{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | Construye la función request: `uni.uploadFile` en el Mini Programa, XHR + FormData en H5 |
| `chooseLhFiles(options)` | Selección de archivos unificada (normalmente se invoca desde el área del disparador; rara vez la usa el consumidor directamente) |
| `wrapLhNativeFile(file)` | Envuelve un File real soltado en H5 como `LhUniFile` |

### Accesibilidad

- El área del disparador es `role="button"` con un `tabindex` (-1 si está
  deshabilitada) y expone `aria-disabled` cuando lo está
- Los archivos en subida llevan una barra de progreso con `role="progressbar"` +
  `aria-valuenow`
- Los archivos fallidos muestran su texto de error; el mensaje de error bajo la
  lista es `role="alert"`
- El botón de eliminación lleva un `aria-label` ("Eliminar" + nombre del archivo)

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **La selección de archivos pasa por APIs nativas**: la versión Vue3 usa
  `<input type="file">`, pero el Mini Programa no tiene File ni input. La
  selección se unifica a través del `chooseLhFiles` del adapter (chooseMedia /
  chooseImage / chooseVideo), y su resultado es una ruta temporal
  (`LhUniFile`), no un File del DOM.
- **accept solo puede mapearse a tipos de medio**: las APIs de selección de uni
  solo entienden image / video. `image/*` (o extensiones de imagen) → selector
  de imágenes, `video/*` (o extensiones de vídeo) → selector de vídeos, una
  mezcla de ambos o sin regla → chooseMedia en modo mixto. Las reglas de
  extensión (como `.png`) no se pueden entregar al panel del selector nativo,
  por lo que `isFileRejected` las aplica después como red de seguridad; las
  reglas que no son de medio (como `.txt`) no tienen contrapartida en el Mini
  Programa: se mapean al selector de imágenes y luego las rechaza la
  verificación de respaldo. chooseMedia solo existe a partir de la biblioteca
  base 2.10+ de WeChat; el adapter dispone de una guarda de existencia y, si no
  está disponible, recurre a chooseImage / chooseVideo.
- **request recibe un LhUniFile y no un File del DOM**: el `file` de
  `{ file: LhUniFile, onProgress }` es un descriptor de archivo temporal. Para
  subir directamente con `uni.uploadFile`, construye la petición con el
  `createLhUploadRequest(action, config)` del adapter (en H5 usa
  automáticamente XHR + FormData, manteniendo ambos extremos alineados).
  **El dominio de destino de uploadFile debe estar registrado en los ajustes
  "Dominios de servidor" de la plataforma WeChat**; de lo contrario, las
  peticiones desde un dispositivo real se bloquean. H5 no tiene esta
  restricción.
- **Arrastrar y soltar es solo para H5**: el Mini Programa no dispone de drag
  and drop HTML5, así que `drag` no surte efecto en MP (el área del
  disparador pasa a ser de clic para subir). Los manejadores de arrastre se
  eliminan mediante compilación condicional (sin código muerto en el bundle
  MP).
- **La activación por teclado es solo para H5**: Enter / Space abren el selector
  únicamente en H5; el Mini Programa no tiene eventos de teclado.
- **La cancelación del selector es silenciosa**: cancelar el selector nativo
  (errMsg contiene cancel) no escribe ningún mensaje de error ni dispara el
  evento `error`.
- **El alcance de la API se mantiene alineado con la fuente de plus**: no se
  añadieron capacidades que plus no tiene (`action` / `headers` / `fileList` /
  `before-upload`); el endpoint de subida y configuraciones similares viven en
  la función request que controla el consumidor. Se añade `customClass`
  (reenvío para el aislamiento de estilos) según las convenciones de este
  paquete.
:::
