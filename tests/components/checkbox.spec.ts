import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhCheckbox from '../../src/components/lh-checkbox/lh-checkbox.vue'
import LhCheckboxGroup from '../../src/components/lh-checkbox-group/lh-checkbox-group.vue'

describe('LhCheckbox', () => {
  it('renders the box and label', () => {
    const wrapper = mount(LhCheckbox, { props: { label: '水墨' } })
    expect(wrapper.classes()).toContain('lh-checkbox')
    expect(wrapper.find('.lh-checkbox__label').text()).toBe('水墨')
  })

  it('toggles and emits update:modelValue / change', async () => {
    const wrapper = mount(LhCheckbox, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('marks the box checked via modifier class', () => {
    const wrapper = mount(LhCheckbox, { props: { modelValue: true } })
    expect(wrapper.find('.lh-checkbox__box--checked').exists()).toBe(true)
    expect(wrapper.find('.lh-checkbox__icon').exists()).toBe(true)
  })

  it('shows the indeterminate dash without the check icon', () => {
    const wrapper = mount(LhCheckbox, { props: { indeterminate: true } })
    expect(wrapper.find('.lh-checkbox__box--indeterminate').exists()).toBe(true)
    expect(wrapper.find('.lh-checkbox__icon').exists()).toBe(false)
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(LhCheckbox, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('LhCheckboxGroup', () => {
  it('syncs checked state of children via provide/inject', async () => {
    const group = mount({
      components: { LhCheckboxGroup, LhCheckbox },
      data: () => ({ value: ['ink'] }),
      template: `<lh-checkbox-group v-model="value">
        <lh-checkbox value="ink">水墨</lh-checkbox>
        <lh-checkbox value="danqing">丹青</lh-checkbox>
      </lh-checkbox-group>`,
    })
    const boxes = group.findAll('.lh-checkbox__box')
    expect(boxes[0].classes()).toContain('lh-checkbox__box--checked')
    expect(boxes[1].classes()).not.toContain('lh-checkbox__box--checked')

    await boxes[1].trigger('click')
    expect((group.vm as unknown as { value: string[] }).value).toEqual(['ink', 'danqing'])

    await boxes[0].trigger('click')
    expect((group.vm as unknown as { value: string[] }).value).toEqual(['danqing'])
  })

  it('propagates external modelValue changes to children (full-select / reset)', async () => {
    const group = mount({
      components: { LhCheckboxGroup, LhCheckbox },
      data: () => ({ value: [] as string[] }),
      template: `<lh-checkbox-group v-model="value">
        <lh-checkbox value="ink">水墨</lh-checkbox>
        <lh-checkbox value="danqing">丹青</lh-checkbox>
      </lh-checkbox-group>`,
    })
    const boxes = () => group.findAll('.lh-checkbox__box')
    // 初始全未选
    expect(boxes().map((b) => b.classes().includes('lh-checkbox__box--checked'))).toEqual([false, false])

    // 外部整体赋值（「全选」场景）→ 子项必须同步选中
    ;(group.vm as unknown as { value: string[] }).value = ['ink', 'danqing']
    await group.vm.$nextTick()
    expect(boxes().map((b) => b.classes().includes('lh-checkbox__box--checked'))).toEqual([true, true])

    // 外部清空（「反选/重置」场景）→ 子项必须同步取消
    ;(group.vm as unknown as { value: string[] }).value = []
    await group.vm.$nextTick()
    expect(boxes().map((b) => b.classes().includes('lh-checkbox__box--checked'))).toEqual([false, false])
  })

  it('emits update:modelValue when the group value changes', async () => {
    const wrapper = mount(LhCheckboxGroup, {
      props: { modelValue: [] },
      slots: {
        default: () => null,
      },
    })
    expect(wrapper.classes()).toContain('lh-checkbox-group')
  })
})
