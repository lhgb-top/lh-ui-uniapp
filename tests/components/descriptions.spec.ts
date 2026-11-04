import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhDescriptions from '../../src/components/lh-descriptions/lh-descriptions.vue'

const baseItems = [
  { label: '名称', value: '青花缠枝莲纹瓶' },
  { label: '年代', value: '明永乐' },
  { label: '类别', value: '瓷器' },
  { label: '级别', value: '一级文物' },
]

function mountDescriptions(props = {}) {
  return mount(LhDescriptions, { props: { items: baseItems, ...props } })
}

describe('LhDescriptions', () => {
  it('渲染标题与全部条目的 label/value', () => {
    const wrapper = mountDescriptions({ title: '藏品档案', column: 2 })
    expect(wrapper.find('.lh-descriptions__header').text()).toBe('藏品档案')
    expect(wrapper.findAll('.lh-descriptions__label')).toHaveLength(4)
    expect(wrapper.findAll('.lh-descriptions__content')).toHaveLength(4)
    expect(wrapper.findAll('.lh-descriptions__label')[0].text()).toBe('名称')
    expect(wrapper.findAll('.lh-descriptions__content')[0].text()).toBe('青花缠枝莲纹瓶')
  })

  it('column=2 时每行两个条目（共 2 行），无需补位', () => {
    const wrapper = mountDescriptions({ column: 2 })
    expect(wrapper.findAll('.lh-descriptions__row')).toHaveLength(2)
    expect(wrapper.findAll('.lh-descriptions__filler')).toHaveLength(0)
  })

  it('最后一行不足时渲染补位单元格（aria-hidden，与 plus 一致）', () => {
    // column 默认 3：第一行 3 个条目，第二行 1 个条目 + 补 2 列
    const wrapper = mountDescriptions()
    const rows = wrapper.findAll('.lh-descriptions__row')
    expect(rows).toHaveLength(2)
    const filler = rows[1].find('.lh-descriptions__filler')
    expect(filler.exists()).toBe(true)
    expect(filler.attributes('aria-hidden')).toBe('true')
  })

  it('border 模式追加 lh-descriptions--border 类，默认不带', () => {
    expect(mountDescriptions().classes()).not.toContain('lh-descriptions--border')
    expect(mountDescriptions({ border: true }).classes()).toContain('lh-descriptions--border')
  })

  it('单元格 flex basis 按 column 计算（与 plus 同一套计算）', () => {
    const wrapper = mountDescriptions({ column: 2 })
    // labelBasis = 100 / (column * 2) = 25%；单列 content basis 同为 25%
    expect(wrapper.find('.lh-descriptions__label').attributes('style')).toContain('flex: 0 0 25%')
    expect(wrapper.find('.lh-descriptions__content').attributes('style')).toContain('flex: 0 0 25%')
  })

  it('span 超出 column 时钳制：整行条目独占一行，后续条目换行并补位', () => {
    // column=2，第一条 span=5 超出 → 钳制为整行 2 列
    const wrapper = mountDescriptions({
      column: 2,
      items: [
        { label: '名称', value: '千里江山图', span: 5 },
        { label: '年代', value: '北宋' },
      ],
    })
    const rows = wrapper.findAll('.lh-descriptions__row')
    expect(rows).toHaveLength(2)
    // 跨 2 列的 content basis = 2 * 100 / 2 - 25 = 75%
    expect(rows[0].find('.lh-descriptions__content').attributes('style')).toContain('flex: 0 0 75%')
    // 第二行只有 1 个条目，补 1 列
    expect(rows[1].find('.lh-descriptions__filler').exists()).toBe(true)
  })

  it('item-<index> 作用域插槽覆盖条目内容', () => {
    const wrapper = mount(LhDescriptions, {
      props: { column: 2, items: baseItems },
      slots: {
        'item-1':
          '<template #default="{ item }"><span class="slot-value">{{ item.value }}</span></template>',
      },
    })
    const contents = wrapper.findAll('.lh-descriptions__content')
    expect(contents[0].text()).toBe('青花缠枝莲纹瓶')
    expect(contents[1].find('.slot-value').exists()).toBe(true)
    expect(contents[1].text()).toBe('明永乐')
  })

  it('title 插槽存在时渲染插槽标题（不传 title prop 也渲染标题区）', () => {
    const wrapper = mount(LhDescriptions, {
      props: { items: baseItems },
      slots: { title: '<span class="slot-title">插槽标题</span>' },
    })
    expect(wrapper.find('.lh-descriptions__header').text()).toBe('插槽标题')
  })

  it('无标题且无 title 插槽时不渲染标题区', () => {
    const wrapper = mountDescriptions({ column: 2 })
    expect(wrapper.find('.lh-descriptions__header').exists()).toBe(false)
  })

  it('customClass 透传到根节点', () => {
    const wrapper = mountDescriptions({ column: 2, customClass: 'demo-desc' })
    expect(wrapper.classes()).toContain('demo-desc')
  })
})
