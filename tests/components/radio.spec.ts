import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhRadio from '../../src/components/lh-radio/lh-radio.vue'
import LhRadioGroup from '../../src/components/lh-radio-group/lh-radio-group.vue'

describe('LhRadio', () => {
  it('renders the box and label', () => {
    const wrapper = mount(LhRadio, { props: { label: '水墨' } })
    expect(wrapper.classes()).toContain('lh-radio')
    expect(wrapper.find('.lh-radio__label').text()).toBe('水墨')
  })

  it('emits update:modelValue / change when selected', async () => {
    const wrapper = mount(LhRadio, { props: { modelValue: '', value: 'ink' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ink'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['ink'])
  })

  it('shows the dot only when checked', () => {
    const on = mount(LhRadio, { props: { modelValue: 'ink', value: 'ink' } })
    expect(on.find('.lh-radio__box--checked').exists()).toBe(true)
    expect(on.find('.lh-radio__dot').exists()).toBe(true)

    const off = mount(LhRadio, { props: { modelValue: 'other', value: 'ink' } })
    expect(off.find('.lh-radio__dot').exists()).toBe(false)
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(LhRadio, { props: { disabled: true, value: 'ink' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('LhRadioGroup', () => {
  it('syncs selected child via provide/inject and keeps exclusivity', async () => {
    const group = mount({
      components: { LhRadioGroup, LhRadio },
      data: () => ({ value: 'ink' }),
      template: `<lh-radio-group v-model="value">
        <lh-radio value="ink">水墨</lh-radio>
        <lh-radio value="danqing">丹青</lh-radio>
      </lh-radio-group>`,
    })
    const dots = group.findAll('.lh-radio__box')
    expect(dots[0].classes()).toContain('lh-radio__box--checked')
    expect(dots[1].classes()).not.toContain('lh-radio__box--checked')

    await dots[1].trigger('click')
    expect((group.vm as unknown as { value: string }).value).toBe('danqing')
    expect(dots[0].classes()).not.toContain('lh-radio__box--checked')
  })

  it('propagates external modelValue changes to children (reset / switch step)', async () => {
    const group = mount({
      components: { LhRadioGroup, LhRadio },
      data: () => ({ value: '' }),
      template: `<lh-radio-group v-model="value">
        <lh-radio value="ink">水墨</lh-radio>
        <lh-radio value="danqing">丹青</lh-radio>
      </lh-radio-group>`,
    })
    const dots = () => group.findAll('.lh-radio__box')
    expect(dots().map((d) => d.classes().includes('lh-radio__box--checked'))).toEqual([false, false])

    // 外部改选「丹青」→ 子项必须同步，且保持互斥
    ;(group.vm as unknown as { value: string }).value = 'danqing'
    await group.vm.$nextTick()
    expect(dots().map((d) => d.classes().includes('lh-radio__box--checked'))).toEqual([false, true])

    // 外部清空 → 全部取消
    ;(group.vm as unknown as { value: string }).value = ''
    await group.vm.$nextTick()
    expect(dots().map((d) => d.classes().includes('lh-radio__box--checked'))).toEqual([false, false])
  })
})
