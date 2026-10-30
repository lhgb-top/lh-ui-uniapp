# Form 表單

資料收集與驗證。驗證邏輯全部是 `@lh-ui/share` 的純函式，零平台依賴，兩端行為一致。

## 基礎用法

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="用户名" prop="name">
      <lh-input v-model="form.name" placeholder="请输入用户名" />
    </lh-form-item>
    <lh-form-item label="邮箱" prop="email">
      <lh-input v-model="form.email" placeholder="请输入邮箱" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">提交</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // 驗證通過，提交
  }
}
</script>
```

## Form Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| model | 表單資料物件（必填） | `Record<string, unknown>` | — |
| rules | 驗證規則（鍵為 prop 名） | `Record<string, LhFormRule[]>` | — |
| labelPosition | 標籤位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | 標籤寬度 | `string \| number` | — |
| inline | 行內版面配置 | `boolean` | `false` |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Form Methods（透過 ref 呼叫）

::: warning ref 呼叫須在 onReady 之後
`onLoad` 階段子元件尚未建立完畢，`formRef.value` 是 undefined。
提交按鈕的點選事件天然在 `onReady` 之後，直接用沒問題；
若要在頁面初始化時呼叫，請放進 `onReady`。
:::

| 方法 | 說明 | 傳回 |
| --- | --- | --- |
| validate | 驗證全部欄位 | `Promise<boolean>`（全部通過為 true） |
| validateField | 驗證單一欄位 | `Promise<boolean>` |

## FormItem Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| prop | 欄位鍵名（對應 model 的鍵與 rules 的鍵） | `string` | — |
| label | 標籤文案 | `string` | — |
| required | 必填標記（顯示星號；實際驗證由 rules 決定） | `boolean` | `false` |
| rules | 該欄位專屬規則（與 Form 的 rules 合併） | `LhFormRule[]>` | — |
| customClass | 自訂類別名 | `string` | — |

::: tip 與 Vue3 版的差異
- 驗證觸發：小程序控制項無 change 語義，各表單控制項把 blur / input 事件映射為驗證觸發。
- 表單提交：小程序表單語義不同，`validate` 傳回 `Promise<boolean>` 供手動提交，
  沒有 web 端的 `submit` 事件攔截。
:::
