# Form 폼

데이터 수집과 검증. 검증 로직은 전부 `@lh-ui/share`의 순수 함수이며 플랫폼 의존성이 없어 두 플랫폼에서 동작이
일치합니다.

## 기본 사용법

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="사용자 이름" prop="name">
      <lh-input v-model="form.name" placeholder="사용자 이름을 입력하세요" />
    </lh-form-item>
    <lh-form-item label="이메일" prop="email">
      <lh-input v-model="form.email" placeholder="이메일을 입력하세요" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">제출</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: '사용자 이름을 입력하세요', trigger: 'blur' }],
  email: [{ required: true, message: '이메일을 입력하세요', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // 검증 통과, 제출
  }
}
</script>
```

## Form Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| model | 폼 데이터 객체(필수) | `Record<string, unknown>` | — |
| rules | 검증 규칙(키가 prop 이름) | `Record<string, LhFormRule[]>` | — |
| labelPosition | 레이블 위치: `left` / `right` = 컨트롤 왼쪽 레이블의 텍스트 정렬(Element Plus 기준); `top` = 위; `bottom` = 컨트롤 아래 | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| labelWidth | 레이블 너비 | `string \| number` | — |
| inline | 인라인 레이아웃 | `boolean` | `false` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

::: tip
`labelPosition`의 위치 클래스명은 share 스타일 소스와 정렬되어 있습니다: `lh-form-item--top` / `lh-form-item--bottom` / `lh-form-item--left` / `lh-form-item--right`. 페이지 스타일에서 클래스명으로 미세 조정할 수 있습니다.
:::

## Form Methods(ref로 호출)

::: warning ref 호출은 onReady 이후에 해야 함
`onLoad` 단계에서는 자식 컴포넌트 생성이 완료되지 않아 `formRef.value`가 undefined입니다.
제출 버튼의 클릭 이벤트는 자연스럽게 `onReady` 이후이므로 그대로 사용해도 문제없습니다;
페이지 초기화 시에 호출하려면 `onReady` 안에 넣으십시오.
:::

| 메서드 | 설명 | 반환 |
| --- | --- | --- |
| validate | 모든 필드 검증 | `Promise<boolean>`(모두 통과하면 true) |
| validateField | 단일 필드 검증 | `Promise<boolean>` |

## FormItem Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| prop | 필드 키 이름(model의 키와 rules의 키에 대응) | `string` | — |
| label | 레이블 문구 | `string` | — |
| required | 필수 표시(별표 표시; 실제 검증은 rules가 결정) | `boolean` | `false` |
| rules | 이 필드 전용 규칙(Form의 rules와 병합) | `LhFormRule[]>` | — |
| customClass | 커스텀 클래스명 | `string` | — |

::: tip Vue3 버전과의 차이
- 검증 트리거: 미니프로그램 컨트롤에는 change 시맨틱이 없어 각 폼 컨트롤이 blur / input 이벤트를 검증 트리거로
  매핑합니다.
- 폼 제출: 미니프로그램 폼 시맨틱이 달라 `validate`가 `Promise<boolean>`을 반환해 수동 제출에 사용하며,
  web 버전의 `submit` 이벤트 가로채기는 없습니다.
:::
