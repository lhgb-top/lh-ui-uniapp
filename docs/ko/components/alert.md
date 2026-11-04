# Alert 경고

페이지 내 중요한 의미적 피드백(성공 / 경고 / 오류 / 정보)을 표시합니다. 제목, 설명, 의미 아이콘, 닫기 동작을 지원합니다.

## 기본 사용법

```vue
<template>
  <lh-alert title="정보">
    현재 작업이 저장되었으며 언제든 다시 편집할 수 있습니다.
  </lh-alert>
</template>
```

제목은 `title` prop 또는 동일한 이름의 슬롯으로 전달할 수 있으며, 기본 슬롯은 설명 내용을 담습니다.

## 의미 타입

```vue
<template>
  <lh-alert type="success" title="성공">
    데이터 동기화가 완료되었습니다.
  </lh-alert>
  <lh-alert type="warning" title="경고">
    잔액이 부족합니다. 충전해 주세요.
  </lh-alert>
  <lh-alert type="danger" title="오류">
    제출에 실패했습니다. 네트워크를 확인 후 다시 시도해 주세요.
  </lh-alert>
  <lh-alert type="info" title="정보">
    새 버전이 다음 주에 출시될 예정입니다.
  </lh-alert>
</template>
```

## 의미 아이콘

```vue
<template>
  <lh-alert show-icon type="success" title="아이콘이 포함된 성공 메시지">
    아이콘 색상은 의미 타입을 자동으로 따라갑니다.
  </lh-alert>
</template>
```

## 닫기 가능

```vue
<template>
  <lh-alert closable title="닫을 수 있는 경고">
    우측 닫기 아이콘을 클릭하면 컴포넌트가 숨겨지고 close 이벤트가 발생합니다.
  </lh-alert>
</template>
```

## 플레인 스타일

```vue
<template>
  <lh-alert plain title="플레인 스타일">
    투명한 배경에 의미 색상 테두리. 간결한 목록에 적합합니다.
  </lh-alert>
</template>
```

## Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| type | 의미 타입 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | 제목 (title 슬롯 사용 가능) | `string` | — |
| closable | 닫기 가능 여부 | `boolean` | `false` |
| showIcon | 의미 아이콘 표시 여부 | `boolean` | `false` |
| plain | 플레인(밝은) 스타일 여부 | `boolean` | `false` |
| closeLabel | 닫기 버튼의 접근성 이름 (미지정 시 `alert.close` 언어 리소스) | `string` | — |
| customClass | 사용자 정의 클래스명 | `string` | — |
| sx | 레이아웃 바로가기 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 인자 |
| --- | --- | --- |
| close | 닫기 버튼을 클릭할 때 발생 (직후 컴포넌트 숨김) | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 설명 내용 |
| title | 제목 내용 (title prop보다 우선) |

## 플랫폼 차이

- **접근성 역할**: `warning` / `danger`는 `role="alert"`(즉시 알림), `info` / `success`는 `role="status"`(대기열 알림)로 렌더링되며, plus 측 APG 의미와 일치합니다. 플랫폼 간 차이는 없습니다.
- **태그 치환**: plus의 `<div>` / `<span>` / `<p>`는 `view`로 대체됩니다(WXSS는 태그 선택자를 금지하므로 스타일은 `lh-alert__*` 클래스명으로 적용됩니다).
- **아이콘**: 인라인 svg는 미니프로그램에서 지원되지 않아 `lh-icon` 노드(`info` / `check` / `warning` / `error`)로 통일되며, `lh-alert__icon` 클래스는 share scss와 공통입니다.
- **닫기 버튼**: plus의 `<button type="button">`은 `role="button"`을 가진 `view`로 대체됩니다. 접근성 이름도 동일하게 `closeLabel` 또는 `alert.close` 언어 리소스에서 가져옵니다(9개 언어 모두 제공).
- **등장/퇴장 애니메이션 없음**: plus 측도 닫을 때 `v-if`로 노드를 제거할 뿐(`<transition>`으로 감싸지 않음)이므로, 이 저장소의 동작은 완전히 동일하며 미니프로그램의 `transitionend` 신뢰성 문제와 무관합니다.
- **이식 결론**: alert은 순수 표시 컴포넌트입니다(측정 / 오버레이 / 포커스 트랩 / document 의존 없음). 모든 플랫폼에서 사용 가능하며 H5와 WeChat 미니프로그램에서 동일하게 동작합니다.
