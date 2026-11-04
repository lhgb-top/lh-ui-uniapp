# Menu ナビゲーションメニュー

ページや機能のナビゲーションメニュー。縦横（デフォルトは縦） 2 つのレイアウトモードをサポートし、サブメニューは再帰的にネストできます。
選択状態は `v-model` が保持し、展開状態は制御可能（`openeds`）または内部任せ（`default-openeds`）です。

## 基本的な使い方

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">ホーム</lh-menu-item>
    <lh-menu-item index="2">作品</lh-menu-item>
    <lh-menu-item index="3">概要</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` は項目の一意識別子で、葉項目のクリック時に `select` イベントで通知されます（`update:modelValue` も同時に発火するため `v-model` で受け取れます）。

## サブメニューとデフォルト展開

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">ホーム</lh-menu-item>
    <lh-sub-menu index="2" title="私の作品">
      <lh-menu-item index="2-1">水墨画</lh-menu-item>
      <lh-menu-item index="2-2">工筆画</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

ネストしたサブメニューは複数階層に再帰できます。`select` イベントの `indexPath` は最外層のサブメニューから選択項目までの完全なパスです（例: `['2', '2-1', '2-1-1']`）。

## アコーディオン

`unique-opened` を指定すると、同時に展開されるサブメニューは最大 1 つになります（展開中のタイトルを再度クリックすると閉じます。すべて閉じた状態も許可されます）。

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="第 1 グループ">
      <lh-menu-item index="1-1">オプション 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="第 2 グループ">
      <lh-menu-item index="2-1">オプション 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## 制御された展開

`openeds` を渡すと制御モードになります。コンポーネント内部では展開状態を維持せず、`update:openeds` のコールバックで駆動します。

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="制御されたサブメニュー">
      <lh-menu-item index="1-1">オプション 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## グループ

`lh-menu-item-group` は同系統の項目をまとめます（視覚的なグループ化のみで、展開ロジックには関与しません）。

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="基本コンテンツ">
      <lh-menu-item index="1">記事</lh-menu-item>
      <lh-menu-item index="2">画像</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="高度な機能">
      <lh-menu-item index="3">データ分析</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## 横方向モード

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">ホーム</lh-menu-item>
    <lh-sub-menu index="2" title="作品集">
      <lh-menu-item index="2-1">水墨画</lh-menu-item>
      <lh-menu-item index="2-2">工筆画</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">概要</lh-menu-item>
  </lh-menu>
</template>
```

横方向モードではサブメニューがタイトルの下から飛び出します（`bottom-start`）。ネストした階層は右から飛び出します（`right-start`）。

## 折りたたみモード

縦方向モードに `collapse` を組み合わせると狭いバーに折りたたまれ、サブメニューは右側の飛び出しパネルになります。

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="メール">
      <lh-menu-item index="1-1">受信箱</lh-menu-item>
      <lh-menu-item index="1-2">送信済み</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">下書き</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | 現在の選択項目（v-model。省略時は内部で維持） | `string` | — |
| mode | レイアウトモード | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | 縦方向メニューをアイコンバーに折りたたむ（サブメニューは飛び出しパネルになる） | `boolean` | `false` |
| defaultOpeneds | デフォルトで展開するサブメニューのキー（非制御） | `string[]` | `[]` |
| openeds | 制御された展開サブメニューキー | `string[]` | — |
| uniqueOpened | アコーディオン：同時に展開するサブメニューを最大 1 つに | `boolean` | `false` |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| select | 葉項目の選択時に発火 | `(index: string, indexPath: string[])` |
| open | サブメニューの展開時に発火 | `(index: string, indexPath: string[])` |
| close | サブメニューの折りたたみ時に発火 | `(index: string, indexPath: string[])` |
| update:modelValue | 選択項目の変化（v-model） | `(value: string)` |
| update:openeds | 展開セットの変化 | `(value: string[])` |

### Slots

| Slot | 説明 |
| --- | --- |
| default | メニューの内容（`LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup` の組み合わせ） |

## MenuItem API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| index | 一意識別子（必須） | `string` | — |
| disabled | 無効化（aria-disabled セマンティクスを保持。クリックとキーボード起動をともに抑制） | `boolean` | `false` |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| click | 葉項目のクリック時に発火（無効項目では発火しない） | `(index: string)` |

## SubMenu API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| index | 一意識別子（必須） | `string` | — |
| title | タイトル（`title` スロットも使用可） | `string` | — |
| disabled | 無効化 | `boolean` | `false` |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| select | 子孫の葉項目が選択されたときに発火（パスにこのサブメニューの index を含む） | `(index: string, indexPath: string[])` |

### Slots

| Slot | 説明 |
| --- | --- |
| default | サブメニューの内容（さらに `LhMenuItem` / `LhSubMenu` をネスト可） |
| title | カスタムタイトル内容 |

## MenuItemGroup API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| title | グループタイトル（`title` スロットも使用可） | `string` | — |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

### Slots

| Slot | 説明 |
| --- | --- |
| default | グループの内容 |
| title | カスタムグループタイトル |

### アクセシビリティ

- コンテナは `role="menu"`（横方向モードでは `role="menubar"`）。葉項目とサブメニュータイトルは `role="menuitem"`、無効項目は `aria-disabled` を出力し、サブメニュータイトルはさらに `aria-expanded` / `aria-haspopup` / `aria-controls` を持ちます
- キーボードは APG menu パターンに従います（H5 のみ）：縦方向モードでは ↑/↓ で可視項目を循環（無効項目と折りたたまれたパネル内の項目をスキップ）、Home/End で先頭・末尾へ。葉項目は Enter/Space で起動。サブメニュータイトルでは Enter/Space/→ で展開してパネルへフォーカスを移し、←/Esc で折りたたみます
- 横方向モードの ←/→ セマンティクスは各タイトル自身に残し、ルートコンテナは方向キーをインターセプトしません

::: tip プラットフォームの差異（Vue3 版との違い）
- **縦方向とアコーディオンは全端末で利用可能**：縦方向モード（サブメニューのインライン展開、アコーディオン、制御された v-model / openeds を含む）は純粋な CSS と provide/inject で実装されており、H5 と WeChat ミニプログラムで同じように動作します。
- **横方向スクロール**：横方向モードで項目の合計幅がコンテナを超えるとき、スクロールはコンテナ自身の `overflow-x` で実現します（WXSS では view がオーバーフロースクロールをサポート）。`scroll-view` は使いません——後者は H5 でスロット内容を内側の `uni-scroll-view-content` に包み込み、share scss の flex 直系子構造を壊すためです（lh-tabs の横方向ヘッダとは異なり、menu 項目はブロックレベル flex であり、タブのように inline-flex で回避できません）。
- **飛び出しサブメニューは root-portal に乗る**：横方向 / 折りたたみモードの飛び出しパネルは、plus の `<teleport to="body">` に代わり `lh-root-portal` で実現します（低バージョン基础库ではページ内 fixed にフォールバック）。位置決めは 2 フレーム非同期計測（非表示で描画してサイズ計測 → `computePosition` で配置 → 表示、チラつき防止）で、計算は非同期のため同期的な結果を仮定できません。ネストした階層は右から飛び出します（`right-start`）。
- **hover は H5 のみ**：タイトルのホバー展開は H5 でのみ機能します。ミニプログラムに hover セマンティクスはないため、飛び出しパネルの開閉はタイトルのタップで行い、外部タップはページ内の透明マスクで閉じます（plus の mouseleave 相当）。
- **キーボードナビゲーションは H5 のみ**：↑/↓ / Home / End / Enter / Space / ←/→ / Esc は H5 でのみ機能します。ミニプログラムにキーボードイベントはなく、該当ブロックは条件コンパイルで削除されます（MP バンドルにデッドコードは残りません）。
- **開閉トランジションは未実装**：plus は `Transition` でフェードしますが、MP では `Transition` が信頼できないため tooltip / select と同様にバインドしていません。インラインパネルの展開アニメーションは純粋な CSS（grid-template-rows 0fr/1fr）で、transitionend は監視しません（MP では信頼できない）。MP でトランジションがサポートされなくても最終状態は正しくなります。
:::
