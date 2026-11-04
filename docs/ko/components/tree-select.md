# TreeSelect 트리 셀렉터

조직도나 카테고리 트리처럼 계층 구조를 가진 데이터를 위한 셀렉터입니다. 트리거를 클릭하면 트리 패널이 열리고, 단일 선택에서는 노드를 클릭해 선택 후 패널이 닫히며, 다중 선택에서는 체크박스로 선택합니다(부모-자식 연동).

## 기본 사용법

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="请选择节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

노드를 클릭하면 선택되고(리프가 아닌 노드 포함) 패널이 닫힙니다. 노드 왼쪽의 펼침 화살표를 클릭하면 선택값을 바꾸지 않고 펼치기 / 접기만 합니다. 트리거에는 선택된 노드의 `label`이 표시됩니다.

## 다중 선택

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="请选择多个节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

다중 선택에서 `v-model`은 체크된 키 배열(`string[]`)을 바인딩하며 부모-자식이 연동합니다. 부모 노드를 체크하면 체크 가능한 모든 자손이 자동으로 체크되고, 자손이 모두 체크되면 부모는 완전 선택, 일부만 체크되면 반쯜 선택(indeterminate)이 됩니다. 노드 라벨을 클릭하면 펼치기만 하고 체크는 체크박스로 합니다(Vue3 버전과 동일). 트리거에는 체크된 모든 키의 `label`이 '、'로 이어져 표시됩니다.

## 비활성화

노드 데이터의 `disabled: true`는 해당 노드를 비활성화합니다(클릭해도 펼쳐지지 않고 선택되지 않으며 체크박스도 조작할 수 없습니다). `disabled` prop은 셀렉터 전체를 비활성화합니다.

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>
```

## TreeSelect API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 바인딩 값(단일 선택 `string` / 다중 선택 `string[]`, 제어되는 v-model) | `string \| string[] \| undefined` | — |
| data | 트리 데이터 | `LhTreeNode[]` | `() => []` |
| multiple | 다중 선택 여부(체크박스 표시, 값은 체크된 키 배열, 부모-자식 연동) | `boolean` | `false` |
| disabled | 셀렉터 전체 비활성화 여부 | `boolean` | `false` |
| placeholder | 플레이스홀더(미지정 시 언어 팩 `select.placeholder`) | `string` | — |
| customClass | 커스텀 클래스 이름(루트 노드로 전달) | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | sx 퀵 레이아웃 속성(트리거 루트 요소에 적용, 플로팅 패널에는 영향 없음) | `LhSxProps` | — |

### Events

| Event | 설명 | 매개변수 |
| --- | --- | --- |
| update:modelValue | 바인딩 값이 변경될 때 발생 | `(value: string \| string[] \| undefined)` |
| change | 선택 값이 변경될 때 발생 | `(value: string \| string[] \| undefined)` |

### 데이터 구조

`LhTreeNode` 타입 정의(원천은 `@lh-ui/share/core/tree`):

```ts
interface LhTreeNode {
  /** 고유 키 */
  key: string
  /** 표시 텍스트 */
  label: string
  /** 자식 노드 */
  children?: LhTreeNode[]
  /** 비활성화 */
  disabled?: boolean
  /** 리프 노드 여부(미지정 시 children에서 추론) */
  isLeaf?: boolean
}
```

### 접근성

- 트리거는 `aria-haspopup="tree"` / `aria-expanded` / `aria-label`을 가집니다(언어 팩 `treeSelect.triggerLabel`에서 가져옴)
- 패널은 `role="listbox"`, 내장 트리는 `role="tree"`, 노드는 `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`를 가진 `role="treeitem"`입니다. 다중 선택 시 패널에 `aria-multiselectable`이 붙고 체크박스는 `role="checkbox"`에 `aria-checked`를 가집니다(반쪽 선택은 `mixed`)
- 계층 들여쓰기, 펼침 화살표 회전, 체크박스 삼상태 외관은 모두 share 스타일 소스(`@lh-ui/share/styles/tree`)에서 오며, 단내 중복 스타일은 없습니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **전용 core가 아닌 접착(glue) 조합**: share core에 tree-select 모듈이 없어, 이 단은 plus의 구현 형태를 따라 'select 트리거 + lh-tree 패널'을 조합합니다. 패널은 `lh-tree`를 내장하고 트리의 펼침 / 선택 / 연동 체크는 모두 `lh-tree`가 `core/tree` 순수 함수(`flattenTree` / `toggleCheckKeys` / `getNodeCheckState` 등)를 소비합니다. 어떤 트리 로직도 복사하지 않습니다. API와 이벤트는 plus에 맞추고 자체 기능을 추가하지 않았습니다.
- **패널화 오버레이**: plus는 패널을 `Teleport to="body"`에 마운트하지만, uni-app에서는 `lh-root-portal`이 담당하고(구 버전에서는 페이지 내 fixed 폴백) 두 프레임 비동기 계측으로 배치합니다(숨김 렌더링으로 측정 → `computePosition` 배치 → 표시, 깜빡임 방지). 배치 계산은 비동기이므로 동기적 결과를 가정하면 안 됩니다.
- **트리 패널 스크롤**: share scss의 `.lh-tree-select__panel`은 `overflow: auto`를 쓰지만 MP `view`에는 신뢰할 수 있는 오버플로 스크롤이 없어 패널 안에 `scroll-view`(`scroll-y`)를 한 층 더 싸고 최대 높이를 share의 320px에 맞춥니다.
- **키보드 내비게이션 없음**: plus의 Escape 종료와 문서 수준 키보드 감시는 키보드 이벤트에 의존하지만 미니 프로그램에는 키보드 이벤트가 없어, 이 단에서는 페이지 내 투명 마스크를 탭해 패널을 닫습니다(select / cascader와 동일). 조건부 컴파일 처리는 하지 않았습니다.
- **`teleported` prop 미이식**: plus는 패널을 body에 마운트할지 제어하지만 uni-app 오버레이는 항상 `lh-root-portal`을 경유하므로 이 의미론이 존재하지 않습니다.
- **외부 클릭 종료**: plus는 `useLhClickOutside`로 document 클릭을 감시하지만 uni-app에서는 페이지 내 투명 마스크가 담당합니다(마스크 탭 시 닫힘).
- **체크 상태 제어화 수정**: plus는 `checked-keys`를 내장 트리에 넘기지 않아 다중 선택의 사전 설정 값이 체크박스에 반영되지 않습니다. 이 단은 `v-model`을 `checked-keys`로도 넘겨 체크박스와 트리거 표시를 모두 `v-model`이 구동하게 합니다(API는 동일).
- **트리거가 뷰포트 밖으로 스크롤되어도 자동으로 닫히지 않음**: uni-app에 통일된 스크롤 / 크기 변경 감시 채널이 없어 이식하지 않았습니다.
:::
