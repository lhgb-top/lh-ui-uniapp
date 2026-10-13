<template>
  <!-- #ifdef H5 -->
  <teleport to="body">
    <view
      class="lh-root-portal"
      :style="portalStyle"
    >
      <slot />
    </view>
  </teleport>
  <!-- #endif -->

  <!-- #ifndef H5 -->
  <!-- 微信 / 支付宝：基础库达标时用 root-portal 脱离页面节点树 -->
  <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
  <root-portal v-if="useRootPortal">
    <view
      class="lh-root-portal"
      :style="portalStyle"
    >
      <slot />
    </view>
  </root-portal>
  <!-- #endif -->

  <!-- 未达标或钉钉等其他端：页内 fixed 兜底（不脱离页面树，层级靠 z-index） -->
  <!-- #ifndef MP-WEIXIN || MP-ALIPAY -->
  <view
    class="lh-root-portal"
    :style="portalStyle"
  >
    <slot />
  </view>
  <!-- #endif -->
  <!-- #endif -->
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { supportsLhRootPortal } from '@/adapter/platform'
import { useLhZIndex } from '@/composables'

defineOptions({
  name: 'LhRootPortal',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhRootPortalProps>(), {
  zIndex: undefined,
})

const { nextZIndex } = useLhZIndex()

/** 是否使用 root-portal：编译期 H5 直接 false（走 teleport）；MP 端看基础库版本 */
const useRootPortal = supportsLhRootPortal()

const portalStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  zIndex: String(props.zIndex ?? nextZIndex()),
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
}))
</script>

<script lang="ts">
/** lh-root-portal props（内部组件，不对外发包文档） */
export interface LhRootPortalProps {
  /** 层级；不传时由 useLhZIndex 自增分配 */
  zIndex?: number
}
</script>

<style>
/* 弹层根容器本身不产生可视样式，仅承载定位与层级；
   pointer-events:none 让点击穿透到页面，各弹层组件自行在自己的节点上恢复 auto */
.lh-root-portal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
