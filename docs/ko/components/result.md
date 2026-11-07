# Result 결과

피드백 흐름의 끝을 알려주는 결과 표시로, 상태 아이콘과 배색을 기본 제공합니다.

## 기본 사용법

```vue
<template>
  <lh-result
    status="success"
    title="제출 성공"
    sub-title="작업 오더가 다음 단계로 넘어갔습니다"
  />
</template>
```

네 가지 상태: `success` / `warning` / `error` / `info`(기본 `info`). 각각 기본 아이콘과 배색을 가지며, 잘못된 상태값은 `info`로 대체됩니다.

## 커스텀 아이콘

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="좋아요·즐겨찾기"
  />
</template>
```

`icon`에 빈 문자열 `""`을 전달하면 아이콘을 렌더링하지 않습니다. 전달하지 않으면 상태 기본 아이콘을 사용합니다.

## 슬롯

```vue
<template>
  <lh-result status="success">
    <template #subTitle> 커스텀 부제목 </template>
    <template #extra>
      <lh-button type="primary" size="small">홈으로</lh-button>
    </template>
  </lh-result>
</template>
```

`title` / `subTitle` / `extra` 세 슬롯 모두 같은 이름의 prop을 덮어씁니다.

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| status | 결과 상태 | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | 커스텀 아이콘명(상태 기본 아이콘을 덮어씀, 빈 문자열은 렌더링하지 않음) | `string` | — |
| iconSize | 아이콘 크기 | `string \| number` | `64` |
| title | 제목 | `string` | — |
| subTitle | 부제목 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| title | 제목(title prop 덮어씀) |
| subTitle | 부제목(subTitle prop 덮어씀) |
| extra | 하단 작업 영역 |
