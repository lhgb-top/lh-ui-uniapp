import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '../mount'
import LhSegmented from '../../src/components/lh-segmented/lh-segmented.vue'

const STRING_OPTIONS = ['列表', '卡片', '表格']

const OBJECT_OPTIONS = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month', disabled: true },
]

function mountSegmented(props = {}) {
  return mount(LhSegmented, { props })
}

describe('LhSegmented', () => {
  it('渲染根节点与全部选项，根节点带 radiogroup 语义', () => {
    const wrapper = mountSegmented({ options: STRING_OPTIONS })
    const root = wrapper.find('.lh-segmented')
    expect(root.exists()).toBe(true)
    expect(root.attributes('role')).toBe('radiogroup')
    const items = wrapper.findAll('.lh-segmented__option')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toBe('列表')
    expect(items[2].text()).toBe('表格')
  })

  it('字符串快捷写法与对象选项都能渲染 label', () => {
    const wrapper = mountSegmented({ options: OBJECT_OPTIONS })
    const items = wrapper.findAll('.lh-segmented__option')
    expect(items.map((item) => item.text())).toEqual(['日', '周', '月'])
  })

  it('点击选项触发 update:modelValue 与 change（v-model 受控）', async () => {
    const wrapper = mountSegmented({ modelValue: '列表', options: STRING_OPTIONS })
    const items = wrapper.findAll('.lh-segmented__option')
    await items[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['卡片']])
    expect(wrapper.emitted('change')).toEqual([['卡片']])
    // 受控组件：props 未变前选中态不变
    expect(items[1].classes()).not.toContain('lh-segmented__option--checked')
    await wrapper.setProps({ modelValue: '卡片' })
    expect(wrapper.findAll('.lh-segmented__option')[1].classes()).toContain(
      'lh-segmented__option--checked',
    )
  })

  it('v-model 双向绑定更新选中项', async () => {
    const wrapper = mount(LhSegmented, {
      props: {
        modelValue: 'day',
        'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
        options: OBJECT_OPTIONS,
      },
    })
    await wrapper.findAll('.lh-segmented__option')[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe('week')
    expect(wrapper.findAll('.lh-segmented__option')[1].classes()).toContain(
      'lh-segmented__option--checked',
    )
  })

  it('disabled 项不响应点击也不抛事件', async () => {
    const wrapper = mountSegmented({ modelValue: 'day', options: OBJECT_OPTIONS })
    const items = wrapper.findAll('.lh-segmented__option')
    await items[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // aria 契约由 share 的 getSegmentedItemAria 决定
    expect(items[2].attributes('aria-checked')).toBe('false')
    expect(items[2].attributes('aria-disabled')).toBe('true')
    expect(items[2].classes()).toContain('lh-segmented__option--disabled')
    // 启用项正常可选
    await items[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['week']])
  })

  it('整组禁用：全部选项不可点，根节点带禁用修饰类与 aria-disabled', async () => {
    const wrapper = mountSegmented({ modelValue: '列表', options: STRING_OPTIONS, disabled: true })
    expect(wrapper.find('.lh-segmented').classes()).toContain('lh-segmented--disabled')
    expect(wrapper.find('.lh-segmented').attributes('aria-disabled')).toBe('true')
    await wrapper.findAll('.lh-segmented__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('roving tabindex：选中项（或首个启用项）持有焦点位', () => {
    const wrapper = mountSegmented({ modelValue: 'week', options: OBJECT_OPTIONS })
    const items = wrapper.findAll('.lh-segmented__option')
    expect(items[1].attributes('tabindex')).toBe('0')
    expect(items[0].attributes('tabindex')).toBe('-1')
    // 未选中任何项时焦点位落在首个启用项
    const wrapper2 = mountSegmented({ options: OBJECT_OPTIONS })
    const items2 = wrapper2.findAll('.lh-segmented__option')
    expect(items2[0].attributes('tabindex')).toBe('0')
    // 选中项为禁用项时回退到首个启用项（core 的 getRovingTabIndex 语义）
    const wrapper3 = mountSegmented({ modelValue: 'month', options: OBJECT_OPTIONS })
    expect(wrapper3.findAll('.lh-segmented__option')[0].attributes('tabindex')).toBe('0')
  })

  it('方向键移动选中项（首尾循环、跳过禁用项），仅 H5 有效', async () => {
    const wrapper = mount(LhSegmented, {
      props: {
        modelValue: 'day',
        'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
        options: OBJECT_OPTIONS,
      },
    })
    const root = wrapper.find('.lh-segmented')
    // 末项（禁用）右移循环回首项
    await root.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.props('modelValue')).toBe('week')
    await root.trigger('keydown', { key: 'ArrowRight' })
    // 跳过禁用的「月」，回到「日」
    expect(wrapper.props('modelValue')).toBe('day')
    await root.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.props('modelValue')).toBe('week')
    // 非方向键不响应
    await root.trigger('keydown', { key: 'Enter' })
    expect(wrapper.props('modelValue')).toBe('week')
  })

  it('block 撑满容器落修饰类', () => {
    const wrapper = mountSegmented({ options: STRING_OPTIONS, block: true })
    expect(wrapper.find('.lh-segmented').classes()).toContain('lh-segmented--block')
  })

  it('customClass 与 sx 透传到根节点', () => {
    const wrapper = mountSegmented({
      options: STRING_OPTIONS,
      customClass: 'my-seg',
      sx: { mt: 1 },
    })
    const root = wrapper.find('.lh-segmented')
    expect(root.classes()).toContain('my-seg')
    expect(root.attributes('style')).toContain('margin-top: 8px')
  })

  it('空选项组不渲染任何项，焦点位为 -1', async () => {
    const wrapper = mountSegmented({ options: [] })
    expect(wrapper.findAll('.lh-segmented__option')).toHaveLength(0)
    // 空组的方向键不应抛错
    await wrapper.find('.lh-segmented').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('选项变化后选中态与焦点位跟随更新（computed 订阅 props.options）', async () => {
    const wrapper = mountSegmented({ modelValue: '甲', options: ['甲', '乙'] })
    expect(wrapper.findAll('.lh-segmented__option')[0].classes()).toContain(
      'lh-segmented__option--checked',
    )
    await wrapper.setProps({ options: ['乙', '丙'] })
    const items = wrapper.findAll('.lh-segmented__option')
    expect(items).toHaveLength(2)
    expect(items.map((item) => item.text())).toEqual(['乙', '丙'])
    expect(items[0].classes()).not.toContain('lh-segmented__option--checked')
    expect(items[0].attributes('tabindex')).toBe('0')
  })

  it('nextTick 后选中项文案与 aria-checked 同步', async () => {
    const wrapper = mountSegmented({ modelValue: 'day', options: OBJECT_OPTIONS })
    await wrapper.setProps({ modelValue: 'week' })
    await nextTick()
    const items = wrapper.findAll('.lh-segmented__option')
    expect(items[1].classes()).toContain('lh-segmented__option--checked')
    expect(items[1].attributes('aria-checked')).toBe('true')
    expect(items[0].attributes('aria-checked')).toBe('false')
  })
})
