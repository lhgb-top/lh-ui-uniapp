# Breadcrumb breadcrumb

현재 페이지의 경로를 표시하여 이전의任意 페이지로 빠르게 돌아갈 수 있게 합니다.

## 기본 사용

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>홈</lh-breadcrumb-item>
    <lh-breadcrumb-item>컴포넌트</lh-breadcrumb-item>
    <lh-breadcrumb-item>Breadcrumb</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 클릭 가능한 이동 항목

마지막 항목이 아닌 곳에 `to`를 전달하면 링크 스타일로 렌더링되며, 클릭 시 `uni.navigateTo`로 이동합니다(url은 `/`로 시작하는 페이지 경로여야 합니다).

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">홈</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">컴포넌트</lh-breadcrumb-item>
    <lh-breadcrumb-item>Breadcrumb</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 접기

`maxItems`가 보이는 항목 수의 상한(말줄임 포함)을 제어합니다. 초과하면 첫 항목 + 말줄임 + 마지막 몇 항목을 남기고, 말줄임을 클릭하면 모두 펼쳐집니다.

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>홈</lh-breadcrumb-item>
    <lh-breadcrumb-item>이벤트</lh-breadcrumb-item>
    <lh-breadcrumb-item>목록</lh-breadcrumb-item>
    <lh-breadcrumb-item>상세</lh-breadcrumb-item>
    <lh-breadcrumb-item>리뷰</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| separator | 구분자 문자 | `string` | `'/'` |
| maxItems | 최대 보이는 항목 수(첫 항목 + 말줄임 + 마지막 몇 항목). 초과 시 접히며 `0`은 접지 않음 | `number` | `0` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 레이아웃 간편 속성 | `LhSxProps` | — |

## BreadcrumbItem Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| to | 이동 주소. 설정되어 있고 마지막 항목이 아니면 링크로 렌더링되고 클릭 시 `uni.navigateTo` 실행 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |

## Slots

| Slot | 설명 |
| --- | --- |
| default | breadcrumb 항목의 텍스트 내용 |

::: tip Vue3 버전과의 차이
- `to`는 vue-router를 쓰지 않음(uni-app 프로젝트에는 router가 없음): 항상 `uni.navigateTo`. H5에서는 uni의 H5 라우팅 정책을 따름.
- `<nav>/<ol>/<li>`를 `<view>`로 대체(WXSS는 태그 선택자를 금지). `aria-current="page"`와 `aria-label`은 유지.
- 접기/말줄임 로직은 같은 share core 순수 함수를 재사용하며 plus와 동일하게 동작.
:::
