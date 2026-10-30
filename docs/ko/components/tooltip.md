# Tooltip 툴팁

## 기본 사용법

```vue
<template>
  <lh-tooltip content="이것은 팁 문구입니다">
    <lh-button>팁 보려면 클릭</lh-button>
  </lh-tooltip>
</template>
```

::: warning 미니프로그램에는 hover 시맨틱이 없음
`trigger`의 기본값은 `click`(모든 단말에서 사용 가능)입니다. `hover`는 H5에서만 유효합니다 —
미니프로그램 측에서는 `trigger="click"`을 사용하여 클릭 / 터치로 표시와 닫기를 하십시오.
:::

## 위치와 너비

```vue
<template>
  <lh-tooltip content="하단 팁" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="긴 문구는 자동으로 줄바꿈됩니다" :max-width="200" placement="top">
    <lh-button>너비 제한</lh-button>
  </lh-tooltip>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| content | 팁 문구 | `string` | — |
| placement | 레이어 위치(12개 방위) | `LhTooltipPlacementCore` | `'top'` |
| trigger | 트리거 방식: `click`(모든 단말) / `hover`(H5 전용) | `'click' \| 'hover'` | `'click'` |
| showDelay | 표시 지연(밀리초) | `number` | — |
| hideDelay | 숨김 지연(밀리초) | `number` | — |
| maxWidth | 최대 너비(내용 자동 줄바꿈) | `string \| number` | — |
| disabled | 비활성화 | `boolean` | `false` |
| customClass | 커스텀 클래스명 | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 표시 / 숨김 변화(제어형 사용) | `(visible: boolean)` |
| show | 표시 | — |
| hide | 숨김 | — |

::: tip Vue3 버전과의 차이
- 레이어는 `root-portal` + 2프레임 비동기 측정 위치 지정을 사용합니다(먼저 투명하게 렌더링하여 크기 측정 → 위치 지정 →
  표시, 깜빡임 방지).
- MP 측 `showDelay` / `hideDelay`는 click 모드에서만 즉시 동작을 유지합니다.
- 위치 계산은 비동기(`getLhRect`가 Promise 반환)이므로 동기적으로 결과를 받을 수 있다고 가정하면 안 됩니다.
:::
