<template>
  <view
    :class="itemClass"
    :role="itemRole"
    :tabindex="props.disabled ? -1 : active ? 0 : -1"
    :aria-disabled="ariaDisabled"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { getDropdownItemAria, getDropdownItemClass } from '@lh-ui/share/core/dropdown'
import { LH_DROPDOWN_KEY } from '../lh-dropdown/types'
import type { LhDropdownItemRecord } from '../lh-dropdown/types'
import type { LhDropdownItemProps } from './types'

defineOptions({
  name: 'LhDropdownItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDropdownItemProps>(), {
  command: undefined,
  disabled: false,
  divided: false,
})

const emit = defineEmits<{
  click: [command: string | number | undefined]
}>()

const ctx = inject(LH_DROPDOWN_KEY, null)
const instance = getCurrentInstance()

// 注册记录的 el 在挂载后补齐：仅 H5 需要（键盘导航的聚焦目标），MP 端无 DOM 保持 undefined
const record: LhDropdownItemRecord = {
  command: props.command,
  disabled: props.disabled,
  divided: props.divided,
}

onMounted(() => {
  // #ifdef H5
  record.el =
    ((instance?.proxy as ComponentPublicInstance | null)?.$el as HTMLElement | null) ?? undefined
  // #endif
  ctx?.registerItem(record)
})

onBeforeUnmount(() => {
  ctx?.unregisterItem(record)
})

const index = computed(() => (ctx ? ctx.items.value.indexOf(record) : -1))
const active = computed(() => index.value !== -1 && index.value === ctx?.activeIndex.value)

const itemClass = computed(() =>
  getDropdownItemClass({ disabled: props.disabled, divided: props.divided }),
)

// 无障碍属性包由 share 纯函数产出；小程序模板不支持 v-bind 对象，逐键摊开绑定
const itemAria = computed(() => getDropdownItemAria({ disabled: props.disabled }))
const itemRole = computed(() => String(itemAria.value.role ?? ''))
// 仅禁用时输出 aria-disabled（share 的契约：假值省略，不渲染该属性）
const ariaDisabled = computed(() => (itemAria.value['aria-disabled'] === true ? true : undefined))

function handleClick() {
  if (props.disabled) return
  emit('click', props.command)
  ctx?.onItemClick(props.command)
}
</script>

<!-- 无独立样式源：share 的 dropdown scss 同时含菜单容器与项规则，复用同款净化产物
     （照 lh-breadcrumb-item / lh-skeleton-item 复用父样式的先例） -->
<style src="../lh-dropdown/style.css"></style>
