# Platform Support

## First-release platform scope

| Platform | Status | Notes |
| --- | --- | --- |
| **H5** | ✅ Full | All components fully functional |
| **WeChat Mini Program** | ✅ Full (partial degradation) | Desktop-class capabilities of overlay components are degraded; see the table below |
| Alipay / Douyin Mini Program | 🚫 Not supported in the first release | Columns will be added after per-target verification via conditional compilation |
| App (nvue) | 🚫 Not planned | The nvue rendering system differs from webview and is not on the roadmap |

## Component capability matrix

"Degrade" means **unsupported platform capabilities are removed directly by compile-time guards** (no dead code in the Mini Program package), not a runtime failure.

| Component | H5 | WeChat Mini Program | Degradation strategy / notes |
| --- | --- | --- | --- |
| config-provider | Full | Full | provide/inject + inline CSS variables work on all platforms; dark mode toggles via the `page.dark` class (no document) |
| button / tag | Full | Full | — |
| icon | Full | Full | iconfont font approach (the web builds use inline SVG; see "icon rendering differences" below) |
| input | Full | Full | Placeholder styling goes through the `placeholder-style` prop (MP does not support `::placeholder`) |
| checkbox / radio / switch | Full | Full | **Drawn with view** (native components are not used, unifying the lh visual language) |
| form / form-item | Full | Full | Validation logic lives in core pure functions, with zero platform dependencies |
| select | Full | Degraded | root-portal + two-frame measurement positioning; **keyboard navigation is H5-only**, MP relies on taps + scroll-view |
| dialog | Full | Degraded | root-portal; **focus-trap / lockScroll are H5-only**, MP falls back to mask interception |
| tooltip | Full | Degraded | Two-frame measurement positioning; **no hover**, the MP target is triggered by tap / touch |
| message / loading | Full | Full | Mount-point pattern (the Mini Program has no document, so DOM cannot be created via JS) |

## Specific WeChat Mini Program limitations and alternatives

| Limitation | Alternative |
| --- | --- |
| The `<svg>` tag is not supported | Icons are converted at build time to an iconfont font (base64 embedded), rendered via `<text class="lh-iconfont">` |
| `::placeholder` is not supported | The `placeholder-style` / `placeholder-class` props of input |
| `*` wildcards / attribute selectors / `:not()` / `:nth-*` are not supported | Build-time sanitization: `*` wildcards are mapped to flex + gap, the rest are replaced with equivalent class names |
| No `document` / `document.body` | Overlays go through `root-portal`; imperative services use the mount-point pattern |
| No keyboard focus semantics | focus-trap / keyboard navigation are not called under the `LH_IS_H5` guard; aria attributes are still emitted for screen readers |
| `transitionend` is unreliable | Enter/leave animations use CSS transition + setTimeout to align durations |
| Components are not fully created at the `onLoad` stage | All ref / measurement calls must happen after `onReady` |

## WeChat base library version

- **root-portal requires base library ≥ 2.25.2** (the overlay mounting of select / dialog / tooltip depends on it).
- Lower versions automatically degrade to **in-page fixed positioning** (detected by `getLhLibVersion()`); the overlay is still present, only its stacking is constrained by the page flow.

## root-portal and targets such as DingTalk

`lh-root-portal` uses conditional compilation to split three ways: H5 uses `<teleport to="body">`, WeChat uses `<root-portal>`, and targets that do not support root-portal (such as DingTalk) use in-page fixed positioning. **This is an internal component; consumers do not need to care about it** — it is listed here only to explain the source of the platform differences in overlay behavior.
