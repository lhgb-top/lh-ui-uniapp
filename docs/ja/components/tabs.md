# Tabs タブ

同一エリア内でタブペインを切り替えます。タブヘッダーは横スクロール、カード外観、クローズ・追加に対応します。

## 基本的な使い方

`v-model` でアクティブペインの `name` をバインドします。未指定時は最初の利用可能ペインをアクティブにします。

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="水墨"
    >
      水墨：焦・濃・重・淡・清。
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="丹青"
    >
      丹青：丹砂と青雘、絵画を指します。
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="留白"
    >
      留白：白を黒として扱い、余韻を生む。
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## カード型

`type="card"` でカード外観に切り替えます。

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="春"
    >
      春：草木が芽吹く。
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="夏"
    >
      夏：万物が華実する。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## タブ位置

`tab-position="bottom"` でタブヘッダーをコンテンツの下に配置します。

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="詩"
    >
      詩：志を述べる。
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="画"
    >
      画：意を写す。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 無効なタブ

`lh-tab-pane` に `disabled` を渡すとアクティブにできません（クリック無効、`modelValue` がそのペインを指す場合は最初の利用可能ペインにフォールバックします）。

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="利用可能"
    >
      最初のペインは利用可能です。
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="無効"
      disabled
    >
      このペインは無効化されており、アクティブにできません。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## クローズと追加

`closable` は各タブにクローズボタンを描画し（クリックで `tab-remove` を発生）、`addable` は追加ボタンを描画します（クリックで `tab-add` を発生）。
コンポーネントはイベントを発生するだけで、ペインノードの追加・削除は業務レイヤーが行う点は Vue3 版と同じです。

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}：ペイン内容。
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: 'タブ一' },
  { name: 'two', label: 'タブ二' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: '新規タブ' })
}
</script>
```

## Tabs Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | アクティブペインの name（v-model） | `string` | — |
| type | 外観：`'line'` 下線 / `'card'` カード | `'line' \| 'card'` | `'line'` |
| closable | タブをクローズ可能にするか | `boolean` | `false` |
| addable | 追加ボタンを表示するか | `boolean` | `false` |
| tabPosition | タブ位置：`'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | カスタムクラス名 | `string` | — |
| sx | レイアウト用ショートカット | `LhSxProps` | — |

## TabPane Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| name | ペインの一意識別子（安定キー、動的変更非推奨） | `string` | — |
| label | タブラベル | `string` | `''` |
| disabled | 無効化するか | `boolean` | `false` |
| customClass | カスタムクラス名（ペインのルートノードに適用） | `string` | — |

## Events

| Event | 説明 | コールバック引数 |
| --- | --- | --- |
| update:modelValue | アクティブペインが変化（v-model） | `(name: string)` |
| tab-change | ユーザー操作によりアクティブペインが変化 | `(name: string)` |
| tab-remove | クローズボタンがクリックされた。コンポーネント自身は子ノードを削除せず、業務レイヤーが維持する | `(name: string)` |
| tab-add | 追加ボタンがクリックされた。コンポーネント自身は子ノードを追加せず、業務レイヤーが維持する | — |

## Slots

| Slot | 説明 |
| --- | --- |
| Tabs default | ペインノード（`lh-tab-pane` のみ収集、`v-for` / `template` で囲んでもよい） |
| TabPane default | ペイン内容 |

## プラットフォームの違い

- タブヘッダーは `scroll-view` で実装します（横スクロール可能なナビゲーションバー）。WeChat ミニプログラムでは `enable-flex` によりスクロールコンテナを flex レイアウトにし、タブは縮小も折り返しもしないようにします。H5 ではクラス名の `display: flex` が適用されます。
- **アクティブな下線は純粋な CSS トランジション**（アクティブタブの `::after` 墨線）であり、`transitionend` に依存しません。将来的に JS 連動のスライディングインジケーターを実装する場合：ミニプログラムでは `transitionend` が信頼できないため、`setTimeout` で所要時間を合わせる必要があります（message / loading のトランジションと同じ手法）。
- **キーボードナビゲーション（矢印キー / Home / End / Delete でクローズ）は H5 のみ**：ミニプログラムにキーボードイベントがないため、コンパイル時定数のガードにより MP バンドルへナビゲーション分岐が含まれません（デッドコードなし）。roving tabindex の `tabindex` 属性は MP でも保持されますが、キーボードとしての意味はありません。
- アクセシビリティの `role="tablist" / "tab" / "tabpanel"` と `aria-selected` / `aria-controls` / `aria-labelledby` は両プラットフォームで出力します。ミニプログラムの読み上げ対応はプラットフォームの能力次第です。
- タブとペインの `id` はインスタンスごとの一意プレフィックス（`generateId`）で生成されるため、1 ページに複数の tabs があっても衝突しません。
- **移植の決定（Vue3 版に整合、未定義 API の導入なし）**：移植時点では plus の真源と `@lh-ui/share` core に `lazy`、`before-leave`、`editable`（= closable + addable の糖衣構文）、`border-card` 外観がまだ存在しなかったため、本ライブラリでも提供しません。ペイン内容は常に描画され、`v-show` で表示・非表示を切り替えます。真源に追加され次第、追從してアップグレードします。
