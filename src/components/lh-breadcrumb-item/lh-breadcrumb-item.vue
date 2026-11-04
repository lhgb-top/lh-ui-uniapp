<template>
  <view v-if="ownIndex >= 0 && !isHidden" :class="itemClasses">
    <view v-if="showEllipsisBefore" class="lh-breadcrumb__ellipsis">
      <view
        class="lh-breadcrumb__ellipsis-btn"
        :aria-label="moreLabel"
        role="button"
        @click="expand"
      >
        <text aria-hidden="true">•••</text>
      </view>
    </view>
    <view
      v-if="isLink"
      class="lh-breadcrumb__link"
      role="link"
      @click="handleClick"
    >
      <slot />
    </view>
    <view
      v-else
      class="lh-breadcrumb__text"
      :aria-current="isLast ? 'page' : undefined"
    >
      <slot />
    </view>
    <text
      v-if="!isLast"
      class="lh-breadcrumb__separator"
      aria-hidden="true"
    >{{ separatorText }}</text>
  </view>
</template>

<script lang="ts" setup>
import { computed, inject, onUnmounted } from 'vue'
import { getBreadcrumbItemClassNames } from '@lh-ui/share/core/breadcrumb'
import { lhlocale } from '@/adapter/locale'
import { LH_BREADCRUMB_KEY } from '../lh-breadcrumb/types'
import type { LhBreadcrumbItemProps } from './types'

defineOptions({
  name: 'LhBreadcrumbItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhBreadcrumbItemProps>(), {
  to: undefined,
  customClass: undefined,
})

const context = inject(LH_BREADCRUMB_KEY, null)

const moreLabel = computed(() => lhlocale.t('breadcrumb.more', '更多'))

// setup 阶段注册 token，顺序即渲染顺序；卸载时注销
const token = Symbol('breadcrumb-item')
if (context) {
  context.itemTokens.value.push(token)
  onUnmounted(() => {
    context.itemTokens.value = context.itemTokens.value.filter((item) => item !== token)
  })
}

const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(token) : -1))
const total = computed(() => (context ? context.itemTokens.value.length : 1))
const isLast = computed(() => ownIndex.value === total.value - 1)
const isHidden = computed(() =>
  context ? context.hiddenIndexes.value.includes(ownIndex.value) : false,
)
const showEllipsisBefore = computed(() =>
  context ? context.ellipsisBeforeIndex.value === ownIndex.value : false,
)
const isLink = computed(() => !!props.to && !isLast.value)

const itemClasses = computed(() => [
  ...getBreadcrumbItemClassNames({ isLast: isLast.value, isLink: isLink.value }),
  props.customClass,
])

const separatorText = computed(() => (context ? context.separator.value : '/'))

const expand = () => context?.expand()

/**
 * 跳转：uni-app 无 vue-router，统一走 uni.navigateTo
 * （H5 端走 history 路由；url 需为以 / 开头的页面路径）
 */
function handleClick() {
  if (!props.to) return
  uni.navigateTo({ url: props.to })
}
</script>

<!-- 无独立样式源：share 的 breadcrumb scss 同时含容器与项规则，复用同款净化产物
     （照 lh-skeleton-item 复用 lh-skeleton 样式的先例） -->
<style src="../lh-breadcrumb/style.css"></style>
