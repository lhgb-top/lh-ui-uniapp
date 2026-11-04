# Image 이미지

로드 실패 플레이스홀더가 있는 이미지 컴포넌트입니다. 탭하여 미리 볼 수 있으며
(모든 플랫폼에서 사용 가능한 `uni.previewImage` 네이티브 API 사용), 크기 조절 모드는
uni `<image>`의 `mode`로 매핑되고, 지연 로딩은 컴포넌트 내장 `lazy-load`를 사용합니다.
미리보기 목록 정규화와 상태 클래스 이름은 `@lh-ui/share` core 순수 함수에서 생성됩니다.

## 기본 사용법

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="샘플 이미지" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt`는 TS 레벨에서 필수입니다. uni `<image>`의 기본 크기는 320×240이므로 크기는 `sx`의
`w` / `h`(또는 style)로 명시하세요. 모서리 둥글기는 share 스타일 소스에 내장되어 있으며
(`--lh-border-radius-small`) 설정이 필요 없습니다.

## 채우기 모드

`fit`은 CSS object-fit의 의미를 나타내며 uni `<image>`의 `mode`로 매핑됩니다:
`contain` → `aspectFit`, `cover` → `aspectFill`, `fill` → `scaleToFill`.

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="커버 잘라내기" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="전체 표시" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="늘려 채우기" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down은 근사 매핑
`none`은 `center`로 매핑됩니다(확대/축소 없이 가운데 영역만 표시, object-fit: none과
동일한 의미). uni에는 `scale-down`에 해당하는 `mode`가 없으므로 의미상 가장 가까운
`aspectFit`을 사용합니다(lh-avatar와 동일한 등록된 차이).
:::

## 지연 로딩

`lazy`는 uni `<image>`에 내장된 `lazy-load`를 활성화합니다(뷰포트에 진입할 때 로드).

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`지연 로딩 이미지 ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

WeChat에서 `lazy-load`는 page와 scroll-view 아래의 image에만 적용됩니다.

## 로드 실패

로드가 실패하면 실패 플레이스홀더로 전환되고(루트 노드에 `lh-image--error` 추가), 기본 문구는
언어 팩의 `image.error`(9개 언어 지원)를 사용합니다. `error` 슬롯으로 커스터마이즈할 수도
있으며, 동시에 `error` 이벤트를 발생시킵니다.

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="기본 실패 플레이스홀더" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="커스텀 실패 플레이스홀더" :sx="{ w: '240px', h: '140px' }">
    <template #error>커스텀 실패 플레이스홀더</template>
  </lh-image>
</template>
```

## 탭하여 미리보기

`preview`를 활성화하면 이미지를 탭할 때 `uni.previewImage` 네이티브 미리보기가 열립니다
(모든 플랫폼 사용 가능). `preview-src-list`로 여러 이미지 목록을 전달할 수 있으며, 전달하지
않으면 `[src]`로 폴백합니다(plus와 동일한 정규화, 초기 인덱스는 0 고정).

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="여러 이미지 미리보기"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="단일 이미지 미리보기" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| src | 이미지 URL | `string` | — |
| alt | 대체 텍스트(a11y 강제, TS 레벨 필수) | `string` | — |
| fit | 크기 조절 모드(uni image의 mode로 매핑) | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | 탭 미리보기 활성화 여부 | `boolean` | `false` |
| preview-src-list | 미리보기 이미지 목록(없으면 [src]로 폴백) | `string[]` | — |
| lazy | 지연 로딩(uni image 네이티브 lazy-load) | `boolean` | `false` |
| customClass | 커스텀 클래스 이름(루트 노드에 전달) | `string` | — |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| load | 이미지 로드 성공 시 발생 | `(event: Event)` |
| error | 이미지 로드 실패 시 발생(실패 플레이스홀더로 전환) | `(event: Event)` |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| error | 로드 실패 플레이스홀더 내용(기본값은 언어 팩의 image.error) |

## 플랫폼 차이

- **미리보기는 `uni.previewImage` 네이티브 API 사용**(모든 플랫폼 사용 가능): plus의 미리보기는
  자체 렌더링 Viewer 오버레이(body로 teleport, 확대 / 회전 / 여러 이미지 전환 / Esc로 닫기 /
  포커스 트랩)이지만 미니프로그램에는 document가 없어 그대로 옮길 수 없습니다. uniapp 버전은
  `uni.previewImage`를 호출합니다——H5는 uni 런타임이 오버레이를 구현하고 WeChat은 네이티브
  미리보기 페이지를 사용합니다. 상호작용은 플랫폼이 제공하므로 **마스크 투명도 / 닫기 버튼 /
  툴바를 커스터마이즈할 수 없습니다**. plus의 `LhImageViewer` 독립 컴포넌트는 본 저장소에서
  제공하지 않습니다.
- **fit → mode 매핑**: `contain` / `cover` / `fill`은 `aspectFit` / `aspectFill` /
  `scaleToFill`로 매핑됩니다. `none`은 `center`로 매핑됩니다. `scale-down`은 동등한 모드가
  없어 가장 가까운 `aspectFit`을 사용합니다(lh-avatar와 동일한 차이 등록). object-fit의 CSS
  구현은 H5의 실제 `<img>`에만 적용되며, uni `<image>`는 전 플랫폼에서 `mode`로 제어됩니다.
- **지연 로딩**: uni `<image>` 내장 `lazy-load`(plus의 `loading="lazy"` 대체). WeChat에서는
  page와 scroll-view 아래의 image에만 적용됩니다.
- **크기와 모서리 둥글기**: uni `<image>` 기본값은 320×240이며 크기는 `sx` / style로 명시합니다.
  모서리 둥글기는 share 스타일 소스의 `--lh-border-radius-small`이 내장되어 있습니다. plus에도
  width / height / radius prop이 없고(크기는 sx, 둥글기는 스타일 소스), 본 저장소에서 임의로
  추가하지 않습니다.
- **alt**: MP의 `<image>`에는 alt 개념이 없습니다(H5에서는 속성으로 전달). Web의 `<img alt>`보다
  접근성 폴백이 약하므로 TS 레벨 필수 제약은 유지합니다.
- **Viewer 스타일 잔존**: share 스타일 소스에는 `.lh-image-viewer*` 규칙(plus 자체 오버레이용)이
  포함되어 있으며, 스타일 단일 소스 제약에 따라 본 컴포넌트의 style.css 산출물에 들어가지만 양쪽
  플랫폼 모두 해당 노드가 없습니다(무해한 중복이며 WXSS 화이트리스트도 유지: `:hover` / `:focus`
  계열은 조건부 컴파일로 H5 전용 처리됨).

::: tip Vue3 버전과의 차이
- 로직 기준(미리보기 목록 정규화, 로드 상태, 클래스 이름)은 plus와 완전히 동일합니다(동일한 share core).
- 미리보기가 자체 렌더링 Viewer 오버레이에서 `uni.previewImage` 네이티브 API로 변경되었습니다
  ("플랫폼 차이" 참조).
- `customClass` prop 추가: uni-app에서는 커스텀 클래스 이름이 styleIsolation을 관통할 수 없어
  prop으로 전달합니다.
- 미니프로그램에서 `none` / `scale-down`은 근사 매핑입니다("플랫폼 차이" 참조).
:::
