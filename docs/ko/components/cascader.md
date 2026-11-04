# Cascader 연캐이드 선택기

계층형 데이터 선택에 사용하는 연캐이드 선택기입니다. 예: 시/도 선택. 트리거를 클릭하면 여러 열로 이루어진 패널이 열리고, 단계적으로 하위 레벨을 펼치며 리프 노드(또는 `check-strictly` 시 임의 레벨)를 선택해 완료합니다.

## 기본 사용법

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '가이드',
    children: [
      {
        value: 'sheji',
        label: '디자인 가이드',
        children: [
          { value: 'yuansze', label: '색상' },
          { value: 'fuziyuanze', label: '폰트' },
        ],
      },
      { value: 'shejiguize', label: '디자인 규칙' },
    ],
  },
  {
    value: 'zujian',
    label: '컴포넌트',
    children: [
      { value: 'jiben', label: '기본' },
      { value: 'fankui', label: '피드백' },
    ],
  },
]
</script>
```

하위가 있는 항목을 클릭하면 먼저 다음 열을 펼치고, 리프 노드를 클릭하면 선택됩니다(단일 선택은 선택 후 패널을 자동으로 닫습니다).

## 다중 선택

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- 탭 접기: 첫 번째 선택 항목 + 개수만 표시 -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '가이드',
    children: [
      { value: 'sheji', label: '디자인 가이드' },
      { value: 'shejiguize', label: '디자인 규칙' },
    ],
  },
  {
    value: 'zujian',
    label: '컴포넌트',
    children: [
      { value: 'jiben', label: '기본 컴포넌트' },
      { value: 'fankui', label: '피드백 컴포넌트' },
    ],
  },
]
</script>
```

다중 선택 모드에서 `v-model`은 각 선택 경로의 **마지막 레벨 값** 배열을 바인딩하며, 선택된 항목은 트리거 안에 태그로 표시됩니다.

## 옵션 비활성화

노드 데이터의 `disabled: true`는 해당 노드를 비활성화합니다(클릭해도 펼쳐지지 않고 선택되지도 않습니다). `disabled` prop은 선택기 전체를 비활성화하고, `readonly`는 패널을 열지 않고 값을 표시만 합니다.

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '가이드',
    disabled: true,
    children: [{ value: 'sheji', label: '디자인 가이드' }],
  },
  {
    value: 'zujian',
    label: '컴포넌트',
    children: [
      { value: 'jiben', label: '기본 컴포넌트' },
      { value: 'fankui', label: '피드백 컴포넌트', disabled: true },
    ],
  },
]
</script>
```

## 경로 표시와 반환값

```vue
<template>
  <!-- 전체 경로(기본값) -->
  <lh-cascader v-model="value" :options="options" placeholder="전체 경로(기본값)" />
  <!-- 마지막 레벨만 -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="마지막 레벨만" />
  <!-- 구분자 사용자 지정 -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="구분자 >" />
  <!-- v-model은 마지막 레벨 값만 바인딩(표시는 여전히 전체 경로) -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="마지막 레벨 값만 반환" />
  <!-- 임의 레벨 선택 가능(리프가 아닌 노드 클릭 시 바로 선택) -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="임의 레벨 선택 가능" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '가이드',
    children: [
      { value: 'sheji', label: '디자인 가이드', children: [{ value: 'yuansze', label: '색상' }] },
    ],
  },
]
</script>
```

> 플레이스홀더는 기본적으로 로케일의 `cascader.placeholder`를 참조하며 `placeholder`로 덮어쓸 수 있습니다.

## 필터링

`filterable`로 검색을 활성화합니다: 필터 입력창은 패널 안에 있습니다(미니 프로그램에는 트리거 내부 입력 포커스 의미가 없기 때문). 키워드를 입력하면 검색 결과가 전체 경로와 함께 표시되고, 결과를 클릭하면 바로 선택됩니다.

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="키워드를 입력해 검색" />
</template>
```

일치하는 결과가 없으면 로케일의 `cascader.noMatch`가 표시되며, `no-match` 슬롯으로 사용자 지정할 수 있습니다.

## 필드 별칭

`item-config`로 노드 필드 별칭(`value` / `label` / `children` / `disabled` / `leaf`)을 선언하면 비동기 데이터나 백엔드 구조를 수동으로 변환할 필요가 없습니다:

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '저장성',
    sub: [{ id: 'hangzhou', name: '항저우시', sub: [{ id: 'xihu', name: '시후구' }] }],
  },
]
</script>
```

## Cascader API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 바인딩 값(`emitPath`가 `false`일 때 마지막 레벨 값만) | `(string \| number)[]` | `() => []` |
| options | 옵션 목록(트리 구조) | `LhCascaderNode[]` | `() => []` |
| size | 크기 | `LhCascaderSize` | `'medium'` |
| disabled | 선택기 전체 비활성화 | `boolean` | `false` |
| clearable | 삭제 가능 | `boolean` | `true` |
| placeholder | 플레이스홀더(미지정 시 로케일 cascader.placeholder 참조) | `string` | — |
| readonly | 읽기 전용(패널을 열지 않음) | `boolean` | `false` |
| showAllLevels | 트리거에 전체 경로 표시 | `boolean` | `true` |
| checkStrictly | 임의 레벨 노드 선택 가능 | `boolean` | `false` |
| emitPath | 반환값에 전체 경로 포함 여부 | `boolean` | `true` |
| multiple | 다중 선택 | `boolean` | `false` |
| cascading | 연캐이드 연동(hover로 하위 펼침, H5 전용) | `boolean` | `true` |
| separator | 경로 구분자 | `string` | `'/'` |
| collapseTags | 다중 선택 모드에서 태그 접기 | `boolean` | `false` |
| filterable | 검색 가능 | `boolean` | `false` |
| itemConfig | 노드 필드 별칭 | `LhCascaderItemConfig` | `() => ({})` |
| customClass | 사용자 지정 클래스명(루트 노드로 전달) | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | sx 빠른 레이아웃 prop(트리거 루트 요소에 적용, 팝업 패널에는 영향 없음) | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| update:modelValue | 바인딩 값이 변경될 때 발생 | `(value: (string \| number)[])` |
| change | 선택 값이 변경될 때 발생 | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| no-match | 필터가 일치하는 항목이 없을 때의 사용자 지정 콘텐츠 |

### 데이터 구조

`LhCascaderNode` 타입 정의:

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### 접근성

- 트리거는 `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls`를 가집니다(속성 팩은 share의 `getCascaderTriggerAria`가 생성하고 키별로 펼쳐 바인딩합니다)
- 팝업 패널은 `role="dialog"`, 각 열은 `role="listbox"`(`aria-label`은 로케일 `cascader.columnLabel` 사용), 열 항목은 `role="option"`에 `aria-selected` / `aria-disabled` / `aria-expanded`를 가집니다
- 위치 결정 엔진은 자체 제작한 순수 함수(flip / shift 넘침 방지)이며 서드파티 런타임 의존성이 없습니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **패널화된 팝업**: plus는 패널을 `Teleport to="body"`에 마운트하고 `Transition`으로 페이드하지만, uni-app에서는 `lh-root-portal`이 담당합니다(구형 베이스에서는 페이지 내 fixed 폴백). 이프레임 비동기 측정으로 위치를 정합니다(숨김 상태로 렌더링해 크기를 잰 뒤 → `computePosition`으로 위치 정하기 → 표시, 깜빡임 방지). 위치 계산은 비동기이므로 동기적으로 결과를 얻을 수 있다고 가정하면 안 됩니다. 입출력 전환은 바인딩하지 않았습니다(MP의 `Transition`은 신뢰할 수 없어 tooltip / dropdown / popover와 동일합니다).
- **열 스크롤**: 각 열은 독립적으로 세로 스크롤되는 `scroll-view`(`scroll-y`)입니다——MP의 `view`에는 신뢰할 수 있는 오버플로 스크롤이 없고, share scss의 `overflow-y: auto` 열 컨테이너는 H5 측에서 `scroll-view`의 H5 구현으로 동등하게 폴백됩니다.
- **키보드 탐색은 H5 전용**: 트리거는 Enter/Space로 열고 닫고, 방향키로 패널에 포커스를 보냅니다; 패널 안에서는 ↑↓로 열 내 이동(비활성 항목 건너뜀), ←→로 열을 가로지르고, Enter/Space는 클릭과 동일하며, Escape는 문서 수준 리스너로 닫습니다(여러 팝업이 겹쳐 있으면 최상위만 닫음). 처리 함수 본문 전체가 조건부 컴파일로 잘려 나가 MP 번들에 데드 코드가 남지 않습니다.
- **hover 펼침은 H5 전용**: `cascading`의 hover 하위 펼침은 hover 의미에 의존하지만 미니 프로그램에는 hover가 없어 하위는 탭으로만 펼칠 수 있습니다(MP에서 `cascading`은 사실상 hover 펼침 끄기와 같습니다).
- **필터 입력창 위치**: plus는 트리거 자체를 `filterable` 입력창으로 쓰지만, uni-app은 필터 입력창을 패널 안에 둡니다(select와 동일). MP에는 트리거 내 input 포커스 의미가 없기 때문입니다.
- **외부 클릭으로 닫기**: plus는 `useLhClickOutside`로 document 클릭을 감지하지만, uni-app은 페이지 내 투명 마스크로 담당합니다(마스크를 클릭하면 닫힙니다).
- **트리거가 뷰포트 밖으로 스크롤되어도 자동으로 닫히지 않음**: uni-app에는 통일된 스크롤 / 크기 변화 감시 채널이 없어 이식하지 않았습니다.
- **포커스 링 / roving tabindex는 H5 전용**: MP에는 키보드 포커스 의미가 없고, MP 측에서 `tabindex` 바인딩은 값을 출력하지 않습니다.
:::
