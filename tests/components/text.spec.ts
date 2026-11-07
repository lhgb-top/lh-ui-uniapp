import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import LhText from '../../src/components/lh-text/lh-text.vue'

describe('LhText', () => {
  it('renders the level modifier on the root', () => {
    const wrapper = mount(LhText, { props: { level: 'h2' } })
    expect(wrapper.classes()).toContain('lh-text')
    expect(wrapper.classes()).toContain('lh-text--h2')
  })

  it('defaults to the p level', () => {
    expect(mount(LhText, { slots: { default: '正文' } }).classes()).toContain('lh-text--p')
  })

  it('emits semantic and boolean modifiers', () => {
    const wrapper = mount(LhText, {
      props: { type: 'success', strong: true, mark: true, disabled: true },
    })
    expect(wrapper.classes()).toContain('lh-text--success')
    expect(wrapper.classes()).toContain('lh-text--strong')
    expect(wrapper.classes()).toContain('lh-text--mark')
    expect(wrapper.classes()).toContain('lh-text--disabled')
  })

  it('applies the multi-row ellipsis inline style', () => {
    const style = mount(LhText, { props: { ellipsis: 2 } }).attributes('style') ?? ''
    expect(style).toContain('-webkit-line-clamp: 2')
    expect(style).toContain('overflow: hidden')
  })

  it('renders slot content inside the content node', () => {
    const wrapper = mount(LhText, { slots: { default: '一段正文' } })
    expect(wrapper.find('.lh-text__content').text()).toBe('一段正文')
  })

  it('copies the slot text on H5 and emits copy', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mount(LhText, {
      props: { copyable: true },
      slots: { default: '可复制的正文' },
    })
    await wrapper.find('.lh-text__copy').trigger('click')
    expect(writeText).toHaveBeenCalledWith('可复制的正文')
    expect(wrapper.emitted('copy')?.[0]).toEqual(['可复制的正文'])
    expect(wrapper.find('.lh-text__copy').classes()).toContain('lh-text__copy--copied')
    vi.unstubAllGlobals()
  })

  it('prefers the copyText prop over slot text', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mount(LhText, {
      props: { copyable: true, copyText: '固定文本' },
      slots: { default: '插槽文本' },
    })
    await wrapper.find('.lh-text__copy').trigger('click')
    expect(writeText).toHaveBeenCalledWith('固定文本')
    vi.unstubAllGlobals()
  })

  it('hides the copy button when disabled', () => {
    const wrapper = mount(LhText, {
      props: { copyable: true, disabled: true },
      slots: { default: '正文' },
    })
    expect(wrapper.find('.lh-text__copy').exists()).toBe(false)
  })

  it('passes customClass through to root', () => {
    expect(mount(LhText, { props: { customClass: 'my-text' } }).classes()).toContain('my-text')
  })
})
