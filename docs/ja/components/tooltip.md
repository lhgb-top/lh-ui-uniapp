# Tooltip ツールチップ

## 基本的な使い方

```vue
<template>
  <lh-tooltip content="これはツールチップの文言です">
    <lh-button>クリックでツールチップを表示</lh-button>
  </lh-tooltip>
</template>
```

::: warning ミニプログラムに hover のセマンティクスはありません
`trigger` のデフォルトは `click`（全端で使用可）です。`hover` は H5 のみ有効 ——
ミニプログラム端では `trigger="click"` を使い、タップ / タッチで表示・クローズしてください。
:::

## 位置と幅

```vue
<template>
  <lh-tooltip content="下部のヒント" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="長い文言は自動で折り返す" :max-width="200" placement="top">
    <lh-button>幅を制限</lh-button>
  </lh-tooltip>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| content | ヒントの文言 | `string` | — |
| placement | ポップアップの位置（12 種の方位） | `LhTooltipPlacementCore` | `'top'` |
| trigger | トリガー方式：`click`（全端）/ `hover`（H5 のみ） | `'click' \| 'hover'` | `'click'` |
| showDelay | 表示の遅延（ミリ秒） | `number` | — |
| hideDelay | 非表示の遅延（ミリ秒） | `number` | — |
| maxWidth | 最大幅（内容は自動で折り返し） | `string \| number` | — |
| disabled | 無効 | `boolean` | `false` |
| customClass | カスタムクラス名 | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 表示 / 非表示の変化（制御された使い方） | `(visible: boolean)` |
| show | 表示 | — |
| hide | 非表示 | — |

::: tip Vue3 版との差異
- ポップアップは `root-portal` + 2 フレームの非同期計測定位で動作します（まず透明でレンダリングしてサイズを測る → 定位 → 表示、ちらつき防止）。
- MP 端の `showDelay` / `hideDelay` は click モードでのみ即時挙動を保ちます。
- 定位の計算は非同期です（`getLhRect` は Promise を返す）。同期的に結果が得られると仮定してはいけません。
:::
