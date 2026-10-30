# FAQ

## 1. The easycom config change does not take effect

**Symptom**: You added an easycom rule to `pages.json` (or edited the rule), but `<lh-xxx>` in the template still reports "component not registered".

**Cause**: For compilation performance, uni-app **does not recompile when the easycom config in `pages.json` changes**.

**Solution**: After changing the rule, touch the content of any page (type a space and save) to trigger a recompile; or simply restart the dev server.

## 2. ref cannot reach the component / measurements come back empty

**Symptom**: You call a component ref method inside `onLoad`, or use `getLhRect` / `useLhPopper` related capabilities, and get undefined or an empty rect.

**Cause**: At the `onLoad` stage the components are not fully created yet; the child component instances and nodes are not ready.

**Solution**: Place all ref calls and node measurements **after `onReady`** (`onReady` corresponds to the completion of the page's first render):

```ts
import { onReady } from '@dcloudio/uni-app'

onReady(() => {
  // Only here is it safe to access child component refs / measure nodes
})
```

## 3. The imperative services (message / loading) do nothing after being called

**Symptom**: You called `useLhMessage().success(...)`, the console shows a `console.error` warning, but no message appears on the page.

**Cause**: The Mini Program cannot create DOM via JS, so the imperative services use a **mount-point pattern** — the page must first contain `<lh-message />` / `<lh-loading />`; a call only pushes a record into the singleton store, which the mount-point component then renders.

**Solution**: Place the mount points on the pages that need them (or in a persistent root wrapper component):

```vue
<lh-config-provider>
  <view><!-- content --></view>
  <lh-message />
  <lh-loading />
</lh-config-provider>
```

The warning is intentional — no silent degradation, to avoid the hidden bug of "the call seems to work but nothing happens".

## 4. Styles do not apply / class names are present but the styles are missing

**Troubleshooting order**:

1. Confirm both CSS artifacts are imported: `@lh-ui/uniapp/src/theme/index.css` and `@lh-ui/uniapp/src/icon/iconfont.css`. When the theme variables are missing, all `var(--lh-*)` fall back to their default values (colors and radii are all wrong).
2. Confirm the component-level `styleIsolation` is not overridden. The component SFCs ship with `styleIsolation: 'shared'` + `addGlobalClass: true`; if the project-level config forces stricter isolation, the component styles become mutually invisible.
3. Pass custom styles in via the `custom-class` / `custom-style` props; do not write the component's internal BEM class names directly in the page (internal class names like `.lh-button__text` are not part of the public API).

## 5. Why is the iconfont base64 in the Mini Program package size

That is the icon font (a few tens of KB), embedded in the CSS and shipped with the package. The Mini Program does not support the `<svg>` tag, so icons must use a font approach; the base64 embedding exists because the Mini Program's `@font-face` does not allow referencing local font files (in wxss, `url(...)` only supports network addresses or base64). This is the mainstream approach for icon solutions in uni-app.

## 6. The overlay position is fine on H5 but off in the Mini Program

Overlay positioning follows a "measure → position → show" sequence (render transparently to measure, then position, and finally show to avoid flicker). If the position is off, it is usually a **call timing** problem: confirm that the positioning trigger runs after `onReady` and that the trigger node has finished layout. Also note that `getLhRect` is asynchronous on the Mini Program; do not assume you get the result synchronously.

## 7. Dark mode does not take effect

The dark variables are attached to `page.dark, .dark`, toggled by the ConfigProvider's wrapping node gaining the `dark` class. Confirm that `<lh-config-provider :theme="dark">` actually wraps the scope that needs dark mode (unlike the web builds, where it is attached to document.documentElement and therefore global, the scope in this library follows the wrapping node).
