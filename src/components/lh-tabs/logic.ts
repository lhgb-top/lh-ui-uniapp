import { computed, nextTick, provide, ref, useSlots } from 'vue'
import type { Component, VNode } from 'vue'
import {
  getNameAfterRemove,
  getNextActiveName,
  getTabsClassNames,
  resolveActiveName,
} from '@lh-ui/share/core/tabs'
import { LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { generateId } from '@lh-ui/share/utils'
import { LH_IS_H5 } from '@/adapter/platform'
import { lhlocale } from '@/adapter/locale'
import LhTabPane from '../lh-tab-pane/lh-tab-pane.vue'
import { LH_TABS_KEY } from './types'
import type { LhTabRecord } from '@lh-ui/share/core/tabs'
import type { LhEmitFn } from '@/types/emit'
import type { LhTabsResolvedProps } from './types'

/**
 * Tabs 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 页签记录同样从默认插槽 vnode 同步收集（下钻 v-for / template 产生的 Fragment），首帧即正确
 * - roving tabindex 键盘导航仅 H5 启用：MP 无键盘事件，由 LH_IS_H5 守卫直接不进入导航分支
 *   （照 lh-dialog 的守卫先例），焦点管理（focus）在 MP 无意义也不会被调用
 * - 出入场不依赖 transitionend（MP 不可靠）；页签切换由 CSS 过渡自行呈现
 */
export function useLhTabs(
  props: LhTabsResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'tab-change' | 'tab-remove' | 'tab-add'>,
) {
  const slots = useSlots()

  // easycom 解析与直接导入应产出同一组件对象；兜底按组件名识别，防止易主场景漏收
  function isTabPaneVnode(vnode: VNode): boolean {
    if (vnode.type === LhTabPane) return true
    const type = vnode.type as Component
    return typeof type === 'object' && type !== null && type.name === 'LhTabPane'
  }

  // 从默认插槽同步收集页签 vnode（下钻 v-for / template 产生的 Fragment）
  function collectPaneVnodes(vnodes: VNode[] | undefined): VNode[] {
    const out: VNode[] = []
    for (const vnode of vnodes ?? []) {
      if (isTabPaneVnode(vnode)) {
        out.push(vnode)
      } else if (Array.isArray(vnode.children)) {
        out.push(...collectPaneVnodes(vnode.children as VNode[]))
      }
    }
    return out
  }

  // 页签记录同步源自插槽 vnode props，首帧即正确
  const records = computed<LhTabRecord[]>(() =>
    collectPaneVnodes(slots.default?.()).map((vnode) => ({
      name: String(vnode.props?.name ?? ''),
      label: String(vnode.props?.label ?? ''),
      disabled: vnode.props?.disabled === true || vnode.props?.disabled === '',
    })),
  )

  const innerActive = ref<string | null>(null)
  const idPrefix = generateId('lh-tabs')

  const activeName = computed(() =>
    resolveActiveName(records.value, props.modelValue ?? innerActive.value),
  )

  const rootClasses = computed(() => [
    ...getTabsClassNames({ type: props.type, position: props.tabPosition }),
    props.customClass,
  ])
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  function setActive(name: string) {
    const pane = records.value.find((record) => record.name === name)
    if (!pane || pane.disabled) return
    innerActive.value = name
    emit('update:modelValue', name)
    emit('tab-change', name)
  }

  function removePane(name: string) {
    if (!props.closable) return
    emit('tab-remove', name)
    // 被关闭的是激活页签时，联动切换到相邻可用页签
    if (name === activeName.value) {
      const next = getNameAfterRemove(records.value, name, activeName.value ?? '')
      if (next) setActive(next)
    }
  }

  function handleAdd() {
    emit('tab-add')
  }

  // —— roving tabindex 键盘导航（APG tabs pattern：方向键移动并激活），仅 H5 ——
  const tabRefs = new Map<string, unknown>()

  function setTabRef(name: string, el: unknown) {
    if (el) {
      tabRefs.set(name, el)
    } else {
      tabRefs.delete(name)
    }
  }

  function onKeydown(event: KeyboardEvent) {
    // MP 无键盘事件：编译期守卫直接不进入导航分支（焦点相关 API 在 MP 也不存在）
    if (!LH_IS_H5) return

    const target = event.target as HTMLElement | null
    const currentName = target?.dataset?.name
    if (!currentName) return

    if (event.key === LH_KEYS.Delete) {
      if (props.closable) removePane(currentName)
      return
    }

    let direction: 'next' | 'prev' | 'first' | 'last' | null = null
    if (event.key === LH_KEYS.ArrowRight || event.key === LH_KEYS.ArrowDown) direction = 'next'
    else if (event.key === LH_KEYS.ArrowLeft || event.key === LH_KEYS.ArrowUp) direction = 'prev'
    else if (event.key === LH_KEYS.Home) direction = 'first'
    else if (event.key === LH_KEYS.End) direction = 'last'
    if (!direction) return

    event.preventDefault()
    const next = getNextActiveName(records.value, currentName, direction)
    if (!next) return
    setActive(next)
    nextTick(() => (tabRefs.get(next) as HTMLElement | undefined)?.focus())
  }

  provide(LH_TABS_KEY, {
    activeName,
    setActive,
    removePane,
    closable: computed(() => props.closable),
    idPrefix,
  })

  const addLabel = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('tabs.add', '新增标签页')
  })

  return {
    records,
    activeName,
    idPrefix,
    rootClasses,
    sxStyle,
    addLabel,
    setActive,
    removePane,
    handleAdd,
    onKeydown,
    setTabRef,
  }
}
