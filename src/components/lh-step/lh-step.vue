<template>
  <view
    v-if="ownIndex >= 0"
    :class="itemClasses"
    :aria-current="ariaCurrent"
  >
    <view
      class="lh-steps__head"
      :role="headRole"
      :aria-label="headAriaLabel"
      @click="onHeadClick"
    >
      <view
        class="lh-steps__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          <lh-icon
            v-if="props.icon"
            :name="props.icon"
          />
          <text v-else>{{ iconChar }}</text>
        </slot>
      </view>
    </view>
    <view class="lh-steps__main">
      <view class="lh-steps__title">
        <slot name="title">{{ props.title }}</slot>
      </view>
      <view
        v-if="hasDescription"
        class="lh-steps__description"
      >
        <slot name="description">{{ props.description }}</slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, inject, onUnmounted, useSlots } from 'vue'
import { getStepAria, getStepClassNames, getStepStatus } from '@lh-ui/share/core/steps'
import { lhlocale } from '@/adapter/locale'
import { LH_STEPS_KEY } from '../lh-steps/types'
import type { LhStepProps } from './types'

defineOptions({
  name: 'LhStep',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhStepProps>(), {
  title: '',
  description: '',
  icon: undefined,
  customClass: undefined,
})

const context = inject(LH_STEPS_KEY, null)
const slots = useSlots()

// setup 阶段注册 token，顺序即渲染顺序；卸载时注销
const token = Symbol('step')
if (context) {
  context.itemTokens.value.push(token)
  onUnmounted(() => {
    context.itemTokens.value = context.itemTokens.value.filter((item) => item !== token)
  })
}

const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(token) : -1))

const status = computed(() =>
  getStepStatus({
    index: ownIndex.value,
    current: context?.current.value ?? 0,
    forced: context?.forcedStatus.value,
  }),
)

const clickable = computed(() => !!context?.clickable.value)
// 当前步骤与历史步骤可点击导航；等待中的后续步骤不引导跳转
const isButton = computed(() => clickable.value && status.value !== 'wait')

// 折行 / 纵向布局下不画连接线的项（详见 lh-steps logic.ts 的平台差异注释）
const isLineLast = computed(() =>
  context ? context.lineLastIndices.value.includes(ownIndex.value) : false,
)

// 「末项」语义不在此输出 JS 类（子项分批注册时首屏会全命中）：横向末项与折行行末项
// 都由 --line-last 承担（见 lh-steps logic.ts），与 share core 的设计一致
const itemClasses = computed(() => [
  ...getStepClassNames({
    status: status.value,
    clickable: isButton.value,
    lineLast: isLineLast.value,
  }),
  props.customClass,
])

// 无障碍属性摊开绑定（MP 模板不支持 v-bind 属性包，照 AGENTS.md 坑 16）
const ariaCurrent = computed(() =>
  getStepAria(status.value)['aria-current'] === 'step' ? 'step' : undefined,
)

const headRole = computed(() => (isButton.value ? 'button' : undefined))
const headAriaLabel = computed(() => (isButton.value ? stepLabel.value : undefined))

// 图标回退：finish 勾、error 叉，其余显示序号（从 1 起）
const iconChar = computed(() => {
  if (status.value === 'finish') return '✓'
  if (status.value === 'error') return '✕'
  return ownIndex.value + 1
})

const hasDescription = computed(() => Boolean(props.description || slots.description))

const stepLabel = computed(() => {
  void lhlocale.version.value
  if (status.value === 'finish') return lhlocale.t('steps.finish', '已完成')
  if (status.value === 'error') return lhlocale.t('steps.error', '出错')
  return lhlocale.t('steps.step', '第 {index} 步').replace('{index}', String(ownIndex.value + 1))
})

function onHeadClick() {
  if (!isButton.value) return
  context?.select(ownIndex.value)
}
</script>

<!-- 无独立样式源：share 的 steps scss 同时含容器与项规则，复用同款净化产物
     （照 lh-breadcrumb-item / lh-tab-pane 复用父样式的先例） -->
<style src="../lh-steps/style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物。share 源里纵向步骤的末项连接线靠
     :not(:last-child) 隐藏，WXSS 不支持 :not()（build-styles 已剥离为所有项都画），
     改由 --line-last 类接管：胶水层（lh-steps logic.ts）在纵向标记全局末项、横向
     标记折行行末项，本规则补上纵向 ::before 的隐藏；横向 ::after 的隐藏规则 share 已有。
     【放本组件而非 lh-steps】::before 伪元素挂在步骤项节点上（本组件的模板内），
     小程序组件样式隔离下，本组件 wxss 肯定作用到自身节点；祖先段 .lh-steps--vertical
     的跨组件匹配走 addGlobalClass 的祖先类机制（与 ConfigProvider 的 .dark 暗色切换同理）。 -->
<style>
.lh-steps--vertical .lh-steps__item--line-last::before {
  display: none;
}
</style>
