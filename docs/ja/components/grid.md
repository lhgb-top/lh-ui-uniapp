# Grid グリッド

24 列グリッドレイアウト：`lh-row` と `lh-col` の組み合わせ（easycom ならタグを直接記述可能；オンデマンド導入時のコンポーネント名は `LhRow` / `LhCol`）。実体は CSS Grid で、`span` / `offset` / `push` / `pull` はそのまま `grid-column` の配置へ映射されます。クラス名と配置アルゴリズムはすべて `@lh-ui/share` core の純関数が产出します。

## 基本的なレイアウト

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 列間隔 gutter

`gutter` は `number`（横方向のみ）または `[横, 縦]` 配列を受け付けます。Row は負の外辺距離で列の内辺距相殺ます。

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 主軸の整列 justify / 交差軸の整列 align

`justify` の `center` と `align` の `middle` はそれぞれ独立した修飾クラスに映射され（両軸でクラスが衝突しません）、`align='center'` は `middle` の互換エイリアスです。

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## オフセットとシフト

- `offset`：先頭を N 列右にずらす（明示的な開始位置 `offset + 1`）
- `push` / `pull`：offset を基準に開始位置を右 / 左へシフト

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## レスポンシブブレイクポイント

`xs` / `sm` / `md` / `lg` / `xl` は `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` でそれぞれ有効になり、未定義の時は定義済みの直近の档へフォールバックします（`xs` が常に最終候補）。`sizes` で一括宣言することも可能です。

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Row Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| gutter | 列間隔（px、または `[横, 縦]`） | `number \| [number, number]` | `0` |
| justify | 主軸の整列 | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | 交差軸の整列 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | 折り返しするか | `boolean` | `true` |
| customClass | カスタムクラス（ルートノードへ転送） | `string` | — |
| sx | sx ショートハンドレイアウトプロパティ | `LhSxProps` | — |

## Col Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| span | 占有する列数（24 グリッド制） | `number` | — |
| offset | 先頭のオフセット列数 | `number` | — |
| push | 右へシフトする列数 | `number` | — |
| pull | 左へシフトする列数 | `number` | — |
| xs / sm / md / lg / xl | 各ブレイクポイントのサイズ（`number` または `{ span, offset }`） | `LhColSize` | — |
| sizes | ブレイクポイント別の一括宣言（xs～xl と等価、どちらかを使用） | `LhBreakpointSizes` | — |
| customClass | カスタムクラス（ルートノードへ転送） | `string` | — |
| sx | sx ショートハンドレイアウトプロパティ | `LhSxProps` | — |

## Slots

| Slot | 説明 |
| --- | --- |
| default | グリッドの内容（Row と Col はともにデフォルトスロット） |

## プラットフォームの違い

- **純粋なレイアウトコンポーネント**：オーバーレイ・計測・document への依担なし。H5 と WeChat ミニプログラムで同じ挙動になります。
- **ブレイクポイントの取得元**：H5 は `matchMedia` でビューポート変化を監視しますが、**ミニプログラムに matchMedia はない**ため、常に `xs` 档へ固定降格します（フォールバック規則自体は引き続き share core の `resolveResponsiveSize` が決定し、現在のブレイクポイントのみが `xs` 固定になります）。ミニプログラムで画面幅による切り替えが必要な場合は、`uni.getSystemInfoSync().windowWidth` を `useLhBreakpoint` の注入インターフェースへ自行渡すか、ミニプログラム向けに固定レイアウトを一つ定義してください。
- **タグ置換**：plus の `<div>` は `<view>` になります（WXSS はタグセレクタを禁じるため、スタイルは `lh-row*` / `lh-col*` クラスで適用されます）。
- **`grid-column` の配置**：純粋な `span` は auto-placement（`span N`）を使い、`offset` / `push` / `pull` がある場合は開始位置を明示的に決定し、24 列座標系内にクリップして、範囲外の組み合わせでコンテナが突き破られるのを防ぎます。

::: tip Vue3 版との違い
- コンポーネント構造・props の口径・クラス名・配置アルゴリズムは plus と完全に一致します（同一の share core）。
- サブコンポーネントのタグは easycom の慣例に従い `lh-row` / `lh-col` です（オンデマンド導入時は `LhRow` / `LhCol`）。
- `customClass` prop が追加されています：uni-app ではカスタムクラスが `styleIsolation` を貫通できないため、prop 経由で転送します（plus は class を直接渡します）。
:::
