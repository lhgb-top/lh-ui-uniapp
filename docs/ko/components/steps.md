# Steps(단계 표시줄)

사용자가 작업 흐름을 따라가도록 안내합니다. 가로 / 세로 레이아웃, 아이콘, 설명, 클릭 내비게이션을 지원합니다. 순수 표시 + 상태 컴포넌트로 H5와 WeChat 미니프로그램 양 끝에서 모두 사용할 수 있습니다.

## 기본 사용법

`current`로 현재 단계 인덱스(0부터 시작, `v-model:current`로 양방향 바인딩 가능)를 지정합니다. 앞선 단계는 `finish`, 해당 단계는 `process`, 이후 단계는 `wait`이 됩니다.

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="墨 가루 갈기"
      description="먹은 다섯 빛깔"
    />
    <lh-step
      title="초고"
      description="화면 구성하기"
    />
    <lh-step
      title="먹 칠하기"
      description="필치를 뼈대로"
    />
    <lh-step
      title="낙관"
      description="점정(點睛)의 마무리"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## 세로 단계

`direction="vertical"`로 세로 레이아웃으로 전환합니다(CSS로 제어, 플랫폼 차이 없음).

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="주문 접수"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="결제 완료"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="발송 완료"
      description="10-03 도착 예정"
    />
    <lh-step title="수령 확인" />
  </lh-steps>
</template>
```

## 아이콘 사용

`lh-step`에 `icon`을 전달해 내장 아이콘 폰트를 사용합니다(이름은 Icon 문서 참조). 전달하지 않으면 `finish`는 체크, `error`는 X, 나머지는 서수를 표시합니다.

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="회원가입"
      icon="user"
    />
    <lh-step
      title="인증"
      icon="email"
    />
    <lh-step
      title="완료"
      icon="check"
    />
  </lh-steps>
</template>
```

`icon` 슬롯으로 기본 폴백을 완전히 대체할 수 있습니다(커스텀 그래픽, 텍스트 모두 가능):

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="첫 번째 단계">
      <template #icon>
        <text class="step-badge">하나</text>
      </template>
    </lh-step>
    <lh-step title="두 번째 단계">
      <template #icon>
        <text class="step-badge">둘</text>
      </template>
    </lh-step>
    <lh-step title="세 번째 단계">
      <template #icon>
        <text class="step-badge">셋</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## 클릭 내비게이션

`clickable`을 켜면 `finish` / `process` 상태의 단계가 클릭 가능한 머리로 렌더링되고, 클릭 시 `update:current`(v-model)와 `change`를 발생시킵니다. 이후의 `wait` 단계는 이동할 수 없습니다.

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="첫 번째 단계" />
    <lh-step title="두 번째 단계" />
    <lh-step title="세 번째 단계" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## 상태 일괄 덮어쓰기

`status`를 전달하면 모든 단계의 파생 상태(`wait` / `process` / `finish` / `error`)를 덮어씁니다(커스텀 표시용).

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="첫 번째 단계" />
    <lh-step title="두 번째 단계" />
    <lh-step title="세 번째 단계" />
  </lh-steps>
</template>
```

## Steps Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| current | 현재 단계 인덱스(v-model:current, 0부터) | `number` | `0` |
| direction | 방향: `'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | 단계 클릭 가능 여부(완료 / 진행 중 단계만) | `boolean` | `false` |
| status | 모든 단계의 상태를 일괄 덮어씀(커스텀 표시용) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | 커스텀 클래스 이름(루트 노드로 전달) | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Step Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| title | 단계 제목(title 슬롯도 사용 가능) | `string` | `''` |
| description | 단계 설명(description 슬롯도 사용 가능) | `string` | `''` |
| icon | 커스텀 아이콘 이름(미전달 시 finish/error는 체크/X, 나머지는 서수) | `LhIconName` | — |
| customClass | 커스텀 클래스 이름(항목 루트 노드로 전달) | `string` | — |

## Events

| Event | 설명 | 콜백 인자 |
| --- | --- | --- |
| update:current | 현재 단계가 변경됨(v-model:current) | `(index: number)` |
| change | 클릭 가능 단계를 클릭해 이동 | `(index: number)` |

## Slots

| Slot | 설명 |
| --- | --- |
| Steps default | 단계 항목 노드(`lh-step`만 수집) |
| Step icon | 원 안 내용(icon prop과 서수 폴백을 대체) |
| Step title | 제목(title prop 대체) |
| Step description | 설명(description prop 대체) |

## 플랫폼 차이

- **순수 표시 + 상태 컴포넌트로 H5와 WeChat 미니프로그램 양 끝에서 사용 가능**합니다. 가로 / 세로 레이아웃은 CSS로 제어되어 양단이 동일합니다.
- `<ol>/<li>`는 `<view>`로 대체됩니다(WXSS는 태그 선택자를 금지). 클릭 가능한 머리는 `view` + `role="button"`으로 렌더링합니다(미니프로그램의 `<button>`은 네이티브 스타일을 리셋할 수 없기 때문). 접근성 이름은 share locales의 `steps.step` / `steps.finish` / `steps.error` 키에서 가져옵니다(9개 언어 완비, 이 저장소에 사본을 보유하지 않음).
- **"마지막 단계는 연결선을 그리지 않는" 메커니즘이 양단에따라 다릅니다**: share 소스에서 연결선(가로 `::after` / 세로 `::before`)은 구조적 `:not(:last-child)`로 마지막 항목을 제외하지만, WXSS는 `:not()`를 지원하지 않아 빌드 시 제거됩니다(모든 항목이 연결선을 그림). 마지막 / 줄 끝 항목의 숨김은 모두 `--line-last` 클래스에 맡겨집니다:
  - 가로: 줄바꿈 측정 로직은 Vue3 버전과 동일(`getStepsLineLastIndices`)하되, 측정은 어댑터 `getLhRect`를 경유합니다(H5는 document 쿼리, MP는 비동기 `createSelectorQuery`, onMounted 이후에 실행 필수).
  - 세로: 줄바꿈이 없어 전역 마지막 항목을 직접 표시하고, 컴포넌트 SFC의 uni-app 적응 스타일로 `--line-last::before` 숨김 규칙을 보충합니다(share 소스에 해당 규칙 없음).
- **컨테이너 너비 변화에 따른 줄바꿈 재계산은 H5 전용입니다**: H5는 `ResizeObserver`를 사용합니다. MP에는 해당 API가 없고 단계 추가/제거와 방향 전환은 재계산되지만, 동적 크기 변화에는 페이지 재진입이 필요합니다(MP 번들에 데드 코드를 남기지 않기 위해 수용된 제한).
- **이식 결정(Vue3 버전에 정렬, 미정의 API 도입 없음)**: 이식 시점에 plus 진원에는 `simple` 모드, `process-status` / `finish-status` 커스텀 상태, `space` 간격 등의 API가 없었고(진원 Props는 `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`), 이 라이브러리에서도 제공하지 않습니다. `themeVars`도 포함하지 않습니다(이 저장소 ConfigProvider의 `componentTheme` 목록에 steps 미등록). 진원에 추가되면 따라갑니다.
