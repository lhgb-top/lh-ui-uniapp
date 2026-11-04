# Descriptions 설명 목록

객체의 속성 목록을 표시합니다. 열 수, 열 걸치기(span), 테두리 모드를 지원합니다. 항목 데이터는 `items`로 전달되고(`LhDescriptionsItem`은 `@lh-ui/share` core가 제공하는 항목 타입), 내용은 스코프드 슬롯으로 덮어쓸 수 있습니다.

## 기본 사용법

```vue
<template>
  <lh-descriptions
    title="소장품 아카이브"
    :column="2"
    :items="[
      { label: '명칭', value: '청화缠枝莲纹瓶' },
      { label: '연대', value: '명 영락' },
      { label: '종류', value: '자기' },
      { label: '등급', value: '1급 문물' },
    ]"
  />
</template>
```

## 열 수와 열 걸치기

`column`은 행당 항목 수를, 항목의 `span`은 몇 열을 차지할지 제어합니다. `span`이 행의 남은 너비를 초과하면 자동으로 조정되고, 마지막 행이 모자라면 자동으로 채워집니다(채우기 셀은 `aria-hidden`, 장식 전용).

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: '명칭', value: '천리강산도', span: 2 },
      { label: '연대', value: '북송' },
      { label: '작가', value: '왕희맹' },
      { label: '재질', value: '비단 채색' },
      { label: '소장처', value: '베이징 고궁박물원' },
    ]"
  />
</template>
```

## 테두리 모드

`border`로 테이블 테두리를 켭니다(테두리 모드에서는 행 간격이 0이 되고 셀 테두리가 테이블을 이룹니다).

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: '명칭', value: '난정서' },
      { label: '작가', value: '왕희지' },
      { label: '연대', value: '동진' },
      { label: '서체', value: '행서' },
    ]"
  />
</template>
```

## 제목과 내용 커스터마이징

`title` 슬롯이 제목 영역을 덮어씁니다. `item-<index>` 스코프드 슬롯이 해당 항목의 내용을 덮어씁니다(`index`는 항목이 속한 행 내의 셀 번호, 스코프는 `{ item }`을 제공).

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>소장품 아카이브 (슬롯 제목)</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: '상태', value: '진행 중' },
  { label: '단계', value: '감정 완료' },
]
</script>
```

## Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| title | 목록 제목 | `string` | — |
| column | 행당 항목 수 | `number` | `3` |
| border | 테두리 표시 여부 | `boolean` | `false` |
| items | 항목 목록. label / value / span 3요소 | `[LhDescriptionsItem](#lhdescriptionsitem-타입)`[] | `() => []` |
| customClass | 커스텀 클래스 이름 | `string` | — |
| sx | 레이아웃 약식 속성 | `LhSxProps` | — |

## LhDescriptionsItem (타입)

`@lh-ui/share` core에서 제공(`LhDescriptionsItem`). 이 리포지토리에서 재정의하지 않습니다.

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| label | 항목 라벨 | `string` | — |
| value | 항목 내용 (스코프드 슬롯으로도 전달 가능) | `string \| number` | — |
| span | 차지할 열 수. 초과 시 조정됨 | `number` | `1` |

## Slots

| Slot | 설명 | 스코프 |
| --- | --- | --- |
| title | 커스텀 제목 | — |
| item-\<index\> | 항목의 내용을 덮어씀 (index는 행 내 셀 번호) | `{ item }` |

## 플랫폼 차이

- 순수 표시 컴포넌트로 플랫폼 API를 전혀 사용하지 않으며, H5와 WeChat 미니프로그램에서 동작이 완전히 동일합니다. `items` / `column` / `border` / `span` 동작은 Vue3 버전과 같습니다.
- Vue3 버전은 `<dl>/<dt>/<dd>` 시맨틱 태그를 사용하지만, 이 리포지토리는 `<view>`로 대체합니다(WXSS는 태그 선택자를 금지, 클래스 이름으로 스타일 적용). 행 레이아웃은 인라인 `flex`와 퍼센트 `flex-basis`로 처리하며 너비 계산식은 Vue3 버전과 동일합니다.
- 테두리 모드의 테이블 선은 `@lh-ui/share`의 styles 소스에서 제공되고, `build-styles` 정화를 거쳐 미니프로그램에서도 사용할 수 있습니다(정화 산물에는 클래스 선택자와 속성만 포함되어 WXSS 화이트리스트를 준수).
- 행 구조 집계(span 정규화, 조정, 줄바꿈, 채우기)는 모두 `@lh-ui/share`의 `buildDescriptionRows` 순수 함수가 산출하며, 이 리포지토리는 반응형 접착제만 작성하고 core 구현을 복사하지 않습니다.
