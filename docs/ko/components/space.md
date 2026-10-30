# Space 간격

레이아웃에서 인접 요소 사이의 간격을 위해 사용하며, 직접 작성한 margin을 대체합니다. 간격은 전적으로 CSS `gap`에
의존하며, 두 플랫폼 모두 네이티브로 지원합니다.

## 기본 사용법

```vue
<template>
  <lh-space>
    <lh-tag>수묵</lh-tag>
    <lh-tag>여백</lh-tag>
    <lh-tag>국풍</lh-tag>
  </lh-space>
</template>
```

## 방향

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>수묵</lh-tag>
    <lh-tag>여백</lh-tag>
  </lh-space>
</template>
```

## 간격 단계

사전 설정 단계는 spacing token을 참조합니다(`--lh-spacing-*`로 커스터마이즈 가능); 숫자는 px로 처리; 배열은 가로와
세로 간격을 각각 제어합니다.

```vue
<template>
  <lh-space size="small">
    <lh-tag>소</lh-tag>
    <lh-tag>소</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>중</lh-tag>
    <lh-tag>중</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>대</lh-tag>
    <lh-tag>대</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>가로 8</lh-tag>
    <lh-tag>세로 16</lh-tag>
  </lh-space>
</template>
```

## 정렬과 줄바꿈

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>가운데 정렬</lh-tag>
    <lh-button type="primary" size="small">버튼</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">태그{{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip 줄바꿈은 가로 방향에서만 유효
`wrap`은 `direction="horizontal"`일 때만 의미가 있으며, 세로 방향으로 전달하면 무시됩니다.
:::

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| direction | 배열 방향 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 간격: 사전 설정 단계 / 픽셀 숫자 / [가로, 세로] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | 줄바꿈 허용 여부(가로 방향만 해당) | `boolean` | `true` |
| alignment | 정렬 방식 | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 간격을 배치할 자식 요소 |
