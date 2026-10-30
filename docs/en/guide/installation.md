# Installation

## Dependencies

- `@lh-ui/share` is installed automatically (the only runtime dependency of this library).
- A uni-app Vue3 project (`@dcloudio/uni-app` 3.x).
- The WeChat Mini Program requires **base library ≥ 2.25.2** (root-portal); lower versions degrade to an in-page fixed fallback.

## Option 1: easycom on-demand import (recommended)

After installing, add one easycom rule to `pages.json`:

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

Then just write the tags directly in your templates — **no import or registration needed**:

```vue
<template>
  <lh-button type="primary" @click="onTap">Button</lh-button>
</template>
```

::: warning easycom config does not take effect immediately
For compilation performance, uni-app **does not recompile when the easycom config in `pages.json` changes**. After editing the rule, touch any page content (or restart the dev server) for it to take effect. This is existing uni-app behavior, not a problem with this library.
:::

## Option 2: full registration

When not using easycom (for example, an H5 project that wants to import everything), use `app.use`:

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## Importing styles

**Both approaches must import the two CSS artifacts** (consumers have zero sass dependencies; styles are already sanitized at build time into self-contained CSS):

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // Theme variables (page { --lh-* } + page.dark dark mode)
import '@lh-ui/uniapp/src/icon/iconfont.css' // Icon font (required by the lh-icon component)
```

::: tip Why build-time artifacts instead of scss sources
The sass `loadPaths` of a uni-app project does not include `node_modules`, so bare specifiers like `@use '@lh-ui/share/...'` cannot be resolved and a direct import would fail to compile. Therefore this library outputs self-contained CSS at build time, and component SFCs import it via `<style src="./style.css">`. This also means **consumers do not need to install sass**.
:::

## Imperative services need a mount point

Message / Loading cannot create DOM via JS in the Mini Program, so they use a **mount-point pattern**. Place a mount-point component on the page (or root component) where you need them:

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- page content --></view>

    <!-- mount point for the imperative services -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('Success')
</script>
```

::: danger A missing mount point triggers a warning
If you call `useLhMessage()` but the page has no `<lh-message />`, a `console.error` warning is emitted during development and it **does not silently degrade**. This is intentional: silent degradation would turn "the call seems to work but nothing happens" into a hidden bug.
:::

## TypeScript

This library ships its own types; component Props / events have full type inference. Under the easycom form, the types of in-template tags are provided by the `uni-app` component type system (if the project has no global component types configured, annotate explicitly with `LhXxxProps`).
