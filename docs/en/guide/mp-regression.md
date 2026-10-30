# WeChat Mini Program Manual Regression Checklist

> For consumers (or maintainers) to walk through in the WeChat DevTools. The build smoke test only guarantees valid WXSS and a successful compile; **behavioral correctness must be regressed manually** — vitest runs H5 semantics, and the event and rendering differences of the MP target cannot be covered by it.
>
> Build: `pnpm dev:mp-weixin` (or `pnpm build:mp-weixin`); the output is in `dist/dev/mp-weixin` (or `dist/build/mp-weixin`). Open that directory in the WeChat DevTools.
>
> Prerequisite: WeChat base library **≥ 2.25.2** (root-portal depends on it; lower versions take the in-page fixed degradation branch — if you specifically want to verify the degradation path, set the base library below 2.25.2 and run the three "overlay" items again).

## Common baseline (check on every page)

| # | Item | Pass criteria |
| --- | --- | --- |
| G1 | Open | The page renders without a white screen and without a "component not registered" error |
| G2 | Dark mode | Switch to dark mode at the entry; all component colors on the page follow (not just the background) |
| G3 | Chinese / English | Switch the language at the entry; in-component copy (such as form validation messages and button text) follows the switch |
| G4 | Console | No `console.error` throughout (in particular, the "no mount point" warning of message/loading should not appear) |

## Component checklist

| Page path | Component | Key interactions (beyond the common baseline) |
| --- | --- | --- |
| `pages/button/button` | button | Tap shows a press state; loading / disabled / plain / round / circle / block all render; the iconfont of icon buttons renders correctly |
| `pages/icon/icon` | icon | All 37 icons render (not blank squares); size / color take effect; the loading icon spins |
| `pages/tag/tag` | tag | Each type has the correct color; round / hit toggle; closable triggers a close on tap and the callback fires |
| `pages/input/input` | input | v-model is two-way; placeholder styling via `placeholder-style` takes effect (**do not check `::placeholder`**); textarea auto-sizes in height; word counter; clearable clears; the error state turns the border red |
| `pages/switch/switch` | switch | Tapping toggles with a thumb animation; loading / disabled do not respond to taps; activeText/inactiveText are displayed |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | A single tap checks the box; multiple selections inside a group do not interfere with each other; disabled items do not respond; indeterminate shows the half-selected state |
| `pages/radio/radio` | radio / radio-group | Options are mutually exclusive (tapping another cancels the previous); disabled items do not respond |
| `pages/form/form` | form / form-item | blur / input triggers validation; error text is displayed properly by `<text>`; the Promise returned by `validate()` resolves correctly inside the "submit" button; the required asterisk is displayed |
| `pages/select/select` | select | Tapping opens the listbox (**root-portal, stacked above the mask**); tapping an option selects it and closes; clearable clears; the in-overlay input of filterable is usable; **the absence of keyboard navigation is normal** (removed on MP) |
| `pages/tooltip/tooltip` | tooltip | Tapping the trigger opens the bubble; the position matches the placement (positioned after two-frame measurement — **no flicker or misplacement should be seen on the first frame**); tapping outside closes; trigger="hover" having no effect on MP should be treated as normal |
| `pages/dialog/dialog` | dialog | Opening shows a mask and a transition; tapping the mask closes per `closeOnClick-modal`; the bottom positioning honors `safe-area-inset-bottom` on full-screen devices; **Esc and lockScroll being no-ops on MP is normal**; the full-screen mode fills the viewport |
| `pages/services/services` | message / loading | See the next section |

## message / loading specifics

| # | Item | Pass criteria |
| --- | --- | --- |
| S1 | All message types | success / info / warning / danger / loading show; the icon and color of each are correct |
| S2 | Auto close | Disappears after 3 seconds by default, with a leave transition (**not instantaneous**) |
| S3 | Manual close | The loading type does not auto close; it disappears only after `handle.close()` |
| S4 | Stacking of multiple | Successive calls stack vertically without overlapping; once the max count is exceeded the oldest ones are pushed out |
| S5 | Full-screen mask | loading.show shows a full-screen mask; the layer below is not clickable while the mask is up |
| S6 | Close callback | The onClose callback fires when the message disappears |
| S7 | Unmounted warning | (Verify specifically: remove `<lh-message />` from the page, then call) The console should emit a clear `console.error` warning, **not silent** |

## Known MP-target "non-defects" (do not report these as bugs if you hit them)

- select / dialog / tooltip have **no keyboard navigation / Esc / focus-trap / lockScroll** — removed at compile time; see [Platform Support](/en/guide/platform).
- tooltip's `trigger="hover"` does not trigger on the MP target — there is no hover semantics; use click.
- message / loading require a mount point first; this is by design, not a bug.
- icon is font-rendered; `fill` / `stroke` have no effect in CSS — only `color` works.

## Recording regression results

Add a "pass / fail (observed)" column to the right of the tables. For failing items, first attach screenshots of the DevTools Console and the WXML panel, then compare against the platform capability matrix in `docs/uniapp/uniapp组件库计划.md` to judge whether it is an "expected degradation" or a real defect.
