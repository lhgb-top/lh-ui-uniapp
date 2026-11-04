import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhStatistic from '../../src/components/lh-statistic/lh-statistic.vue'

function mountStatistic(props = {}) {
  return mount(LhStatistic, { props })
}

describe('LhStatistic', () => {
  it('渲染根节点、标题与数值，默认 precision 0 + 逗号千分位', () => {
    const wrapper = mountStatistic({ value: 2384712 })
    expect(wrapper.find('.lh-statistic').exists()).toBe(true)
    expect(wrapper.find('.lh-statistic__content').exists()).toBe(true)
    expect(wrapper.find('.lh-statistic__value').text()).toBe('2,384,712')
    // 未传 title / prefix / suffix 时对应节点不渲染
    expect(wrapper.find('.lh-statistic__title').exists()).toBe(false)
    expect(wrapper.find('.lh-statistic__prefix').exists()).toBe(false)
    expect(wrapper.find('.lh-statistic__suffix').exists()).toBe(false)
  })

  it('title 与 prefix / suffix 生效', () => {
    const wrapper = mountStatistic({ title: '年访问量', value: 1024, prefix: '¥', suffix: '次' })
    expect(wrapper.find('.lh-statistic__title').text()).toBe('年访问量')
    expect(wrapper.find('.lh-statistic__prefix').text()).toBe('¥')
    expect(wrapper.find('.lh-statistic__suffix').text()).toBe('次')
  })

  it('precision 控制小数位（四舍五入）', () => {
    const wrapper = mountStatistic({ value: 4.8471, precision: 2 })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('4.85')
  })

  it('separator 空串关闭千位分组', () => {
    const wrapper = mountStatistic({ value: 8899001, separator: '' })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('8899001')
  })

  it('超大数字符串走字符串路径不丢精度', () => {
    const wrapper = mountStatistic({ value: '9007199254740993' })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('9,007,199,254,740,993')
  })

  it('非数值字符串按原文展示', () => {
    const wrapper = mountStatistic({ value: '不可计数' })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('不可计数')
  })

  it('value 变化后重新格式化（computed 订阅 props）', async () => {
    const wrapper = mountStatistic({ value: 1234.56, precision: 1 })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('1,234.6')
    await wrapper.setProps({ value: 12345.678, precision: 2 })
    expect(wrapper.find('.lh-statistic__value').text()).toBe('12,345.68')
  })

  it('title / prefix / suffix 插槽覆盖 props 文本', () => {
    const wrapper = mount(LhStatistic, {
      props: { value: 1024 },
      slots: {
        title: '<text class="slot-title">自定义标题</text>',
        prefix: '<text class="slot-prefix">¥</text>',
        suffix: '<text class="slot-suffix">元</text>',
      },
    })
    expect(wrapper.find('.slot-title').exists()).toBe(true)
    expect(wrapper.find('.slot-prefix').exists()).toBe(true)
    expect(wrapper.find('.slot-suffix').exists()).toBe(true)
  })

  it('aria-live="polite" 标注数值区（读屏器温和播报）', () => {
    const wrapper = mountStatistic({ value: 42 })
    expect(wrapper.find('.lh-statistic__value').attributes('aria-live')).toBe('polite')
  })
})
