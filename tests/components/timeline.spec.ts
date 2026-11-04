import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '../mount'
import LhTimeline from '../../src/components/lh-timeline/lh-timeline.vue'
import LhTimelineItem from '../../src/components/lh-timeline-item/lh-timeline-item.vue'

function mountTimeline(
  props: Record<string, unknown> = {},
  items: Array<Record<string, unknown>> = [
    { timestamp: '2026-09-01', content: '立项评审' },
    { timestamp: '2026-09-15', content: '一期交付' },
    { timestamp: '2026-09-25', content: '验收进行中' },
  ],
) {
  const slots = items
    .map((item) => {
      const attrs = Object.entries(item)
        .filter(([key]) => key !== 'content')
        .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
        .join(' ')
      return `<lh-timeline-item ${attrs}>${item.content}</lh-timeline-item>`
    })
    .join('\n')
  return mount({
    components: { LhTimeline, LhTimelineItem },
    data: () => ({ props }),
    template: `<lh-timeline v-bind="props">
      ${slots}
    </lh-timeline>`,
  })
}

describe('LhTimeline', () => {
  it('渲染容器与全部条目（时间顺序即文档顺序）', () => {
    const wrapper = mountTimeline()
    expect(wrapper.find('.lh-timeline').exists()).toBe(true)
    expect(wrapper.find('.lh-timeline').attributes('role')).toBe('list')
    expect(wrapper.findAll('.lh-timeline__item')).toHaveLength(3)
    expect(wrapper.findAll('.lh-timeline__content').map((n) => n.text())).toEqual([
      '立项评审',
      '一期交付',
      '验收进行中',
    ])
  })

  it('默认 left 模式无 alternate 容器类、无右侧条目类', () => {
    const wrapper = mountTimeline()
    expect(wrapper.find('.lh-timeline').classes()).not.toContain('lh-timeline--alternate')
    expect(wrapper.findAll('.lh-timeline__item--right')).toHaveLength(0)
  })

  it('alternate 模式：容器带 alternate 类，条目按序号左右交替（偶数左、奇数右）', () => {
    const wrapper = mountTimeline({ mode: 'alternate' }, [
      { timestamp: 'Q1', content: '规划' },
      { timestamp: 'Q2', content: '开发' },
      { timestamp: 'Q3', content: '压测' },
      { timestamp: 'Q4', content: '上线' },
    ])
    expect(wrapper.find('.lh-timeline').classes()).toContain('lh-timeline--alternate')
    const items = wrapper.findAll('.lh-timeline__item')
    expect(items[0].classes()).not.toContain('lh-timeline__item--right')
    expect(items[1].classes()).toContain('lh-timeline__item--right')
    expect(items[2].classes()).not.toContain('lh-timeline__item--right')
    expect(items[3].classes()).toContain('lh-timeline__item--right')
  })

  it('仅末项带 --last 类（连接线由 CSS 伪元素隐藏）', async () => {
    // 子项 setup 期注册 token，isLast 收敛跨两拍：首拍 flush 注册引发的
    // 重渲染，次拍才是收敛后的类名（同 breadcrumb 的注册时序，实测需两拍）
    const wrapper = mountTimeline()
    await nextTick()
    await nextTick()
    const items = wrapper.findAll('.lh-timeline__item')
    expect(items[0].classes()).not.toContain('lh-timeline__item--last')
    expect(items[1].classes()).not.toContain('lh-timeline__item--last')
    expect(items[2].classes()).toContain('lh-timeline__item--last')
  })

  it('type 语义类型落到条目类名', () => {
    const wrapper = mountTimeline({}, [
      { type: 'primary', content: '主流程' },
      { type: 'success', content: '成功' },
      { type: 'warning', content: '警告' },
      { type: 'danger', content: '危险' },
    ])
    const items = wrapper.findAll('.lh-timeline__item')
    expect(items[0].classes()).toContain('lh-timeline__item--primary')
    expect(items[1].classes()).toContain('lh-timeline__item--success')
    expect(items[2].classes()).toContain('lh-timeline__item--warning')
    expect(items[3].classes()).toContain('lh-timeline__item--danger')
  })

  it('hollow 渲染空心节点类', () => {
    const wrapper = mountTimeline({}, [
      { hollow: true, content: '未开始' },
      { content: '进行中' },
    ])
    const items = wrapper.findAll('.lh-timeline__item')
    expect(items[0].classes()).toContain('lh-timeline__item--hollow')
    expect(items[1].classes()).not.toContain('lh-timeline__item--hollow')
  })

  it('timestamp 渲染为时间戳节点，缺省时不渲染', () => {
    const wrapper = mountTimeline({}, [
      { timestamp: '2026-09-01', content: '有时间戳' },
      { content: '无时间戳' },
    ])
    const stamps = wrapper.findAll('.lh-timeline__timestamp')
    expect(stamps).toHaveLength(1)
    expect(stamps[0].text()).toBe('2026-09-01')
  })

  it('圆点节点纯装饰（aria-hidden）且始终渲染', () => {
    const wrapper = mountTimeline()
    const dots = wrapper.findAll('.lh-timeline__dot')
    expect(dots).toHaveLength(3)
    expect(dots[0].attributes('aria-hidden')).toBe('true')
  })

  it('customClass 透传到容器与条目根节点', () => {
    const wrapper = mount({
      components: { LhTimeline, LhTimelineItem },
      template: `<lh-timeline custom-class="my-timeline">
        <lh-timeline-item custom-class="my-item">内容</lh-timeline-item>
      </lh-timeline>`,
    })
    expect(wrapper.find('.lh-timeline').classes()).toContain('my-timeline')
    expect(wrapper.find('.lh-timeline__item').classes()).toContain('my-item')
  })

  it('自定义圆点插槽渲染到圆点节点内', () => {
    const wrapper = mount({
      components: { LhTimeline, LhTimelineItem },
      template: `<lh-timeline>
        <lh-timeline-item timestamp="Q1">
          <template #dot>
            <text class="custom-dot">墨</text>
          </template>
          自定义圆点
        </lh-timeline-item>
      </lh-timeline>`,
    })
    expect(wrapper.find('.lh-timeline__dot .custom-dot').exists()).toBe(true)
  })

  it('自定义时间戳插槽渲染（即使未传 timestamp prop）', () => {
    const wrapper = mount({
      components: { LhTimeline, LhTimelineItem },
      template: `<lh-timeline>
        <lh-timeline-item>
          <template #timestamp>
            <text class="custom-stamp">2026 年 9 月</text>
          </template>
          自定义时间戳
        </lh-timeline-item>
      </lh-timeline>`,
    })
    expect(wrapper.find('.lh-timeline__timestamp .custom-stamp').exists()).toBe(true)
  })

  it('脱离 lh-timeline 单用：按 left 模式、视为唯一节点（末项）渲染', () => {
    const wrapper = mount(LhTimelineItem, {
      props: { timestamp: '2026-09-01' },
      slots: { default: '独立条目' },
    })
    const item = wrapper.find('.lh-timeline__item')
    expect(item.exists()).toBe(true)
    expect(item.classes()).toContain('lh-timeline__item--last')
    expect(item.classes()).not.toContain('lh-timeline__item--right')
    expect(wrapper.find('.lh-timeline__timestamp').text()).toBe('2026-09-01')
  })
})
