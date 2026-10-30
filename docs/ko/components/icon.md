# Icon 아이콘

::: tip 미니프로그램 측은 폰트 렌더링
web 버전(plus)은 인라인 `<svg><path>`를 사용하지만, 미니프로그램은 **`<svg>` 태그를 지원하지 않습니다**.
본 라이브러리는 빌드 시 share의 SVG path 집합을 iconfont 폰트로 변환합니다(base64가 `iconfont.css`에 인라인),
컴포넌트는 `<text class="lh-iconfont lh-iconfont--<name>">`를 렌더링합니다.
색상은 CSS `color`를 사용하고(**`fill` / `stroke`는 사용 불가**), web 버전의 `currentColor` 시맨틱을 완전히
대체합니다.
:::

## 기본 사용법

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| name | 아이콘 이름(share의 `LH_ICON_SVGS_CONST` 키) | `LhIconName` | — |
| size | 크기(숫자는 px로 처리; 문자열은 그대로 전달, 예: `'1.5em'`) | `string \| number` | — |
| color | 색상(web 버전 `currentColor` 대체) | `string` | — |
| customClass | 커스텀 클래스명(루트 노드로 전달) | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| bgPattern | 컴포넌트 수준 배경 문양 | `string` | — |

## 아이콘 목록

총 37개 아이콘(24×24 단색, 단일 path)이며, 모두 `@lh-ui/share`의 `LH_ICON_SVGS_CONST`에서 왔습니다.
빌드 명령 `pnpm build:iconfont`을 실행하면 폰트와 코드 포인트 매핑(`src/icon/icon-map.ts`)이 다시 생성됩니다.

::: warning 폰트 스타일 import를 잊지 마세요
사용자는 `@lh-ui/uniapp/src/icon/iconfont.css`를 import해야 하며, 그렇지 않으면 아이콘이 빈 사각형으로 표시됩니다.
:::
