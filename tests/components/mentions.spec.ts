import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhMentions from '../../src/components/lh-mentions/lh-mentions.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，打桩成固定几何体（同 select.spec）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    if (selector.startsWith('#lh-mentions-trigger')) {
      return { top: 100, left: 10, width: 320, height: 32, right: 330, bottom: 132 }
    }
    return { top: 0, left: 0, width: 320, height: 160, right: 320, bottom: 160 }
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
  await wrapper.find('.lh-mentions__inner').trigger('input', { detail: { value } })
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhMentions', () => {
  it('renders the base class and the text value', () => {
    const wrapper = mount(LhMentions, { props: { modelValue: '已 @水墨', options } })
    expect(wrapper.classes()).toContain('lh-mentions')
    expect((wrapper.find('.lh-mentions__inner').element as HTMLInputElement).value).toBe('已 @水墨')
  })

  it('emits the disabled modifier', () => {
    expect(mount(LhMentions, { props: { options, disabled: true } }).classes()).toContain(
      'lh-mentions--disabled',
    )
  })

  it('opens the panel when the caret is inside an active mention', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    // 输入 "@"（caret 在末尾 = 紧跟 prefix，活动上下文）
    await typeValue(wrapper, '@')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(true)
    expect(wrapper.findAll('.lh-mentions__option')).toHaveLength(3)
    vi.useRealTimers()
  })

  it('filters options by the search text after the prefix', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    await typeValue(wrapper, '@水')
    const list = wrapper.findAll('.lh-mentions__option')
    expect(list).toHaveLength(1)
    expect(list[0].text()).toBe('水墨')
    vi.useRealTimers()
  })

  it('keeps the panel closed when the prefix is mid-word (email guard)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    // 邮箱伪前缀：@ 前紧贴 ASCII 词字符不触发
    await typeValue(wrapper, 'user@')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('closes the panel when the context becomes inactive', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    await typeValue(wrapper, '@')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(true)
    // 空白切断上下文
    await typeValue(wrapper, '@ ')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('inserts the mention on click and writes back label + space', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    await typeValue(wrapper, '@')
    await wrapper.findAll('.lh-mentions__option')[1].trigger('click')
    // 写回的是 label（人可读），value 经 select 事件交业务层
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['@留白 '])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('replaces the pending fragment with the picked mention', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    // 片段落在已有文本之后：insertMention 只替换 @ 片段，前文原样保留
    await typeValue(wrapper, '前文@水')
    await wrapper.findAll('.lh-mentions__option')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['前文@水墨 '])
    vi.useRealTimers()
  })

  it('ignores clicks on disabled options', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    await typeValue(wrapper, '@飞')
    expect(wrapper.findAll('.lh-mentions__option')).toHaveLength(1)
    await wrapper.findAll('.lh-mentions__option')[0].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    vi.useRealTimers()
  })

  it('navigates with arrow keys and selects with Enter (H5 keyboard)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    const input = wrapper.find('.lh-mentions__inner')
    await typeValue(wrapper, '@')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(
      wrapper.findAll('.lh-mentions__option')[0].classes(),
    ).toContain('lh-mentions__option--highlighted')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([options[0]])
    vi.useRealTimers()
  })

  it('closes on Escape and on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options } })
    await typeValue(wrapper, '@')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(true)
    await wrapper.find('.lh-mentions__inner').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(false)
    await typeValue(wrapper, '@留')
    await wrapper.find('.lh-mentions__mask').trigger('click')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('renders the multiline textarea variant', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhMentions, { props: { options, multiline: true } })
    expect(wrapper.find('textarea.lh-mentions__inner').exists()).toBe(true)
    await typeValue(wrapper, '@')
    expect(wrapper.find('.lh-mentions__dropdown').exists()).toBe(true)
    vi.useRealTimers()
  })

  it('carries the combobox aria contract on the control', () => {
    const control = mount(LhMentions, { props: { options } }).find('.lh-mentions__inner')
    expect(control.attributes('role')).toBe('combobox')
    expect(control.attributes('aria-haspopup')).toBe('listbox')
    expect(control.attributes('aria-expanded')).toBe('false')
    expect(control.attributes('aria-controls')).toMatch(/^lh-mentions-/)
  })

  it('exposes updateContext / close on the instance', () => {
    const wrapper = mount(LhMentions, { props: { options } })
    const vm = wrapper.vm as { updateContext: (caret: number) => void; close: () => void }
    expect(typeof vm.updateContext).toBe('function')
    expect(typeof vm.close).toBe('function')
  })
})
