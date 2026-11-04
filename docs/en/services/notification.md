# Notification

Global notification service. Shows cards with a title and body in the corners of the viewport, typically for result feedback that requires the user's attention. Like Message / Loading it uses a **mount-point pattern** — the Mini Program cannot create DOM via JS, so the page must first contain the mount-point component.

## Place the mount point

Place it once on the pages that need notifications (or in a persistent root wrapper component):

```vue
<template>
  <lh-config-provider>
    <view><!-- page content --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger A missing mount point triggers a warning
If you call `useLhNotification()` but the page has no `<lh-notification />`, a `console.error` warning is emitted during development and it **does not silently degrade**. Same as Message: silent degradation would turn "the call seems to work but nothing happens" into a hidden bug.
:::

## Usage

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: 'Saved', content: 'The document has been written to the cloud' })
notification.info({ title: 'Info' })
notification.warning({ title: 'Warning' })
notification.danger({ title: 'Danger' })

// Each of the four corners is an independent container
notification.info({ title: 'Top left', position: 'top-left' })

// Does not auto close, closed manually
const handle = notification.warning({ title: 'Persistent warning', duration: 0 })
handle.close()

// close all
notification.closeAll()
```

## Methods

| Method | Description | Parameters |
| --- | --- | --- |
| (direct call) | `notification(options)` opens a notification | `(options: LhNotificationOptions)` |
| success / info / warning / danger | Opens a notification of the corresponding semantic type | `(options: LhNotificationOptions)` |
| close | Closes the notification with the given id | `(id: number)` |
| closeAll | Closes all | — |
| config | Changes the global defaults | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title (required) | `string` | — |
| content | Body content | `string` | — |
| type | Semantic type | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | Auto close after milliseconds; 0 means no auto close | `number` | `4500` |
| position | Popup position | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | Show the close button | `boolean` | `true` |
| sx | sx quick layout props | `LhSxProps` | — |
| onClick | Card click callback (makes the card render as a button) | `() => void` | — |
| onClose | Callback after closing (automatic or manual) | `() => void` | — |

::: tip The error type
`error` is an alias semantic of `danger` (share core's `LhNotificationType` includes it). The service methods expose only success / info / warning / danger, matching plus; for error call `notification({ title: '...', type: 'error' })` directly.
:::

## Global config

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| Config | Description | Default |
| --- | --- | --- |
| duration | Default auto-close duration in milliseconds; 0 means no auto close | `4500` |
| offset | Offset from the viewport edge (px) | `20` |

## Behavior

- **Four independent corner containers**: records are grouped by `position` and stack chronologically within a corner (the two bottom corners use `column-reverse`, so new notifications hug the bottom edge); the stacking gap is controlled by the style source `--lh-notification-gap` (16px by default).
- **Auto close**: removed automatically after `duration` milliseconds and `onClose` fires; `duration: 0` means persistent.
- **Card clicks**: do not close (same as plus) and only trigger `onClick`; closing goes through the close button or the auto timer only.
- **Accessibility**: corner containers get `role="region"` + `aria-live="polite"`; cards with `onClick` render as `role="button"`; the close button carries the accessible name from the locale key `notification.close` (already in the share language packs and updated on locale switch).

## Platform differences (from the Vue3 version)

- **Mount-point pattern**: plus mounts a host to `document.body` via `createApp`; the Mini Program has no `document`, so it uses a "module-level singleton store + `<lh-notification />` mount-point component per page", with the API exposed through `useLhNotification()` (plus is the callable `LhNotification` + install registration).
- **No `appendTo`**: the web build can pick a mount container; the Mini Program has no such concept — the popup position is decided by the fixed corner containers rendered by the mount-point component.
- **Degraded enter/leave animations**: plus uses `TransitionGroup` for slide-in / FLIP reflow; `transitionend` is unreliable on the Mini Program, so nodes are added/removed without animation in the first release (the transition class names remain in the style source and can be reused on H5 with a self-wrapped Transition).
- **Keyboard semantics for clickable cards are not ported**: plus adds `tabindex` and Enter/Space triggering for cards with `onClick`; the Mini Program has no DOM focus model, so only click and the `role="button"` semantics remain.
