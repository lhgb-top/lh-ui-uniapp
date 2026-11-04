# Spinner 스피너

진행 중 상태를 나타내는 기본 회전 도형입니다. 로딩 오버레이(LhLoading 서비스) 내부에서도 동일하게 렌더링됩니다.

## 기본 사용법

다섯 가지 크기: `mini` / `small` / `medium` / `large` / `x-large`. 지름은 `@lh-ui/share` core의 `LH_SPINNER_SIZE_PX` 상수가 단일 매핑합니다(12 / 16 / 24 / 32 / 40 px).

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## 색상 커스터마이징

`color`는 임의의 CSS color 값을 받습니다. 전달하지 않으면 현재 텍스트 색상(`currentColor`)을 상속합니다.

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## 텍스트 색상 상속

`color`를 전달하지 않으면 도형은 컨테이너의 텍스트 색상을 따라갑니다. 텍스트와 섞어 배치할 때 적합합니다.

```vue
<template>
  <view class="row">
    <text>불러오는 중…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| size | 크기 | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | 회전 색상 (CSS color 값, 미지정 시 currentColor 상속) | `string` | — |
| customClass | 사용자 정의 클래스명 | `string` | — |
| sx | 레이아웃 바로가기 속성 | `LhSxProps` | — |

## 플랫폼 차이

- **회전 애니메이션은 순수 CSS animation**으로 어떤 플랫폼 API에도 의존하지 않습니다. 모든 플랫폼에서 사용 가능하며 H5와 WeChat 미니프로그램에서 동일하게 동작합니다.
- **도형 렌더링은 플랫폼별로 분기됩니다**: H5에서는 svg 스트로크 링(`stroke-dasharray` 이중 애니메이션, Vue3 버전과 픽셀 단위로 동일)을 그립니다. 미니프로그램은 svg 템플릿 태그를 지원하지 않아 대신 `view` + `border` 링을 사용합니다 — 세 변을 채색하여 원의 약 4분의 3 호를 구성하고(Vue3 버전의 72% 호와 시각적으로 동형), 선 너비는 지름의 10%로 인라인 계산합니다(최소 1px). 양 플랫폼 모두 회전을 CSS animation으로 구동하므로 `transitionend`처럼 미니프로그램에서 신뢰할 수 없는 기능에는 의존하지 않습니다.
- **색상은 currentColor를 따릅니다**: `color` prop은 루트 노드의 인라인 `color` 스타일에 기록되고 도형이 이를 상속합니다. Vue3 버전과 동일합니다.
- **접근성**: 도형은 순수 장식이며 `aria-hidden="true"`로 접근성 트리에서 제외됩니다. 진행 중 상태의 의미는 상위 컨테이너(예: `role="status"`)가 담당해야 합니다.
- **모션 감소**: `prefers-reduced-motion` 시 정적 반원으로 낮추는 처리는 `@lh-ui/share`의 scss 소스가 제공합니다. 해당 미디어 쿼리 블록은 미니프로그램 빌드 시 전체가 제거되므로(WXSS 미지원) 이 낮춤은 H5에만 적용됩니다.
- **이식 결론**: spinner는 순수 표시 컴포넌트입니다(측정 / 오버레이 / document 의존 없음). 크기 매핑과 클래스명은 `@lh-ui/share` core의 순수 함수(`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`)가 산출하며 이 저장소는 반응형 접착제만 작성합니다.
