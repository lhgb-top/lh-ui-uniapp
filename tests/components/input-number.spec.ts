import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '../mount'
import LhInputNumber from '../../src/components/lh-input-number/lh-input-number.vue'

/**
 * uni 事件载荷形态：input / blur / confirm 的值在 event.detail.value
 * （与浏览器的 InputEvent 不重叠）。jsdom 的 blur / confirm 带 detail 只能直接在
 * DOM 上派发 CustomEvent（VTU trigger 不接受 Event 实例、detail 只读）。
 */
function dispatchUniEvent(element: Element, type: string, value: string) {
  element.dispatchEvent(new CustomEvent(type, { detail: { value } }))
}

function mountInputNumber(props = {}) {
  return mount(LhInputNumber, { props })
}

describe('LhInputNumber', () => {
  it('渲染根节点、加减按钮与输入框，根节点带尺寸修饰类', () => {
    const wrapper = mountInputNumber({ modelValue: 5 })
    expect(wrapper.find('.lh-input-number').exists()).toBe(true)
    expect(wrapper.find('.lh-input-number').classes()).toContain('lh-input-number--medium')
    expect(wrapper.find('.lh-input-number__decrease').exists()).toBe(true)
    expect(wrapper.find('.lh-input-number__increase').exists()).toBe(true)
    expect(wrapper.find('.lh-input-number__input').classes()).toContain('lh-input-number--medium')
  })

  it('显示已提交值，null 显示空串', () => {
    const wrapper = mountInputNumber({ modelValue: 5 })
    expect((wrapper.find('.lh-input-number__input').element as HTMLInputElement).value).toBe('5')
    const empty = mountInputNumber({ modelValue: null })
    expect((empty.find('.lh-input-number__input').element as HTMLInputElement).value).toBe('')
  })

  it('点击加号按步长递增并抛 update:modelValue 与 change', async () => {
    const wrapper = mountInputNumber({ modelValue: 2 })
    await wrapper.find('.lh-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    expect(wrapper.emitted('change')).toEqual([[3]])
  })

  it('点击减号按步长递减；空值时步进落到 ±step', async () => {
    const wrapper = mountInputNumber({ modelValue: 2, step: 2 })
    await wrapper.find('.lh-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[0]])

    const empty = mountInputNumber({ modelValue: null })
    await empty.find('.lh-input-number__increase').trigger('click')
    expect(empty.emitted('update:modelValue')).toEqual([[1]])
    await empty.find('.lh-input-number__decrease').trigger('click')
    expect(empty.emitted('update:modelValue')?.[1]).toEqual([-1])
  })

  it('到达 max 后加号禁用（类名 + 无事件），减号仍可用', async () => {
    const wrapper = mountInputNumber({ modelValue: 10, min: 0, max: 10 })
    const increase = wrapper.find('.lh-input-number__increase')
    expect(increase.classes()).toContain('lh-input-number__increase--disabled')
    expect(increase.attributes('aria-disabled')).toBe('true')
    await increase.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.find('.lh-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[9]])
  })

  it('到达 min 后减号禁用，加号仍可用', async () => {
    const wrapper = mountInputNumber({ modelValue: 1, min: 1, max: 10 })
    const decrease = wrapper.find('.lh-input-number__decrease')
    expect(decrease.classes()).toContain('lh-input-number__decrease--disabled')
    await decrease.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.find('.lh-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('disabled 整体禁用：根节点带禁用修饰类、input 落 disabled、点击无效', async () => {
    const wrapper = mountInputNumber({ modelValue: 5, disabled: true })
    expect(wrapper.find('.lh-input-number').classes()).toContain('lh-input-number--disabled')
    expect(wrapper.find('.lh-input-number__input').attributes('disabled')).toBeDefined()
    await wrapper.find('.lh-input-number__increase').trigger('click')
    await wrapper.find('.lh-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('输入中只同步草稿不提交，失焦一次性提交（等价 plus 原生 change 时机）', async () => {
    const wrapper = mountInputNumber({ modelValue: 5 })
    const inner = wrapper.find('.lh-input-number__input')
    await inner.trigger('input', { detail: { value: '8' } })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    dispatchUniEvent(inner.element, 'blur', '8')
    expect(wrapper.emitted('update:modelValue')).toEqual([[8]])
    expect(wrapper.emitted('change')).toEqual([[8]])
  })

  it('提交时按 min/max 钳制', async () => {
    const wrapper = mountInputNumber({ modelValue: 5, min: 1, max: 10 })
    const inner = wrapper.find('.lh-input-number__input')
    dispatchUniEvent(inner.element, 'blur', '99')
    expect(wrapper.emitted('update:modelValue')).toEqual([[10]])
  })

  it('空串提交清空为 null，非法数字不提交', async () => {
    const wrapper = mountInputNumber({ modelValue: 5 })
    const inner = wrapper.find('.lh-input-number__input')
    dispatchUniEvent(inner.element, 'blur', '')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])

    const wrapper2 = mountInputNumber({ modelValue: 5 })
    dispatchUniEvent(wrapper2.find('.lh-input-number__input').element, 'blur', 'abc')
    expect(wrapper2.emitted('update:modelValue')).toBeUndefined()
  })

  it('precision 先于钳制生效', async () => {
    const wrapper = mountInputNumber({ modelValue: 1, precision: 2 })
    const inner = wrapper.find('.lh-input-number__input')
    dispatchUniEvent(inner.element, 'blur', '1.234')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1.23]])
  })

  it('stepStrictly 把提交值吸附到 step 网格（四舍五入）', async () => {
    const wrapper = mountInputNumber({ modelValue: 10, step: 10, stepStrictly: true })
    const inner = wrapper.find('.lh-input-number__input')
    dispatchUniEvent(inner.element, 'blur', '17')
    expect(wrapper.emitted('update:modelValue')).toEqual([[20]])
  })

  it('同一值不重复发事件（MP 端 confirm 后还会再触发一次 blur）', async () => {
    const wrapper = mountInputNumber({ modelValue: 5 })
    const inner = wrapper.find('.lh-input-number__input')
    dispatchUniEvent(inner.element, 'blur', '5')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('controls=false 不渲染加减按钮', () => {
    const wrapper = mountInputNumber({ modelValue: 1, controls: false })
    expect(wrapper.find('.lh-input-number__decrease').exists()).toBe(false)
    expect(wrapper.find('.lh-input-number__increase').exists()).toBe(false)
  })

  it('placeholder 与 name 透传到 input', () => {
    const wrapper = mountInputNumber({ modelValue: null, placeholder: '请输入数字', name: 'quantity' })
    const inner = wrapper.find('.lh-input-number__input')
    expect(inner.attributes('placeholder')).toBe('请输入数字')
    expect(inner.attributes('name')).toBe('quantity')
  })

  it('键盘上下键步进（仅 H5 触发），confirm 提交草稿', async () => {
    const wrapper = mountInputNumber({ modelValue: 2 })
    const inner = wrapper.find('.lh-input-number__input')
    await inner.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    await inner.trigger('keydown', { key: 'ArrowDown' })
    // 无 v-model 接线时步进始终基于 props.modelValue（2）：减号落 1
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([1])
    // 非方向键不响应
    await inner.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
    // 回车 / 键盘「完成」统一走 confirm 提交（等价 plus 原生 change 的回车触发）
    await inner.trigger('input', { detail: { value: '9' } })
    await nextTick()
    dispatchUniEvent(inner.element, 'confirm', '9')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([9])
  })

  it('步进丢弃未提交草稿（始终基于已提交值）', async () => {
    const wrapper = mountInputNumber({ modelValue: 2 })
    const inner = wrapper.find('.lh-input-number__input')
    await inner.trigger('input', { detail: { value: '100' } })
    await wrapper.find('.lh-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('spinbutton 值域语义：role 与 aria-valuemin / aria-valuemax / aria-valuenow', () => {
    const wrapper = mountInputNumber({ modelValue: 5, min: 0, max: 10 })
    const inner = wrapper.find('.lh-input-number__input')
    expect(inner.attributes('role')).toBe('spinbutton')
    expect(inner.attributes('aria-valuemin')).toBe('0')
    expect(inner.attributes('aria-valuemax')).toBe('10')
    expect(inner.attributes('aria-valuenow')).toBe('5')
    // 空值不输出 valuenow（share core 的 getInputNumberAria 契约）
    const empty = mountInputNumber({ modelValue: null })
    expect(empty.find('.lh-input-number__input').attributes('aria-valuenow')).toBeUndefined()
  })

  it('customClass 与 sx 透传到根节点', () => {
    const wrapper = mountInputNumber({
      modelValue: 1,
      customClass: 'my-number',
      sx: { mt: 1 },
    })
    const root = wrapper.find('.lh-input-number')
    expect(root.classes()).toContain('my-number')
    expect(root.attributes('style')).toContain('margin-top: 8px')
  })
})
