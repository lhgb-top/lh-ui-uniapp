import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhCollapse from '../../src/components/lh-collapse/lh-collapse.vue'
import LhCollapseItem from '../../src/components/lh-collapse-item/lh-collapse-item.vue'

const ITEMS = [
  { name: 'a', title: '面板甲' },
  { name: 'b', title: '面板乙' },
  { name: 'c', title: '禁用面板', disabled: true },
]

function itemSlots(items: Array<Record<string, unknown>> = ITEMS): string {
  return items
    .map((item) => {
      const attrs = Object.entries(item)
        .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
        .join(' ')
      return `<lh-collapse-item ${attrs}>${item.title}内容</lh-collapse-item>`
    })
    .join('\n')
}

// 直接挂载 LhCollapse（根组件即被测组件，emitted 可断言 update:modelValue / change）；
// 面板项走字符串插槽，子组件由 mount helper 的全局注册解析（对齐 easycom 语义）
function mountCollapse(props: Record<string, unknown> = {}, items = ITEMS) {
  return mount(LhCollapse, {
    props,
    slots: { default: itemSlots(items) },
  })
}

describe('LhCollapse', () => {
  it('渲染容器与全部面板项（含标题与箭头），头/内容 aria 关联成对', () => {
    const wrapper = mountCollapse()
    expect(wrapper.find('.lh-collapse').exists()).toBe(true)
    const headers = wrapper.findAll('.lh-collapse__header')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toContain('面板甲')
    expect(wrapper.find('.lh-collapse__arrow').exists()).toBe(true)
    const region = wrapper.find('.lh-collapse__wrap')
    expect(region.attributes('role')).toBe('region')
    expect(headers[0].attributes('aria-controls')).toBe(region.attributes('id'))
    expect(region.attributes('aria-labelledby')).toBe(headers[0].attributes('id'))
  })

  it('header 点击切换展开态，同步落 active 类与 aria-expanded', async () => {
    const wrapper = mountCollapse()
    const headers = wrapper.findAll('.lh-collapse__header')
    await headers[0].trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-collapse__item')[0].classes()).toContain(
      'lh-collapse__item--active',
    )
    expect(headers[0].attributes('aria-expanded')).toBe('true')
    // 内容区始终渲染（由 CSS 的 grid 0fr/1fr 控制显隐），不做 v-if 直切
    expect(wrapper.find('.lh-collapse__content').exists()).toBe(true)
  })

  it('非受控模式点击抛 change（数组快照），再次点击收起', async () => {
    const wrapper = mountCollapse()
    await wrapper.findAll('.lh-collapse__header')[1].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([['b']])
    await wrapper.findAll('.lh-collapse__header')[1].trigger('click')
    expect(wrapper.emitted('change')?.[1]).toEqual([[]])
  })

  it('accordion 手风琴：同时只展开一项，change 抛单值', async () => {
    const wrapper = mountCollapse({ accordion: true })
    expect(wrapper.find('.lh-collapse').classes()).toContain('lh-collapse--accordion')
    const headers = wrapper.findAll('.lh-collapse__header')
    await headers[0].trigger('click')
    await headers[1].trigger('click')
    await nextTick()
    const active = wrapper.findAll('.lh-collapse__item').filter((item) =>
      item.classes().includes('lh-collapse__item--active'),
    )
    expect(active).toHaveLength(1)
    expect(active[0].text()).toContain('面板乙')
    // 手风琴下 change 抛单值
    expect(wrapper.emitted('change')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('change')?.[1]).toEqual(['b'])
  })

  it('accordion 下再次点击已开面板收起，change 抛 undefined', async () => {
    const wrapper = mountCollapse({ accordion: true })
    const headers = wrapper.findAll('.lh-collapse__header')
    await headers[0].trigger('click')
    await headers[0].trigger('click')
    expect(wrapper.emitted('change')?.[1]).toEqual([undefined])
    expect(
      wrapper.findAll('.lh-collapse__item').filter((item) =>
        item.classes().includes('lh-collapse__item--active'),
      ),
    ).toHaveLength(0)
  })

  it('受控 v-model：点击只抛 update:modelValue，内部不落值（未回写时面板不展开）', async () => {
    const wrapper = mountCollapse({ modelValue: ['a'] })
    expect(wrapper.findAll('.lh-collapse__item')[0].classes()).toContain(
      'lh-collapse__item--active',
    )
    await wrapper.findAll('.lh-collapse__header')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.findAll('.lh-collapse__item')[1].classes()).not.toContain(
      'lh-collapse__item--active',
    )
  })

  it('受控 v-model 更新后面板跟随展开（父组件异步回写）', async () => {
    const wrapper = mountCollapse({ modelValue: [] })
    await wrapper.setProps({ modelValue: ['b'] })
    const items = wrapper.findAll('.lh-collapse__item')
    expect(items[1].classes()).toContain('lh-collapse__item--active')
    expect(wrapper.findAll('.lh-collapse__header')[1].attributes('aria-expanded')).toBe('true')
  })

  it('禁用面板不可展开、不抛事件，带 aria-disabled 与 --disabled 类', async () => {
    const wrapper = mountCollapse()
    const headers = wrapper.findAll('.lh-collapse__header')
    expect(wrapper.findAll('.lh-collapse__item')[2].classes()).toContain(
      'lh-collapse__item--disabled',
    )
    expect(headers[2].attributes('aria-disabled')).toBe('true')
    await headers[2].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(headers[2].attributes('aria-expanded')).toBe('false')
  })

  it('title 插槽覆盖默认标题', () => {
    const wrapper = mount(LhCollapse, {
      slots: {
        default: `<lh-collapse-item name="a">
          <template #title>插槽标题</template>
          内容
        </lh-collapse-item>`,
      },
    })
    expect(wrapper.find('.lh-collapse__header').text()).toContain('插槽标题')
  })

  it('无父上下文时独立面板始终收起（面板必须置于 lh-collapse 内，与 plus 一致）', () => {
    const wrapper = mount(LhCollapseItem, { props: { name: 'solo', title: '独立' } })
    expect(wrapper.find('.lh-collapse__item').exists()).toBe(true)
    expect(wrapper.find('.lh-collapse__item--active').exists()).toBe(false)
    expect(wrapper.find('.lh-collapse__header').attributes('aria-expanded')).toBe('false')
  })
})
