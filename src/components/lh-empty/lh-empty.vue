<template>
  <view
    class="lh-empty"
    :class="[emptyClass, customClass]"
    :style="emptyStyle"
    role="status"
  >
    <!-- 视觉区：自定义图片 / 默认插槽 > 默认插画 -->
    <view
      v-if="hasCustomImage"
      class="lh-empty__image lh-empty__image--custom"
    >
      <slot>
        <image
          class="lh-img"
          :src="props.image"
          mode="aspectFit"
        />
      </slot>
    </view>
    <view
      v-else
      class="lh-empty__image"
      aria-hidden="true"
    >
      <!-- H5 分支：内联 svg，主题着色类名在 share scss 里，完整保真 -->
      <!-- #ifdef H5 -->
      <svg
        class="lh-empty__illustration"
        viewBox="0 0 96 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          class="lh-empty__ink-wash"
          cx="48"
          cy="58"
          rx="30"
          ry="6"
        />
        <rect
          x="24"
          y="22"
          width="48"
          height="32"
          rx="4"
          class="lh-empty__ink-frame"
        />
        <path
          d="M38 44 L48 30 L58 44"
          class="lh-empty__ink-mountain"
        />
        <circle
          cx="62"
          cy="30"
          r="4"
          class="lh-empty__ink-seal"
        />
      </svg>
      <!-- #endif -->
      <!-- 非 H5 分支：小程序不支持 svg，用 CSS 绘制同构简化版（见下方内联样式） -->
      <!-- #ifndef H5 -->
      <view class="lh-empty__illustration">
        <view class="lh-empty__ink-wash" />
        <view class="lh-empty__ink-frame" />
        <view class="lh-empty__ink-mountain" />
        <view class="lh-empty__ink-seal" />
      </view>
      <!-- #endif -->
    </view>

    <!-- 描述文案：description 插槽 > props > 语言包 -->
    <view class="lh-empty__description">
      <slot name="description">{{ descriptionText }}</slot>
    </view>

    <!-- 动作区 -->
    <view
      v-if="$slots.actions"
      class="lh-empty__actions"
    >
      <slot name="actions" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhEmpty } from './logic'
import type { LhEmptyProps } from './types'

defineOptions({
  name: 'LhEmpty',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhEmptyProps>(), {
  description: undefined,
  image: undefined,
  customClass: undefined,
  sx: undefined,
})

const { hasCustomImage, emptyClass, emptyStyle, descriptionText } = useLhEmpty(props)
</script>

<style src="./style.css"></style>

<!-- 小程序端默认插画的 CSS 简化版：类名与 H5 的 svg 一一对应
     （椭圆底座 / 圆角方框 / 三角山 / 圆点印章），颜色取主题变量，
     明暗模式自动适配。不进 build-styles 产物，仅本组件内联生效。 -->
<style>
.lh-empty__illustration {
  position: relative;
  width: 96px;
  height: 72px;
}

.lh-empty__ink-wash {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 8px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--lh-border-color-light, #E5E0D8);
  opacity: 0.6;
}

.lh-empty__ink-frame {
  position: absolute;
  left: 24px;
  top: 22px;
  width: 48px;
  height: 32px;
  border-radius: 4px;
  background-color: var(--lh-bg-color, #FAF6F0);
  border: 1.5px solid var(--lh-border-color-base, #D8D3CC);
  box-sizing: border-box;
}

.lh-empty__ink-mountain {
  position: absolute;
  left: 38px;
  top: 28px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 16px solid var(--lh-text-disabled, #C8C8C8);
}

.lh-empty__ink-seal {
  position: absolute;
  left: 58px;
  top: 26px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--lh-border-color-base, #D8D3CC);
}
</style>
