# Collapse 접기 패널

콘텐츠 블록을 접거나 펼칩니다. 여러 패널을 함께 쓰거나 아코디언(한 번에 하나만 펼침) 모드를 지원합니다.

## 기본 사용

`v-model`을 넘기지 않으면 비제어입니다. 컴포넌트가 펼침 상태를 스스로 관리하고, 제목 표시줄을 클릭해 전환하며, `change` 이벤트가 최신 펼침 패널을 전달합니다.

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="일관성과 다양성"
    >
      페이지 전체와 일관된 시각과 상호작용을 유지합니다.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="피드백"
    >
      조작 후 명확하고 시기적절한 피드백을 제공합니다.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 아코디언

`accordion` 모드에서는 동시에 최대 한 개만 펼침됩니다. 펼쳐진 패널을 다시 클릭하면 모두 접힙니다.

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="하나만 펼침"
    >
      동시에 최대 한 개만 펼침됩니다.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="다시 클릭하면 접힘"
    >
      모두 접을 수 있습니다.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 제어 v-model과 비활성화

`v-model`로 펼침 패널을 바인딩합니다(단일 값 또는 배열. 아코디언 모드에서는 보통 단일 값). `disabled`로 개별 패널을 비활성화합니다.

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="패널 A"
    >
      제어 콘텐츠 A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="패널 B (비활성화)"
      disabled
    >
      비활성화 콘텐츠
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="패널 C"
    >
      제어 콘텐츠 C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 현재 활성 패널(제어 v-model, 단일 값 또는 배열) | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | 아코디언 모드: 동시에 하나만 펼침 | `boolean` | `false` |
| customClass | 커스텀 클래스 이름(루트 노드로 전달) | `string` | — |
| sx | 레이아웃 간편 속성 | `LhSxProps` | — |

## CollapseItem Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| name | 패널의 고유 식별자(필수) | `string \| number` | — |
| title | 제목(`title` 슬롯도 사용 가능) | `string` | — |
| disabled | 패널 비활성화 여부 | `boolean` | `false` |
| customClass | 커스텀 클래스 이름(항목 루트 노드로 전달) | `string` | — |
| sx | 레이아웃 간편 속성 | `LhSxProps` | — |

## Events

| Event | 설명 | 콜백 인수 |
| --- | --- | --- |
| update:modelValue | 펼침 패널 변경(제어 v-model. 컴포넌트는 내부 상태를 갖지 않음) | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | 펼침 패널 변경(비제어. 아코디언에서는 단일 값, 모두 접히면 `undefined`) | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| Slot | 설명 |
| --- | --- |
| Collapse default | 패널 항목 노드(`lh-collapse-item`) |
| CollapseItem default | 패널 콘텐츠 |
| CollapseItem title | 패널 제목(`title` prop을 덮음) |

## 플랫폼 차이

- **펼침 / 접힘 애니메이션은 순수 CSS**입니다(`grid-template-rows`가 `0fr / 1fr` 사이를 전환 + 화살표는 `transform`으로 회전). `transitionend`는 전혀 감시하지 않습니다(WeChat 미니프로그램에서 신뢰할 수 없어 이 라이브러리 전체가 의존하지 않습니다). 클래스 전환으로 즉시 최종 상태가 됩니다. 일부 MP 렌더링 엔진이 grid 전환을 지원하지 않아도 최종 펼침 상태는 올바르며 전환 과정만 생략됩니다.
- **콘텐츠는 항상 렌더링**합니다(`v-if`로 건너뛰지 않음). `lh-collapse__wrap`은 `--active` 클래스로 표시를 전환합니다. '펼칠 때만 렌더링'이 필요하면 콘텐츠 측에서 `v-if`로 직접 제어하세요.
- `<h3>` / `<button>`은 모두 `<view>` / `<text>`로 대체됩니다(WXSS는 태그 선택자를 금지). 비활성화는 네이티브 `<button disabled>`에 의존하지 않고 클릭 가드 + `--disabled` 클래스 + `aria-disabled`로 표현합니다.
- 접근성 속성은 양 플랫폼 모두 출력됩니다. 헤더는 `role="button"` + `aria-expanded` / `aria-controls`, 콘텐츠 영역은 `role="region"` + `aria-labelledby`입니다. MP 음성 지원은 플랫폼 능력에 따릅니다. H5에서는 포커스된 헤더가 Enter / Space에 자연스럽게 반응합니다.
- 헤더 / 콘텐츠 연결 `id`는 `generateId`로 로컬 고유하게 생성합니다(Vue 3.5의 `useId`가 아닌, uni-app 각 단의 커널 호환성을 우선). 한 페이지에 여러 접기 그룹이 있어도 충돌하지 않습니다.
- **이식 결정(Vue3 판과 정렬, 정의되지 않은 API는 추가하지 않음)**: 이 이식은 plus 진원을 엄격히 따르며 `v-model`(단일 값 / 배열), `accordion`, 패널의 `name` / `title` / `disabled`와 `title` 슬롯만 제공합니다. 진원에 없는 중첩 접기, 아이콘 슬롯, 지연 렌더링 등은 임의로 추가하지 않으며, 진원이 보완되면 따라갑니다.
- 이 저장소의 글루 계층에는 제어 상태 읽기 수정이 한 곳 있습니다(changeset에 기록): 제어 시 펼침 상태를 `props.modelValue`를 구독하는 computed로 만들어, 부모가 v-model을 비동기적으로 업데이트하면 패널이 즉시 따라갑니다. core 순수 함수와 props 계약은 plus와 완전히 동일합니다.
