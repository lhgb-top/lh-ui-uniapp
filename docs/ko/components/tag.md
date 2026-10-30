# Tag 태그

## 기본 사용법

```vue
<template>
  <lh-tag>기본</lh-tag>
  <lh-tag type="primary">주요</lh-tag>
  <lh-tag type="success">성공</lh-tag>
  <lh-tag type="warning">경고</lh-tag>
  <lh-tag type="danger">위험</lh-tag>
</template>
```

## 스타일과 닫기

```vue
<template>
  <lh-tag round>둥근 모서리</lh-tag>
  <lh-tag hit>테두리</lh-tag>
  <lh-tag closable @close="onClose">닫기 가능</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('닫았습니다')
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| type | 유형 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 크기 | `'small' \| 'medium' \| 'large'` | — |
| closable | 닫기 가능 | `boolean` | `false` |
| disabled | 비활성화 | `boolean` | `false` |
| round | 둥근 모서리 | `boolean` | `false` |
| hit | 테두리(채움 없음) | `boolean` | `false` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| close | 닫기 버튼 클릭 | — |

::: tip Vue3 버전과의 차이
닫기 버튼의 인라인 SVG가 본 라이브러리에서는 lh-icon으로 교체되었습니다(iconfont 방식).
:::
