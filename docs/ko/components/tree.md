# Tree 트리 컨트롤

계층 데이터의 표시와 상호작용. 펼침 / 접기, 체크박스 연동, 지연 로딩 병합 등의 순수 로직은
`@lh-ui/share`의 core 순수 함수(`flattenTree` / `toggleCheckKeys` / `mergeLoadedChildren` 등)를
그대로 소비하고, 컴포넌트 계층은 렌더링·이벤트·키보드 탐색만 담당합니다.

## 기본 사용법

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: '프론트엔드',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: '백엔드', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: '운영', disabled: true },
]
</script>
```

`data`는 `LhTreeNode[]`입니다: `key`는 고유 값, `label`은 표시 텍스트, `children`은 하위 노드,
`disabled`는 비활성화, `isLeaf`는 말단 여부(생략 시 `children`에서 추론).
계층 들여쓰기는 인라인 스타일 `level * 18 + 8` px로 표현합니다.
행 전체를 클릭하면 노드가 선택되고(`update:selectedKeys` / `select`),
`expandOnClickNode` 기본값(켜짐)에서는 말단이 아닌 노드 클릭 시 펼침 / 접기도 함께 처리합니다；
화살표 클릭은 펼침만 토글합니다.

## 체크 가능 (연동)

`show-checkbox`로 체크박스를 표시합니다. 부모를 체크하면 모든 하위에 연동됩니다；
하위가 모두 체크되면 부모도 자동으로 체크되고, 일부 선택은 중간 상태(indeterminate)로 나타납니다.

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

체크 상태는 `default-checked-keys`(비제어) 또는 `v-model:checked-keys`(제어)로 유지되고,
변경은 `update:checkedKeys` / `check` 이벤트로 내보내집니다. `checkStrictly`를 켜면
체크는 노드 자신에게만 작용합니다: 하위 연동·상위 역추적·중간 상태가 없습니다.

## 지연 로딩

`lazy`를 켜면, 아직 로드되지 않은 노드를 펼칠 때 `load` 콜백을 호출합니다
(`resolve`가 하위 노드를 확정하고 펼침, `reject` 또는 예외로 취소)； 로딩 중에는 화살표가 회전합니다.

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: '눌러서 로드', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // 비동기 요청 시뮬레이션
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: '하위 노드 1', isLeaf: true },
        { key: 'lazy-2', label: '하위 노드 2', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

로드 가능 노드는 반드시 `isLeaf: false`를 명시해야 합니다
(그렇지 않으면 `children`이 없는 노드는 말단으로 추론되어 펼침 화살표가 나오지 않습니다)；
로드된 하위 노드가 아직 로드 대기 중인 가지라면 마찬가지로 `isLeaf: false`를,
진짜 말단에는 `isLeaf: true`를 명시합니다. 로드 결과는 share의
`mergeLoadedChildren`에 의해 `props.data`에 불변하게 병합되며
사용자의 데이터는 수정되지 않습니다； 하위 노드가 도착하면 `nodeLoad` 이벤트를 함께 발생시킵니다.

## 선택과 제어 키

`multiple`은 다중 선택을 허용합니다(교체 대신 선택을 토글)；
`default-selected-keys` / `v-model:selected-keys`로 선택을 제어；
`default-expanded-keys` / `v-model:expanded-keys`로 펼침을 제어；
`disabled`는 트리 전체를 비활성화합니다(클릭과 키 입력 모두 무응답).

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: '디자인',
    children: [{ key: 'x-1', label: '색채' }, { key: 'x-2', label: '서체' }],
  },
  { key: 'y', label: '엔지니어링' },
]
</script>
```

## 대용량 데이터 가상화 (uni-app 전용)

수백~수천 개 노드라면 `virtual`을 활성화합니다: 노드 목록을 `scroll-view`가 담당하고
고정 행 높이 34px(`--lh-tree-node-height` 기본값)로 윈도우 렌더링하여
가시 영역 + 상하 버퍼 행만 그립니다； `virtualHeight`는 scroll-view 높이
(숫자는 px, 문자열은 그대로, 기본 300px)를 지정합니다.

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

노드 내용은 한 줄로 줄바꿈 없어야 합니다(share scss의 `.lh-tree-node__label`이
`nowrap` + 말줄임을 이미 강제합니다). `virtual`을 넘기지 않은 일반 모드에서는
노드가 루트 컨테이너에 직접 렌더링되어 Vue3 버전과 동일한 구조입니다.

## 슬롯

`node` 범위 슬롯은 `{ node, level, expanded, selected }`를 받아 노드 내용을 커스터마이즈합니다；
`empty` 슬롯은 빈 상태를 커스터마이즈합니다(기본값은 언어팩 `tree.empty`, 한국어
「데이터가 없습니다」).

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| data | 트리 데이터 | `LhTreeNode[]` | — |
| showCheckbox | 체크박스 표시 | `boolean` | `false` |
| multiple | 다중 선택(교체 대신 선택 토글) | `boolean` | `false` |
| expandOnClickNode | 행 클릭으로 말단 아닌 노드 펼침 / 접기 | `boolean` | `true` |
| defaultExpandedKeys | 기본 펼침 키(비제어) | `string[]` | `[]` |
| expandedKeys | 제어 펼침 키 | `string[]` | — |
| defaultSelectedKeys | 기본 선택 키(비제어) | `string[]` | `[]` |
| selectedKeys | 제어 선택 키 | `string[]` | — |
| defaultCheckedKeys | 기본 체크 키(비제어) | `string[]` | `[]` |
| checkedKeys | 제어 체크 키 | `string[]` | — |
| checkStrictly | 부모-자식 체크 연동 안 함(자신만, 연동·중간 상태 없음) | `boolean` | `false` |
| lazy | 지연 모드(미로드 노드 펼침 시 load 호출) | `boolean` | `false` |
| load | 지연 콜백(resolve가 하위 확정 후 펼침, reject는 취소) | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | 트리 전체 비활성화 | `boolean` | `false` |
| virtual | 대용량 데이터 가상화(uni-app 전용) | `boolean` | `false` |
| virtualHeight | 가상 scroll-view 높이(숫자는 px / 문자열 그대로) | `number \| string` | `300` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| update:expandedKeys | 펼침 키 목록 변경(v-model:expanded-keys용) | `(keys: string[])` |
| update:selectedKeys | 선택 키 목록 변경(v-model:selected-keys용) | `(keys: string[])` |
| update:checkedKeys | 체크 키 목록 변경(v-model:checked-keys용) | `(keys: string[])` |
| select | 노드 클릭으로 선택 / 토글 시 발생 | `(key: string, node: LhTreeNode)` |
| check | 체크 상태 변경 후 발생 | `(keys: string[], node: LhTreeNode)` |
| expand | 노드 펼침 / 접기 후 발생 | `(key: string, expanded: boolean)` |
| nodeLoad | 지연 로딩 하위 노드 도착 후 발생 | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| node | 노드 내용(범위 `{ node, level, expanded, selected }`) |
| empty | 빈 상태(기본값: 언어팩 `tree.empty`) |

### LhTreeNode

| 필드 | 설명 | 타입 |
| --- | --- | --- |
| key | 고유 키 | `string` |
| label | 표시 텍스트 | `string` |
| children | 하위 노드 | `LhTreeNode[]` |
| disabled | 비활성화 | `boolean` |
| isLeaf | 말단 여부(생략 시 children에서 추론) | `boolean` |

### 접근성

- `role="tree"` + `role="treeitem"`, `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`를 모두 노출
- 체크박스는 `role="checkbox"` + `aria-checked`(중간 상태는 `mixed`)

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **가상화는 이 패키지 전용 기능**: 대용량 데이터(수백~수천 노드)에서는 `virtual`을 권장합니다.
  노드 목록을 `scroll-view`가 담당하고 고정 행 높이 34px로 윈도우 렌더링(가시 영역 + 버퍼)하며,
  `virtualHeight`로 뷰포트 높이를 지정합니다. 노드 내용은 한 줄이어야 합니다；
  일반 모드에서는 노드가 루트 컨테이너에 직접 렌더링됩니다.
- **키보드 탐색은 H5 전용**: ↑/↓ 항목 간 이동(비활성 건너뜀, 순환), → 펼침 또는 첫 하위로,
  ← 접기 또는 상위로, Home/End 처음 / 끝, Enter/Space 활성화의 APG tree 패턴 키보드 탐색은
  H5에서만 동작합니다； 미니프로그램에는 키보드 이벤트가 없어 조건부 컴파일로 통째로 제거되며
  (MP 번들에 데드 코드 없음) roving tabindex 역시 H5에서만 값이 설정됩니다.
- **RTL 들여쓰기**: 계층 들여쓰기는 양 단에서 물리 `padding-left`를 사용합니다
  (이 저장소의 기존 「MP는 고정 LTR」 결정과 일치)； H5에서 RTL 미러링이 필요하면
  사용자 측에서 덮어쓰세요.
- **화살표는 자체 그리기**: 펼침 화살표는 글리프 `▸`를 `view`에 얹은 형태이며
  (회전 / 로딩 중 회전도 CSS 변환만으로 처리) 아이콘 폰트에 의존하지 않습니다.
:::
