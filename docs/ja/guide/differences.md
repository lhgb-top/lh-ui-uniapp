# Vue3 版との API 差異

本ライブラリは `@lh-ui/vue3`（plus）と `@lh-ui/share` の core 純関数を共有しており、**Props の命名とイベントの命名はほぼ一致**しています。
以下は uni-app のターゲットプラットフォームに由来する必然的な差異です。記載のない API の挙動は Vue3 版と同じです。

## icon：インライン SVG ではなくフォントレンダリング

| | Vue3 版（plus） | 本ライブラリ |
| --- | --- | --- |
| レンダリング方式 | インライン `<svg><path>` | `<text class="lh-iconfont lh-iconfont--<name>">` |
| 色 | `currentColor`（親の color を継承） | 明示的な `color` prop / 親の color（CSS のフォント色、セマンティクスは等価） |
| サイズ | `size` prop | `size` prop（font-size を設定） |

ミニプログラムは `<svg>` タグに対応していないため、アイコンはビルド時に share の SVG path 集合から iconfont フォントへ変換されます
（base64 を `iconfont.css` に埋め込み、37 個のアイコン、24×24 単色）。見た目は同じ字形ですが、本質はフォントなので、
CSS では `fill` / `stroke` を**使用できず**、`color` のみ使用できます。

## input：プレースホルダースタイルは prop 経由

MP は `::placeholder` 疑似要素に対応していません。プレースホルダースタイルは prop で指定してください：

```vue
<lh-input placeholder="入力してください" placeholder-style="color: #999" />
```

| prop | 説明 |
| --- | --- |
| `placeholder-style` | プレースホルダーテキストのインラインスタイル文字列 |
| `placeholder-class` | プレースホルダーテキストのクラス名（style といずれか一方） |

その他の API（`v-model`、`maxlength`、文字数カウント `show-word-limit`、`type`）は Vue3 版と同じです。

## select / dialog / tooltip：デスクトップ級の機能は H5 のみ

| 機能 | H5 | WeChat ミニプログラム |
| --- | --- | --- |
| キーボードナビゲーション（方向キー / Enter / Esc） | ✅ | ❌ コンパイル期に削除 |
| focus-trap（ダイアログのフォーカス巡回） | ✅ | ❌ コンパイル期に呼び出されない |
| lockScroll（背景スクロールのロック） | ✅ | ❌（オーバーレイによる遮断でフォールバック） |
| hover トリガー（tooltip） | ✅ | ❌、click / touchstart に変更 |

**tooltip の `trigger`**：`'click' | 'hover'` は引き続きサポートしますが、ミニプログラムでは `hover` にセマンティクスがありません。
ミニプログラム端では `trigger="click"`（またはデフォルト値）を使い、タップ / タッチでトリガーしてください。

**select のイベント**は変わりません（`update:modelValue` / `change` / `visible-change`）。
ただし「クリア」「選択」は MP 端では listbox の項目をタップする方法しかなく、キーボードの経路はありません。

## message / loading：マウントポイントパターン

これが**最大の使い方の違い**です。Vue3 版は `createApp + document.body への mount` で、
呼び出すだけで表示されます。ミニプログラムには document がないため、**先にマウントポイントコンポーネントを置く**必要があります：

```vue
<!-- ページに 1 回置く -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: '読み込み中...' })
// ...
loading.close()
```

詳細は [インストール - 命令的サービスにはマウントポイントが必要](/ja/guide/installation#命令的サービスにはマウントポイントが必要) を参照してください。

::: tip Notification コンポーネントは初版では未実装
Vue3 版には `lh-notification` がありますが、本ライブラリの初版では**実装しません**（ミニプログラム端では価値が低く、通知は通常システム機能に任せるため）。
通知系のプロンプトが必要な場合は `lh-message` で代替してください。
:::

## config-provider：ダークは document ではなくクラス名

| | Vue3 版 | 本ライブラリ |
| --- | --- | --- |
| ダークの切り替え | `document.documentElement` を操作して class を追加 | ラップするノードに `dark` クラスを追加（ミニプログラムに document はない） |
| `theme` prop | `'light' \| 'dark'` | 同じ（内部実装は異なる） |

使い方は変わりません。どちらも `<lh-config-provider :theme="dark">` です。本ライブラリの `theme/index.css` では
ダーク変数が `page.dark, .dark` に付与されるため、ダークのスコープは ConfigProvider がラップするノードに従います。

## 単位：px をそのまま出力

本ライブラリは **px→rpx 変換を行いません**。スタイルソースは px 基準のそのまま出力です。これは wot-design-uni / uview-plus /
uni-ui / TDesign など主要な uni コンポーネントライブラリと同じです（uni 公式のコンパイルも px→rpx を自動変換しません）。
プロジェクトに `postcss-px-to-rpx` などのプラグインを設定している場合、本ライブラリの成果物も一緒に変換されるため、特別な対応は不要です。

## コンポーネント SFC が自前で持つミニプログラムオプション

各コンポーネントの SFC は次のように宣言しています：

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` —— コンポーネントが余分なラップノードを生成しないため、custom-class / customStyle が対象要素に届きます。
- `addGlobalClass: true` —— コンポーネント内でグローバルスタイル（`app.wxss` / ページスタイル）を使用できます。
- `styleIsolation: 'shared'` —— スタイル分離が共有モードになり、コンポーネントスタイルとページスタイルが相互に可視になります。

**利用者は pages.json やプロジェクトでこれら 3 項目を追加設定する必要はありません** —— すでにコンポーネント自身の json で宣言されています。
コンポーネントのスタイルが異常な場合（クラス名はすべてあるのにスタイルが効かない）、まずプロジェクトの `styleIsolation` 上書き設定がコンポーネントレベルの宣言を上書きしていないか確認してください。
