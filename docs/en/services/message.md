# Message

Global message prompt service. **Uses a mount-point pattern** — the Mini Program cannot create DOM via JS, so the page must first contain the mount-point component.

## Place the mount point

Place it once on the pages that need message prompts (or in a persistent root wrapper component):

```vue
<template>
  <lh-config-provider>
    <view><!-- page content --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## Usage

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('Saved successfully')
message.info('Info message')
message.warning('Warning message')
message.danger('Error message')
message.error('Error message (alias of danger)')

// A loading prompt that does not auto close (duration: 0), closed manually
const handle = message.loading('Loading...')
// ...after the async work is done
handle.close()

// close all
message.closeAll()
```

::: danger A missing mount point triggers a warning
If you call `useLhMessage()` but the page has no `<lh-message />`, a `console.error` warning is emitted during development and it **does not silently degrade**. This is intentional: silent degradation would turn "the call seems to work but nothing happens" into a hidden bug.
:::

## Methods

| Method | Description | Parameters |
| --- | --- | --- |
| (direct call) | `message('xxx')` is equivalent to `message.info('xxx')` | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | Shows a message of the corresponding type | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | Shows a loading prompt that does not auto close (`duration: 0`); returns a handle for manual closing | Same as above |
| close | Closes the message with the given id | `(id: number)` |
| closeAll | Closes all | — |

## LhMessageOptions

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Text (required) | `string` | — |
| type | Type | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | Display duration (milliseconds); 0 means no auto close | `number` | `3000` |
| showClose | Show the close button | `boolean` | `false` |
| offset | Offset from the top (px) | `number` | — |
| onClose | Close callback | `() => void` | — |

## Global config

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| Config | Description | Default |
| --- | --- | --- |
| duration | Default display duration (milliseconds) | `3000` |
| max | Maximum number of simultaneous messages | — |
| offset | Offset from the top | — |

::: tip Differences from the Vue3 version
- **No `appendTo`**: the web build mounts to `document.body`, a concept that does not exist on the Mini Program; the mount position is determined by where `<lh-message />` sits in the page.
- Enter/leave animations use CSS transition + setTimeout to align durations (`transitionend` is unreliable on the Mini Program).
- The notification component (Notification) is absent from the first release; use Message as an alternative.
:::
