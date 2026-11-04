# Drawer ドロワー

画面の端からスライドインするパネルで、Dialog より広い幅を使いたい一時的な操作（詳細、絞り込み、ウィザードのステップなど）に適します。Dialog と同様に `role="dialog"` + `aria-modal="true"` を持ち、マスククリックと Esc（H5）で閉じられます。

## 基本的な使い方

```vue
<template>
  <lh-button @click="visible = true">ドロワーを開く</lh-button>

  <lh-drawer v-model="visible" title="注文詳細">
    <view>ここにドロワーの本文を置きます。</view>
    <view>パネルの幅は size で制御し、既定はビューポート幅の 30% です。</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 4 方向

`direction` は `right`（既定）/ `left` / `top` / `bottom` を受け付け、パネルは対応する端からスライドインします。

```vue
<template>
  <!-- 右ドロワーを開く -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- 左ドロワーを開く -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- 上ドロワーを開く -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- 下ドロワーを開く -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- 指定方向にスライドアウト -->
  <lh-drawer v-model="dirVisible" :title="`${direction} ドロワー`" :direction="direction" size="40%">
    <view>現在の方向：{{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## サイズのカスタマイズ

`size` は数値なら px、文字列ならパーセント指定に対応します（例：`'40%'`）。左右方向は幅に、上下方向は高さに反映されます。

```vue
<template>
  <!-- 幅 480px のドロワーを開く -->
  <lh-button @click="sized = true">幅 480px のドロワー</lh-button>

  <!-- 固定サイズのドロワー、下部は操作領域 -->
  <lh-drawer v-model="sized" title="絞り込み条件" :size="480">
    <view>名前やタグでデータを絞り込みます。</view>
    <template #footer>
      <lh-button @click="sized = false">キャンセル</lh-button>
      <lh-button type="primary" @click="sized = false">絞り込みを適用</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## 挙動の切り替え

`mask-closable` はマスククリックでの閉じ、`show-close` は右上の閉じるボタン、`close-on-esc` は Esc での閉じ（H5 のみ）、`lock-scroll` は開いている間の本文スクロール固定（H5 のみ）を制御します。

```vue
<template>
  <!-- 「ボタンでのみ閉じる」ドロワーを開く -->
  <lh-button @click="locked = true">ボタンでのみ閉じる</lh-button>

  <!-- マスククリックも Esc も閉じない。ボタンでのみ閉じられる -->
  <lh-drawer
    v-model="locked"
    title="ボタンでのみ閉じる"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>マスククリックでも Esc（H5）でも閉じません。</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">閉じる</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| プロパティ | 説明 | 型 | 既定値 |
| --- | --- | --- | --- |
| modelValue (v-model) | 表示するか | `boolean` | `false` |
| title | タイトル（header スロットでも可） | `string` | — |
| direction | 方向 | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | サイズ：数値は px、文字列はパーセント対応 | `string \| number` | `'30%'` |
| maskClosable | マスククリックで閉じるか | `boolean` | `true` |
| showClose | 閉じるボタンを表示するか | `boolean` | `true` |
| lockScroll | 開いている間、本文スクロールを固定（**H5 のみ有効**） | `boolean` | `true` |
| closeOnEsc | Esc で閉じるか（**H5 のみ有効**） | `boolean` | `true` |
| customClass | カスタムクラス名（ルートノードへ透過） | `string` | — |
| themeVars | コンポーネント単位のテーマ変数 | `Record<string, string>` | — |
| bgPattern | コンポーネント単位の背景パターン。ConfigProvider の設定を上書き | `string` | — |
| sx | sx クイックレイアウト属性（パネルに適用） | `LhSxProps` | — |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| update:modelValue | 表示状態が変化（アニメーション終了後に発火） | `(visible: boolean)` |
| open | 開いた | — |
| close | 閉じた（アニメーション終了後に発火） | — |

### Slots

| スロット | 説明 |
| --- | --- |
| default | 本文コンテンツ |
| header | ヘッダーのタイトル領域をカスタム（title 文を置き換え） |
| footer | フッターの操作領域 |

### Methods

| メソッド | 説明 |
| --- | --- |
| open | プログラムで開く |
| close | プログラムで閉じる |

### アクセシビリティ

- ルートノードは `role="dialog"` + `aria-modal="true"`。タイトルがあれば `aria-labelledby` で関連付け、なければ言語パックの `drawer.title` を `aria-label` のフォールバックに使用
- マスクは装飾ノード（`aria-hidden="true"`）
- 閉じるボタンは `role="button"` と言語パック `drawer.close` の `aria-label` を持つ
- Esc で閉じる（`close-on-esc` で無効化可能、H5 のみ）

::: tip プラットフォーム差異（Vue3 版との差異）
- **オーバーレイの実体**：`teleportTarget` prop なし——ミニプログラムに DOM teleport はなく、オーバーレイは `root-portal` で担います（H5 は teleport）。**WeChat の `root-portal` はベースライブラリ ≥ 2.25.2 が必要**で、旧バージョンは自動的にページ内 `fixed` にフォールバックします（ページノードツリーからは外れませんが、階層は自動増分 z-index が保証するため機能に影響ありません）。
- **開閉トランジション**：plus は `<Transition name="lh-drawer-fade">` でスライドアニメーションを駆動しますが、ミニプログラムには `<Transition>` コンポーネントがなく `transitionend` イベントも信頼できないため、本ポートは Vue Transition のクラス付与シーケンスを手動で再現し（開始状態を 1 フレーム後に除去 → アクティブ状態 → 終了時にアンマウント）、share SCSS の 300ms transition 時長を `setTimeout` で整合させています——マスクのフェード + パネルの方向別スライドは両端で同じ見た目になります。
- **フォーカストラップ（focus-trap）はキーボードフォーカスの意味論が H5 のみで、本ポートでは未対応**：plus は開いている間 Tab フォーカスをパネル内に閉じ込めますが、ミニプログラムにはキーボードフォーカスの意味論がなく（share の shouldDrawerTrapFocus は LH_IS_H5 のコンパイル時ガードで短絡）、Dialog と同様に share の focus-trap を呼びません。Esc での閉じのみ保持します。
- **lockScroll は H5 のみ有効**：ミニプログラムには body スクロール固定の手段がなく、フルスクリーンマスクがクリックを拾う形で代替します。
- **closeOnEsc は H5 のみ有効**：Esc はドキュメントレベルのキーボードリスナーで、複数オーバーレイが重なっているときは最上面のみ応答します。ミニプログラムにキーボードイベントはなく、全体が条件付きコンパイルで除去されます。
- **teleportTarget は未実装**：select / tooltip / dropdown の先例に合わせます（ミニプログラムに DOM teleport はない）。
- **下ドロワーのセーフエリア**：`direction="bottom"` のときパネルは自動で `env(safe-area-inset-bottom)` の内側余白を持ち、フルスクリーン端末に対応します（uni-app 固有の調整で、share のスタイルソースにはない端末特化です）。
:::
