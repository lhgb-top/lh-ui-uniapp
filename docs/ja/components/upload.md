# Upload アップロード

ファイル選択とアップロードを組み合わせたコンポーネントです。選択時の検証
（accept / maxSize / maxCount）、ファイル項目のステートマシン
（ready → uploading → success / fail）、リストの更新ロジックはすべて
`@lh-ui/share` の core 純関数（`normalizeUploadAccept` /
`isFileRejected` / `exceedsMaxSize` / `exceedsMaxCount` /
`patchUploadFile` など）を消費し、コンポーネント層は描画・イベント・
プラットフォーム別の選択適配のみを担います。HTTP クライアントは内蔵せず、
`request` prop は使用方が所有します。adapter の `createLhUploadRequest` で
直接生成できます。

## 基本的な使い方

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// ミニプログラムでは uni.uploadFile、H5 では XHR + FormData を使用。
// フィールド名はデフォルトで file。実機では WeChat の
// 「サーバードメイン - uploadFile」設定にターゲットドメインの登録が必要です。
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

トリガー領域をクリックするとネイティブの選択画面が開きます
（chooseMedia / chooseImage / chooseVideo）。ファイルがリストに入るとすぐに
`request` が実行され、アップロード中はプログレスバー、成功時は ✓ と
サーバー URL、失敗時は原因が表示されます（`error` イベントが失敗した
ファイルと理由文字列を運びます）。`request` を渡さない場合はローカルでの
選択と検証のみを行い、リストは `ready` 状態で止まります。アップロードの
経路は使用方が自身で処理してください。

トリガー領域にはデフォルトでヒントテキストが表示されます
（「ファイルを選択」、ドラッグモードでは「ここにファイルをドロップするか
クリックしてアップロード」。テキストは share locales の `upload.*` キーから
取得、10 言語に対応）。デフォルトスロットを渡すとトリガー領域の内容を
カスタマイズできます。

## 複数選択と数量 / サイズ上限

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

`multiple` はネイティブ選択側の複数選択を有効にします。`maxCount` に達すると
それ以降の選択では「数量上限を超えています」と表示されて追加を止めます。
`maxSize` を超えるファイルはスキップされ「ファイルがサイズ上限を超えています」
と表示されます（デフォルトは 5MB）。どちらのメッセージもリスト下の
エラーテキストノード（`role="alert"`）に描画されます。

## accept による型制限

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept` は配列 `['.png', 'image/*']` またはカンマ区切り文字列
`'.png,.jpg'` を受け取ります。uni 環境でのルールのマッピングは後述の
「プラットフォーム差異」を参照してください。ネイティブの選択パネルは
メディアタイプでしか絞り込めないため、拡張子ルールはパネルに渡されず、
選択後に `isFileRejected` がフォールバックとして検証します。

## ドラッグ＆ドロップ（H5 のみ）

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag` はトリガー領域をドロップゾーンにします（H5 では `dragover` /
`dragleave` / `drop` が機能し、ドロップされた File は `LhUniFile` に
ラップされて同じフローに入ります）。ミニプログラムに HTML5 ドラッグ&
ドロップはないため、MP では `drag` は機能せず、トリガー領域は
クリックによるアップロードに切り替わります。

## 無効化

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled` でアップロード全体を無効化します。トリガー領域のクリックと
キーボード操作（Enter / Space、H5 のみ）がともに抑制され、トリガー領域に
`aria-disabled` が出力されます。

## API

### Props

| 属性 | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| multiple | 複数選択を許可 | `boolean` | `false` |
| drag | ドロップゾーン（H5 のみ：MP に HTML5 ドラッグはない） | `boolean` | `false` |
| disabled | 無効化 | `boolean` | `false` |
| accept | 許可する拡張子 / MIME：配列 `['.png', 'image/*']` またはカンマ文字列 `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | 1 ファイルあたりのサイズ上限（バイト） | `number` | `5242880`（5MB） |
| maxCount | 数量上限（0 は無制限） | `number` | `0` |
| request | アップロードリクエスト関数（省略時はローカル選択と検証のみ） | `LhUniUploadRequest` | — |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

### Events

| イベント | 説明 | パラメータ |
| --- | --- | --- |
| change | ファイルリストが変化（選択 / アップロード完了 / 削除後） | `(files: LhUploadFile[])` |
| success | 1 つのファイルのアップロード成功 | `(file: LhUploadFile)` |
| error | 1 つのファイルのアップロード失敗 | `(file: LhUploadFile, reason: string)` |
| remove | ファイルが削除された | `(uid: string)` |

### Slots

| 名前 | 説明 |
| --- | --- |
| default | トリガー領域の内容（省略時はヒントテキストを表示） |

### LhUploadFile

| フィールド | 説明 | 型 |
| --- | --- | --- |
| uid | 一意識別子（内部生成） | `string` |
| name | ファイル名 | `string` |
| size | バイトサイズ | `number` |
| status | ステータス | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | アップロード進捗 0-100 | `number` |
| url | サーバー URL（成功時） | `string` |
| error | 失敗理由 | `string` |

### 適配層（`@lh-ui/uniapp/src/adapter/upload`）

| エクスポート | 説明 |
| --- | --- |
| `LhUniFile` | uni 環境のファイルハンドル：`{ path, name, size, type }`（path は一時パス：H5 では blob / data URL、WeChat では wxfile:// 一時パス） |
| `LhUniUploadRequest` | request prop の関数署名：`{ file: LhUniFile, onProgress }` を受け取り `Promise<LhUploadResult>` を返す |
| `LhUploadResult` | アップロード結果：`{ url?, data? }`（url が欠落している場合は data が生レスポンスを透過し、使用側で解析する） |
| `LhUploadConfig` | `createLhUploadRequest` の設定：`{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | リクエスト関数を生成：ミニプログラムでは `uni.uploadFile`、H5 では XHR + FormData |
| `chooseLhFiles(options)` | 統一的なファイル選択（通常はトリガー領域経由で呼ばれ、使用方が直接呼ぶことは少ない） |
| `wrapLhNativeFile(file)` | H5 でドロップされた File を `LhUniFile` にラップ |

### アクセシビリティ

- トリガー領域は `role="button"` + `tabindex`（無効時は -1）で、無効時に
  `aria-disabled` を公開
- アップロード中の項目には `role="progressbar"` + `aria-valuenow` を持つ
  プログレスバーが内蔵
- 失敗した項目はエラーテキストを表示。リスト下のエラーメッセージは
  `role="alert"`
- 削除ボタンには `aria-label`（「削除 + ファイル名」）が付く

::: tip プラットフォーム差異（Vue3 版との差異）
- **ファイル選択はネイティブ API 経由**：Vue3 版は `<input type="file">` を
  使いますが、ミニプログラムに File や input はありません。選択は adapter の
  `chooseLhFiles`（chooseMedia / chooseImage / chooseVideo）に統一され、
  その結果は一時ファイルパス（`LhUniFile`）で、DOM File ではありません。
- **accept はメディアタイプにしかマップできない**：uni の選択 API は
  image / video しか解釈しません。`image/*`（または画像拡張子）→ 画像選択、
  `video/*`（または動画拡張子）→ 動画選択、両方の混在または指定なし →
  chooseMedia の混合モード。拡張子ルール（`.png` など）はネイティブの選択
  パネルに渡せないため、選択後に `isFileRejected` がフォールバックとして
  検証します。非メディアルール（`.txt` など）に該当する能力はミニプログラムに
  なく、画像選択にマップされたうえでフォールバック検証で拒否されます。
  chooseMedia は WeChat ベースライブラリ 2.10+ にのみ存在し、adapter には
  存在確認のガードがあり、利用できない場合は chooseImage / chooseVideo に
  フォールバックします。
- **request は DOM File ではなく LhUniFile を受け取る**：
  `{ file: LhUniFile, onProgress }` の file は一時ファイルハンドルです。
  `uni.uploadFile` で直接アップロードしたい場合は、adapter の
  `createLhUploadRequest(action, config)` で request を生成してください
  （H5 では自動的に XHR + FormData を使用し、両端のセマンティクスを合わせる）。
  **uploadFile のターゲットドメインは WeChat 公式アカウントの
  「サーバードメイン」設定に登録必須**です。登録しないと実機のリクエストが
  ブロックされます。H5 にはこの制限はありません。
- **ドラッグ＆ドロップは H5 のみ**：ミニプログラムに HTML5 ドラッグはないため、
  MP では `drag` は機能しません（トリガー領域はクリックによるアップロードに
  切り替わる）。ドラッグ関連のハンドラは条件付きコンパイルで削除され、
  MP バンドルにデッドコードは残りません。
- **キーボード操作は H5 のみ**：Enter / Space で選択画面を開くのは H5 のみ。
  ミニプログラムにキーボードイベントはありません。
- **選択のキャンセルはサイレント**：ネイティブ選択のキャンセル
  （errMsg に cancel を含む）はエラーメッセージを書き込まず、`error`
  イベントも発火しません。
- **API 範囲は plus ソースに厳密に合わせる**：plus にない `action` /
  `headers` / `fileList` / `before-upload` などは追加せず、アップロード先は
  request 関数として使用方が保持します。本パッケージの慣例により
  `customClass`（スタイル隔離のパススルー）を追加しています。
:::
