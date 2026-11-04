import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTransfer from '../../src/components/lh-transfer/lh-transfer.vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const items: LhTransferItem[] = [
  { key: 'a', label: '甲' },
  { key: 'b', label: '乙' },
  { key: 'c', label: '丙', disabled: true },
  { key: 'd', label: '丁' },
]

/** 某侧某键的列表项 */
function row(wrapper: ReturnType<typeof mount>, side: 'left' | 'right', key: string) {
  return wrapper.find(`.lh-transfer-panel--${side} [data-transfer-key="${key}"]`)
}

/** 某侧列表项内的勾选框（lh-checkbox 根节点承接 fallthrough 类名） */
function itemCheckbox(wrapper: ReturnType<typeof mount>, side: 'left' | 'right', key: string) {
  return wrapper.find(`.lh-transfer-panel--${side} [data-transfer-key="${key}"] .lh-transfer-panel__checkbox`)
}

/** 某侧的全选容器（点击触发全选 / 全不选） */
function checkAllBox(wrapper: ReturnType<typeof mount>, side: 'left' | 'right') {
  return wrapper.find(`.lh-transfer-panel--${side} .lh-transfer-panel__check-all`)
}

/** 两个穿梭按钮：第一个 ›（移到右侧），第二个 ‹（移到左侧） */
function moveRightButton(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.lh-transfer__button')[0]
}
function moveLeftButton(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.lh-transfer__button')[1]
}

describe('LhTransfer', () => {
  it('renders two panels partitioned by modelValue with counts', () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    expect(wrapper.find('.lh-transfer').exists()).toBe(true)
    // modelValue 即左侧（源）键：左列甲，右列乙 / 丙（禁用）/ 丁
    expect(wrapper.find('.lh-transfer-panel--left').exists()).toBe(true)
    expect(wrapper.find('.lh-transfer-panel--right').exists()).toBe(true)
    expect(row(wrapper, 'left', 'a').exists()).toBe(true)
    expect(row(wrapper, 'right', 'b').exists()).toBe(true)
    expect(row(wrapper, 'right', 'c').exists()).toBe(true)
    expect(row(wrapper, 'left', 'b').exists()).toBe(false)

    // 面板计数与 listbox 语义
    expect(wrapper.find('.lh-transfer-panel--left .lh-transfer-panel__count').text()).toBe('1 / 4')
    expect(wrapper.find('.lh-transfer-panel--right .lh-transfer-panel__count').text()).toBe('3 / 4')
    expect(wrapper.find('.lh-transfer-panel__list').attributes('role')).toBe('listbox')
    expect(wrapper.find('.lh-transfer-panel__list').attributes('aria-multiselectable')).toBe('true')
    // 列表项语义：禁用项输出 aria-disabled，label 缺失时回退显示 key
    expect(row(wrapper, 'right', 'c').attributes('aria-disabled')).toBe('true')
    expect(row(wrapper, 'right', 'b').attributes('aria-disabled')).toBeUndefined()
    expect(wrapper.find('.lh-transfer-panel--right [data-transfer-key="b"] .lh-transfer-panel__item-label').text()).toBe('乙')
  })

  it('puts every item on the right when modelValue is absent', () => {
    const wrapper = mount(LhTransfer, { props: { data: items } })
    expect(wrapper.find('.lh-transfer-panel--left .lh-transfer-panel__count').text()).toBe('0 / 4')
    expect(wrapper.find('.lh-transfer-panel--right .lh-transfer-panel__count').text()).toBe('4 / 4')
  })

  it('toggles an item on row click and reflects aria-selected / checkbox', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('false')
    await row(wrapper, 'right', 'b').trigger('click')
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('true')
    expect(itemCheckbox(wrapper, 'right', 'b').classes()).toContain('lh-checkbox--checked')
    // 勾选不改变分区，只累计待穿梭键
    expect(wrapper.find('.lh-transfer-panel--right .lh-transfer-panel__count').text()).toBe('3 / 4')
  })

  it('toggles exactly once when clicking the inner checkbox (click stopped)', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    await itemCheckbox(wrapper, 'right', 'b').trigger('click')
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('true')
    // 内部勾选框的 click 已 stop：行级 click 不会再触发一次切换
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('true')
    await itemCheckbox(wrapper, 'right', 'b').trigger('click')
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('false')
  })

  it('skips disabled items for check / check-all / move', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    // 禁用项点击不勾选
    await row(wrapper, 'right', 'c').trigger('click')
    expect(row(wrapper, 'right', 'c').attributes('aria-selected')).toBe('false')
    await itemCheckbox(wrapper, 'right', 'c').trigger('click')
    expect(row(wrapper, 'right', 'c').attributes('aria-selected')).toBe('false')

    // 全选跳过禁用项：乙 + 丁被勾选，丙保持未勾
    await checkAllBox(wrapper, 'right').trigger('click')
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('true')
    expect(row(wrapper, 'right', 'd').attributes('aria-selected')).toBe('true')
    expect(row(wrapper, 'right', 'c').attributes('aria-selected')).toBe('false')
    // 全选态：右侧可选项（乙 / 丁）全部勾选 → checkbox 取消勾选后回到全选态时为 checked
    expect(checkAllBox(wrapper, 'right').find('.lh-transfer-panel__checkbox').classes()).toContain(
      'lh-checkbox--checked',
    )

    // 移动：禁用项即使被勾选也不会被搬走（此处丙未被勾选，不影响）
    await moveLeftButton(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b', 'd']])
    const change = wrapper.emitted('change')?.[0] as [Array<string | number>, string]
    expect(change[1]).toBe('right-to-left')
    // 穿梭后清空勾选（受控：回写 modelValue 后左侧才出现 b）
    await wrapper.setProps({ modelValue: ['a', 'b', 'd'] })
    expect(row(wrapper, 'left', 'b').attributes('aria-selected')).toBe('false')
  })

  it('shows indeterminate state when only part of a side is checked', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    await row(wrapper, 'right', 'b').trigger('click')
    const checkAll = checkAllBox(wrapper, 'right').find('.lh-transfer-panel__checkbox')
    // 右侧 3 项中仅勾选 1 项（丙禁用不计入可选）→ 半选
    expect(checkAll.classes()).toContain('lh-checkbox--indeterminate')
    // 再次点击全选容器：补齐可选的丁（乙已勾），丙跳过
    await checkAllBox(wrapper, 'right').trigger('click')
    expect(checkAll.classes()).toContain('lh-checkbox--checked')
    expect(checkAll.classes()).not.toContain('lh-checkbox--indeterminate')
  })

  it('filters items per side by the search input', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    // uni 的 input 事件载荷在 event.detail.value
    await wrapper.find('.lh-transfer-panel--right .lh-transfer-panel__search').trigger('input', {
      detail: { value: '乙' },
    })
    expect(row(wrapper, 'right', 'b').exists()).toBe(true)
    expect(row(wrapper, 'right', 'd').exists()).toBe(false)
    // 大小写不敏感：搜 Z 也匹不到中文，搜「丁」命中
    await wrapper.find('.lh-transfer-panel--right .lh-transfer-panel__search').trigger('input', {
      detail: { value: 'zzz' },
    })
    expect(wrapper.find('.lh-transfer-panel--right .lh-transfer-panel__empty').text()).toBe('暂无数据')
    // 左侧搜索互不影响
    expect(row(wrapper, 'left', 'a').exists()).toBe(true)
  })

  it('moves checked keys left-to-right and clears the checked set', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a', 'b'] } })
    await row(wrapper, 'left', 'a').trigger('click')
    await moveRightButton(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
    const change = wrapper.emitted('change')?.[0] as [Array<string | number>, string]
    expect(change[0]).toEqual(['b'])
    expect(change[1]).toBe('left-to-right')
    // 移动后甲出现在右侧，勾选集合已清空（受控：回写 modelValue 后右侧才出现）
    await wrapper.setProps({ modelValue: ['b'] })
    expect(row(wrapper, 'right', 'a').exists()).toBe(true)
    expect(moveRightButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('disables move buttons until that side has a checked item', () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a', 'b'] } })
    // 两侧都无勾选：两个按钮都禁用
    expect(moveRightButton(wrapper).attributes('disabled')).toBeDefined()
    expect(moveLeftButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('blocks everything when the component is disabled', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'], disabled: true } })
    expect(wrapper.find('.lh-transfer').classes()).toContain('lh-transfer--disabled')
    await row(wrapper, 'right', 'b').trigger('click')
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('false')
    await checkAllBox(wrapper, 'right').trigger('click')
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('false')
    // 搜索框与穿梭按钮同样禁用
    expect(wrapper.find('.lh-transfer-panel--left .lh-transfer-panel__search').attributes('disabled')).toBeDefined()
    expect(moveLeftButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('renders the empty state for empty data', () => {
    const wrapper = mount(LhTransfer, { props: { data: [] } })
    expect(wrapper.findAll('.lh-transfer-panel__empty')).toHaveLength(2)
    expect(wrapper.find('.lh-transfer-panel__empty').text()).toBe('暂无数据')
  })

  it('applies roving tabindex (H5 only)', () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    // 右列顺序：乙 / 丙（禁用）/ 丁；首个可用项 tabindex 0，其余 -1，禁用项恒 -1
    const tabs = wrapper
      .findAll('.lh-transfer-panel--right .lh-transfer-panel__item')
      .map((el) => el.attributes('tabindex'))
    expect(tabs).toEqual(['0', '-1', '-1'])
  })

  it('navigates by keyboard (H5 only): arrows / Enter / Escape', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'] } })
    const b = () => row(wrapper, 'right', 'b')
    const d = () => row(wrapper, 'right', 'd')

    // ↓ 在过滤后的列表内移动焦点（跳过禁用项）
    await b().trigger('keydown', { key: 'ArrowDown' })
    expect(b().attributes('tabindex')).toBe('-1')
    expect(d().attributes('tabindex')).toBe('0')
    // Enter 勾选当前项（与点击等价）
    await d().trigger('keydown', { key: 'Enter' })
    expect(d().attributes('aria-selected')).toBe('true')
    // 勾选后焦点锚点落到被勾项
    expect(d().attributes('tabindex')).toBe('0')
    // Escape 重置焦点（回到锚点）
    await d().trigger('keydown', { key: 'Escape' })
    expect(d().attributes('tabindex')).toBe('0')

    // ← 跨面板跳焦：右列表左移回左列表（H5 走 scope 内查询聚焦）
    await d().trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(wrapper.find('.lh-transfer-panel--left [data-transfer-key="a"]').attributes('tabindex')).toBe('0')
  })

  it('keeps keyboard events inert when the component is disabled', async () => {
    const wrapper = mount(LhTransfer, { props: { data: items, modelValue: ['a'], disabled: true } })
    await row(wrapper, 'right', 'b').trigger('keydown', { key: 'Enter' })
    await row(wrapper, 'right', 'b').trigger('keydown', { key: 'ArrowDown' })
    expect(row(wrapper, 'right', 'b').attributes('aria-selected')).toBe('false')
    // 禁用树下列表项 tabindex 恒为 -1
    expect(wrapper.findAll('.lh-transfer-panel__item').every((el) => el.attributes('tabindex') === '-1')).toBe(true)
  })
})
