# Upload 업로드

파일 선택과 업로드를 결합한 컴포넌트입니다. 선택 검증(accept / maxSize /
maxCount), 파일 항목의 상태 머신(ready → uploading → success / fail),
목록 패치 로직은 모두 `@lh-ui/share`의 core 순수 함수
(`normalizeUploadAccept` / `isFileRejected` / `exceedsMaxSize` /
`exceedsMaxCount` / `patchUploadFile` 등)를 그대로 소비하고, 컴포넌트
계층은 렌더링, 이벤트, 플랫폼 선택 어댑터만 담당합니다. 업로드 자체는
HTTP 클라이언트를 내장하지 않고 `request` prop은 사용자가 소유하며,
adapter의 `createLhUploadRequest`로 바로 생성할 수 있습니다.

## 기본 사용법

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// 미니 프로그램에서는 uni.uploadFile, H5에서는 XHR + FormData를 사용.
// 필드명은 기본적으로 file. 실기기에서는 WeChat의
// '서버 도메인 - uploadFile' 설정에 대상 도메인을 등록해야 합니다.
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

트리거 영역을 클릭하면 네이티브 선택기가 열립니다(chooseMedia /
chooseImage / chooseVideo). 파일이 목록에 들어오면 즉시 `request`를 호출해
업로드합니다. 업로드 중에는 진행률 표시줄, 성공 시에는 ✓과 서버 URL,
실패 시에는 원인을 표시합니다(`error` 이벤트가 실패한 파일과 원인 문자열을
전달). `request`를 넘기지 않으면 로컬 선택과 검증만 수행하고 목록은
`ready` 상태에 머무릅니다. 업로드 채널은 사용자가 직접 처리하세요.

트리거 영역에는 기본적으로 힌트 텍스트가 렌더링됩니다('파일 선택',
드래그 모드에서는 '여기에 파일을 끌어다 놓거나 클릭하여 업로드하세요'.
문구는 share locales의 `upload.*` 키에서 가져오며 10개 국어를 지원).
기본 슬롯을 전달하면 트리거 영역의 콘텐츠를 커스터마이징할 수 있습니다.

## 다중 선택과 수량 / 크기 제한

```vue
<template>
  <lh-upload
    :request="request"
    accept="image/*"
    multiple
    :max-count="3"
    :max-size="2 * 1024 * 1024"
  />
</template>
```

`multiple`은 네이티브 선택기의 다중 선택을 켭니다. `maxCount`에 도달한 후
다시 선택하면 '수량 제한을 초과했습니다'라는 메시지를 표시하고 추가를
멈춥니다. `maxSize`를 초과하는 파일은 건너뛰고 '파일이 크기 제한을
초과했습니다'라고 표시합니다(기본값 5MB). 두 메시지 모두 목록 아래의
에러 텍스트 노드(`role="alert"`)에 렌더링됩니다.

## accept 타입 제한

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept`는 배열 `['.png', 'image/*']` 또는 쉼표로 구분된 문자열
`'.png,.jpg'`를 받습니다. uni 환경에서의 규칙 매핑은 아래 '플랫폼 차이'를
참조하세요. 네이티브 선택기 패널은 미디어 타입으로만 필터링할 수 있어
확장자 규칙은 패널에 전달되지 않고, 선택 후 `isFileRejected`가
폴백으로 검증합니다.

## 드래그 앤 드롭(H5 전용)

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag`는 트리거 영역을 드롭 존으로 만듭니다(H5에서는 `dragover` /
`dragleave` / `drop`이 동작하고, 드롭된 File은 `LhUniFile`로 래핑되어
동일한 흐름을 따릅니다). 미니 프로그램에는 HTML5 드래그 앤 드롭이 없어
MP에서는 `drag`가 동작하지 않고, 트리거 영역은 클릭 업로드로
전환됩니다.

## 비활성화

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled`는 업로드 전체를 비활성화합니다. 트리거 영역 클릭과 키보드
활성화(Enter / Space, H5 전용)가 모두 차단되고, 트리거 영역에
`aria-disabled`가 출력됩니다.

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| multiple | 다중 선택 허용 | `boolean` | `false` |
| drag | 드롭 존(H5 전용: MP에는 HTML5 드래그 없음) | `boolean` | `false` |
| disabled | 비활성화 | `boolean` | `false` |
| accept | 허용할 확장자 / MIME: 배열 `['.png', 'image/*']` 또는 쉼표 문자열 `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | 파일당 크기 제한(바이트) | `number` | `5242880`(5MB) |
| maxCount | 수량 제한(0은 무제한) | `number` | `0` |
| request | 업로드 요청 함수(생략 시 로컬 선택과 검증만 수행) | `LhUniUploadRequest` | — |
| customClass | 커스텀 클래스 이름(루트 노드로 전달) | `string` | — |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| change | 파일 목록이 변화함(선택 / 업로드 완료 / 제거 후) | `(files: LhUploadFile[])` |
| success | 단일 파일 업로드 성공 | `(file: LhUploadFile)` |
| error | 단일 파일 업로드 실패 | `(file: LhUploadFile, reason: string)` |
| remove | 파일이 제거됨 | `(uid: string)` |

### Slots

| 이름 | 설명 |
| --- | --- |
| default | 트리거 영역 콘텐츠(생략 시 힌트 텍스트 표시) |

### LhUploadFile

| 필드 | 설명 | 타입 |
| --- | --- | --- |
| uid | 고유 식별자(내부 생성) | `string` |
| name | 파일 이름 | `string` |
| size | 바이트 크기 | `number` |
| status | 상태 | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | 업로드 진행률 0-100 | `number` |
| url | 서버 URL(성공 시) | `string` |
| error | 실패 원인 | `string` |

### 어댑터(`@lh-ui/uniapp/src/adapter/upload`)

| 내보내기 | 설명 |
| --- | --- |
| `LhUniFile` | uni 환경 파일 핸들: `{ path, name, size, type }`(path는 임시 경로: H5에서는 blob / data URL, WeChat에서는 wxfile:// 임시 경로) |
| `LhUniUploadRequest` | request prop의 함수 서명: `{ file: LhUniFile, onProgress }`를 받아 `Promise<LhUploadResult>`를 반환 |
| `LhUploadResult` | 업로드 결과: `{ url?, data? }`(url이 없으면 data가 원시 응답 본문을 전달하므로 직접 파싱) |
| `LhUploadConfig` | `createLhUploadRequest`의 설정: `{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | 요청 함수 생성: 미니 프로그램에서는 `uni.uploadFile`, H5에서는 XHR + FormData |
| `chooseLhFiles(options)` | 통일된 파일 선택(보통 트리거 영역을 통해 호출되며 사용자가 직접 호출할 일은 적음) |
| `wrapLhNativeFile(file)` | H5에서 드롭된 File을 `LhUniFile`로 래핑 |

### 접근성

- 트리거 영역은 `role="button"` + `tabindex`(비활성 시 -1)이며, 비활성 시
  `aria-disabled`를 노출
- 업로드 중인 항목에는 `role="progressbar"` + `aria-valuenow`를 가진
  진행률 표시줄이 내장
- 실패한 항목은 에러 텍스트를 표시하며, 목록 아래의 에러 메시지는
  `role="alert"`
- 제거 버튼에는 `aria-label`('제거 + 파일 이름')이 부여됨

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **파일 선택은 네이티브 API 경유**: Vue3 버전은 `<input type="file">`을
  사용하지만 미니 프로그램에는 File이나 input이 없습니다. 선택은 adapter의
  `chooseLhFiles`(chooseMedia / chooseImage / chooseVideo)로 통일되며,
  그 결과는 임시 파일 경로(`LhUniFile`)이지 DOM File이 아닙니다.
- **accept는 미디어 타입으로만 매핑 가능**: uni의 선택 API는 image /
  video만 이해합니다. `image/*`(또는 이미지 확장자) → 이미지 선택,
  `video/*`(또는 동영상 확장자) → 동영상 선택, 둘의 혼합 또는 미지정 →
  chooseMedia 혼합 모드. 확장자 규칙(`.png` 등)은 네이티브 선택기 패널에
  전달할 수 없어 선택 후 `isFileRejected`가 폴백으로 검증합니다.
  미디어가 아닌 규칙(`.txt` 등)에 해당하는 기능은 미니 프로그램에 없어
  이미지 선택으로 매핑된 뒤 폴백 검증에서 거부됩니다. chooseMedia는
  WeChat 기반 라이브러리 2.10+에만 존재하며 adapter에는 존재 확인 가드가
  있어, 사용할 수 없는 경우 chooseImage / chooseVideo로 폴백합니다.
- **request는 DOM File이 아니라 LhUniFile을 받음**:
  `{ file: LhUniFile, onProgress }`의 file은 임시 파일 핸들입니다.
  `uni.uploadFile`로 직접 업로드하려면 adapter의
  `createLhUploadRequest(action, config)`로 request를 생성하세요
  (H5는 자동으로 XHR + FormData를 사용해 양 끝의 의미를 맞춤).
  **uploadFile의 대상 도메인은 WeChat 공식 계정의 '서버 도메인' 설정에
  등록해야 하며**, 그렇지 않으면 실기기 요청이 차단됩니다. H5에는 이런
  제한이 없습니다.
- **드래그 앤 드롭은 H5 전용**: 미니 프로그램에는 HTML5 드래그가 없어
  MP에서는 `drag`가 동작하지 않습니다(트리거 영역은 클릭 업로드로
  전환). 드래그 관련 핸들러는 조건부 컴파일로 제거되며 MP 번들에는
  데드 코드가 없습니다.
- **키보드 활성화는 H5 전용**: Enter / Space로 선택기를 여는 동작은 H5에서만
  작동합니다. 미니 프로그램에는 키보드 이벤트가 없습니다.
- **선택 취소는 조용히 처리**: 네이티브 선택 취소(errMsg에 cancel 포함)는
  에러 메시지를 기록하지 않고 `error` 이벤트도 발생시키지 않습니다.
- **API 범위는 plus 소스에 엄격하게 정렬**: plus에 없는 `action` /
  `headers` / `fileList` / `before-upload` 등은 추가하지 않았고, 업로드
  주소 등의 설정은 request 함수로 사용자가 소유합니다. 이 패키지의 관례에
  따라 `customClass`(스타일 격리 통과)를 추가했습니다.
:::
