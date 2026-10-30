# Button 버튼

기본 버튼 컴포넌트입니다. 렌더링 대상은 uni 내장 `<button>`(각 단말의 네이티브 버튼으로 컴파일)이며, 클릭 이벤트는 uni
컴파일에 의해 `bindtap`이 됩니다.

## 기본 사용법

```vue
<template>
  <lh-button>기본</lh-button>
  <lh-button type="primary">주요</lh-button>
  <lh-button type="success">성공</lh-button>
  <lh-button type="warning">경고</lh-button>
  <lh-button type="danger">위험</lh-button>
  <lh-button type="info">정보</lh-button>
</template>
```

## 상태와 모양

```vue
<template>
  <lh-button loading>로딩 중</lh-button>
  <lh-button disabled>비활성화</lh-button>
  <lh-button plain>단순</lh-button>
  <lh-button round>둥근 모서리</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>블록(한 줄을 꽉 채움)</lh-button>
  <lh-button icon="search" type="primary">아이콘 포함</lh-button>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| type | 유형 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 크기(미지정 시 ConfigProvider에서 상속) | `'small' \| 'medium' \| 'large'` | — |
| loading | 로딩 중 상태 | `boolean` | `false` |
| disabled | 비활성화 | `boolean` | `false` |
| plain | 단순(테두리) 스타일 | `boolean` | `false` |
| block | 블록 레이아웃 | `boolean` | `false` |
| round | 둥근 모서리 | `boolean` | `false` |
| circle | 원형 | `boolean` | `false` |
| icon | 아이콘 이름 | `LhIconName` | — |
| customClass | 커스텀 클래스명(루트 노드로 전달) | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| bgPattern | 컴포넌트 수준 배경 문양 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| click | 클릭 | `(event)` |

::: tip Vue3 버전과의 차이
미니프로그램 button에는 `nativeType` / `href` / `target` 시맨틱이 없어, 이 세 속성은 본 라이브러리에서
**구현하지 않습니다**. 나머지 API는 동일합니다.
:::
