# Loading 로딩

전역 로딩 오버레이 서비스. Message와 마찬가지로 **마운트 지점 패턴**입니다.

## 마운트 지점 배치

```vue
<template>
  <lh-config-provider>
    <view><!-- 페이지 내용 --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## 호출

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show는 옵션 객체 또는 문구 문자열을 받아 handle을 반환
const handle = loading.show({ text: '로딩 중...' })
handle.close()

// 모두 닫기
loading.closeAll()
```

::: danger 마운트 지점을 두지 않으면 경고합니다
Message와 같음: `useLhLoading()`를 호출했는데 페이지에 `<lh-loading />`이 없으면,
개발 중 `console.error`로 명확히 경고하며, 조용히 폴백하지 않습니다.
:::

## LhLoadingOptions

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| target | 타깃 노드(**H5 전용**; MP 측은 항상 전체 화면) | `string` | — |
| text | 로딩 문구 | `string` | — |
| background | 오버레이 배경색 | `string` | — |
| lock | 스크롤 잠금(**H5 전용**) | `boolean` | `false` |
| zIndex | 층위(미전달 시 자동 증가 할당) | `number` | — |

## 메서드

| 메서드 | 설명 | 매개변수 |
| --- | --- | --- |
| show | 로딩 오버레이를 표시하고 handle(`{ close }`) 반환 | `(options: LhLoadingOptions \| string)` |
| close | 지정 id의 로딩 닫기 | `(id: number)` |
| closeAll | 모두 닫기 | — |

## Vue3 버전과의 차이

- `target`은 미니프로그램 측에서 **전체 화면 오버레이만 지원** — 미니프로그램에서는 임의의 노드를 선택해 오버레이를 붙일
  수 없어, 초판 MP 측은 `target`을 무시합니다(필드는 유지, 문서에 명시).
- `lock`은 H5에서만 유효하며, 미니프로그램에는 body 스크롤 잠금이 없습니다.
- 여러 인스턴스가 겹칠 때 `useLhZIndex`가 나중에 열린 오버레이를 상위 층에 보장합니다.
