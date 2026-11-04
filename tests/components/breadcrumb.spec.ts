import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhBreadcrumb from '../../src/components/lh-breadcrumb/lh-breadcrumb.vue'
import LhBreadcrumbItem from '../../src/components/lh-breadcrumb-item/lh-breadcrumb-item.vue'

function mountBreadcrumb(props = {}, items = ['首页', '组件', '面包屑']) {
  const slots = items
    .map((text, i) => `<lh-breadcrumb-item${i === 0 ? ' to="/pages/index/index"' : ''}>${text}</lh-breadcrumb-item>`)
    .join('\n')
  return mount({
    components: { LhBreadcrumb, LhBreadcrumbItem },
    data: () => ({ props }),
    template: `<lh-breadcrumb v-bind="props">
      ${slots}
    </lh-breadcrumb>`,
  })
}

describe('LhBreadcrumb', () => {
  it('渲染导航区、列表与全部项', () => {
    const wrapper = mountBreadcrumb()
    expect(wrapper.find('.lh-breadcrumb').exists()).toBe(true)
    expect(wrapper.find('.lh-breadcrumb__list').exists()).toBe(true)
    expect(wrapper.findAll('.lh-breadcrumb__item')).toHaveLength(3)
  })

  it('末项标记 aria-current 且非末项渲染链接', async () => {
    // 子项 setup 期注册 token，isLast/isLink 的 computed 在兄弟项全部注册后
    // 才收敛（Vue 首渲染的 effect 队列在 nextTick flush），断言前需等一拍
    const wrapper = mountBreadcrumb()
    await nextTick()
    const items = wrapper.findAll('.lh-breadcrumb__item')
    expect(items[0].find('.lh-breadcrumb__link').exists()).toBe(true)
    expect(items[2].find('.lh-breadcrumb__text').exists()).toBe(true)
    // aria-current 绑定在 __text 节点上（非 item 根节点）
    expect(items[2].find('.lh-breadcrumb__text').attributes('aria-current')).toBe('page')
  })

  it('非末项渲染分隔符，末项不渲染', async () => {
    const wrapper = mountBreadcrumb()
    await nextTick()
    const items = wrapper.findAll('.lh-breadcrumb__item')
    expect(items[0].find('.lh-breadcrumb__separator').exists()).toBe(true)
    expect(items[2].find('.lh-breadcrumb__separator').exists()).toBe(false)
  })

  it('自定义分隔符生效', async () => {
    const wrapper = mountBreadcrumb({ separator: '>' })
    await nextTick()
    expect(wrapper.find('.lh-breadcrumb__separator').text()).toBe('>')
  })

  it('maxItems 折叠中间项并渲染省略号按钮，点击后展开', async () => {
    const wrapper = mountBreadcrumb({ maxItems: 3 }, ['首页', '活动', '列表', '详情', '评价'])
    await nextTick()
    // 折叠规则（与 plus 一致）：保留首项 + 省略号 + 末尾 maxItems-1 项，
    // 中间项（索引 1、2）v-if 不渲染，可见项为 3
    expect(wrapper.findAll('.lh-breadcrumb__item')).toHaveLength(3)
    expect(wrapper.find('.lh-breadcrumb__ellipsis').exists()).toBe(true)
    // 点击省略号展开全部
    await wrapper.find('.lh-breadcrumb__ellipsis-btn').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-breadcrumb__item')).toHaveLength(5)
    expect(wrapper.find('.lh-breadcrumb__ellipsis').exists()).toBe(false)
  })

  it('无父上下文时独立项不渲染（项必须置于 lh-breadcrumb 内，与 plus 一致）', () => {
    const wrapper = mount(LhBreadcrumbItem, { slots: { default: '独立项' } })
    expect(wrapper.find('.lh-breadcrumb__item').exists()).toBe(false)
  })
})
