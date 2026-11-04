# Upload 上传

文件选择 + 上传。选择校验（accept / maxSize / maxCount）、文件项状态机
（ready → uploading → success / fail）与列表补丁逻辑全部消费 `@lh-ui/share`
的 core 纯函数（`normalizeUploadAccept` / `isFileRejected` /
`exceedsMaxSize` / `exceedsMaxCount` / `patchUploadFile` 等），组件层只负责
渲染、事件与平台选择适配。上传本身不内置 HTTP 客户端：`request` prop 由
使用方持有，可直接用 adapter 的 `createLhUploadRequest` 生成。

## 基础用法

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// 微信端走 uni.uploadFile、H5 端走 XHR + FormData，字段名默认 file
// 真机需在微信后台「服务器域名 - uploadFile」登记目标域名
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

点击触发区拉起原生选择（chooseMedia / chooseImage / chooseVideo），
文件进入列表后立即调 `request` 上传：上传中显示进度条，成功显示 ✓ 与
服务端地址，失败显示原因（`error` 事件附失败文件与原因文案）。
不传 `request` 时只做本地选择与校验，文件列表停在 `ready` 状态，
由使用方自行处理上传通道。

触发区默认渲染一段提示文案（「选择文件」 / 拖拽模式「将文件拖到此处，或点击上传」，
文案走 share locales 的 `upload.*` 键，十语言齐备）；传默认插槽可自定义触发区内容。

## 多选与数量 / 大小限制

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

`multiple` 开启底层选择的多选；`maxCount` 达到后继续选择会提示
「超出数量限制」并停止追加；`maxSize` 超限的文件被跳过并提示
「文件超出大小限制」（默认 5MB）。两类提示都渲染在列表下方的
错误文本节点（`role="alert"`）。

## accept 类型限制

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept` 收数组 `['.png', 'image/*']` 或逗号字符串 `'.png,.jpg'`。
uni 端的规则映射见下方「平台差异」：原生选择面板只能按媒体类型过滤，
扩展名规则在面板上不生效，由选择后的 `isFileRejected` 兜底拒绝。

## 拖拽上传（仅 H5）

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag` 把触发区变成拖放区（H5 端 `dragover` / `dragleave` / `drop` 生效，
拖拽落下时把真实 File 包成 `LhUniFile` 走统一流程）。小程序无 HTML5
拖放，`drag` 在 MP 端不生效，触发区退化为点击上传。

## 禁用

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled` 禁用整个上传：点击触发区与键盘激活（Enter / Space，仅 H5）
均被拦截，触发区输出 `aria-disabled`。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| multiple | 允许多选 | `boolean` | `false` |
| drag | 拖拽上传区（仅 H5：MP 无 HTML5 拖放） | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| accept | 允许的扩展名 / MIME：数组 `['.png', 'image/*']` 或逗号字符串 `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | 单个文件大小上限（字节） | `number` | `5242880`（5MB） |
| maxCount | 数量上限（0 为不限） | `number` | `0` |
| request | 上传请求函数（不传则只做本地选择与校验） | `LhUniUploadRequest` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| change | 文件列表变化（选择 / 上传完成 / 移除后触发） | `(files: LhUploadFile[])` |
| success | 单个文件上传成功 | `(file: LhUploadFile)` |
| error | 单个文件上传失败 | `(file: LhUploadFile, reason: string)` |
| remove | 移除某个文件 | `(uid: string)` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发区内容（不传时显示提示文案） |

### LhUploadFile

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| uid | 唯一标识（内部生成） | `string` |
| name | 文件名 | `string` |
| size | 字节大小 | `number` |
| status | 状态 | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | 上传进度 0-100 | `number` |
| url | 服务端返回地址（成功时） | `string` |
| error | 失败原因 | `string` |

### 适配层（`@lh-ui/uniapp/src/adapter/upload`）

| 导出 | 说明 |
| --- | --- |
| `LhUniFile` | uni 端文件句柄：`{ path, name, size, type }`（path 为临时路径：H5 是 blob / data URL，微信端是 wxfile:// 临时路径） |
| `LhUniUploadRequest` | request prop 的函数签名：收 `{ file: LhUniFile, onProgress }`，返回 `Promise<LhUploadResult>` |
| `LhUploadResult` | 上传结果：`{ url?, data? }`（url 缺失时 data 透传原始响应体自行解析） |
| `LhUploadConfig` | `createLhUploadRequest` 的配置：`{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | 生成 request 函数：小程序端走 `uni.uploadFile`，H5 端走 XHR + FormData |
| `chooseLhFiles(options)` | 统一文件选择（一般经组件触发区调用，使用方少用） |
| `wrapLhNativeFile(file)` | H5 拖拽落下的真实 File 包成 LhUniFile |

### 无障碍

- 触发区为 `role="button"` + `tabindex`（禁用时 -1），禁用时输出 `aria-disabled`
- 上传中的文件项内置进度条，带 `role="progressbar"` + `aria-valuenow`
- 失败项显示错误文案；列表下方的错误提示节点为 `role="alert"`
- 移除按钮带 `aria-label`（「移除 + 文件名」）

::: tip 平台差异（与 Vue3 版的差异）
- **文件选择走原生 API**：plus 用 `<input type="file">`，小程序没有 File 与
  input；选择统一走 adapter 的 `chooseLhFiles`（chooseMedia / chooseImage /
  chooseVideo），选择产物是临时文件路径（`LhUniFile`），不是 DOM File。
- **accept 只能映射媒体类型**：uni 的选择 API 只认 image / video。
  `image/*`（或图片扩展名）→ 图片选择，`video/*`（或视频扩展名）→ 视频
  选择，两者混合或不限 → chooseMedia 混合模式；扩展名规则（如 `.png`）
  无法传给原生选择面板，由选择后的 `isFileRejected` 兜底校验；非媒体
  规则（如 `.txt`）在小程序端没有对应能力，会映射到图片选择再被兜底拒绝。
  chooseMedia 只在微信基础库 2.10+ 存在，adapter 有存在性守卫，不可用时
  回退 chooseImage / chooseVideo。
- **request 收 LhUniFile 而不是 DOM File**：`{ file: LhUniFile, onProgress }`
  中 file 是临时文件句柄；想直接用 `uni.uploadFile` 上传时，用 adapter 的
  `createLhUploadRequest(action, config)` 生成 request（H5 端自动走 XHR +
  FormData，两端语义对齐）。**uploadFile 的目标域名必须在微信公众平台
  「服务器域名」登记**，否则真机请求会被拦截；H5 端无此限制。
- **拖拽上传仅 H5**：MP 无 HTML5 拖放，`drag` 在小程序端不生效（触发区退化
  为点击上传），拖拽相关处理体由条件编译裁剪（MP 包内无死代码）。
- **键盘激活仅 H5**：Enter / Space 唤起选择只在 H5 生效；小程序无键盘事件。
- **用户取消静默**：原生选择的取消（errMsg 含 cancel）不写错误提示，
  也不触发 `error` 事件。
- **API 范围与 plus 真源对齐**：plus 没有的 `action` / `headers` /
  `fileList` / `before-upload` 等不新增，上传地址等配置经 request 函数由
  使用方持有；另按本仓约定增加 `customClass`（样式隔离穿透）。
:::
