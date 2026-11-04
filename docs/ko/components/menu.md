# Menu 내비게이션 메뉴

페이지와 기능 내비게이션 메뉴입니다. 세로(기본)와 가로 두 가지 레이아웃 모드를 지원하고 서브메뉴는 재귀적으로 중첩할 수 있습니다.
선택 상태는 `v-model`이 유지하고, 펼침 상태는 제어 가능(`openeds`)하게 하거나 내부에 맡길(`default-openeds`) 수 있습니다.

## 기본 사용법

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">홈</lh-menu-item>
    <lh-menu-item index="2">작품</lh-menu-item>
    <lh-menu-item index="3">소개</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index`는 항목의 고유 식별자이며, 리프 항목을 클릭하면 `select` 이벤트와 함께 전달됩니다(`update:modelValue`도 함께 발생하므로 `v-model`으로 받을 수 있습니다).

## 서브메뉴와 기본 펼침

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">홈</lh-menu-item>
    <lh-sub-menu index="2" title="내 작품">
      <lh-menu-item index="2-1">수묵화</lh-menu-item>
      <lh-menu-item index="2-2">공필화</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

중첩 서브메뉴는 여러 계층으로 재귀할 수 있습니다. `select` 이벤트의 `indexPath`는 가장 바깥 서브메뉴부터 선택된 항목까지의 전체 경로입니다(예: `['2', '2-1', '2-1-1']`).

## 아코디언

`unique-opened`를 지정하면 동시에 펼쳐지는 서브메뉴가 최대 하나가 됩니다(펼쳐진 제목을 다시 클릭하면 접히며, 모두 접힌 상태도 허용됩니다).

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="첫 번째 그룹">
      <lh-menu-item index="1-1">옵션 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="두 번째 그룹">
      <lh-menu-item index="2-1">옵션 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## 제어되는 펼침

`openeds`를 전달하면 제어 모드가 됩니다. 컴포넌트 내부에서 펼침 상태를 유지하지 않고 `update:openeds` 콜백으로 구동합니다.

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="제어되는 서브메뉴">
      <lh-menu-item index="1-1">옵션 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## 그룹

`lh-menu-item-group`은 같은 종류의 항목을 묶습니다(시각적 그룹화만 담당하며 펼침 로직에는 관여하지 않습니다).

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="기본 콘텐츠">
      <lh-menu-item index="1">글</lh-menu-item>
      <lh-menu-item index="2">이미지</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="고급 기능">
      <lh-menu-item index="3">데이터 분석</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## 가로 모드

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">홈</lh-menu-item>
    <lh-sub-menu index="2" title="작품집">
      <lh-menu-item index="2-1">수묵화</lh-menu-item>
      <lh-menu-item index="2-2">공필화</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">소개</lh-menu-item>
  </lh-menu>
</template>
```

가로 모드에서는 서브메뉴가 제목 아래에서 팝업으로 나타납니다(`bottom-start`). 중첩 계층은 오른쪽에서 나타납니다(`right-start`).

## 접기 모드

세로 모드에 `collapse`를 조합하면 좁은 막대로 접히고, 서브메뉴는 오른쪽 팝업 패널이 됩니다.

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="메일">
      <lh-menu-item index="1-1">받은 편지함</lh-menu-item>
      <lh-menu-item index="1-2">보낸 편지함</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">임시 보관함</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 현재 활성 항목(v-model. 생략 시 내부에서 유지) | `string` | — |
| mode | 레이아웃 모드 | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | 세로 메뉴를 아이콘 막대로 접기(서브메뉴는 팝업 패널이 됨) | `boolean` | `false` |
| defaultOpeneds | 기본으로 펼쳐지는 서브메뉴 키(비제어) | `string[]` | `[]` |
| openeds | 제어되는 펼침 서브메뉴 키 | `string[]` | — |
| uniqueOpened | 아코디언: 동시에 펼쳐지는 서브메뉴를 최대 하나로 | `boolean` | `false` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| select | 리프 항목 선택 시 발생 | `(index: string, indexPath: string[])` |
| open | 서브메뉴 펼침 시 발생 | `(index: string, indexPath: string[])` |
| close | 서브메뉴 접힘 시 발생 | `(index: string, indexPath: string[])` |
| update:modelValue | 활성 항목 변화(v-model) | `(value: string)` |
| update:openeds | 펼침 세트 변화 | `(value: string[])` |

### Slots

| Slot | 설명 |
| --- | --- |
| default | 메뉴 내용(`LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup` 조합) |

## MenuItem API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| index | 고유 식별자(필수) | `string` | — |
| disabled | 비활성화(aria-disabled 의미 유지. 클릭과 키보드 활성화 모두 억제) | `boolean` | `false` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| click | 리프 항목 클릭 시 발생(비활성 항목은 발생하지 않음) | `(index: string)` |

## SubMenu API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| index | 고유 식별자(필수) | `string` | — |
| title | 제목(`title` 슬롯도 사용 가능) | `string` | — |
| disabled | 비활성화 | `boolean` | `false` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| select | 자손 리프 항목 선택 시 발생(경로에 이 서브메뉴의 index 포함) | `(index: string, indexPath: string[])` |

### Slots

| Slot | 설명 |
| --- | --- |
| default | 서브메뉴 내용(추가로 `LhMenuItem` / `LhSubMenu` 중첩 가능) |
| title | 사용자 정의 제목 내용 |

## MenuItemGroup API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| title | 그룹 제목(`title` 슬롯도 사용 가능) | `string` | — |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Slots

| Slot | 설명 |
| --- | --- |
| default | 그룹 내용 |
| title | 사용자 정의 그룹 제목 |

### 접근성

- 컨테이너는 `role="menu"`(가로 모드에서는 `role="menubar"`)입니다. 리프 항목과 서브메뉴 제목은 `role="menuitem"`, 비활성 항목은 `aria-disabled`를 출력하고, 서브메뉴 제목은 추가로 `aria-expanded` / `aria-haspopup` / `aria-controls`를 가집니다
- 키보드는 APG menu 패턴을 따릅니다(H5 전용): 세로 모드에서는 ↑/↓로 보이는 항목 사이를 순환(비활성 항목과 접힌 패널 내 항목은 건너뜀), Home/End로 양끝으로 이동합니다. 리프 항목은 Enter/Space로 활성화합니다. 서브메뉴 제목에서 Enter/Space/→는 펼치고 패널로 포커스를 옮기며, ←/Esc는 접습니다
- 가로 모드의 ←/→ 의미는 각 제목 자체에 남기고 루트 컨테이너는 방향키를 인터셉트하지 않습니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **세로 모드와 아코디언은 모든 환경에서 사용 가능**: 세로 모드(인라인 서브메뉴 펼침, 아코디언, 제어되는 v-model / openeds 포함)는 순수 CSS와 provide/inject로 구현되어 H5와 WeChat 미니프로그램에서 동일하게 동작합니다.
- **가로 스크롤**: 가로 모드에서 항목의 총 너비가 컨테이너를 넘을 때 스크롤은 컨테이너 자체의 `overflow-x`로 처리합니다(WXSS에서 view는 오버플로우 스크롤을 지원). `scroll-view`로 감싸지 않습니다——후자는 H5에서 슬롯 내용을 내부 `uni-scroll-view-content` 계층으로 감싸 share scss의 flex 직계 자식 구조를 깨뜨립니다(lh-tabs의 가로 헤더와 달리 menu 항목은 블록 수준 flex라 탭처럼 inline-flex로 회피할 수 없습니다).
- **팝업 서브메뉴는 root-portal에 탑재**: 가로 / 접기 모드의 팝업 패널은 plus의 `<teleport to="body">` 대신 `lh-root-portal`로 구현합니다(낮은 버전 기반 라이브러리에서는 페이지 내 fixed로 폴백). 위치 계산은 2프레임 비동기 측정(숨김 상태로 렌더하여 크기 측정 → `computePosition`으로 배치 → 표시, 깜빡임 방지)이며 비동기이므로 동기적인 결과를 가정하면 안 됩니다. 중첩 계층은 오른쪽에서 나타납니다(`right-start`).
- **hover는 H5 전용**: 제목에 마우스를 올려 펼치는 것은 H5에서만 동작합니다. 미니프로그램에는 hover 의미가 없어 팝업 패널의 열기 / 닫기는 제목 탭으로 처리하고, 외부 탭은 페이지 내 투명 마스크가 닫습니다(plus의 mouseleave 접기와 동등).
- **키보드 내비게이션은 H5 전용**: ↑/↓ / Home / End / Enter / Space / ←/→ / Esc는 H5에서만 동작합니다. 미니프로그램에는 키보드 이벤트가 없고 해당 블록 전체가 조건부 컴파일로 제거됩니다(MP 번들에 데드 코드 없음).
- **입출력 트랜지션은 미구현**: plus는 `Transition`으로 페이드하지만 MP에서는 `Transition`을 신뢰할 수 없어 tooltip / select 등과 마찬가지로 바인딩하지 않습니다. 인라인 패널 펼침 애니메이션은 순수 CSS(grid-template-rows 0fr/1fr)이며 transitionend는 감시하지 않습니다(MP에서 불가능). MP에서 트랜지션이 지원되지 않아도 최종 상태는 올바르게 유지됩니다.
:::
