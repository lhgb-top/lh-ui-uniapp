# Form 表单

数据收集与校验。校验逻辑全部是 `@lh-ui/share` 的纯函数，零平台依赖，两端行为一致。

## 基础用法

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
    // 校验通过，提交
  }
}
</script>
```

## Form Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象（必填） | `Record<string, unknown>` | — |
| rules | 校验规则（键为 prop 名） | `Record<string, LhFormRule[]>` | — |
| labelPosition | 标签位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | 标签宽度 | `string \| number` | — |
| inline | 行内布局 | `boolean` | `false` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Form Methods（通过 ref 调用）

::: warning ref 调用须在 onReady 之后
`onLoad` 阶段子组件尚未创建完毕，`formRef.value` 是 undefined。
提交按钮的点击事件天然在 `onReady` 之后，直接用没问题；
若要在页面初始化时调用，请放进 `onReady`。
:::

| 方法 | 说明 | 返回 |
| --- | --- | --- |
| validate | 校验全部字段 | `Promise<boolean>`（全部通过为 true） |
| validateField | 校验单个字段 | `Promise<boolean>` |

## FormItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 字段键名（对应 model 的键与 rules 的键） | `string` | — |
| label | 标签文案 | `string` | — |
| required | 必填标记（显示星号；实际校验由 rules 决定） | `boolean` | `false` |
| rules | 该字段专属规则（与 Form 的 rules 合并） | `LhFormRule[]>` | — |
| customClass | 自定义类名 | `string` | — |

::: tip 与 Vue3 版的差异
- 校验触发：小程序控件无 change 语义，各表单控件把 blur / input 事件映射为校验触发。
- 表单提交：小程序表单语义不同，`validate` 返回 `Promise<boolean>` 供手动提交，
  没有 web 端的 `submit` 事件拦截。
:::
