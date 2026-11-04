import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhRate from '../../src/components/lh-rate/lh-rate.vue'

describe('LhRate', () => {
  it('渲染 max 颗星星与根类名', () => {
    const wrapper = mount(LhRate, { props: { modelValue: 3 } })
    expect(wrapper.find('.lh-rate').exists()).toBe(true)
    expect(wrapper.findAll('.lh-rate__star')).toHaveLength(5)
  })

  it('填充档位：clampRate 钳制 + full/half/empty', () => {
    const wrapper = mount(LhRate, { props: { modelValue: 3, max: 4 } })
    const stars = wrapper.findAll('.lh-rate__star')
    expect(stars[0].classes()).toContain('lh-rate__star--full')
    expect(stars[2].classes()).toContain('lh-rate__star--full')
    expect(stars[3].classes()).toContain('lh-rate__star--empty')
  })

  it('点击星星发出 update:modelValue 与 change', async () => {
    const wrapper = mount(LhRate, { props: { modelValue: 0 } })
    await wrapper.findAll('.lh-rate__star')[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('change')?.[0]).toEqual([4])
  })

  it('整组禁用时点击不发出事件', async () => {
    const wrapper = mount(LhRate, { props: { modelValue: 0, disabled: true } })
    expect(wrapper.find('.lh-rate').classes()).toContain('lh-rate--disabled')
    await wrapper.findAll('.lh-rate__star')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('半星模式：H5 点击左半区取 i - 0.5', async () => {
    const wrapper = mount(LhRate, { props: { modelValue: 0, allowHalf: true } })
    const star = wrapper.findAll('.lh-rate__star')[1]
    // jsdom 的 offsetX 无效（undefined），走整星；用 Object.defineProperty 模拟左半区命中
    Object.defineProperty(star.element, 'clientWidth', { value: 40, configurable: true })
    await star.trigger('click', { offsetX: 5 } as never)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1.5])
  })

  it('半星模式下 offset 无效时退化整星', async () => {
    const wrapper = mount(LhRate, { props: { modelValue: 0, allowHalf: true } })
    // 不注入 offsetX：MP 端事件无该字段，退化为整星
    await wrapper.findAll('.lh-rate__star')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('readonly 分支：role=img + aria-label + 静态星星', () => {
    const wrapper = mount(LhRate, { props: { modelValue: 3.5, readonly: true, allowHalf: true } })
    const root = wrapper.find('.lh-rate')
    expect(root.attributes('role')).toBe('img')
    // getRateAriaText：3.5 星
    expect(root.attributes('aria-label')).toContain('3.5')
    expect(root.find('.lh-rate__star--static').exists()).toBe(true)
  })

  it('showScore 渲染分数文本（scoreTemplate 优先）', () => {
    const wrapper = mount(LhRate, {
      props: { modelValue: 4, readonly: true, showScore: true, scoreTemplate: '{n} 分' },
    })
    expect(wrapper.find('.lh-rate__score').text()).toBe('4 分')
  })

  it('tabindex roving：当前星持焦点位（与 plus 一致）', () => {
    const wrapper = mount(LhRate, { props: { modelValue: 3 } })
    const stars = wrapper.findAll('.lh-rate__star')
    expect(stars[2].attributes('tabindex')).toBe('0')
    expect(stars[3].attributes('tabindex')).toBe('-1')
  })

  it('键盘方向键步进（H5 行为）', async () => {
    const wrapper = mount(LhRate, { props: { modelValue: 2 } })
    await wrapper.find('.lh-rate').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('max 自定义星数', () => {
    const wrapper = mount(LhRate, { props: { modelValue: 0, max: 8 } })
    expect(wrapper.findAll('.lh-rate__star')).toHaveLength(8)
  })
})
