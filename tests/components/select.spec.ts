import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhSelect from '../../src/components/lh-select/lh-select.vue'
import { lhlocale } from '@/adapter/locale'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 定位 → 选中 → 关」的时序与事件流（computePosition 本身在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // ID 按组件实例唯一（lh-select-trigger-<uid>），用前缀匹配
    if (selector.startsWith('#lh-select-trigger')) {
      return { top: 100, left: 10, width: 200, height: 40, right: 210, bottom: 140 }
    }
    return { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160 }
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
  { label: '丹青', value: 'danqing' },
  { label: '留白', value: 'liubai' },
]

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-select__trigger').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhSelect', () => {
  it('renders the placeholder when no value is selected', () => {
    const wrapper = mount(LhSelect, { props: { options, placeholder: '请选择' } })
    expect(wrapper.find('.lh-select__label').text()).toBe('请选择')
    expect(wrapper.classes()).toContain('lh-select--placeholder')
  })

  it('renders the selected label', () => {
    const wrapper = mount(LhSelect, { props: { options, modelValue: 'ink' } })
    expect(wrapper.find('.lh-select__label').text()).toBe('水墨')
    expect(wrapper.find('.lh-select__arrow').exists()).toBe(true)
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(LhSelect, { props: { options, disabled: true } })
    await wrapper.find('.lh-select__trigger').trigger('click')
    expect(wrapper.find('.lh-select__dropdown').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')).toBeUndefined()
  })

  it('opens the popper, positions it, and lists options', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options } })
    await openPopper(wrapper)

    const popper = wrapper.find('.lh-select__dropdown')
    expect(popper.exists()).toBe(true)
    // computePosition 在 375×667 视口内把气泡放到 trigger 下方
    expect(popper.attributes('style')).toContain('position: fixed')
    expect(popper.attributes('style')).toContain('top: 148px')
    expect(wrapper.findAll('.lh-select__option')).toHaveLength(3)
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])

    vi.useRealTimers()
  })

  it('selects an option, emits events, and closes', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options } })
    await openPopper(wrapper)

    await wrapper.findAll('.lh-select__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['danqing'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['danqing'])
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])
    expect(wrapper.find('.lh-select__dropdown').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('marks the selected option and shows the check icon', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options, modelValue: 'liubai' } })
    await openPopper(wrapper)

    const opts = wrapper.findAll('.lh-select__option')
    expect(opts[2].classes()).toContain('lh-select__option--selected')
    expect(opts[2].find('.lh-select__option-icon').exists()).toBe(true)
    expect(opts[0].classes()).not.toContain('lh-select__option--selected')

    vi.useRealTimers()
  })

  it('closes on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options } })
    await openPopper(wrapper)

    await wrapper.find('.lh-select__mask').trigger('click')
    expect(wrapper.find('.lh-select__dropdown').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])

    vi.useRealTimers()
  })

  it('filters options when filterable', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options, filterable: true } })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-select__filter').exists()).toBe(true)
    const filterInput = wrapper.find('.lh-select__filter').find('.lh-input__inner')
    // uni 的 input 事件载荷在 event.detail.value，不能用 setValue（触发的是无 detail 的原生事件）
    await filterInput.trigger('input', { detail: { value: '水' } })
    await nextTick()

    const opts = wrapper.findAll('.lh-select__option')
    expect(opts).toHaveLength(1)
    expect(opts[0].find('.lh-select__option-label').text()).toBe('水墨')

    vi.useRealTimers()
  })

  it('shows the empty state when nothing matches', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options, filterable: true } })
    await openPopper(wrapper)

    await wrapper.find('.lh-select__filter').find('.lh-input__inner').trigger('input', {
      detail: { value: '不存在' },
    })
    await nextTick()

    expect(wrapper.find('.lh-select__empty').exists()).toBe(true)
    expect(wrapper.findAll('.lh-select__option')).toHaveLength(0)

    vi.useRealTimers()
  })

  it('clears the value when clearable and a value is selected', async () => {
    const wrapper = mount(LhSelect, {
      props: { options, modelValue: 'ink', clearable: true },
    })
    expect(wrapper.find('.lh-select__clear').exists()).toBe(true)

    await wrapper.find('.lh-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('change')?.[0]).toEqual([undefined])
  })

  // 空态文案与筛选占位符曾写在 SFC 内部的 t() 里、未订阅版本号，
  // 切语言后不更新；现在落在 logic 的 computed 上，跟随 setLocale 响应
  it('updates the filter placeholder and empty text when the locale changes', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhSelect, { props: { options, filterable: true } })
    await openPopper(wrapper)

    const filter = wrapper.find('.lh-select__filter').find('.lh-input__inner')
    await filter.trigger('input', { detail: { value: 'zzz' } })
    await nextTick()

    expect(wrapper.find('.lh-select__empty').text()).toBe('无匹配项')
    expect(filter.attributes('placeholder')).toBe('搜索')

    lhlocale.setLocale('en-US')
    await nextTick()

    expect(wrapper.find('.lh-select__empty').text()).toBe('No matches')
    expect(wrapper.find('.lh-select__filter').find('.lh-input__inner').attributes('placeholder')).toBe(
      'Search',
    )

    lhlocale.setLocale('zh-CN')
    await nextTick()
    expect(wrapper.find('.lh-select__empty').text()).toBe('无匹配项')

    vi.useRealTimers()
  })
})
