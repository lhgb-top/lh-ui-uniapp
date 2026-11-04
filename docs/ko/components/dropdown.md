# Dropdown 드롭다운

아래로 펼쳐지는 명령 메뉴입니다. 트리거는 어떤 요소든 될 수 있고, 메뉴 항목은 `command` 로 식별되며 클릭 시 `command` 이벤트로 전달됩니다.

## 기본 사용법

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || '더보기' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">새로 만들기</lh-dropdown-item>
      <lh-dropdown-item command="edit">편집</lh-dropdown-item>
      <lh-dropdown-item command="delete">삭제</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// 트리거 문구는 사용자가 관리합니다: command 이벤트는 명령 값만 전달하며,
// 라벨을 어떻게 표시할지는 외부에서 결정합니다
const labelMap: Record<string, string> = { new: '새로 만들기', edit: '편집', delete: '삭제' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## 트리거 방식

기본값은 `click` 이며, 호버와 길게 누르기도 사용할 수 있습니다.

```vue
<template>
  <!-- 호버로 열기 (H5 전용, 미니프로그램에서는 탭 토글로 강등) -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>호버로 열기 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">수묵</lh-dropdown-item>
      <lh-dropdown-item command="danqing">단청</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- 우클릭 / 길게 눌러 열기 -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>길게 눌러 열기 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">새로 고침</lh-dropdown-item>
      <lh-dropdown-item command="copy">복사</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 비활성화와 구분선

```vue
<template>
  <!-- 비활성 항목과 구분선이 있는 작업 메뉴 -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>작업 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">내보내기</lh-dropdown-item>
      <lh-dropdown-item command="import">가져오기</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">감사 로그</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">데이터 삭제</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> 비활성 항목에는 `aria-disabled="true"` 가 붙어 스크린 리더가 읽어줍니다. 다만 방향키는 건너뛰며, 클릭과 Enter/Space 로도 `command` 는 발생하지 않습니다.

## 위치와 최대 높이

```vue
<template>
  <!-- 하단 우측 정렬 + 최대 높이 제한(초과 시 스크롤) -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>하단 우측 정렬 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">제 {{ i }} 항목</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 제어 표시와 클릭 동작

`v-model:visible` 로 표시를 수동 제어할 수 있습니다. `hide-on-click` 은 선택 후 자동으로 닫을지 결정하고, `popper-class` 는 팝업에 커스텀 클래스를 추가합니다.

```vue
<template>
  <!-- 제어 표시: 선택 후에도 닫지 않음 -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? '접기' : '펼치기' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">복사(선택 후에도 닫지 않음)</lh-dropdown-item>
      <lh-dropdown-item command="paste">붙여넣기</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| trigger | 트리거 방식: `click` (전端) / `hover` (H5 전용, MP 에서는 탭 토글로 강등) / `contextmenu` (길게 누르기로 처리) | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | 표시 위치(12 종 방위) | `LhDropdownPlacement` | `'bottom-start'` |
| visible | 표시 상태(v-model:visible) | `boolean` | — |
| disabled | 트리거 비활성화 | `boolean` | `false` |
| hideOnClick | 메뉴 항목 클릭 후 자동으로 닫을지 | `boolean` | `true` |
| popperClass | 팝업의 커스텀 클래스명 | `string` | — |
| maxHeight | 메뉴 최대 높이(숫자는 px) | `string \| number` | — |
| themeVars | 컴포넌트 단위 테마 변수 | `Record<string, string>` | — |
| bgPattern | 컴포넌트 단위 배경 패턴(ConfigProvider 설정을 덮어씀) | `string` | — |
| sx | sx 퀵 레이아웃 속성(트리거 루트 요소에 적용) | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| command | 메뉴 항목 클릭 시 발생 | `(command: string \| number \| undefined)` |
| visible-change | 표시 상태 변화 | `(value: boolean)` |
| update:visible | 표시 상태 변화(v-model) | `(value: boolean)` |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 트리거 내용 |
| dropdown | 메뉴 내용(`LhDropdownItem` 목록) |

### Methods

| 메서드 | 설명 |
| --- | --- |
| show | 프로그래밍으로 열기 |
| hide | 프로그래밍으로 닫기 |
| toggle | 프로그래밍으로 전환 |

## DropdownItem API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| command | 명령 식별자. 클릭 시 `command` 이벤트로 전달 | `string \| number` | — |
| disabled | 비활성화 | `boolean` | `false` |
| divided | 위에 구분선 표시 | `boolean` | `false` |

### Events

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| click | 메뉴 항목 클릭 시 발생(비활성 항목은 발생하지 않음) | `(command: string \| number \| undefined)` |

### 접근성

- 트리거에는 `aria-haspopup="menu"` 와 `aria-expanded` / `aria-controls` 가 붙습니다. 메뉴는 `role="menu"`, 항목은 `role="menuitem"` 입니다
- 키보드는 APG menu 패턴을 따릅니다(H5 전용): ↑/↓ 순환(비활성 항목 건너뜀), Home/End 으로 처음과 끝으로 이동, Enter/Space 로 `command` 를 발생시키고 닫기, Esc 로 닫고 포커스 반환
- 메뉴가 펼쳐질 때 주축 넘침은 자동으로 방향을 뒤집고, 교차축 넘침은 뷰포트로 클램프됩니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **트리거 방식**: 미니프로그램에는 hover 시맨틱이 없어 `trigger="hover"` 는 MP 에서 탭 / 터치 토글로 강등됩니다. 우클릭도 없으므로 `trigger="contextmenu"` 는 길게 누르기(`longpress`)로 처리합니다(H5 도 길게 누르기로 통일. 브라우저 기본 우클릭 메뉴는 막지 않습니다. plus 는 `preventDefault` 합니다).
- **팝업의 캐리어와 위치 결정**: `teleportTarget` prop 이 없습니다. 미니프로그램에는 DOM teleport 가 없으므로 팝업은 `root-portal`(저버전은 페이지 내 fixed 폴백)이 담당합니다. 위치 결정은 2 프레임 비동기 측정(먼저 숨긴 상태로 렌더링해 크기 측정 → `computePosition` 으로 배치 → 표시, 깜빡임 방지)으로 진행되며, 계산은 비동기이므로 동기 결과를 가정할 수 없습니다.
- **키보드 내비게이션은 H5 전용**: 방향키 / Home / End / Enter / Space / Esc 는 H5 에서만 동작합니다(Esc 는 문서 단위 리스너로, 여러 팝업이 겹칠 때는 최상위만 닫습니다). 미니프로그램에는 키보드 이벤트가 없어 전체가 조건부 컴파일로 제거됩니다.
- **외부 클릭으로 닫기**는 페이지 내 투명 마스크가 담당합니다(plus 의 document 단위 click-outside 리스너와 동등).
- **개폐 트랜지션 미구현**: plus 는 `Transition` 으로 페이드하지만, MP 에서는 `Transition` 이 신뢰할 수 없어 tooltip / select 와 마찬가지로 바인딩하지 않습니다.
- **트리거가 뷰포트 밖으로 스크롤되어도 자동으로 닫지 않음**: plus 의 `useLhPopper` 에는 scroll-out 콜백이 있지만, uni-app 에는 통일된 스크롤 / 크기 변경 감지 수단이 없어 이식하지 않았습니다.
:::
