# Popconfirm 확인 버블

가벼운 2차 확인: 트리거 근처에 확인 버블을 띄워 대화상자를 열 필요가 없습니다. 의미는 차단형 확인(`role="alertdialog"`)이며 Escape 는 취소로 처리됩니다. 확인 내용은 `content` 슬롯이나 `title` 속성으로 전달하고, 트리거는 기본 슬롯에 감쌉니다.

## 기본 사용법

```vue
<template>
  <lh-popconfirm title="이 기록을 삭제하시겠습니까?" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">삭제</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = '확인됨'
}
function onCancel() {
  action.value = '취소됨'
}
</script>
```

::: warning 미니프로그램에는 hover / focus 의미론이 없습니다
`trigger` 의 기본값은 `click`(전 단말 사용 가능)입니다. `hover` / `focus` 는 H5 에서만 유효——미니프로그램에서는 탭 전환으로 자동 다운그레이드됩니다(첫 탭으로 열기, 다시 탭으로 닫기).
:::

## 세 가지 톤

`type` 이 톤 아이콘과 수식 클래스를 결정합니다: `info`(정보) / `warning`(경고, 기본값) / `danger`(위험).

```vue
<template>
  <lh-popconfirm type="info" title="이 기록의 접속 로그를 보시겠습니까?">
    <lh-button>정보</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="이 작업은 모든 멤버에게 알립니다.">
    <lh-button type="warning">경고</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="삭제하면 복구할 수 없습니다.">
    <lh-button type="danger">위험</lh-button>
  </lh-popconfirm>
</template>
```

## 사용자 정의 문구와 방위

```vue
<template>
  <lh-popconfirm
    title="보관 후 휴지통에서 복원할 수 있습니다."
    confirm-text="보관"
    cancel-text="다시 생각"
    placement="right"
  >
    <lh-button>사용자 정의 문구</lh-button>
  </lh-popconfirm>

  <!-- 호버 트리거(H5 에서만 유효, 미니프로그램에서는 탭 전환으로 다운그레이드) -->
  <lh-popconfirm title="가리키면 확인됩니다." trigger="hover" :show-after="0" placement="bottom">
    <lh-button>호버 트리거</lh-button>
  </lh-popconfirm>
</template>
```

> 버튼 문구는 기본적으로 언어팩의 `popconfirm.confirm` / `popconfirm.cancel` 을 사용하며, `confirm-text` / `cancel-text` 로 재정의할 수 있습니다.

## 제어형 표시와 아이콘

```vue
<template>
  <!-- 제어형: 표시 여부를 완전히 외부 v-model:visible 이 제어 -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="제어 버블">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? '접기' : '펼치기' }}</lh-button>
  </lh-popconfirm>

  <!-- 아이콘 스위치와 확인 버튼 타입 -->
  <lh-popconfirm title="이 기록을 삭제하시겠습니까?" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">아이콘 없음</lh-button>
  </lh-popconfirm>

  <!-- 비활성화 -->
  <lh-popconfirm title="이 작업은 사용할 수 없습니다." disabled>
    <lh-button disabled>비활성</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| type | 확인 톤: `info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | 표시 위치(12 방위) | `LhPopconfirmPlacement` | `'top'` |
| trigger | 트리거 방식: `click`(전 단말) / `hover`, `focus`(H5 전용, MP 는 탭으로 다운그레이드) / `manual`(제어형) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 확인 내용(content 슬롯도 가능) | `string` | — |
| confirmText | 확인 버튼 문구(미지정 시 언어팩 popconfirm.confirm) | `string` | — |
| cancelText | 취소 버튼 문구(미지정 시 언어팩 popconfirm.cancel) | `string` | — |
| confirmButtonType | 확인 버튼 타입 | `'default' \| 'primary'` | `'primary'` |
| visible | 수동 제어 표시 상태(v-model:visible) | `boolean` | — |
| disabled | 비활성화 여부 | `boolean` | `false` |
| showIcon | 톤 아이콘 표시 여부 | `boolean` | `true` |
| popperClass | 팝업층 사용자 정의 클래스명 | `string` | — |
| showAfter | 표시 지연(ms, H5 의 hover / focus 에만 유효) | `number` | — |
| hideAfter | 숨김 지연(ms, H5 의 hover / focus 에만 유효) | `number` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| bgPattern | 컴포넌트 수준 배경 패턴, ConfigProvider 설정 재정의 | `string` | — |
| sx | sx 빠른 레이아웃 속성(트리거 루트 요소에 적용) | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| confirm | 확인 버튼 클릭 후 발생 | — |
| cancel | 취소 버튼 클릭 또는 Escape 누름 후 발생 | — |
| update:visible | 표시 상태 변화(v-model) | `(value: boolean)` |
| show | 표시 후 발생 | — |
| hide | 숨김 후 발생 | — |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 트리거 내용 |
| content | 사용자 정의 확인 내용 |

### Methods

| 메서드 | 설명 |
| --- | --- |
| show | 프로그래밍 방식 표시 |
| hide | 프로그래밍 방식 숨김 |
| toggle | 프로그래밍 방식 전환 |

### 접근성

- 팝업층은 `role="alertdialog"` + `aria-modal="true"`, 확인 내용은 `aria-labelledby` 로 연결; 트리거는 `aria-haspopup` / `aria-expanded` / `aria-controls` 를 가집니다(속성 팩은 share 순수 함수가 생성)
- Escape 는 취소로 처리(WAI-ARIA alertdialog 패턴 준수: Escape 로 닫고 부정으로 간주); 여러 팝업이 겹쳐 있을 때 Esc 는 최상위만 닫습니다(H5 전용)
- 취소 버튼 클릭, 확인 버튼 외부의 투명 마스크 클릭 모두 닫힙니다; 톤 아이콘은 장식용(`aria-hidden`)
- 위치 엔진은 자체 개발 순수 함수(flip / shift 넘침 방지)로, 서드파티 런타임 의존성이 없습니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **트리거 방식**: 미니프로그램에는 hover / focus 의미론이 없어 `trigger="hover"` / `trigger="focus"` 는 MP 에서 탭/터치 전환으로 다운그레이드; 표시 지연(`showAfter` / `hideAfter`)은 H5 의 hover / focus 모드에서만 유효하고, `click` 과 `manual` 은 즉시 응답합니다.
- **팝업층 운반과 위치**: `teleportTarget` prop 없음——미니프로그램에는 DOM teleport 가 없어 팝업층은 `root-portal`(저버전은 페이지 내 fixed 폴백)이 운반; popper 위치는 2 프레임 비동기 측정(숨김 렌더링으로 크기 측정 → `computePosition` 배치 → 표시, 깜빡임 방지)으로, 위치 계산은 비동기이므로 동기적으로 결과를 얻을 수 있다고 가정하면 안 됩니다; 화살표 오프셋은 컴포넌트 글루가 위치 결과의 `arrowOffset` 을 `--lh-arrow-offset` 에 기록합니다.
- **키보드 동작은 H5 전용**: Esc = 취소는 문서 레벨 리스너(여러 팝업 중첩 시 최상위만 닫음); 미니프로그램에는 키보드 이벤트가 없어 전체가 조건부 컴파일로 제거됩니다.
- **포커스 트랩 미이식**: plus 는 열릴 때 포커스를 「확인」 버튼에 두고, Tab 이 두 버튼 사이를 순환하며 팝업층에 가두고(focus-trap), 닫을 때 포커스를 반환합니다; MP 에는 키보드 포커스 의미론이 없어 본 저장소의 Dialog / Popover 와 같이 전체를 이식하지 않습니다.
- **进出 전환 미구현**: plus 는 `Transition` 으로 페이드 인/아웃(`lh-popconfirm-fade`); MP 에서 `Transition` 이 불안정하여 tooltip / dropdown / popover 와 마찬가지로 전환을 바인딩하지 않습니다.
- **트리거가 뷰포트 밖으로 스크롤되어도 자동으로 닫히지 않음**: plus 의 `useLhPopper` 에는 scroll-out 콜백이 있지만, uni-app 에는 통합된 스크롤/크기 변경 감시 채널이 없어 미이식입니다.
- **aria-haspopup 값**: plus 템플릿은 `aria-haspopup="dialog"` 를 하드코딩하지만, 본 저장소의 트리거 속성 팩은 share 의 `getPopconfirmTriggerAria` 가 통일 생성(값 `'true'`)하며, 계약은 share 순수 함수를 따릅니다.
:::
