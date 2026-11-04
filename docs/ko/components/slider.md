# Slider 슬라이더

트랙 위의 손잡이를 드래그하여 값을 선택하는 슬라이더 컴포넌트입니다. 단일 손잡이와 범위(손잡이 2개) 모드, `step` 단위 흡착, `marks` 눈금 라벨을 지원합니다. 트랙·손잡이·채움 막대는 모두 `view`로 자체 그려지며, 값 클램프 / 단위 흡착 / 눈금 정렬 / 접근성 계약은 `@lh-ui/share` 순수 함수를 그대로 사용합니다(복사 없음).

## 기본 사용법

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

`modelValue`를 넘기지 않으면 `min`으로 내부 상태를 초기화합니다. 넘기면 제어형이 됩니다(다른 폼 컴포넌트들과 동일). 드래그 중에는 내부 상태만 갱신되고, **드래그가 끝날 때 `update:modelValue` / `change`가 한 번만 전달됩니다**(Vue3 버전과 동일).

## 범위 선택

`range`를 켜면 손잡이 2개 모드가 되고 `modelValue`는 `[시작, 끝]` 튜플입니다:

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

한쪽 끝을 다른 쪽 끝을 넘어 드래그하면 양 끝이 자동으로 교체됩니다(손가락 아래에 있는 손잡이가 항상 드래그 대상). 값은 항상 `[이른, 늦은]` 순서를 유지합니다.

## 단위와 눈금

`step`은 손잡이를 단위 격자에 흡착시킵니다. `marks`는 `값 → 라벨` 맵으로 눈금 라벨을 그립니다(값 기준 정렬):

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: '중간',
  100: '최대',
}
</script>
```

## 비활성화

`disabled`는 드래그와 키보드 조작을 막고 손잡이를 탭 순서에서 제외합니다:

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## 값 표시

`show-input`은 트랙 오른쪽에 현재 값을 표시합니다(범위 모드에서는 `[시작, 끝]` 문자열):

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 현재 값(제어형 v-model, 범위 모드는 튜플) | `number \| [number, number]` | — |
| min | 최솟값 | `number` | `0` |
| max | 최댓값 | `number` | `100` |
| step | 단위 크기(손잡이가 흡착되는 최소 단위) | `number` | `1` |
| disabled | 전체 비활성화 | `boolean` | `false` |
| range | 범위 모드(손잡이 2개) | `boolean` | `false` |
| showInput | 트랙 오른쪽에 현재 값 표시 | `boolean` | `false` |
| size | 크기 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | 눈금 라벨(키가 값, 오름차순 정렬) | `Record<number, string>` | — |
| customClass | 루트 노드로 전달할 커스텀 클래스명 | `string` | — |
| sx | sx 레이아웃 단축 속성(루트 노드에 적용) | `LhSxProps` | — |

### Events

| Event | 설명 | Parameters |
| --- | --- | --- |
| update:modelValue | 값 변경(v-model, 드래그 종료 또는 키보드 조작 시 전달) | `(value: number \| [number, number])` |
| change | 값 변경(update:modelValue와 동일한 페이로드) | `(value: number \| [number, number])` |

### 접근성

- 손잡이는 `role="slider"`이며 `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext`를 갖습니다(계약은 share의 `getSliderThumbAria`가 결정)
- 범위 모드에서는 두 손잡이의 `aria-label`이 구분됩니다(「시작 손잡이 / 끝 손잡이」, 로케일 키 `slider.thumbStart` / `slider.thumbEnd`, 범위 외는 `slider.thumb`)
- 키보드 조작(방향키로 `step` 이동, PageUp / PageDown 큰 걸음, Home / End 로 양끝으로 점프)은 H5 전용입니다. 아래 플랫폼 차이를 참조하세요

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **드래그 방식**: plus는 손잡이에 `mousedown` / `touchstart`를 건 뒤 move / up 감시를 `document`로 옮깁니다. 미니프로그램에는 document가 없어서 `touchstart` / `touchmove` / `touchend`는 손잡이에 그대로 바인딩합니다(미니프로그램의 touch 이벤트는 touchstart 대상에 계속 전달되므로 전역 감시가 필요 없음). H5는 document 레벨 마우스 감시를 유지하고(마우스 다운 이후 컴포넌트 밖에서도 드래그 계속) 조건부 컴파일로 지킵니다. MP 번들에는 데드 코드가 없습니다.
- **위치 계산은 비동기**: plus는 동기 `getBoundingClientRect`로 트랙 사각형을 측정하지만, 미니프로그램에는 비동기 `createSelectorQuery`만 있어 어댑터의 `getSingleLhRect`를 사용합니다. 측정 결과는 드래그 세션별로 캐시되고(touchstart 시 미리 측정) 일반 드래그에는 거의 영향이 없습니다. 다만 **값 갱신이 터치보다 한 프레임 늦는** 비동기 의미를 가집니다. move 이벤트 안에서 값이 이미 갱신되었다고 동기적으로 가정하지 마세요. 전달은 드래그가 끝날 때만 일어납니다.
- **트랙 너비 0이면 건너뜀**: 레이아웃 전(또는 테스트 환경)처럼 트랙 사각형 너비가 0이면 0으로 나누어 NaN이 되는 것을 피해 해당 갱신을 건너뜁니다.
- **키보드 조작은 H5 전용**: 방향키 / Home / End / PageUp / PageDown 이동은 MP에 키보드 이벤트가 없어 조건부 컴파일로 호출 자체를 생략합니다. MP 번들에 데드 코드는 없습니다.
- **aria 속성은 하나씩 명시 바인딩**: share의 `LhAriaAttrs` 팩은 `v-bind`로 펼칠 수 없습니다(MP 템플릿 컴파일러 미지원). 글루 레이어가 `aria-*` 키를 구체적인 값으로 펼쳐 바인딩하며, 계약은 여전히 share 순수 함수가 결정합니다.
- **vertical 세로 모드와 tooltip 버블은 미지원**: plus 원본에 `vertical`(세로 트랙)과 tooltip 버블 prop이 없고, 이 포팅도 엄격히 맞춰 추가하지 않습니다. 세로가 필요하면 바깥 컨테이너를 회전시키고(터치 좌표는 직접 처리) 값 표시가 필요하면 `show-input`으로 항상 표시하세요.
:::
