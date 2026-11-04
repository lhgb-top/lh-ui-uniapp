# Collapse 折りたたみパネル

コンテンツブロックを折りたたみ / 展開します。複数パネルの共存と、アコーディオン（同時に1つのみ展開）モードをサポートします。

## 基本的な使い方

`v-model` を渡さない場合は非制御です。コンポーネントが展開状態を自管理し、タイトルバーのクリックで切り替えます。`change` イベントが最新の展開パネルを搬送します。

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="一貫性と多様性"
    >
      ページ全体と一致する視覚とインタラクションを保ちます。
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="フィードバック"
    >
      操作後に明確でタイムリーなフィードバックを返します。
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## アコーディオン

`accordion` モードでは同時に展開されるのは最大1つです。展開中のパネルを再度クリックするとすべて折りたたまれます。

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="1つだけ展開"
    >
      同時に展開されるのは最大1つです。
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="再クリックで折りたたみ"
    >
      すべて折りたたむことができます。
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 制御 v-model と無効化

`v-model` で展開パネルをバインドします（単値または配列。アコーディオンモードでは通常単値）。`disabled` で個別パネルを無効化します。

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="パネル A"
    >
      制御コンテンツ A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="パネル B（無効）"
      disabled
    >
      無効コンテンツ
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="パネル C"
    >
      制御コンテンツ C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | 現在アクティブなパネル（制御 v-model、単値または配列） | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | アコーディオンモード：同時に展開するのは1つだけ | `boolean` | `false` |
| customClass | カスタムクラス名（ルートノードに適用） | `string` | — |
| sx | レイアウト簡易プロパティ | `LhSxProps` | — |

## CollapseItem Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| name | パネルの一意識別子（必須） | `string \| number` | — |
| title | タイトル（`title` スロットも使用可） | `string` | — |
| disabled | パネルを無効化するか | `boolean` | `false` |
| customClass | カスタムクラス名（項目ルートノードに適用） | `string` | — |
| sx | レイアウト簡易プロパティ | `LhSxProps` | — |

## Events

| Event | 説明 | コールバック引数 |
| --- | --- | --- |
| update:modelValue | 展開パネルが変化（制御 v-model。コンポーネントは内部状態を持たない） | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | 展開パネルが変化（非制御。アコーディオンでは単値、すべて折りたたまれると `undefined`） | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| Slot | 説明 |
| --- | --- |
| Collapse default | パネル項目ノード（`lh-collapse-item`） |
| CollapseItem default | パネルコンテンツ |
| CollapseItem title | パネルタイトル（`title` prop を上書き） |

## プラットフォームの違い

- **展開 / 折りたたみアニメーションは純 CSS**（`grid-template-rows` を `0fr / 1fr` 間で遷移 + 矢印を `transform` で回転）で、`transitionend` は一切監視しません（WeChat ミニプログラムでは同イベントが信頼できないため、本ライブラリは全体で依存しません）。クラスの切り替えで即座に確定します。一部 MP レンダリングエンジンが grid 遷移をサポートしなくても、最終的な展開状態は正しく、遷移の過程だけが省かれます。
- **コンテンツは常にレンダリング**（`v-if` による省略なし）：`lh-collapse__wrap` は `--active` クラスで表示を切り替えます。「展開時にのみレンダリング」が必要な場合は、コンテンツ側で `v-if` を使って自行制御してください。
- `<h3>` / `<button>` はすべて `<view>` / `<text>` に置き換え（WXSS はタグセレクタを禁止）。無効化はネイティブの `<button disabled>` に頼らず、クリックガード + `--disabled` クラス + `aria-disabled` で表現します。
- アクセシビリティ属性は両プラットフォームで出力されます。ヘッダーは `role="button"` + `aria-expanded` / `aria-controls`、コンテンツ領域は `role="region"` + `aria-labelledby`。MP の読み上げ対応はプラットフォームの能力次第です。H5 では、フォーカスされたヘッダーは Enter / Space で自然に動作します。
- ヘッダー / コンテンツの関連 `id` は `generateId` でローカル一意に生成します（Vue 3.5 の `useId` ではなく、uni-app 各端のカーネルとの互換性を優先）。1ページに複数の折りたたみグループがあっても衝突しません。
- **移植の決定（Vue3 版と整合、API の勝手な追加なし）**：本移植は plus の真源に厳密に合わせ、`v-model`（単値 / 配列）、`accordion`、パネルの `name` / `title` / `disabled`、`title` スロットのみを提供します。真源に存在しないネスト折りたたみ、アイコンスロット、遅延レンダリング等は追加しません。真源が追加されれば追従します。
- 本リポジトリのグルー層には制御取得の修正が1つあります（changeset に記録）：制御時、展開状態を `props.modelValue` を購読する computed とし、親が v-model を非同期的に更新するとパネルが即座に追従します。core の純関数と props 契約は plus と完全に一致します。
