# Dropdown ドロップダウン

下方向にポップアップするコマンドメニューです。トリガーは任意の要素にでき、メニュー項目は `command` で識別され、クリックすると `command` イベントで通知されます。

## 基本的な使い方

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || 'その他の操作' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">新規作成</lh-dropdown-item>
      <lh-dropdown-item command="edit">編集</lh-dropdown-item>
      <lh-dropdown-item command="delete">削除</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// トリガーの文言は利用者側で管理します：command イベントはコマンド値のみ通知し、
// ラベルの表示は外部で判断します
const labelMap: Record<string, string> = { new: '新規作成', edit: '編集', delete: '削除' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## トリガー方式

デフォルトは `click` で、ホバーや長押しも使えます。

```vue
<template>
  <!-- ホバーで開く（H5 のみ有効、ミニプログラムではタップ切替に降格） -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>ホバーで開く ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">水墨</lh-dropdown-item>
      <lh-dropdown-item command="danqing">丹青</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- 右クリック / 長押しで開く -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>長押しで開く ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">更新</lh-dropdown-item>
      <lh-dropdown-item command="copy">コピー</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 無効化と区切り線

```vue
<template>
  <!-- 無効項目と区切り線付きの操作メニュー -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>操作 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">エクスポート</lh-dropdown-item>
      <lh-dropdown-item command="import">インポート</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">監査ログ</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">データ消去</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> 無効項目には `aria-disabled="true"` が付き、スクリーンリーダーが読み上げます。ただし矢印キーはスキップし、クリックや Enter/Space でも `command` は発火しません。

## 位置と最大高さ

```vue
<template>
  <!-- 下端右寄せ＋最大高さ制限（超えたらスクロール） -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>下端右寄せ ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">第 {{ i }} 項目</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 制御表示とクリック動作

`v-model:visible` で表示を手動制御できます。`hide-on-click` は選択後に自動で閉じるかを制御し、`popper-class` はポップアップにカスタムクラスを追加します。

```vue
<template>
  <!-- 制御表示：選択後も閉じない -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? '閉じる' : '開く' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">コピー（選択後も閉じない）</lh-dropdown-item>
      <lh-dropdown-item command="paste">貼り付け</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| trigger | トリガー方式：`click`（全端）/ `hover`（H5 のみ、MP ではタップ切替に降格）/ `contextmenu`（長押しで担う） | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | 表示位置（12 種の方位） | `LhDropdownPlacement` | `'bottom-start'` |
| visible | 表示状態（v-model:visible） | `boolean` | — |
| disabled | トリガーを無効化 | `boolean` | `false` |
| hideOnClick | メニュー項目クリック後に自動で閉じるか | `boolean` | `true` |
| popperClass | ポップアップのカスタムクラス名 | `string` | — |
| maxHeight | メニューの最大高さ（数値は px） | `string \| number` | — |
| themeVars | コンポーネント単位のテーマ変数 | `Record<string, string>` | — |
| bgPattern | コンポーネント単位の背景模様（ConfigProvider の設定を上書き） | `string` | — |
| sx | sx クイックレイアウト属性（トリガーのルート要素に適用） | `LhSxProps` | — |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| command | メニュー項目クリック時に発火 | `(command: string \| number \| undefined)` |
| visible-change | 表示状態の変化 | `(value: boolean)` |
| update:visible | 表示状態の変化（v-model） | `(value: boolean)` |

### Slots

| スロット | 説明 |
| --- | --- |
| default | トリガーの内容 |
| dropdown | メニューの内容（`LhDropdownItem` のリスト） |

### Methods

| メソッド | 説明 |
| --- | --- |
| show | プログラムで開く |
| hide | プログラムで閉じる |
| toggle | プログラムで切替 |

## DropdownItem API

### Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| command | コマンド識別子。クリック時に `command` イベントで通知 | `string \| number` | — |
| disabled | 無効化 | `boolean` | `false` |
| divided | 上に区切り線を表示 | `boolean` | `false` |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| click | メニュー項目クリック時に発火（無効項目では発火しない） | `(command: string \| number \| undefined)` |

### アクセシビリティ

- トリガーには `aria-haspopup="menu"` と `aria-expanded` / `aria-controls` が付きます。メニューは `role="menu"`、項目は `role="menuitem"` です
- キーボードは APG menu パターンに従います（H5 のみ）：↑/↓ で循環（無効項目をスキップ）、Home/End で先頭と末尾へ、Enter/Space で `command` を発火して閉じる、Esc で閉じてフォーカスを返却
- メニュー展開時、主軸のはみ出しは自動で反転し、交差軸のはみ出しはビューポートにクランプされます

::: tip プラットフォームの差異（Vue3 版との違い）
- **トリガー方式**：ミニプログラムに hover のセマンティクスがないため、`trigger="hover"` は MP 端ではタップ / タッチ切替に降格します。右クリックもないため、`trigger="contextmenu"` は長押し（`longpress`）で担います（H5 も長押しで統一。ブラウザ標準の右クリックメニューは阻止しません。plus は `preventDefault` します）。
- **ポップアップの配置先と位置決め**：`teleportTarget` prop はありません。ミニプログラムに DOM teleport がないため、ポップアップは `root-portal`（低バージョンはページ内 fixed でフォールバック）で担います。位置決めは 2 フレーム非同期計測（先に非表示で描画してサイズを計測 → `computePosition` で配置 → 表示、チラつき防止）で、計算は非同期のため同期的な結果を仮定できません。
- **キーボードナビゲーションは H5 のみ**：矢印キー / Home / End / Enter / Space / Esc は H5 端のみ有効です（Esc はドキュメント単位のリスナーで、複数のポップアップが重なっているときは最上位だけ閉じます）。ミニプログラムにキーボードイベントはなく、全体が条件コンパイルで削除されます。
- **外部クリックで閉じる**はページ内の透明マスクで担います（plus の document 単位の click-outside リスナーと等価）。
- **開閉トランジションは未実装**：plus は `Transition` でフェードしますが、MP 端では `Transition` が信頼できないため、tooltip / select と同様にバインドしていません。
- **トリガーがビューポート外にスクロールしても自動で閉じない**：plus の `useLhPopper` には scroll-out コールバックがありますが、uni-app には統一されたスクロール / サイズ変化の監視手段がないため移植していません。
:::
