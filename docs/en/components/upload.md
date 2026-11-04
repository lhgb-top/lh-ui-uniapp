# Upload

File picking plus upload. Selection validation (accept / maxSize / maxCount), the file
status machine (ready → uploading → success / fail) and the list patching logic are
consumed entirely from the `@lh-ui/share` core pure functions (`normalizeUploadAccept` /
`isFileRejected` / `exceedsMaxSize` / `exceedsMaxCount` / `patchUploadFile` and friends);
the component layer only handles rendering, events and the platform picking adapter.
No HTTP client is built in: the `request` prop is owned by the consumer and can be
generated with the adapter's `createLhUploadRequest`.

## Basic usage

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// Mini Program: uni.uploadFile; H5: XHR + FormData; field name defaults to file.
// On a real device the target domain must be registered under WeChat's
// "Server Domain - uploadFile" settings.
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

Click the trigger area to open the native picker (chooseMedia / chooseImage /
chooseVideo). Once a file enters the list, `request` runs immediately: a progress bar
shows while uploading, a ✓ and the server URL appear on success, and the failure reason
is displayed on error (the `error` event carries the failed file and the reason string).
Without a `request` prop the component only picks and validates locally — the list stays
in the `ready` state and the consumer handles the upload channel.

The trigger area renders a hint by default ("Select file", or "Drop files here or click
to upload" in drag mode; the copy comes from share locale keys `upload.*`, available in
ten languages). Pass the default slot to customize the trigger content.

## Multiple selection and count / size limits

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

`multiple` enables multi-selection in the native picker; once `maxCount` is reached,
further picks show "Exceeds the count limit" and stop appending; files beyond `maxSize`
are skipped with "File exceeds the size limit" (5MB by default). Both messages render in
the error text node below the list (`role="alert"`).

## accept type filtering

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept` takes an array `['.png', 'image/*']` or a comma-separated string `'.png,.jpg'`.
See "Platform differences" below for how rules map on the uni side: the native picker
panel can only filter by media type, so extension rules do not reach the panel and are
enforced afterwards by `isFileRejected` as a fallback.

## Drag and drop (H5 only)

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag` turns the trigger area into a drop zone (`dragover` / `dragleave` / `drop` work on
H5; dropped Files are wrapped into `LhUniFile` and go through the same flow). The Mini
Program has no HTML5 drag and drop, so `drag` has no effect there and the trigger area
degrades to click-to-upload.

## Disabled

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled` turns the whole upload off: clicks on the trigger area and keyboard activation
(Enter / Space, H5 only) are both suppressed, and the trigger area exposes `aria-disabled`.

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| multiple | Allow multi-selection | `boolean` | `false` |
| drag | Drop zone (H5 only: no HTML5 drag and drop on MP) | `boolean` | `false` |
| disabled | Disable | `boolean` | `false` |
| accept | Allowed extensions / MIME: array `['.png', 'image/*']` or comma string `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | Per-file size limit in bytes | `number` | `5242880` (5MB) |
| maxCount | Count limit (0 = unlimited) | `number` | `0` |
| request | Upload request function (omit to only pick and validate locally) | `LhUniUploadRequest` | — |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | The file list changed (after pick / upload completes / remove) | `(files: LhUploadFile[])` |
| success | A single file uploaded successfully | `(file: LhUploadFile)` |
| error | A single file failed to upload | `(file: LhUploadFile, reason: string)` |
| remove | A file was removed | `(uid: string)` |

### Slots

| Name | Description |
| --- | --- |
| default | Trigger area content (falls back to the hint text) |

### LhUploadFile

| Field | Description | Type |
| --- | --- | --- |
| uid | Unique id (generated internally) | `string` |
| name | File name | `string` |
| size | Size in bytes | `number` |
| status | Status | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | Upload progress 0-100 | `number` |
| url | Server URL (on success) | `string` |
| error | Failure reason | `string` |

### Adapter (`@lh-ui/uniapp/src/adapter/upload`)

| Export | Description |
| --- | --- |
| `LhUniFile` | uni-side file handle: `{ path, name, size, type }` (path is a temp path: a blob / data URL on H5, a wxfile:// temp path on WeChat) |
| `LhUniUploadRequest` | Signature of the request prop: takes `{ file: LhUniFile, onProgress }` and returns `Promise<LhUploadResult>` |
| `LhUploadResult` | Upload result: `{ url?, data? }` (when url is missing, data carries the raw response body for you to parse) |
| `LhUploadConfig` | Configuration for `createLhUploadRequest`: `{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | Builds a request function: `uni.uploadFile` on the Mini Program, XHR + FormData on H5 |
| `chooseLhFiles(options)` | Unified file picking (usually invoked via the trigger area; rarely needed by consumers) |
| `wrapLhNativeFile(file)` | Wraps a real File dropped on H5 into an `LhUniFile` |

### Accessibility

- The trigger area is `role="button"` with a `tabindex` (-1 when disabled) and exposes
  `aria-disabled` when disabled
- Uploading items carry a progress bar with `role="progressbar"` + `aria-valuenow`
- Failed items show their error text; the error message below the list is `role="alert"`
- The remove button carries an `aria-label` ("Remove" + file name)

::: tip Platform differences (differences from the Vue3 version)
- **File picking goes through native APIs**: the Vue3 version uses `<input type="file">`,
  but the Mini Program has no File or input. Picking is unified through the adapter's
  `chooseLhFiles` (chooseMedia / chooseImage / chooseVideo), and the result is a temp
  file path (`LhUniFile`), not a DOM File.
- **accept can only map to media types**: the uni picking APIs only understand image /
  video. `image/*` (or image extensions) → image picking, `video/*` (or video
  extensions) → video picking, a mix of both or no rule → chooseMedia mixed mode.
  Extension rules (such as `.png`) cannot be handed to the native picker panel, so they
  are enforced afterwards by `isFileRejected`; non-media rules (such as `.txt`) have no
  Mini Program counterpart — they map to image picking and are then rejected by the
  fallback check. chooseMedia only exists on WeChat base library 2.10+; the adapter has
  an existence guard and falls back to chooseImage / chooseVideo when unavailable.
- **request receives an LhUniFile, not a DOM File**: the `file` in
  `{ file: LhUniFile, onProgress }` is a temp file handle. To upload straight through
  `uni.uploadFile`, build the request with the adapter's
  `createLhUploadRequest(action, config)` (H5 automatically uses XHR + FormData, keeping
  both targets aligned). **The uploadFile target domain must be registered under the
  WeChat Official Account "Server Domain" settings**, otherwise real-device requests are
  blocked; H5 has no such restriction.
- **Drag and drop is H5-only**: the Mini Program has no HTML5 drag and drop, so `drag`
  has no effect there (the trigger area degrades to click-to-upload). The drag handlers
  are stripped by conditional compilation (no dead code in the MP bundle).
- **Keyboard activation is H5-only**: Enter / Space open the picker on H5 only; the Mini
  Program has no keyboard events.
- **Picker cancellation is silent**: cancelling the native picker (errMsg containing
  cancel) writes no error message and fires no `error` event.
- **The API scope stays aligned with the Vue3 source**: capabilities the Vue3 version
  lacks — `action` / `headers` / `fileList` / `before-upload` — were not added; the
  upload endpoint and similar configuration live in the request function owned by the
  consumer. `customClass` (style isolation passthrough) is added per this package's
  conventions.
:::
