<template>
  <view
    :class="itemClasses"
    :style="itemStyle"
    role="menuitem"
    :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="ariaDisabled"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { getMenuItemClassNames } from '@lh-ui/share/core/menu'
import { isActivationKey, sxToStyle } from '@lh-ui/share/core/shared'
import { LH_MENU_KEY } from '../lh-menu/types'
import type { LhMenuItemProps } from './types'

defineOptions({
  name: 'LhMenuItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhMenuItemProps>(), {
  disabled: false,
  sx: undefined,
})

const emit = defineEmits<{
  click: [index: string]
}>()

const context = inject(LH_MENU_KEY, null)

const itemClasses = computed(() =>
  getMenuItemClassNames({
    active: context ? context.isActive(props.index) : false,
    disabled: props.disabled,
  }),
)

const itemStyle = computed(() => sxToStyle(props.sx ?? {}))

// 无障碍属性包由 share 纯函数产出；小程序模板不支持 v-bind 对象，逐键摊开绑定
const ariaDisabled = computed(() => (props.disabled ? true : undefined))

function handleClick(): void {
  if (props.disabled) return
  emit('click', props.index)
  context?.handleSelect(props.index, [props.index])
}

/**
 * 键盘激活（对齐 plus 仓）：Enter / Space 触发与点击等价的选择。
 * MP 端无键盘事件，体由条件编译裁剪（函数体必须双端存在，
 * 模板事件绑定在 MP 构建时才引用得到）。
 */
function handleKeydown(event: KeyboardEvent): void {
  // #ifdef H5
  if (props.disabled) return
  if (isActivationKey(event)) {
    event.preventDefault()
    handleClick()
  }
  // #endif
}
</script>

<!-- 无独立样式源：share 的 menu scss 同时含容器 / 项 / 子菜单 / 分组规则，
     复用同款净化产物（照 lh-breadcrumb-item / lh-collapse-item 复用父样式的先例） -->
<style src="../lh-menu/style.css"></style>
