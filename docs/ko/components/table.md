# Table 테이블

데이터 테이블: 다단 헤더, 정렬, 필터, 가상 스크롤, 커스텀 셀. 헤더 구성
(`buildHeaderCells`), 정렬(`sortTableRows`), 필터(`filterTableRows`),
가상 구간(`computeVisibleRange`)과 클래스명 / sticky 오프셋 계산은 모두
`@lh-ui/share`의 core 순수 함수에서 가져옵니다.

## 플랫폼 차이 (중요)

- **가로 스크롤**: H5에서는 헤더와 본문이 두 개의 독립적인 스크롤
  컨테이너이며 `scrollLeft`를 양방향으로 동기화합니다. 위챗 측에서는 바깥쪽
  `scroll-view`(scroll-x)가 테이블 전체를 가로로 스크롤하고, 헤더와 본문이
  동일한 스크롤 축을 공유하므로 동기화 메커니즘이 필요 없습니다.
- **고정 열 (H5 전용)**: 고정 열은 테이블 셀의 `position: sticky` 지원에
  의존하는데 WXSS에서는 신뢰할 수 없어, MP 측 고정 열 스타일은 빌드 시
  제거됩니다(`build-styles`의 `#ifdef H5` 래핑). 일반 가로 스크롤 열로
  대체됩니다.
- **열 너비 드래그 (H5 전용)**: `mousedown` / 키보드 인터랙션은 MP에
  존재하지 않으므로 드래그 핸들은 H5에서만 렌더링됩니다.
- **줄무늬**: share의 `:nth-child(even)` 규칙은 H5 전용(WXSS는 nth
  가상 클래스를 지원하지 않음)이며, MP 측에서는 템플릿이 행 인덱스에
  따라 `--alt` 클래스를 추가합니다.
- **가상 스크롤**: H5는 `clientHeight` + `ResizeObserver`를, MP는
  `scroll-view`의 `detail.scrollTop` + `createSelectorQuery`를 사용합니다.

## 기본 사용법

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: '사용자 1', age: 28, city: '베이징' },
  { id: 2, name: '사용자 2', age: 34, city: '상하이' },
]
const columns = [
  { prop: 'name', label: '이름', width: 140 },
  { prop: 'age', label: '나이', width: 120, align: 'right' },
  { prop: 'city', label: '도시', width: 160 },
]
</script>
```

## 줄무늬와 테두리

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## 정렬과 필터

```vue
<template>
  <lh-table
    :data="rows"
    :columns="columns"
    @sort-change="onSort"
    @filter-change="onFilter"
  />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'age', label: '나이', width: 120, sortable: true },
  {
    prop: 'city',
    label: '도시',
    width: 160,
    filters: [
      { text: '베이징', value: '베이징' },
      { text: '상하이', value: '상하이' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

정렬 가능한 열의 헤더를 클릭하면 `없음 → 오름차순 → 내림차순` 순서로
순환합니다(`cycleSortOrder`). 필터 열의 헤더에는 필터 트리거가 있으며,
패널에서 항목을 체크하고 확인하면 행을 필터링합니다(필터링 로직은 share의
`filterTableRows`를 거칩니다). 필터 상태는 제어(`filtered-values`) 방식과
비제어(`default-filtered-values`) 방식을 모두 지원합니다.

## 고정 열과 가로 스크롤 (H5 전용)

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '이름', width: 140, fixed: 'left' },
  { prop: 'age', label: '나이', width: 120 },
  { prop: 'city', label: '도시', width: 160 },
  { prop: 'status', label: '상태', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'`는 숫자 너비와 함께 사용해야 합니다. MP 측은 위의
플랫폼 차이를 참고하세요.

## 가상 스크롤 (수만 행)

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

`height`를 설정하면 가상 스크롤이 활성화됩니다: 본문이 고정 높이를 갖고
가시 창 + 오버스캔(`LH_TABLE_OVERSCAN = 3`)만 렌더링합니다. `row-height`는
실제 행 높이와 일치해야 합니다(기본값 48).

## 커스텀 셀

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '활성' : '비활성' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '이름', width: 140 },
  { prop: 'status', label: '상태', width: 140, slot: 'status' },
]
</script>
```

열 설정의 `slot` 필드가 이름이 지정된 스코프 슬롯을 선언합니다. 슬롯
매개변수는 `{ row, column, index, value }`입니다.

## 다단 헤더

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: '이름', width: 140 },
  {
    label: '그룹',
    children: [
      { prop: 'age', label: '나이', width: 120 },
      { prop: 'city', label: '도시', width: 160 },
    ],
  },
]
</script>
```

열 설정의 `children`이 하위 열을 선언합니다. 헤더는 계층별로 자동으로
행이 나뉘고 그리드로 배치됩니다(`buildHeaderCells`가 colspan /
rowspan을 계산).

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| data | 행 데이터 | `LhTableRow[]` | `[]` |
| columns | 열 설정 | `LhTableColumn[]` | `[]` |
| height | 본문 높이 (설정 시 가상 스크롤 활성화) | `number \| string` | `-` |
| max-height | 비가상 모드의 최대 높이 | `number \| string` | `-` |
| row-height | 가상 스크롤 행 높이 | `number` | `48` |
| stripe | 줄무늬 | `boolean` | `false` |
| border | 셀 테두리 | `boolean` | `false` |
| size | 크기 | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | 행 키 필드명 | `string` | `'id'` |
| default-sort-prop | 기본 정렬 열 | `string` | `-` |
| default-sort-order | 기본 정렬 방향 | `'asc' \| 'desc'` | `-` |
| sorter | 커스텀 정렬 함수 | `(a, b) => number` | `-` |
| resizable | 열 너비 드래그 활성화 (H5 전용) | `boolean` | `false` |
| default-filtered-values | 기본 필터 상태 (비제어) | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | 제어되는 필터 상태 | `Record<string, (string \| number)[]>` | `-` |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | `-` |

### LhTableColumn

| 속성 | 설명 | 타입 |
| --- | --- | --- |
| prop | 필드명 | `string` |
| label | 헤더 텍스트 | `string` |
| width | 열 너비 (숫자는 px) | `number \| string` |
| align | 정렬 | `'left' \| 'center' \| 'right'` |
| fixed | 고정 열 (H5 전용) | `'left' \| 'right'` |
| sortable | 정렬 가능 | `boolean` |
| resizable | 드래그 가능 (열 단위 활성화와 숫자 width 필요, H5 전용) | `boolean` |
| filters | 필터 항목 | `{ text, value }[]` |
| filter-multiple | 필터 다중 선택 (기본값 true) | `boolean` |
| formatter | 셀 포맷터 | `(row, value) => string` |
| slot | 커스텀 셀의 이름 슬롯명 | `string` |
| children | 하위 열 (다단 헤더) | `LhTableColumn[]` |

### Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| sort-change | 정렬 변경 | `(payload: { prop, order })` |
| row-click | 행 클릭 | `(row, index)` |
| filter-change | 필터 변경 | `(payload: { prop, values })` |
| update:filtered-values | 제어 필터 업데이트 | `(values)` |
| column-resize | 열 너비 조정 (H5 전용) | `(payload: { prop, width })` |

### 슬롯

| 슬롯 | 설명 | 스코프 매개변수 |
| --- | --- | --- |
| [열 slot] | 커스텀 셀 (이름은 열 설정의 slot으로 지정) | `{ row, column, index, value }` |
| empty | 빈 데이터 콘텐츠 (기본값 「데이터 없음」) | `-` |
