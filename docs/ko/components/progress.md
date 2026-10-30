# Progress 진행률 표시줄

작업 진행률을 표시하며, 상태 색상, 커스텀 색상과 텍스트 포맷을 지원합니다.

## 기본 사용법

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## 상태

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

`status`가 `normal`이고 100에 도달하면 자동으로 `success`로 간주됩니다.

## 선 너비와 텍스트 숨김

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## 커스텀 색상

문자열은 막대 색상으로 직접 사용되고, 함수는 백분율에 따라 색상을 반환합니다.

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## 커스텀 포맷과 텍스트 슬롯

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `진행률 ${p}`
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| percentage | 진행률 백분율 0-100(초과 시 자동으로 클램프) | `number` | `0` |
| type | 유형 | `'line' \| 'circle'` | `'line'` |
| status | 상태 | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | 진행률 표시줄 색상: 문자열 또는 백분율에 따라 색상을 반환하는 함수 | `string \| ((percentage: number) => string)` | — |
| strokeWidth | 선 너비 px | `number` | `6` |
| width | 원형 모드 캔버스 너비 px | `number` | `126` |
| showText | 텍스트 표시 여부 | `boolean` | `true` |
| format | 커스텀 텍스트 포맷 | `(percentage: number) => string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 | 스코프 매개변수 |
| --- | --- | --- |
| text | 커스텀 진행률 텍스트 | `{ percentage: number }` |

::: tip circle 형은 아직 구현되지 않음
미니프로그램은 svg 지원이 제한적어 초판은 line 형만 구현합니다. `type="circle"`을 전달하면 line으로 렌더링되고
개발 중 한 번 경고합니다(조용히 폴백하지 않으며), circle은 2차에 남겨둡니다.
:::
