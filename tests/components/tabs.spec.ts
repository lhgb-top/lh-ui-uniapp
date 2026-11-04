import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTabs from '../../src/components/lh-tabs/lh-tabs.vue'
import LhTabPane from '../../src/components/lh-tab-pane/lh-tab-pane.vue'

function mountTabs(props = {}, paneProps: Array<Record<string, unknown>> = [
  { name: 'ink', label: '水墨' },
  { name: 'danqing', label: '丹青' },
  { name: 'liubai', label: '留白' },
]) {
  const slots = paneProps
    .map((pane) => {
      const attrs = Object.entries(pane)
        .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
        .join(' ')
      return `<lh-tab-pane ${attrs}>${pane.label}内容</lh-tab-pane>`
    })
    .join('\n')
  // 直接挂载被测组件（LhTabs 为根）：宿主模板挂载时 emitted() 拿不到子组件事件；
  // lh-tab-pane 走字符串 slot 由 mount.ts 的全局注册解析
  return mount(LhTabs, {
    props,
    slots: { default: slots },
  })
}

describe('LhTabs', () => {
  it('渲染页签头、全部页签与面板（内容区始终渲染，由 v-show 控制显隐）', () => {
    const wrapper = mountTabs()
    expect(wrapper.find('.lh-tabs').exists()).toBe(true)
    expect(wrapper.find('.lh-tabs__header').exists()).toBe(true)
    expect(wrapper.findAll('.lh-tabs__tab')).toHaveLength(3)
    expect(wrapper.findAll('.lh-tab-pane')).toHaveLength(3)
  })

  it('根类名随 type 与 tab-position 变化', () => {
    const wrapper = mountTabs({ type: 'card', tabPosition: 'bottom' })
    expect(wrapper.find('.lh-tabs').classes()).toContain('lh-tabs--card')
    expect(wrapper.find('.lh-tabs').classes()).toContain('lh-tabs--bottom')
  })

  it('默认激活首个可用页签，其余面板隐藏', () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('.lh-tabs__tab')
    expect(tabs[0].classes()).toContain('lh-tabs__tab--active')
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    const panes = wrapper.findAll('.lh-tab-pane')
    expect(panes[0].isVisible()).toBe(true)
    expect(panes[1].isVisible()).toBe(false)
  })

  it('modelValue 指定初始激活页签', () => {
    const wrapper = mountTabs({ modelValue: 'danqing' })
    const tabs = wrapper.findAll('.lh-tabs__tab')
    expect(tabs[1].classes()).toContain('lh-tabs__tab--active')
    expect(wrapper.findAll('.lh-tab-pane')[1].isVisible()).toBe(true)
  })

  it('点击页签切换激活态，并按序抛出 update:modelValue 与 tab-change', async () => {
    const wrapper = mountTabs()
    await wrapper.findAll('.lh-tabs__tab')[2].trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-tabs__tab')[2].classes()).toContain('lh-tabs__tab--active')
    expect(wrapper.findAll('.lh-tab-pane')[2].isVisible()).toBe(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['liubai'])
    expect(wrapper.emitted('tab-change')?.[0]).toEqual(['liubai'])
  })

  it('禁用页签不可激活、不抛事件', async () => {
    const wrapper = mountTabs({}, [
      { name: 'first', label: '可用' },
      { name: 'second', label: '禁用', disabled: true },
    ])
    const tabs = wrapper.findAll('.lh-tabs__tab')
    expect(tabs[1].classes()).toContain('lh-tabs__tab--disabled')
    await tabs[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('tab-change')).toBeUndefined()
    // 首个可用页签仍是激活态
    expect(tabs[0].classes()).toContain('lh-tabs__tab--active')
  })

  it('modelValue 指向禁用页签时回退到首个可用页签', () => {
    const wrapper = mountTabs({ modelValue: 'second' }, [
      { name: 'first', label: '可用' },
      { name: 'second', label: '禁用', disabled: true },
    ])
    const tabs = wrapper.findAll('.lh-tabs__tab')
    expect(tabs[0].classes()).toContain('lh-tabs__tab--active')
  })

  it('closable 时渲染关闭按钮，点击抛出 tab-remove 并联动切换激活页签', async () => {
    const wrapper = mountTabs({ closable: true })
    expect(wrapper.find('.lh-tabs__tab-close').exists()).toBe(true)
    await wrapper.find('.lh-tabs__tab-close').trigger('click')
    expect(wrapper.emitted('tab-remove')?.[0]).toEqual(['ink'])
    await nextTick()
    // 被关闭的是激活页签：联动切到右侧最近可用页签
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['danqing'])
  })

  it('无 closable 时不渲染关闭按钮', () => {
    const wrapper = mountTabs()
    expect(wrapper.find('.lh-tabs__tab-close').exists()).toBe(false)
  })

  it('addable 时渲染新增按钮，点击抛出 tab-add', async () => {
    const wrapper = mountTabs({ addable: true })
    const addBtn = wrapper.find('.lh-tabs__add')
    expect(addBtn.exists()).toBe(true)
    await addBtn.trigger('click')
    expect(wrapper.emitted('tab-add')).toHaveLength(1)
  })

  it('无父上下文时独立面板不激活（面板必须置于 lh-tabs 内，与 plus 一致）', () => {
    const wrapper = mount(LhTabPane, { props: { name: 'solo', label: '独立' } })
    expect(wrapper.find('.lh-tab-pane').isVisible()).toBe(false)
  })
})
