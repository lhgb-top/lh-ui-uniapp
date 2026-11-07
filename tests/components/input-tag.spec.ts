import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhInputTag from '../../src/components/lh-input-tag/lh-input-tag.vue'

/** uni 的 input 事件载荷在 event.detail.value（H5 原生 input 事件没有 detail） */
async function typeValue(wrapper: ReturnType<typeof mount>, value: string) {
  await wrapper.find('.lh-input-tag__input').trigger('input', { detail: { value } })
}

describe('LhInputTag', () => {
  it('renders the base class and provided tags', () => {
    const wrapper = mount(LhInputTag, {
      props: { modelValue: ['水墨', '留白'] },
    })
    expect(wrapper.classes()).toContain('lh-input-tag')
    expect(wrapper.findAll('.lh-input-tag__tag')).toHaveLength(2)
    expect(wrapper.findAll('.lh-input-tag__tag-text')[0].text()).toBe('水墨')
  })

  it('defaults to an empty tag list', () => {
    expect(mount(LhInputTag).findAll('.lh-input-tag__tag')).toHaveLength(0)
  })

  it('emits modifiers for disabled and readonly', () => {
    expect(mount(LhInputTag, { props: { disabled: true } }).classes()).toContain(
      'lh-input-tag--disabled',
    )
    expect(mount(LhInputTag, { props: { readonly: true } }).classes()).toContain(
      'lh-input-tag--readonly',
    )
  })

  it('submits a tag on the Enter keydown (H5 trigger path)', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: [] } })
    await typeValue(wrapper, '新标签')
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['新标签']])
    expect(wrapper.emitted('add')?.[0]).toEqual(['新标签'])
    expect(wrapper.emitted('change')?.[0]).toEqual([['新标签']])
  })

  it('supports the comma trigger', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: [], trigger: 'comma' } })
    await typeValue(wrapper, '逗号标签')
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: ',' })
    expect(wrapper.emitted('add')?.[0]).toEqual(['逗号标签'])
  })

  it('submits on the confirm event (MP 完成键 path)', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: [] } })
    await typeValue(wrapper, '完成键标签')
    await wrapper.find('.lh-input-tag__input').trigger('confirm')
    expect(wrapper.emitted('add')?.[0]).toEqual(['完成键标签'])
  })

  it('submits the pending input on blur', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: [] } })
    await typeValue(wrapper, '失焦提交')
    await wrapper.find('.lh-input-tag__input').trigger('blur')
    expect(wrapper.emitted('add')?.[0]).toEqual(['失焦提交'])
  })

  it('ignores empty and whitespace-only submissions', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: [] } })
    await typeValue(wrapper, '   ')
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('rejects duplicates and clears the input', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: ['已有'] } })
    await typeValue(wrapper, '已有')
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeUndefined()
    // 重复提交时输入被清空（交由业务感知）
    expect(wrapper.find('.lh-input-tag__input').attributes('value')).toBe('')
  })

  it('enforces the max limit', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: ['一'], max: 1 } })
    await typeValue(wrapper, '二')
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('removes the last tag on Backspace when the input is empty (H5)', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: ['尾巴'] } })
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['尾巴'])
  })

  it('removes a tag from its close button', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: ['去', '留'] } })
    await wrapper.findAll('.lh-input-tag__tag-close')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['留']])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['去'])
  })

  it('hides the close buttons when readonly', () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: ['只读'], readonly: true } })
    expect(wrapper.find('.lh-input-tag__tag-close').exists()).toBe(false)
  })

  it('rejects typing and submissions when readonly', async () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: ['只读'], readonly: true } })
    await typeValue(wrapper, '新字')
    await wrapper.find('.lh-input-tag__input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('exposes focus / commit on the instance', () => {
    const wrapper = mount(LhInputTag, { props: { modelValue: [] } })
    expect(typeof (wrapper.vm as { focus: unknown }).focus).toBe('function')
    expect(typeof (wrapper.vm as { commit: unknown }).commit).toBe('function')
  })

  it('passes customClass through to root', () => {
    expect(
      mount(LhInputTag, { props: { customClass: 'my-input-tag' } }).classes(),
    ).toContain('my-input-tag')
  })
})
