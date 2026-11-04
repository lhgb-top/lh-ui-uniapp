# Steps（ステップバー）

ユーザーをタスクフローに沿って案内します。横方向 / 縦方向、アイコン、説明文、クリックナビゲーションに対応。純粋な表示・状態コンポーネントで、H5 と WeChat ミニプログラムの両端で利用可能です。

## 基本的な使い方

`current` で現在のステップインデックス（0 始まり、`v-model:current` で双方向バインド可能）を指定します。前のステップは `finish`、現在は `process`、後は `wait` となります。

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="墨を磨く"
      description="墨は五色"
    />
    <lh-step
      title="下書き"
      description="構図を決める"
    />
    <lh-step
      title="墨を置く"
      description="筆致を骨格に"
    />
    <lh-step
      title="款記"
      description="画竜点睛"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## 縦方向ステップ

`direction="vertical"` で縦方向レイアウトに切り替わります（CSS で制御、プラットフォーム差異なし）。

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="注文受付"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="支払完了"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="発送済み"
      description="10-03 到着予定"
    />
    <lh-step title="受取確認" />
  </lh-steps>
</template>
```

## アイコン付き

`lh-step` に `icon` を渡すと内蔵アイコンフォントを使用します（名前は Icon ドキュメント参照）。未指定時、`finish` はチェック、`error` はバツ、それ以外は序数を表示します。

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="登録"
      icon="user"
    />
    <lh-step
      title="認証"
      icon="email"
    />
    <lh-step
      title="完了"
      icon="check"
    />
  </lh-steps>
</template>
```

`icon` スロットでデフォルトのフォールバックを完全に上書きできます（カスタム図形・テキストともに可）：

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="ステップ1">
      <template #icon>
        <text class="step-badge">壱</text>
      </template>
    </lh-step>
    <lh-step title="ステップ2">
      <template #icon>
        <text class="step-badge">弐</text>
      </template>
    </lh-step>
    <lh-step title="ステップ3">
      <template #icon>
        <text class="step-badge">参</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## クリックナビゲーション

`clickable` を指定すると、`finish` / `process` のステップがクリック可能なヘッドとして描画され、クリックで `update:current`（v-model）と `change` を発火します。未来の `wait` ステップには遷移できません。

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="ステップ1" />
    <lh-step title="ステップ2" />
    <lh-step title="ステップ3" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## 状態の一括上書き

`status` を渡すと、全ステップの派生状態（`wait` / `process` / `finish` / `error`）を上書きします（カスタム表示用）。

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="ステップ1" />
    <lh-step title="ステップ2" />
    <lh-step title="ステップ3" />
  </lh-steps>
</template>
```

## Steps Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| current | 現在のステップインデックス（v-model:current、0 始まり） | `number` | `0` |
| direction | 方向：`'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | ステップをクリック可能にする（完了 / 進行中ステップのみ） | `boolean` | `false` |
| status | 全ステップの状態を一括上書き（カスタム表示用） | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| sx | レイアウト簡易 prop | `LhSxProps` | — |

## Step Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| title | ステップタイトル（title スロットも使用可） | `string` | `''` |
| description | ステップ説明（description スロットも使用可） | `string` | `''` |
| icon | カスタムアイコン名（未指定時、finish/error はチェック/バツ、それ以外は序数） | `LhIconName` | — |
| customClass | カスタムクラス名（項目ルートノードに転送） | `string` | — |

## Events

| Event | 説明 | コールバック引数 |
| --- | --- | --- |
| update:current | 現在のステップが変化（v-model:current） | `(index: number)` |
| change | クリック可能ステップのクリックによる遷移 | `(index: number)` |

## Slots

| Slot | 説明 |
| --- | --- |
| Steps default | ステップ項目ノード（`lh-step` のみ収集） |
| Step icon | 円の内容（icon prop と序数フォールバックを上書き） |
| Step title | タイトル（title prop を上書き） |
| Step description | 説明（description prop を上書き） |

## プラットフォーム差異

- **純粋な表示・状態コンポーネントで、H5 と WeChat ミニプログラムの両端で利用可能**。横方向 / 縦方向は CSS で制御され、両端で同一です。
- `<ol>/<li>` は `<view>` に置き換わります（WXSS はタグセレクタを禁止）。クリック可能なヘッドは `view` + `role="button"` で描画します（ミニプログラムの `<button>` はネイティブスタイルのリセットができないため）。アクセシブル名は share locales の `steps.step` / `steps.finish` / `steps.error` キーから取得します（9 言語揃い、リポジリ内にコピーは保持しない）。
- **「最終項は连接線を描かない」機構が両端で異なります**：share ソースでは接続線（横方向 `::after` / 縦方向 `::before`）は構造的 `:not(:last-child)` で最終項を除外していますが、WXSS は `:not()` をサポートしないため、ビルド時に削除され（全項目が接続線を描く）、最終項 / 行末項の非表示はすべて `--line-last` クラスに委ねられます：
  - 横方向：折り返し測定ロジックは Vue3 版と同源（`getStepsLineLastIndices`）ですが、測定はアダプタ `getLhRect` 経由です（H5 は document クエリ、MP は非同期 `createSelectorQuery`、onMounted 以降に実行必須）。
  - 縦方向：折り返しがないためグローバル最終項を直接マークし、コンポーネント SFC の uni-app 適用スタイルで `--line-last::before` の非表示ルールを補います（share ソースにこのルールはありません）。
- **コンテナ幅変化による折り返し再計算は H5 のみ**：H5 は `ResizeObserver` を使用します。MP にはその API がなく、ステップの増減と方向切り替えは再計算されますが、動的なサイズ変化にはページ再出入が必要です（MP バンドルにデッドコードを残さないための許容される degraded 仕様）。
- **移植判断（Vue3 版に aligned、未定義 API の持ち出しなし）**：移植時点で plus 真源には `simple` モード、`process-status` / `finish-status` カスタム状態、`space` 間隔などの API がなく（真源の Props は `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`）、本ライブラリでも提供しません。`themeVars` も含みません（本リポジトリの ConfigProvider の `componentTheme` 名簿に steps は未登録）。真源で追加され次第追従します。
