# Badge 배지

아이콘 오른쪽 위 모서리의 배지로, 알림 개수, 상태 점 또는 커스텀 문구에 사용됩니다.

## 기본 사용법

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">메시지</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">주요</lh-button>
  </lh-badge>
</template>
```

## 수치 처리

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">max 초과 시 99+ 표시</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">0 표시</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">0 숨김</lh-button>
  </lh-badge>
  <lh-badge content="N">
    <lh-button size="small">커스텀 문구</lh-button>
  </lh-badge>
</template>
```

## 작은 빨간 점

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">새 메시지 있음</lh-button>
  </lh-badge>
</template>
```

## 오프셋과 크기

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">오프셋</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">작은 크기</lh-button>
  </lh-badge>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| type | 유형 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | 표시할 수치 | `string \| number` | — |
| size | 크기 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | 최대값, 초과 시 `${max}+` 표시 | `number` | `99` |
| isDot | 작은 빨간 점 여부(수치 표시 안 함) | `boolean` | `false` |
| hidden | 숨김 여부 | `boolean` | `false` |
| offset | 기본 위치 기준 오프셋 `[x, y]`, 음수 margin으로 구현 | `[number, number]` | — |
| showZero | value가 0일 때 표시 여부 | `boolean` | `false` |
| content | 커스텀 문구(value보다 우선) | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 배지가 붙는 내용 |

::: tip Vue3 버전과의 차이
등장 / 퇴장 애니메이션이 Vue 내장 `<transition>`에 의존하지 않고(미니프로그램의 전환 종료 이벤트는 신뢰할 수 없음),
class 전환 + 타이머로 0.15s 애니메이션 시간을 맞추며 시각적 표현은 plus와 일치합니다.
:::
