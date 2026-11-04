<template>
  <view
    :class="subMenuClasses"
    :style="subMenuStyle"
  >
    <!-- 标题（触发器） -->
    <view
      :id="triggerId"
      class="lh-sub-menu__title"
      role="menuitem"
      :aria-expanded="opened"
      :aria-haspopup="true"
      :aria-controls="panelId"
      :aria-disabled="ariaDisabled"
      :tabindex="props.disabled ? -1 : 0"
      @click="onTitleClick"
      @mouseenter="onTitleMouseenter"
      @mouseleave="onTitleMouseleave"
      @keydown="onTitleKeydown"
    >
      <slot name="title">{{ props.title }}</slot>
      <text
        class="lh-sub-menu__arrow"
        aria-hidden="true"
      >▾</text>
    </view>

    <!-- 飞出面板（水平 / 折叠模式）：root-portal 承载，两帧度量定位 -->
    <lh-root-portal v-if="isPopper && opened">
      <view
        :id="panelId"
        class="lh-sub-menu__popper"
        role="menu"
        :style="panelStyle"
        @mouseenter="onPanelMouseenter"
        @mouseleave="onPanelMouseleave"
      >
        <slot />
      </view>
      <view
        class="lh-sub-menu__mask"
        @click.stop="onMaskClick"
      />
    </lh-root-portal>

    <!-- 内联展开（垂直非折叠模式）：始终渲染，grid 0fr/1fr 控制显隐 -->
    <view
      v-if="!isPopper"
      :id="panelId"
      class="lh-sub-menu__inline"
      role="menu"
      :aria-hidden="!opened"
    >
      <view class="lh-sub-menu__inline-content">
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLhSubMenu } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhSubMenuProps } from './types'

defineOptions({
  name: 'LhSubMenu',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSubMenuProps>(), {
  title: undefined,
  disabled: false,
  sx: undefined,
})

const emit = defineEmits<{
  select: [index: string, indexPath: string[]]
}>()

const {
  triggerId,
  panelId,
  isPopper,
  opened,
  panelStyle,
  subMenuClasses,
  subMenuStyle,
  onTitleClick,
  onTitleMouseenter,
  onTitleMouseleave,
  onPanelMouseenter,
  onPanelMouseleave,
  onMaskClick,
  onTitleKeydown,
} = useLhSubMenu(props, emit as LhEmitFn<'select'>)

// 仅禁用时输出 aria-disabled（share 的契约：假值省略，不渲染该属性）
const ariaDisabled = computed(() => (props.disabled ? true : undefined))
</script>

<!-- 无独立样式源：share 的 menu scss 同时含容器 / 项 / 子菜单 / 分组规则，
     复用同款净化产物（照 lh-breadcrumb-item / lh-collapse-item 复用父样式的先例） -->
<style src="../lh-menu/style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的菜单挂在 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，面板与遮罩需各自恢复 -->
<style>
.lh-sub-menu__popper {
  pointer-events: auto;
}

.lh-sub-menu__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}
</style>
