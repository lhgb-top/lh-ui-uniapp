# Message 메시지

전역 메시지 팁 서비스. **마운트 지점 패턴을 채택** — 미니프로그램에서는 JS로 DOM을 생성할 수 없어 페이지에 마운트 지점
컴포넌트를 먼저 배치해야 합니다.

## 마운트 지점 배치

메시지 팁이 필요한 페이지(또는 상주하는 루트 감싸기 컴포넌트)에 한 번 배치합니다:

```vue
<template>
  <lh-config-provider>
    <view><!-- 페이지 내용 --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## 호출

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('저장 성공')
message.info('안내 메시지')
message.warning('경고 메시지')
message.danger('오류 메시지')
message.error('오류 메시지(danger의 별칭)')

// 자동으로 닫히지 않는 로딩 팁(duration: 0), 수동으로 닫기
const handle = message.loading('로딩 중...')
// ...비동기 완료 후
handle.close()

// 모두 닫기
message.closeAll()
```

::: danger 마운트 지점을 두지 않으면 경고합니다
`useLhMessage()`를 호출했는데 페이지에 `<lh-message />`가 없으면, 개발 중 `console.error`로
명확히 경고합니다. **조용히 폴백하지 않습니다.** 이것은 의도된 설계입니다: 조용히 폴백하면 "호출이 된 것처럼 보이나
실제로 반응이 없는" 문제가 숨은 버그가 되기 때문입니다.
:::

## 메서드

| 메서드 | 설명 | 매개변수 |
| --- | --- | --- |
| (직접 호출) | `message('xxx')`는 `message.info('xxx')`와 동등 | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | 해당 유형의 메시지 팝업 | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | 자동으로 닫히지 않는 로딩 팁(`duration: 0`)을 팝업하고 handle을 반환해 수동으로 닫기 | 같음 |
| close | 지정 id의 메시지 닫기 | `(id: number)` |
| closeAll | 모두 닫기 | — |

## LhMessageOptions

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| content | 문구(필수) | `string` | — |
| type | 유형 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | 표시 시간(밀리초), 0이면 자동 닫기 안 함 | `number` | `3000` |
| showClose | 닫기 버튼 표시 | `boolean` | `false` |
| offset | 상단 오프셋(px) | `number` | — |
| onClose | 닫힘 콜백 | `() => void` | — |

## 전역 설정

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| 설정 | 설명 | 기본값 |
| --- | --- | --- |
| duration | 기본 표시 시간(밀리초) | `3000` |
| max | 같은 화면 최대 개수 | — |
| offset | 상단 오프셋 | — |

::: tip Vue3 버전과의 차이
- **`appendTo` 없음**: web 버전은 `document.body`에 마운트하지만 미니프로그램에는 이 개념이 없으며, 마운트 지점 위치는
  페이지 내 `<lh-message />`의 위치에 의해 결정됩니다.
- 등장 / 퇴장 애니메이션은 CSS transition + setTimeout으로 시간을 정렬합니다(미니프로그램에서 `transitionend`는
  신뢰할 수 없음).
- 알림이 필요하면 Notification 서비스를 사용하세요(「서비스」 그룹 참고).
:::
