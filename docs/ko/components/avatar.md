# Avatar 아바타

사용자나 사물의 아바타를 표시하며, 이미지, 아이콘, 텍스트 세 가지 형태를 지원합니다.

## 기본 사용법

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="수묵" />
</template>
```

## 모양과 크기

```vue
<template>
  <lh-avatar text="물" shape="circle" />
  <lh-avatar text="먹" shape="square" />
  <lh-avatar text="소" size="small" />
  <lh-avatar text="대" size="large" />
</template>
```

## 자르기 모드

`fit`은 uni `<image>`의 `mode`에 매핑됩니다: `fill` → `scaleToFill`, `contain` → `aspectFit`, `cover` →
`aspectFill`, `none` → `center`.

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down은 근사치
uni에는 `scale-down`에 대응하는 mode가 없어, 의미상 가장 가까운 `aspectFit`(비율을 유지하며 완전히 표시, 확장하지
않음)을 사용합니다.
:::

## 로딩 실패 폴백

이미지 로딩 실패 시 "아이콘 → 텍스트 → 빈" 순서로 폴백하며 `error` 이벤트를 트리거합니다.

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="아바타"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('이미지 로딩 실패')
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| src | 이미지 주소; 비어 있을 때 순서대로 아이콘, 텍스트로 폴백 | `string` | — |
| alt | 이미지 로딩 실패 시 대체 텍스트이자 접근성 이름 | `string` | — |
| icon | 아이콘 이름(src가 비어 있거나 로딩 실패 시 표시) | `LhIconName` | — |
| text | 텍스트 아바타 내용(src와 icon이 모두 없을 때 첫 글자를 취해 표시) | `string` | — |
| shape | 모양 | `'circle' \| 'square'` | `'circle'` |
| size | 크기 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | 이미지 자르기 모드(uni image의 mode에 매핑) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| error | 이미지 로딩 실패 | `(e: Event)` |
