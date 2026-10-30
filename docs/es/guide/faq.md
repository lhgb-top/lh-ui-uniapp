# Preguntas frecuentes

## 1. La configuración easycom no surte efecto tras modificarla

**Síntoma**: se añade una regla easycom a `pages.json`, o se modifica la regla existente, pero la plantilla sigue mostrando el error «componente no registrado» en `<lh-xxx>`.

**Causa**: por motivos de rendimiento de compilación, uni-app **no recompila al cambiar la configuración easycom de `pages.json`**.

**Solución**: tras modificar la regla, toca el contenido de cualquier página (basta con guardar un espacio en blanco) para forzar la recompilación, o reinicia el dev server.

## 2. El ref del componente no se obtiene / la medición devuelve vacío

**Síntoma**: se llama a métodos del ref del componente dentro de `onLoad`, o se usan capacidades como `getLhRect` / `useLhPopper`, y se obtiene undefined o un rectángulo vacío.

**Causa**: en la fase `onLoad` los componentes aún no se han terminado de crear; las instancias hijas y los nodos no están listos.

**Solución**: coloca todas las llamadas a refs y la medición de nodos **después de `onReady`** (`onReady` se corresponde con la primera renderización completada de la página):

```ts
import { onReady } from '@dcloudio/uni-app'

onReady(() => {
  // Aquí ya se puede acceder con seguridad a los refs de subcomponentes / medir nodos
})
```

## 3. Los servicios imperativos (message / loading) no responden tras la llamada

**Síntoma**: se llama a `useLhMessage().success(...)`, la consola muestra una advertencia `console.error`, pero la página no muestra el mensaje.

**Causa**: el Mini Programa no puede crear DOM mediante JS, de modo que los servicios imperativos emplean el **patrón de punto de montaje**: la página debe contener primero `<lh-message />` / `<lh-loading />`; la llamada solo añade registros al store singleton y los renderiza el componente de punto de montaje.

**Solución**: coloca el punto de montaje en las páginas que lo necesiten (o en un componente contenedor raíz permanente):

```vue
<lh-config-provider>
  <view><!-- contenido --></view>
  <lh-message />
  <lh-loading />
</lh-config-provider>
```

La advertencia es una decisión deliberada: no se degrada silenciosamente, para evitar el bug oculto de «la llamada parece funcionar, pero no ocurre nada».

## 4. Los estilos no se aplican / las clases están presentes pero faltan los estilos

**Orden de comprobación**:

1. Confirma que se importan los dos artefactos CSS: `@lh-ui/uniapp/src/theme/index.css` y `@lh-ui/uniapp/src/icon/iconfont.css`. Si falta la importación de las variables de tema, todos los `var(--lh-*)` caen a sus valores por defecto (colores y radios de borde incorrectos).
2. Confirma que no se está sobrescribiendo el `styleIsolation` a nivel de componente. El SFC del componente trae `styleIsolation: 'shared'` + `addGlobalClass: true`; si la configuración del proyecto fuerza un aislamiento más estricto, los estilos del componente y los de la página dejarán de verse mutuamente.
3. Pasa los estilos personalizados mediante las props `custom-class` / `custom-style`; no escribas directamente en la página los nombres de clase BEM internos del componente (las clases internas como `.lh-button__text` no forman parte de la API pública).

## 5. ¿Por qué hay un base64 de iconfont en el tamaño del paquete del Mini Programa?

Es la fuente de iconos (del orden de unas decenas de KB), incrustada en el CSS y publicada con el paquete. El Mini Programa no admite la etiqueta `<svg>`, de modo que los iconos deben ir por una solución de fuente; el base64 incrustado se debe a que el `@font-face` del Mini Programa no permite referenciar archivos de fuentes locales (en wxss, `url(...)` solo admite direcciones de red o base64). Es la solución habitual para iconos en uni-app.

## 6. En H5 la capa flotante está bien posicionada, pero en el Mini Programa queda desplazada

El posicionamiento de las capas flotantes sigue la secuencia «medición en dos fotogramas → posicionamiento → muestra» (primero se renderiza de forma transparente para medir, luego se posiciona y por último se muestra para evitar parpadeos). Si queda desplazada, suele ser un problema de **sincronización de la llamada**: confirma que el posicionamiento se dispara después de `onReady` y que el nodo trigger ya ha terminado su disposición. Ten en cuenta además que `getLhRect` es asíncrono en el Mini Programa: no se puede asumir que el resultado se obtiene de forma síncrona.

## 7. El modo oscuro no se aplica

Las variables del modo oscuro cuelgan de `page.dark, .dark` y se activan cuando el nodo contenedor de ConfigProvider recibe la clase `dark`. Confirma que `<lh-config-provider :theme="dark">` envuelve realmente el ámbito de contenido que debe estar en modo oscuro (a diferencia de la versión web, que las cuelga de document.documentElement de forma global, aquí el ámbito sigue al nodo contenedor).
