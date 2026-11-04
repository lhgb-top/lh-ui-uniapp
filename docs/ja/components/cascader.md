# Cascader 級聯セレクター

多層データの選択に使う級聯セレクターです。例：省・市・地区の選択。トリガーをクリックすると複数列のパネルが開き、段階的に子階層を展開し、葉ノード（または `check-strictly` 時は任意の階層）を選択して完了します。

## 基本的な使い方

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: 'ガイド',
    children: [
      {
        value: 'sheji',
        label: 'デザインガイド',
        children: [
          { value: 'yuansze', label: 'カラー' },
          { value: 'fuziyuanze', label: 'フォント' },
        ],
      },
      { value: 'shejiguize', label: 'デザインルール' },
    ],
  },
  {
    value: 'zujian',
    label: 'コンポーネント',
    children: [
      { value: 'jiben', label: '基本' },
      { value: 'fankui', label: 'フィードバック' },
    ],
  },
]
</script>
```

子階層を持つ項目をクリックするとまず次の列を展開し、葉ノードをクリックすると選択されます（単一選択は選択後にパネルを自動的に閉じます）。

## 複数選択

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- タグを折りたたむ：先頭の選択項目 + カウントのみ表示 -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: 'ガイド',
    children: [
      { value: 'sheji', label: 'デザインガイド' },
      { value: 'shejiguize', label: 'デザインルール' },
    ],
  },
  {
    value: 'zujian',
    label: 'コンポーネント',
    children: [
      { value: 'jiben', label: '基本コンポーネント' },
      { value: 'fankui', label: 'フィードバックコンポーネント' },
    ],
  },
]
</script>
```

複数選択モードでは `v-model` は各選択パスの**最終階層の値**の配列をバインドし、選択項目はトリガー内にタグとして表示されます。

## 選択項目の無効化

ノードデータの `disabled: true` はそのノードを無効化します（クリックしても展開も選択もされません）；`disabled` プロップはセレクター全体を無効化し、`readonly` はパネルを開かずに値を表示します。

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: 'ガイド',
    disabled: true,
    children: [{ value: 'sheji', label: 'デザインガイド' }],
  },
  {
    value: 'zujian',
    label: 'コンポーネント',
    children: [
      { value: 'jiben', label: '基本コンポーネント' },
      { value: 'fankui', label: 'フィードバックコンポーネント', disabled: true },
    ],
  },
]
</script>
```

## パス表示と戻り値

```vue
<template>
  <!-- 完全なパス（デフォルト） -->
  <lh-cascader v-model="value" :options="options" placeholder="完全なパス（デフォルト）" />
  <!-- 最終階層のみ -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="最終階層のみ" />
  <!-- 区切り文字のカスタマイズ -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="区切り文字 >" />
  <!-- v-model は最終階層の値のみ（表示は完全パスのまま） -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="最終階層の値のみ返す" />
  <!-- 任意の階層を選択可能（非葉ノードをクリックすると直接選択） -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="任意の階層を選択可能" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: 'ガイド',
    children: [
      { value: 'sheji', label: 'デザインガイド', children: [{ value: 'yuansze', label: 'カラー' }] },
    ],
  },
]
</script>
```

> プレースホルダーはデフォルトでロケールの `cascader.placeholder` を参照し、`placeholder` で上書きできます。

## フィルター

`filterable` で検索を有効にします：フィルター入力欄はパネル内にあります（ミニプログラムのトリガー内に入力フォーカスのセマンティクスがないため）。キーワードを入力すると検索結果が完全なパス付きで表示され、結果をクリックすると直接選択されます。

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="キーワードを入力して検索" />
</template>
```

一致するものがない場合はロケールの `cascader.noMatch` が表示されます。`no-match` スロットでカスタマイズできます。

## フィールドのエイリアス

`item-config` でノードのフィールドエイリアス（`value` / `label` / `children` / `disabled` / `leaf`）を宣言すると、非同期データやバックエンドの構造を手動で変換する必要がありません：

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
  },
]
</script>
```

## Cascader API

### Props

| プロップ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | バインド値（`emitPath` が `false` の場合は最終階層の値のみ） | `(string \| number)[]` | `() => []` |
| options | 選択肢リスト（ツリー構造） | `LhCascaderNode[]` | `() => []` |
| size | サイズ | `LhCascaderSize` | `'medium'` |
| disabled | セレクター全体を無効化 | `boolean` | `false` |
| clearable | クリア可能 | `boolean` | `true` |
| placeholder | プレースホルダー（未指定時はロケールの cascader.placeholder を参照） | `string` | — |
| readonly | 読み取り専用（パネルを開かない） | `boolean` | `false` |
| showAllLevels | トリガーに完全なパスを表示 | `boolean` | `true` |
| checkStrictly | 任意の階層のノードを選択可能 | `boolean` | `false` |
| emitPath | 戻り値に完全なパスを含めるか | `boolean` | `true` |
| multiple | 複数選択 | `boolean` | `false` |
| cascading | 級聯連動（ホバーで子階層を展開、H5 のみ有効） | `boolean` | `true` |
| separator | パスの区切り文字 | `string` | `'/'` |
| collapseTags | 複数選択モードでタグを折りたたむ | `boolean` | `false` |
| filterable | 検索可能 | `boolean` | `false` |
| itemConfig | ノードのフィールドエイリアス | `LhCascaderItemConfig` | `() => ({})` |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | sx クイックレイアウトプロップ（トリガーのルート要素に適用、ポップアップパネルには影響しない） | `LhSxProps` | — |

### Events

| イベント | 説明 | パラメータ |
| --- | --- | --- |
| update:modelValue | バインド値の変化時に発火 | `(value: (string \| number)[])` |
| change | 選択値の変化時に発火 | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| スロット | 説明 |
| --- | --- |
| no-match | フィルターに一致するものがない場合のカスタム内容 |

### データ構造

`LhCascaderNode` の型定義：

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### アクセシビリティ

- トリガーは `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls` を持ちます（属性パックは share の `getCascaderTriggerAria` が产出し、キーごとに展開してバインドします）
- ポップアップパネルは `role="dialog"`、各列は `role="listbox"`（`aria-label` はロケールの `cascader.columnLabel` を使用）、列項目は `role="option"` で `aria-selected` / `aria-disabled` / `aria-expanded` を持ちます
- 位置決めエンジンは自作の純粋関数（flip / shift による溢出防止）で、サードパーティのランタイム依存はありません

::: tip プラットフォームの違い（Vue3 版との違い）
- **パネル化されたポップアップ**：plus はパネルを `Teleport to="body"` にマウントし `Transition` でフェードさせますが、uni-app では `lh-root-portal` が保持し（旧版ベースではページ内 fixed にフォールバック）、二フレームの非同期測量で位置決めします（非表示でレンダリングして寸法を測る → `computePosition` で位置決め → 表示、ちらつきを防止）。位置計算は非同期で、同期的に結果が得られると仮定してはいけません。出入りのトランジションはバインドしていません（MP の `Transition` は信頼性が低く、tooltip / dropdown / popover と同様です）。
- **列のスクロール**：各列は独立して縦方向にスクロールする `scroll-view`（`scroll-y`）です——MP の `view` には信頼できる溢出スクロールがなく、share scss の `overflow-y: auto` な列コンテナは H5 側で `scroll-view` の H5 実装により等価にフォールバックします。
- **キーボードナビゲーションは H5 のみ**：トリガーは Enter/Space で開閉、矢印キーでパネルにフォーカスを移します；パネル内では ↑↓ で列内移動（無効化項目をスキップ）、←→ で列をまたぐ、Enter/Space はクリックと同等、Escape はドキュメントレベルのリスナーで閉じます（複数のポップアップが重なっている場合は最上位のみ閉じる）。処理関数の本体全体が条件コンパイルで切り詰められ、MP バンドルにデッドコードは残りません。
- **ホバー展開は H5 のみ**：`cascading` のホバーによる子階層展開は hover セマンティクスに依存しますが、ミニプログラムには hover がなく、子階層はタップでのみ展開できます（MP では `cascading` は実質的にホバー展開オフと同じです）。
- **フィルター入力欄の位置**：plus はトリガー自体を `filterable` の入力欄にしますが、uni-app ではフィルター入力欄をパネル内に置きます（select と同様）。MP にはトリガー内 input のフォーカスセマンティクスがないためです。
- **外部クリックで閉じる**：plus は `useLhClickOutside` で document のクリックを監視しますが、uni-app ではページ内の透過マスクで対応します（マスクをクリックすると閉じます）。
- **トリガーがビューポート外にスクロールされても自動的に閉じない**：uni-app には統一されたスクロール / サイズ変化の監視チャネルがないため移植していません。
- **フォーカスリング / roving tabindex は H5 のみ**：MP にキーボードフォーカスのセマンティクスはなく、MP 側では `tabindex` バインドは値を出力しません。
:::
