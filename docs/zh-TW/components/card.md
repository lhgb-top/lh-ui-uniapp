# Card 卡片

資訊聚合容器，支援封面、頭部、主體、底部與載入佔位。

## 基礎用法

```vue
<template>
  <lh-card title="水墨">
    <view>卡片内容</view>
  </lh-card>
</template>
```

## 封面與底部

```vue
<template>
  <lh-card title="山水册页">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>卡片内容</view>
    <template #footer>
      <view>底部操作</view>
    </template>
  </lh-card>
</template>
```

::: tip 封面內子元素需自設寬度
share 的「封面子元素撐滿寬度」規則（`.lh-card__cover > *`）依賴 WXSS 不支援的萬用選擇器，淨化管線會丟棄它。小程序端請給封面內的 `<image>` 等子元素明確寫寬度（如 `width: 100%`）。
:::

## 頭部右側操作區

`extra` 插槽渲染在標題右側，僅在存在 `title` 或 `header` 插槽時出現。

```vue
<template>
  <lh-card title="订单">
    <template #extra>
      <lh-button size="small" text>查看更多</lh-button>
    </template>
    <view>卡片内容</view>
  </lh-card>
</template>
```

## 陰影與可點選

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>悬停浮起，点击触发事件</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('点击卡片')
</script>
```

## 載入佔位

```vue
<template>
  <lh-card title="水墨" loading>
    <view>内容加载中时不渲染</view>
  </lh-card>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| title | 卡片標題（也可用 header 插槽） | `string` | — |
| shadow | 陰影顯示時機 | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | 整卡可點選（承擔 button 鍵盤語義） | `boolean` | `false` |
| loading | 載入態：內容區以骨架佔位 | `boolean` | `false` |
| themeVars | 元件級主題變數（鍵自動加 `--lh-` 前綴） | `Record<string, string>` | — |
| bgPattern | 花紋背景 URL（如 `var(--lh-pattern-willow)`），不受全域白名單限制 | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| click | 點選整卡（僅 `clickable` 時觸發） | `(e: Event)` |

## Slots

| 插槽 | 說明 |
| --- | --- |
| cover | 封面 |
| header | 頭部（優先於 title） |
| extra | 頭部右側操作區（依賴頭部存在） |
| default | 主體內容 |
| footer | 底部 |

::: tip 鍵盤啟用僅 H5
`clickable` 的卡片在 H5 支援 Enter / Space 鍵盤啟用（對齊 APG button pattern）；小程序無鍵盤事件，該處理由條件編譯在 MP 端剔除。
:::
