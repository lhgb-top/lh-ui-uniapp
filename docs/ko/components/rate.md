# Rate 별점

별점 평가：클릭으로 별을 선택하고, 반올림 반별과 점수 텍스트를 선택적으로 표시하며, 읽기 전용 상태에서는 스크린 리더용 별점 텍스트를 출력합니다. 채움 단계, 클램프, 스텝 알고리즘은 `@lh-ui/share` core 순수 함수가 산출합니다.

## 기본 사용법

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## 반별 (half star)

`allow-half`로 반별을 활성화합니다: H5에서는 별의 왼쪽 반을 클릭하면 0.5로 기록됩니다（클릭의 가로 오프셋으로 판정）.

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## 읽기 전용 및 점수 텍스트

`readonly`는 순수 표시 분기로 진입합니다（`role="img"`, 별점 텍스트는 `aria-label`로 전달）；`show-score`는 점수 텍스트를 추가하고, `score-template`으로 템플릿을 커스터마이즈할 수 있습니다（`{n}` 자리표시자）.

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} 점" />
</template>
```

## 별 수와 문자 커스터마이즈

`max`로 별 수 상한을 조정（[0, max]로 클램프）；`character`로 기본 `★`를 대체합니다.

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## 비활성화

`disabled`는 그룹 전체를 비활성화합니다: 클릭이 반영되지 않으며, 루트에 `lh-rate--disabled`와 `aria-disabled`가 붙습니다.

## Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue / v-model | 현재 평점 | `number` | `0` |
| max | 별 수 상한 | `number` | `5` |
| allow-half | 반별 허용 | `boolean` | `false` |
| readonly | 읽기 전용（순수 표시） | `boolean` | `false` |
| disabled | 비활성화 | `boolean` | `false` |
| character | 커스텀 문자 | `string` | — |
| show-score | 점수 텍스트 표시 | `boolean` | `false` |
| score-template | 점수 템플릿（`{n}` 자리표시자） | `string` | — |
| customClass | 커스텀 클래스（루트 노드로 전달） | `string` | — |
| sx | sx 축약 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 인자 |
| --- | --- | --- |
| update:modelValue / change | 평점 변화（같은 값은 재발행하지 않음） | `(value: number)` |

## 플랫폼 차이

- **반별 판정은 H5 전용**：클릭 이벤트의 가로 오프셋（`offsetX`）에 의존하지만, **미니프로그램 이벤트에는 이 필드가 없어** 클릭이 온별로 강등됩니다. 미니프로그램에서 반별 정밀도가 필요하면 touch 이벤트 + `uni.createSelectorQuery`의 비동기 오프셋 계산으로 직접 구현해야 합니다（SelectorQuery는 비동기임에 유의）.
- **별 요소**：plus의 `<button>` 별은 `<view role="radio">`가 됩니다（MP의 button은 기본 스타일을 reset할 수 없음）. 비활성화는 클릭 가드 + `--disabled` 수정자 클래스 + `aria-disabled`로 표현합니다.
- **키보드 스텝은 H5 전용**：방향키 ±1（반별 모드 ±0.5）、Home으로 0, End로 상한. 미니프로그램에는 키보드 이벤트가 없어 동작 차이가 없습니다.
- **점수 텍스트**：share locales의 `rate.stars`（`{n} 星`, 9개 언어 완비）를 사용하며, `score-template`으로 재정의할 수 있습니다.

::: tip Vue3 버전과의 차이
- 로직 구성（클램프, 채움 단계, 스텝, aria）이 plus와 완전히 일치합니다（동일한 share core）.
- `customClass` prop이 추가되었습니다：uni-app에서는 커스텀 클래스가 `styleIsolation`을 통과하지 못해 prop으로 전달합니다.
- 반별 판정은 미니프로그램에서 온별로 강등됩니다（「플랫폼 차이」 참조）.
:::
