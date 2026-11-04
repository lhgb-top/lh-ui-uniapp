# Upload 上傳

檔案選擇 + 上傳。選擇校驗（accept / maxSize / maxCount）、檔案項狀態機
（ready → uploading → success / fail）與列表補丁邏輯全部消費 `@lh-ui/share` 的
core 純函式（`normalizeUploadAccept` / `isFileRejected` /
`exceedsMaxSize` / `exceedsMaxCount` / `patchUploadFile` 等），元件層只負責
渲染、事件與平台選擇適配。上傳本身不內建 HTTP 客戶端：`request` prop 由
使用方持有，可直接用 adapter 的 `createLhUploadRequest` 產生。

## 基礎用法

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// 微信端走 uni.uploadFile、H5 端走 XHR + FormData，欄位名預設 file
// 真機需在微信後台「伺服器網域 - uploadFile」登記目標網域
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

點擊觸發區拉起原生選擇（chooseMedia / chooseImage / chooseVideo），
檔案進入列表後立即呼叫 `request` 上傳：上傳中顯示進度條，成功顯示 ✓ 與
伺服器位址，失敗顯示原因（`error` 事件附失敗檔案與原因文案）。
不傳 `request` 時只做本地選擇與校驗，檔案列表停在 `ready` 狀態，
由使用方自行處理上傳通道。

觸發區預設渲染一段提示文案（「選擇檔案」 / 拖曳模式「將檔案拖曳到此處，或點擊上傳」，
文案走 share locales 的 `upload.*` 鍵，十語言齊備）；傳入預設插槽可自訂觸發區內容。

## 多選與數量 / 大小限制

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

`multiple` 開啟底層選擇的多選；`maxCount` 達到後繼續選擇會提示
「超出數量限制」並停止追加；`maxSize` 超限的檔案被跳過並提示
「檔案超出大小限制」（預設 5MB）。兩類提示都渲染在列表下方的
錯誤文字節點（`role="alert"`）。

## accept 類型限制

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept` 收陣列 `['.png', 'image/*']` 或逗號字串 `'.png,.jpg'`。
uni 端的規則映射見下方「平台差異」：原生選擇面板只能依媒體類型過濾，
副檔名規則在面板上不生效，由選擇後的 `isFileRejected` 兜底拒絕。

## 拖曳上傳（僅 H5）

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag` 把觸發區變成拖放區（H5 端 `dragover` / `dragleave` / `drop` 生效，
拖曳放下時把真實 File 包成 `LhUniFile` 走統一流程）。小程式無 HTML5
拖放，`drag` 在 MP 端不生效，觸發區退化為點擊上傳。

## 停用

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled` 停用整個上傳：點擊觸發區與鍵盤啟用（Enter / Space，僅 H5）
均被攔截，觸發區輸出 `aria-disabled`。

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| multiple | 允許多選 | `boolean` | `false` |
| drag | 拖曳上傳區（僅 H5：MP 無 HTML5 拖放） | `boolean` | `false` |
| disabled | 停用 | `boolean` | `false` |
| accept | 允許的副檔名 / MIME：陣列 `['.png', 'image/*']` 或逗號字串 `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | 單一檔案大小上限（位元組） | `number` | `5242880`（5MB） |
| maxCount | 數量上限（0 為不限） | `number` | `0` |
| request | 上傳請求函式（不傳則只做本地選擇與校驗） | `LhUniUploadRequest` | — |
| customClass | 自訂類別名（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| change | 檔案列表變化（選擇 / 上傳完成 / 移除後觸發） | `(files: LhUploadFile[])` |
| success | 單一檔案上傳成功 | `(file: LhUploadFile)` |
| error | 單一檔案上傳失敗 | `(file: LhUploadFile, reason: string)` |
| remove | 移除某個檔案 | `(uid: string)` |

### Slots

| 名稱 | 說明 |
| --- | --- |
| default | 觸發區內容（不傳時顯示提示文案） |

### LhUploadFile

| 欄位 | 說明 | 類型 |
| --- |---| --- |
| uid | 唯一識別（內部產生） | `string` |
| name | 檔名 | `string` |
| size | 位元組大小 | `number` |
| status | 狀態 | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | 上傳進度 0-100 | `number` |
| url | 伺服器回傳位址（成功時） | `string` |
| error | 失敗原因 | `string` |

### 適配層（`@lh-ui/uniapp/src/adapter/upload`）

| 匯出 | 說明 |
| --- | --- |
| `LhUniFile` | uni 端檔案控制代碼：`{ path, name, size, type }`（path 為臨時路徑：H5 是 blob / data URL，微信端是 wxfile:// 臨時路徑） |
| `LhUniUploadRequest` | request prop 的函式簽名：收 `{ file: LhUniFile, onProgress }`，回傳 `Promise<LhUploadResult>` |
| `LhUploadResult` | 上傳結果：`{ url?, data? }`（url 缺失時 data 透傳原始回應內容自行解析） |
| `LhUploadConfig` | `createLhUploadRequest` 的設定：`{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | 產生 request 函式：小程式端走 `uni.uploadFile`，H5 端走 XHR + FormData |
| `chooseLhFiles(options)` | 統一檔案選擇（一般經元件觸發區呼叫，使用方少用） |
| `wrapLhNativeFile(file)` | H5 拖曳放下的真實 File 包成 LhUniFile |

### 無障礙

- 觸發區為 `role="button"` + `tabindex`（停用時 -1），停用時輸出 `aria-disabled`
- 上傳中的檔案項內建進度條，帶 `role="progressbar"` + `aria-valuenow`
- 失敗項顯示錯誤文案；列表下方的錯誤提示節點為 `role="alert"`
- 移除按鈕帶 `aria-label`（「移除 + 檔名」）

::: tip 平台差異（與 Vue3 版的差異）
- **檔案選擇走原生 API**：plus 用 `<input type="file">`，小程式沒有 File 與
  input；選擇統一走 adapter 的 `chooseLhFiles`（chooseMedia / chooseImage /
  chooseVideo），選擇產物是臨時檔案路徑（`LhUniFile`），不是 DOM File。
- **accept 只能映射媒體類型**：uni 的選擇 API 只認 image / video。
  `image/*`（或圖片副檔名）→ 圖片選擇，`video/*`（或影片副檔名）→ 影片
  選擇，兩者混合或不限 → chooseMedia 混合模式；副檔名規則（如 `.png`）
  無法傳給原生選擇面板，由選擇後的 `isFileRejected` 兜底校驗；非媒體
  規則（如 `.txt`）在小程式端沒有對應能力，會映射到圖片選擇再被兜底拒絕。
  chooseMedia 只在微信基礎庫 2.10+ 存在，adapter 有存在性守衛，不可用時
  回退 chooseImage / chooseVideo。
- **request 收 LhUniFile 而不是 DOM File**：`{ file: LhUniFile, onProgress }`
  中 file 是臨時檔案控制代碼；想直接用 `uni.uploadFile` 上傳時，用 adapter 的
  `createLhUploadRequest(action, config)` 產生 request（H5 端自動走 XHR +
  FormData，兩端語意對齊）。**uploadFile 的目標網域必須在微信公眾平台
  「伺服器網域」登記**，否則真機請求會被攔截；H5 端無此限制。
- **拖曳上傳僅 H5**：MP 無 HTML5 拖放，`drag` 在小程式端不生效（觸發區退化
  為點擊上傳），拖曳相關處理體由條件編譯裁剪（MP 包內無死程式碼）。
- **鍵盤啟用僅 H5**：Enter / Space 喚起選擇只在 H5 生效；小程式無鍵盤事件。
- **使用者取消靜默**：原生選擇的取消（errMsg 含 cancel）不寫錯誤提示，
  也不觸發 `error` 事件。
- **API 範圍與 plus 真源對齊**：plus 沒有的 `action` / `headers` /
  `fileList` / `before-upload` 等不新增，上傳位址等設定經 request 函式由
  使用方持有；另依本倉慣例增加 `customClass`（樣式隔離穿透）。
:::
