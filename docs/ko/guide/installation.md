# 설치

## 의존성

- `@lh-ui/share`은 자동으로 설치됩니다(본 라이브러리의 유일한 런타임 의존성).
- uni-app Vue3 프로젝트(`@dcloudio/uni-app` 3.x).
- WeChat 미니프로그램은 **기본 라이브러리 ≥ 2.25.2**(root-portal)를 요구합니다. 낮은 버전에서는 페이지 내 fixed로 폴백합니다.

## 방법 1: easycom 필요할 때만 도입(권장)

설치 후 `pages.json`에 easycom 규칙 한 줄을 추가합니다:

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

그 후 템플릿에 태그를 직접 쓰면 되며, **import와 등록이 필요 없습니다**:

```vue
<template>
  <lh-button type="primary" @click="onTap">버튼</lh-button>
</template>
```

::: warning easycom 설정은 실시간으로 적용되지 않습니다
uni-app은 컴파일 성능상 `pages.json`의 easycom을 변경해도 **재컴파일을 트리거하지 않습니다**. 규칙을 변경한 후 페이지
내용을 수정하거나(또는 dev server를 재시작해야) 적용됩니다. 이것은 uni-app의 기존 동작이며, 본 라이브러리의 문제가
아닙니다.
:::

## 방법 2: 전체 등록

easycom을 사용하지 않을 때(예: H5 프로젝트에서 전체를 도입하려면) `app.use`를 사용합니다:

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## 스타일 import

**두 방법 모두 두 개의 CSS 산출물을 import해야 합니다**(사용자 측 sass 의존성 없음, 스타일은 빌드 시 정제되어 자족적인
CSS가 됩니다):

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // 테마 변수(page { --lh-* } + page.dark 다크)
import '@lh-ui/uniapp/src/icon/iconfont.css' // 아이콘 폰트(lh-icon 컴포넌트 의존)
```

::: tip 왜 빌드 시 산출물인가(scss 소스가 아님)
uni-app 프로젝트의 sass `loadPaths`에는 `node_modules`가 포함되어 있지 않아, `@use '@lh-ui/share/...'` 같은
bare specifier를 해석할 수 없고 직접 참조하면 컴파일이 실패합니다. 그래서 본 라이브러리는 빌드 시 자족적인 CSS를
출력하고, 컴포넌트 SFC는 `<style src="./style.css">`로 참조합니다. 이는 **사용자가 sass를 설치할 필요가 없다**는 뜻이기도
합니다.
:::

## 명령형 서비스는 마운트 지점이 필요합니다

Message / Loading은 미니프로그램에서 JS로 DOM을 생성할 수 없어 **마운트 지점 패턴**을 사용합니다. 사용할 페이지
(또는 루트 컴포넌트)에 마운트 지점 컴포넌트를 배치합니다:

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- 페이지 내용 --></view>

    <!-- 명령형 서비스의 마운트 지점 -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('작업 성공')
</script>
```

::: danger 마운트 지점을 두지 않으면 경고합니다
`useLhMessage()`를 호출했는데 페이지에 `<lh-message />`가 없으면, 개발 중 `console.error`로 명확히 경고합니다.
**조용히 폴백하지 않습니다.** 이것은 의도된 설계입니다: 조용히 폴백하면 "호출이 된 것처럼 보이나 실제로 반응이 없는" 문제가
숨은 버그가 되기 때문입니다.
:::

## TypeScript

본 라이브러리는 타입을 포함하고 있으며, 컴포넌트 Props / 이벤트 모두 완전한 타입 추론을 제공합니다. easycom 형태에서
템플릿 내 태그의 타입은 `uni-app`의 컴포넌트 타입 시스템이 제공합니다(프로젝트에 전역 컴포넌트 타입을 설정하지 않은 경우
`LhXxxProps`로 명시적으로 지정하면 됩니다).
