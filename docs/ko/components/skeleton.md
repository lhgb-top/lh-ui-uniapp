# Skeleton 스켈레톤

데이터 로딩이 준비되지 않았을 때의 자리 표시이며, `loading`이 false일 때 실제 내용을 렌더링합니다.

## 기본 사용법

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>실제 내용</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## 줄 수와 아바타

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## 애니메이션 끄기

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## 독립 자리 표시 블록

`lh-skeleton-item`은 단독으로 사용하여 커스텀 자리 표시 레이아웃을 조립할 수 있으며, `variant`는
`text` / `rect` / `circle`을 취합니다.

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props(lh-skeleton)

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| loading | 로딩 상태인지 여부(false일 때 default 슬롯의 실제 내용 렌더링) | `boolean` | `true` |
| rows | 텍스트 줄 수 | `number` | `3` |
| avatar | 원형 아바타 자리 표시 포함 여부 | `boolean` | `false` |
| animated | 애니메이션 활성화 여부 | `boolean` | `true` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Props(lh-skeleton-item)

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| variant | 자리 표시 블록 모양 | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | 애니메이션 활성화 여부 | `boolean` | `true` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots(lh-skeleton)

| 슬롯 | 설명 |
| --- | --- |
| default | `loading`이 false일 때 렌더링되는 실제 내용 |

::: tip 접근성
컨테이너에 `aria-busy="true"`와 `aria-live="polite"`가 표시되어 있으며, 자리 표시 블록 자체는 보조 기술에서
숨겨집니다; 데이터가 준비되면 화면 판독기가 자동으로 실제 내용을 읽어줍니다.
:::
