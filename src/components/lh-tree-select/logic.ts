import { computed, ref, nextTick, getCurrentInstance } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { findTreeNode } from '@lh-ui/share/core/tree'
import { useLhComponent, useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhTreeSelectProps } from './types'

/**
 * TreeSelect 组件胶水（逻辑对齐 plus 仓 tree-select）
 *
 * 【移植决策】share core 没有 tree-select 模块，本端按 plus 的实现形态做胶水组合：
 * select 触发器（回显 / 占位 / 箭头）+ lh-tree 面板（展开 / 选中 / 勾选），
 * 树的全部纯逻辑都在 lh-tree 里消费 core/tree 纯函数，本组件零拷贝。
 * 行为对齐 plus：单选点节点即选中并关闭；多选点节点只展开（expandOnClickNode），
 * 勾选走 checkbox（父子级联，checkStrictly 未开，与 plus 一致）。
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示）
 * - 键盘导航不启用（MP 无键盘事件），Escape 关闭由点击遮罩承载
 * - 多选时勾选态由 modelValue 受控驱动（plus 未把 checked-keys 传给内嵌树，
 *   预设值不会回显到勾选框；本端把 modelValue 同时作为 checked-keys 传入，修正该回显缺口）
 */
export function useLhTreeSelect(
  props: LhTreeSelectProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle } = useLhComponent('tree-select', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  const { triggerId, popperId } = useLhPopperIds('tree-select')

  const visible = ref(false)
  /** 展开键内部态（plus 同款：tree-select 自持展开，不外暴露 expanded-keys） */
  const expandedKeys = ref<string[]>([])

  /** 当前值统一起成键数组：单选长度 ≤ 1，多选即勾选键数组 */
  const selectedKeys = computed<string[]>(() => {
    if (props.modelValue == null) return []
    return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  })

  const rootClass = computed(() => {
    const list = ['lh-tree-select']
    if (visible.value) list.push('lh-tree-select--open')
    if (props.disabled) list.push('lh-tree-select--disabled')
    if (props.customClass) list.push(props.customClass)
    return list
  })

  const rootStyle = computed(() => componentStyle.value)

  /**
   * 触发器回显文本：已选键的 label 以「、」拼接（对齐 plus）。
   * 多选模式下 modelValue 含级联产生的父级键，其 label 一并回显。
   */
  const displayText = computed(() => {
    const labels = selectedKeys.value
      .map((key) => findTreeNode(props.data ?? [], key)?.label)
      .filter((label): label is string => !!label)
    return labels.join('、')
  })

  /** 文案国际化（lhlocale.t 内部已订阅版本号，切换语言自动重算） */
  const placeholderText = computed(
    () => props.placeholder ?? lhlocale.t('select.placeholder', '请选择'),
  )
  const triggerLabel = computed(() => lhlocale.t('treeSelect.triggerLabel', '树选择'))

  // 弹层定位（两帧度量：面板先隐藏渲染 → 量尺寸 → 定位 → 显示）
  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    {
      placement: 'bottom',
      // 下拉面板宽度跟随触发器：root-portal teleport 后 left/right 拉伸失效，
      // 必须显式同步宽度，否则塌缩到内容宽
      matchTriggerWidth: true,
    },
  )

  function open(): void {
    if (props.disabled) return
    visible.value = true
    nextTick(() => {
      updatePopper()
    })
  }

  function close(): void {
    visible.value = false
  }

  function toggleOpen(): void {
    if (visible.value) close()
    else open()
  }

  /** 点击遮罩关闭 */
  function handleMaskClick(): void {
    close()
  }

  /** 树展开变更（受控回写内部态，对齐 plus） */
  function onExpandedChange(keys: string[]): void {
    expandedKeys.value = keys
  }

  /**
   * 树选中变更：仅单选消费。
   * 取末位键为单选值（与 plus 同款语义：点节点即替换选中），发完后关闭面板。
   */
  function onSelectedChange(keys: string[]): void {
    if (props.multiple) return
    const value = keys.length > 0 ? keys[keys.length - 1] : undefined
    emit('update:modelValue', value)
    emit('change', value)
    close()
  }

  /** 树勾选变更：仅多选消费，勾选键数组即 v-model 值 */
  function onCheckedChange(keys: string[]): void {
    if (!props.multiple) return
    emit('update:modelValue', keys)
    emit('change', keys)
  }

  return {
    triggerId,
    popperId,
    visible,
    popperStyle,
    expandedKeys,
    selectedKeys,
    rootClass,
    rootStyle,
    displayText,
    placeholderText,
    triggerLabel,
    toggleOpen,
    handleMaskClick,
    onExpandedChange,
    onSelectedChange,
    onCheckedChange,
  }
}
