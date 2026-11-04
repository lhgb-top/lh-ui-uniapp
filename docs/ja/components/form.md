# Form フォーム

データ収集とバリデーション。バリデーションロジックはすべて `@lh-ui/share` の純関数で、プラットフォーム依存ゼロ、両端で挙動が一致します。

## 基本的な使い方

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="ユーザー名" prop="name">
      <lh-input v-model="form.name" placeholder="ユーザー名を入力してください" />
    </lh-form-item>
    <lh-form-item label="メールアドレス" prop="email">
      <lh-input v-model="form.email" placeholder="メールアドレスを入力してください" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">送信</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: 'ユーザー名を入力してください', trigger: 'blur' }],
  email: [{ required: true, message: 'メールアドレスを入力してください', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // バリデーション通過、送信
  }
}
</script>
```

## Form Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| model | フォームデータオブジェクト（必須） | `Record<string, unknown>` | — |
| rules | バリデーションルール（キーは prop 名） | `Record<string, LhFormRule[]>` | — |
| labelPosition | ラベルの位置：`left` / `right` = コントロールの左側ラベルの文字揃え（Element Plus の基準）；`top` = 上；`bottom` = コントロールの下 | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| labelWidth | ラベルの幅 | `string \| number` | — |
| inline | インラインレイアウト | `boolean` | `false` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

::: tip
`labelPosition` の位置クラス名は share のスタイルソースと整合しています：`lh-form-item--top` / `lh-form-item--bottom` / `lh-form-item--left` / `lh-form-item--right`。ページスタイルでクラス名単位に微調整できます。
:::

## Form Methods（ref 経由で呼び出す）

::: warning ref 呼び出しは onReady より後に行う必要があります
`onLoad` 段階では子コンポーネントがまだ生成し終わっておらず、`formRef.value` は undefined です。
送信ボタンのクリックイベントは自然と `onReady` の後になるため、そのまま使って問題ありません。
ページの初期化時に呼び出したい場合は `onReady` の中に入れてください。
:::

| メソッド | 説明 | 返り値 |
| --- | --- | --- |
| validate | すべてのフィールドをバリデーション | `Promise<boolean>`（すべて通過で true） |
| validateField | 単一のフィールドをバリデーション | `Promise<boolean>` |

## FormItem Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| prop | フィールドのキー名（model のキーと rules のキーに対応） | `string` | — |
| label | ラベルの文言 | `string` | — |
| required | 必須マーク（アスタリスクを表示。実際のバリデーションは rules が決める） | `boolean` | `false` |
| rules | このフィールド専用のルール（Form の rules とマージ） | `LhFormRule[]>` | — |
| customClass | カスタムクラス名 | `string` | — |

::: tip Vue3 版との差異
- バリデーションのトリガー：ミニプログラムのコントロールには change のセマンティクスがなく、各フォームコントロールが blur / input イベントをバリデーションのトリガーにマッピングします。
- フォーム送信：ミニプログラムのフォームセマンティクスは異なるため、`validate` は `Promise<boolean>` を返して手動送信を可能にします。
  Web 版のような `submit` イベントの横取りはありません。
:::
