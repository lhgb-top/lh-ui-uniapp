<template>
  <view
    class="lh-card"
    :class="[cardClass, customClass]"
    :style="cardStyle"
    :role="interactivity === 'interactive' ? 'button' : undefined"
    :tabindex="interactivity === 'interactive' ? 0 : undefined"
    :aria-busy="props.loading ? true : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 封面 -->
    <view
      v-if="$slots.cover"
      class="lh-card__cover"
    >
      <slot name="cover" />
    </view>

    <!-- 头部 -->
    <view
      v-if="$slots.header || props.title"
      class="lh-card__header"
    >
      <slot name="header">
        <text class="lh-card__title">{{ props.title }}</text>
      </slot>
      <text
        v-if="$slots.extra"
        class="lh-card__extra"
      >
        <slot name="extra" />
      </text>
    </view>

    <!-- 主体 -->
    <view class="lh-card__body">
      <slot v-if="!props.loading" />
      <view
        v-else
        class="lh-card__loading"
        aria-hidden="true"
      >
        <view class="lh-card__loading-line lh-card__loading-line--wide" />
        <view class="lh-card__loading-line" />
        <view class="lh-card__loading-line lh-card__loading-line--narrow" />
      </view>
    </view>

    <!-- 底部 -->
    <view
      v-if="$slots.footer"
      class="lh-card__footer"
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhCard } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhCardProps } from './types'

defineOptions({
  name: 'LhCard',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCardProps>(), {
  title: undefined,
  shadow: 'always',
  clickable: false,
  loading: false,
  themeVars: undefined,
  bgPattern: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  click: [e: Event]
}>()

const { cardClass, cardStyle, interactivity, onCardKeydown } = useLhCard(
  props,
  emit as LhEmitFn<'click'>,
)

function handleClick(e: Event) {
  if (interactivity.value !== 'interactive') return
  emit('click', e)
}

function handleKeydown(e: Event) {
  // #ifdef H5
  onCardKeydown(e)
  // #endif
}
</script>

<style src="./style.css"></style>
