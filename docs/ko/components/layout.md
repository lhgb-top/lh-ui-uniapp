# Layout 레이아웃 컨테이너

페이지 수준의 뼈대: `lh-layout`에 `lh-header` / `lh-aside` / `lh-main` / `lh-footer` 하위 컴포넌트를 조합합니다 (easycom 으로 태그를 그대로 사용 가능; 필요에 따라 import 할 때 컴포넌트 이름은 `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`).

## 기본 사용법 (상단 / 본문 / 하단)

컨테이너에는 명시적인 높이가 필요합니다: `lh-layout` 자체가 `flex: 1` 플렉스 컨테이너이므로, 일반 플로우 부모 안에 놓을 때는 `sx`나 바깥 스타일로 높이를 주어야 header / main / footer 자식들이 비율에 맞게 펼쳐집니다.

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>헤더</lh-header>
    <lh-main>콘텐츠</lh-main>
    <lh-footer>푸터</lh-footer>
  </lh-layout>
</template>
```

## 배치 방향

`direction`이 자식의 배치 방향을 명시적으로 제어합니다: 기본값은 `horizontal`(나란히)이며, `lh-aside`가 있으면 자동으로 `vertical`로 전환되고 수동 지정도 가능합니다.

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>나란히 배치</lh-main>
    <lh-main>나란히 배치</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>세로로 쌓기</lh-main>
    <lh-main>세로로 쌓기</lh-main>
  </lh-layout>
</template>
```

## 사이드바 레이아웃

`lh-aside`가 있으면 부모가 자동으로 세로 방향으로 전환됩니다 (header가 위, aside와 main이 나란히).

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>헤더</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="사이드 내비게이션">사이드바</lh-aside>
      <lh-main>콘텐츠</lh-main>
    </lh-layout>
    <lh-footer>푸터</lh-footer>
  </lh-layout>
</template>
```

`width`는 `number`(px 단위)와 단위가 포함된 `string`(예: `'30%'`)을 허용합니다. 생략 시 `--lh-layout-aside-width`(기본 220px)를 사용합니다.

## Layout Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| direction | 배치 방향 (Aside가 있으면 자동으로 vertical) | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | 커스텀 클래스명 (루트 노드로 전달) | `string` | — |
| sx | sx 간편 레이아웃 속성 | `LhSxProps` | — |

## Header / Main / Footer Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| customClass | 커스텀 클래스명 (루트 노드로 전달) | `string` | — |
| sx | sx 간편 레이아웃 속성 | `LhSxProps` | — |

## Aside Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| width | 사이드바 너비 | `number \| string` | — |
| ariaLabel | 접근성 이름 (landmark 명명) | `string` | — |
| customClass | 커스텀 클래스명 (루트 노드로 전달) | `string` | — |
| sx | sx 간편 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 레이아웃 콘텐츠 (다섯 컴포넌트 모두 기본 슬롯 제공) |

## 플랫폼 차이

- **순수 CSS 레이아웃 컴포넌트**: share core에 layout 모듈이 없고, 로직 계층은 provide/inject 컨텍스트(Aside가 등록되면 부모가 세로 방향으로 전환)만 가집니다. 측정, 오버레이, document 의존성이 없어 H5와 WeChat 미니프로그램에서 동작이 동일합니다.
- **태그 대체**: plus 버전의 `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>`는 모두 `view`로 대체됩니다 (WXSS는 태그 셀렉터를 금지하며 스타일은 `lh-layout*` 클래스명으로 적용).
- **landmark 시맨틱**: 시맨틱 태그가 자연히 제공하던 landmark role을 `role` 속성으로 복원합니다 — header는 `banner`, aside는 `complementary`, main은 `main`, footer는 `contentinfo`. 여러 `aside`를 사용할 때는 `ariaLabel`로 구분을 권장합니다 (예: "사이드 내비게이션", "관련 링크").
- **스크롤 컨테이너**: `lh-main`과 `lh-aside`의 `overflow: auto`는 H5에서 요소 자체 스크롤입니다; **미니프로그램 페이지 자체에는 스크롤 가능한 body 컨테이너가 없습니다** (페이지 스크롤은 `page` 루트 노드가 담당). 미니프로그램에서 페이지 전체 콘텐츠를 `lh-main`에 직접 넣으면 요소 스크롤과 페이지 스크롤이 겹쳐 이중 스크롤바가 나타날 수 있습니다. 사이드바가 있는 전체 페이지 레이아웃에서는 바깥 래퍼에 `h: '100vh'`를 주어 `lh-main`이 직접 스크롤하게 하거나, 필요에 따라 콘텐츠를 `scroll-view`로 감싸세요.
- **포팅 결론**: 모든 플랫폼에서 사용 가능하며 동작은 plus와 동일합니다. 유의해야 할 점은 미니프로그램의 "페이지 수준 스크롤 vs 요소 수준 스크롤"이라는 컨테이너 시맨틱뿐입니다.

::: tip Vue3 버전과의 차이
- 시맨틱 태그가 `view`와 `role` 속성으로 대체되며 (WXSS는 태그 셀렉터 금지) 접근성 시맨틱은 유지됩니다.
- 하위 컴포넌트 태그는 easycom 규칙을 따라 `lh-header` / `lh-aside` / `lh-main` / `lh-footer`입니다 (필요에 따라 import 할 때 대응하는 컴포넌트 이름은 `LhHeader` 등).
- `customClass` prop이 추가되었습니다: uni-app에서는 일반 클래스가 `styleIsolation`을 통과하지 못해 prop으로 전달합니다 (plus 버전은 클래스를 직접 전달).
- 배치 방향과 Aside 감지 시 세로 전환하는 provide/inject 메커니즘은 plus와 완전히 동일합니다.
:::
