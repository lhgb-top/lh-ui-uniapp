# Link 링크

의미 타입, 밑줄 형태, 앞뒤 아이콘 슬롯을 지원하는 텍스트 하이퍼링크입니다.

## 기본 사용법

```vue
<template>
  <lh-link>기본 링크</lh-link>
  <lh-link type="primary">주요 링크</lh-link>
</template>
```

`type`: `default`(기본) / `primary` / `success` / `warning` / `danger` / `info`.

## 밑줄

```vue
<template>
  <lh-link underline="always">항상</lh-link>
  <lh-link underline="none">없음</lh-link>
</template>
```

`underline`: `always` 항상 / `hover` 호버 시 표시(기본) / `none` 없음.

## 비활성화와 앞뒤 아이콘

```vue
<template>
  <lh-link disabled>비활성화된 링크</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    이전 페이지
  </lh-link>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| href | 링크 주소(disabled일 때 href를 렌더링하지 않음) | `string` | — |
| target | 대상 창(H5 전용) | `string` | — |
| type | 링크 의미 타입 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | 밑줄 형태 | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | 비활성화 | `boolean` | `false` |
| current | 현재 페이지 표시(`aria-current` 출력) | `'page' \| 'location' \| true` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 링크 텍스트 |
| prefix | 앞쪽 아이콘 자리 |
| suffix | 뒤쪽 아이콘 자리 |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| click | 클릭 | `(event: Event)` |

## 플랫폼 차이

| 기능 | H5 | 미니프로그램 |
| --- | --- | --- |
| 렌더링 요소 | view + `@click` | H5와 동일(`href` / `target`은 내비게이션 의미가 없고, 이동은 `click` 이벤트에서 비즈니스층이 처리) |
| 호버 밑줄 | 있음 | 없음(`underline="always"` / `"none"`은 표시됨, VIEW의 밑줄 렌더링은 실제 표시에 따름) |
