import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhAutocomplete from '../../src/components/lh-autocomplete/lh-autocomplete.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，打桩成固定几何体，
// 验证「输入 → 定位 → 选中 → 关」的时序与事件流（同 select.spec 的做法）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    if (selector.startsWith('#lh-autocomplete-trigger')) {
      return { top: 100, left: 10, width: 240, height: 32, right: 250, bottom: 132 }
    }
    return { top: 0, left: 0, width: 240, height: 160, right: 240, bottom: 160 }
  },
}))

vi.mock('@/adapter/platform', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>
  return {
    ...original,
    getLhWindowInfo: () => ({ top: 0, left: 0, width: 375, height: 667, right: 375, bottom: 667 }),
  }
})

const options = [
  { label: '水墨', value: 'ink' },
  { label: '留白', value: 'liubai' },
  { label: '飞白', disabled: true },
]

async function typeValue(wrapper: ReturnType<typeof mount>, value: string) {
  await wrapper.find('.lh-autocomplete__inner').trigger('input', { detail: { value } })
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhAutocomplete', () => {
  it('renders the base class and the input value', () => {
    const wrapper = mount(LhAutocomplete, { props: { modelValue: '水墨', options } })
    expect(wrapper.classes()).toContain('lh-autocomplete')
    expect((wrapper.find('.lh-autocomplete__inner').element as HTMLInputElement).value).toBe('水墨')
  })

  it('emits the disabled modifier', () => {
    expect(mount(LhAutocomplete, { props: { options, disabled: true } }).classes()).toContain(
      'lh-autocomplete--disabled',
    )
  })

  it('opens on typing and shows filtered suggestions', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options } })
    await typeValue(wrapper, '水')
    expect(wrapper.find('.lh-autocomplete__dropdown').exists()).toBe(true)
    expect(wrapper.findAll('.lh-autocomplete__option')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('shows all options on empty query and keeps disabled ones visible', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options } })
    await typeValue(wrapper, '')
    const list = wrapper.findAll('.lh-autocomplete__option')
    expect(list).toHaveLength(3)
    expect(list[2].classes()).toContain('lh-autocomplete__option--disabled')
    vi.useRealTimers()
  })

  it('selects an option on click and emits the value', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options } })
    await typeValue(wrapper, '')
    await wrapper.findAll('.lh-autocomplete__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['liubai'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['liubai'])
    expect(wrapper.emitted('select')?.[0]).toEqual(['liubai', options[1]])
    // 选中后关闭面板，label 回填输入框
    expect(wrapper.find('.lh-autocomplete__dropdown').exists()).toBe(false)
    expect((wrapper.find('.lh-autocomplete__inner').element as HTMLInputElement).value).toBe('留白')
    vi.useRealTimers()
  })

  it('ignores clicks on disabled options', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options } })
    await typeValue(wrapper, '')
    await wrapper.findAll('.lh-autocomplete__option')[2].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    vi.useRealTimers()
  })

  it('navigates with arrow keys and selects with Enter (H5 keyboard)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options } })
    const input = wrapper.find('.lh-autocomplete__inner')
    await typeValue(wrapper, '')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    // 第二个可用项（跳过 disabled）高亮
    expect(
      wrapper.findAll('.lh-autocomplete__option')[1].classes(),
    ).toContain('lh-autocomplete__option--highlighted')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual(['liubai', options[1]])
    vi.useRealTimers()
  })

  it('closes on Escape and on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options } })
    await typeValue(wrapper, '')
    expect(wrapper.find('.lh-autocomplete__dropdown').exists()).toBe(true)
    await wrapper.find('.lh-autocomplete__inner').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.lh-autocomplete__dropdown').exists()).toBe(false)
    await typeValue(wrapper, '留')
    await wrapper.find('.lh-autocomplete__mask').trigger('click')
    expect(wrapper.find('.lh-autocomplete__dropdown').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('does not open when disabled', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, { props: { options, disabled: true } })
    await typeValue(wrapper, '水')
    expect(wrapper.find('.lh-autocomplete__dropdown').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('shows the empty slot when nothing matches', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhAutocomplete, {
      props: { options },
      slots: { empty: '<view class="my-empty">没有建议</view>' },
    })
    await typeValue(wrapper, '不存在的词')
    expect(wrapper.find('.lh-autocomplete__empty .my-empty').text()).toBe('没有建议')
    vi.useRealTimers()
  })

  it('exposes open / close / isOpen on the instance', () => {
    const wrapper = mount(LhAutocomplete, { props: { options } })
    const vm = wrapper.vm as { open: () => void; close: () => void; isOpen: boolean }
    expect(typeof vm.open).toBe('function')
    expect(typeof vm.close).toBe('function')
    expect(vm.isOpen).toBe(false)
  })

  it('carries the combobox aria contract on the input', () => {
    const input = mount(LhAutocomplete, { props: { options } }).find('.lh-autocomplete__inner')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-haspopup')).toBe('listbox')
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(input.attributes('aria-controls')).toMatch(/^lh-autocomplete-/)
  })
})
