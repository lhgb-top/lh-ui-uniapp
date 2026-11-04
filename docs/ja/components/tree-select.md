# TreeSelect ツリーセレクター

組織図やカテゴリツリーなど、階層構造を持つデータ向けのセレクターです。トリガーをクリックするとツリーパネルが開き、単一選択ではノードをクリックすると選択されてパネルが閉じ、複数選択ではチェックボックスで選択します（親子連動）。

## 基本的な使い方

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="请选择节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

ノードをクリックすると選択され（葉ではないノードも含む）パネルが閉じます。ノード左側の展開矢印をクリックすると、選択値を変えずに展開 / 折りたたみだけ行います。トリガーには選択されたノードの `label` が表示されます。

## 複数選択

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="请选择多个节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

複数選択では `v-model` にチェックされたキー配列（`string[]`）をバインドし、親子連動します。親ノードをチェックするとチェック可能なすべての子孫が自動的にチェックされ、子孫がすべてチェックされると親は全選択、一部なら半選択（indeterminate）になります。ノードのラベルをクリックしても展開するだけで、チェックはチェックボックスで行います（Vue3 版と同じです）。トリガーにはチェックされたすべてのキーの `label` が「、」区切りで表示されます。

## 無効化

ノードデータの `disabled: true` はそのノードを無効化します（クリックしても展開も選択もされず、チェックボックスも操作できません）。`disabled` prop はセレクター全体を無効化します。

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>
```

## TreeSelect API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | バインド値（単一選択は `string` / 複数選択は `string[]`、制御された v-model） | `string \| string[] \| undefined` | — |
| data | ツリーデータ | `LhTreeNode[]` | `() => []` |
| multiple | 複数選択かどうか（チェックボックス表示、値はチェックされたキー配列、親子連動） | `boolean` | `false` |
| disabled | セレクター全体を無効化するかどうか | `boolean` | `false` |
| placeholder | プレースホルダー（未指定時は言語パック `select.placeholder`） | `string` | — |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | sx クイックレイアウトプロパティ（トリガーのルート要素に適用、フローティングパネルには影響しません） | `LhSxProps` | — |

### Events

| Event | 説明 | パラメータ |
| --- | --- | --- |
| update:modelValue | バインド値の変化時に発生 | `(value: string \| string[] \| undefined)` |
| change | 選択値の変化時に発生 | `(value: string \| string[] \| undefined)` |

### データ構造

`LhTreeNode` 型定義（真源は `@lh-ui/share/core/tree`）:

```ts
interface LhTreeNode {
  /** 一意キー */
  key: string
  /** 表示テキスト */
  label: string
  /** 子ノード */
  children?: LhTreeNode[]
  /** 無効化 */
  disabled?: boolean
  /** 葉ノードかどうか（未指定時は children から推論） */
  isLeaf?: boolean
}
```

### アクセシビリティ

- トリガーは `aria-haspopup="tree"` / `aria-expanded` / `aria-label` を持ちます（言語パック `treeSelect.triggerLabel` から取得）
- パネルは `role="listbox"`、内蔵ツリーは `role="tree"`、ノードは `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` を持つ `role="treeitem"` です。複数選択時はパネルに `aria-multiselectable` が付き、チェックボックスは `role="checkbox"` で `aria-checked` を持ちます（半選択は `mixed`）
- 階層のインデント、展開矢印の回転、チェックボックスの三状態の外観はすべて share スタイルソース（`@lh-ui/share/styles/tree`）由来で、端内に重複スタイルはありません

::: tip プラットフォームの違い（Vue3 版との違い）
- **専用 core ではなくグルーコンポジション**: share core に tree-select モジュールはなく、本端は plus の実装形態に沿って「select トリガー + lh-tree パネル」を組み合わせます。パネルは `lh-tree` を内蔵し、ツリーの展開 / 選択 / 連動チェックはすべて `lh-tree` が `core/tree` 純関数（`flattenTree` / `toggleCheckKeys` / `getNodeCheckState` など）を消費します。ツリー逻辑は一切コピーしません。API とイベントは plus に合わせ、独自の機能追加はありません。
- **パネル化オーバーレイ**: plus はパネルを `Teleport to="body"` にマウントしますが、uni-app では `lh-root-portal` が担い（旧バージョンではページ内 fixed にフォールバック）、二フレームの非同期計測で配置します（非表示で描画して計測 → `computePosition` で配置 → 表示、ちらつき防止）。配置計算は非同期で、同期的に結果が得られると仮定してはいけません。
- **ツリーパネルのスクロール**: share scss の `.lh-tree-select__panel` は `overflow: auto` を使いますが、MP の `view` には信頼できるオーバーフロースクロールがないため、パネル内に `scroll-view`（`scroll-y`）をもう一层はさみ、最大高さを share の 320px に合わせています。
- **キーボードナビゲーションなし**: plus の Escape 終了とドキュメントレベルのキーボード監視はキーボードイベントに依存しますが、ミニプログラムにはキーボードイベントがないため、本端ではページ内の透明マスクをタップしてパネルを閉じます（select / cascader と同じ）。条件コンパイルによる低下対応はしていません。
- **`teleported` prop は未移植**: plus はパネルを body にマウントするかどうかを制御しますが、uni-app ではオーバーレイは常に `lh-root-portal` を経由するため、この意味論は存在しません。
- **外側クリックでの終了**: plus は `useLhClickOutside` で document のクリックを監視しますが、uni-app ではページ内の透明マスクが担います（マスクをタップすると閉じます）。
- **チェック状態の制御化修正**: plus は `checked-keys` を内蔵ツリーに渡さないため、複数選択の事前設定値がチェックボックスに反映されません。本端は `v-model` を `checked-keys` としても渡し、チェックボックスとトリガーの表示をどちらも `v-model` で駆動します（API は変わらず）。
- **トリガーがビューポート外にスクロールしても自動的に閉じない**: uni-app には統一的なスクロール / サイズ変更の監視チャンネルがないため、移植していません。
:::
