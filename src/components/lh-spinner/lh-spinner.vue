<template>
  <view
    :class="[spinnerClasses, customClass]"
    :style="spinnerStyle"
    aria-hidden="true"
  >
    <!-- H5 分支：svg 描边环，与 plus 仓同构（旋转 + 描边虚移双 CSS 动画） -->
    <!-- #ifdef H5 -->
    <svg
      class="lh-spinner__circle"
      viewBox="0 0 50 50"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
    <!-- #endif -->
    <!-- 非 H5 分支：小程序不支持 svg 模板标签，用 view + border 圆环同构简化（见下方内联样式） -->
    <!-- #ifndef H5 -->
    <view
      class="lh-spinner__ring"
      :style="ringStyle"
    />
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import { useLhSpinner } from './logic'
import type { LhSpinnerProps } from './types'

defineOptions({
  name: 'LhSpinner',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSpinnerProps>(), {
  size: 'medium',
  color: undefined,
  customClass: undefined,
  sx: undefined,
})

const { spinnerClasses, spinnerStyle, ringStyle } = useLhSpinner(props)
</script>

<style src="./style.css"></style>

<!-- 小程序端圆环的 CSS 简化版：view + border 三边着色构成约四分之三圆弧
     （与 plus 的 stroke-dasharray 90 40 ≈ 72% 弧视觉同构），颜色走 currentColor
     （由根节点 color 内联样式承载，支持 color prop 与文本色继承），描边宽度由
     ringStyle 内联按直径 10% 计算。不进 build-styles 产物，仅本组件内联生效；
     H5 分支不渲染该类，这段样式在 H5 产物里是死代码（同 lh-empty 先例）。 -->
<style>
.lh-spinner__ring {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-style: solid;
  border-top-color: currentColor;
  border-right-color: currentColor;
  border-bottom-color: currentColor;
  border-left-color: transparent;
  animation: lh-spinner-ring-rotate 0.9s linear infinite;
}

@keyframes lh-spinner-ring-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
