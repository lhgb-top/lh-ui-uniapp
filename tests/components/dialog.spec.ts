import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { h, nextTick } from 'vue'
import LhDialog from '../../src/components/lh-dialog/lh-dialog.vue'

describe('LhDialog', () => {
  it('renders nothing when closed', () => {
    const wrapper = mount(LhDialog, { props: { modelValue: false, title: '提示' } })
    expect(wrapper.find('.lh-dialog').exists()).toBe(false)
  })

  it('renders title / body / footer when open', () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, title: '提示' },
      slots: {
        default: () => '正文内容',
        footer: () => '底栏',
      },
    })
    expect(wrapper.find('.lh-dialog').exists()).toBe(true)
    expect(wrapper.find('.lh-dialog__title').text()).toBe('提示')
    expect(wrapper.find('.lh-dialog__body').text()).toBe('正文内容')
    expect(wrapper.find('.lh-dialog__footer').text()).toBe('底栏')
  })

  it('omits the header when no title slot is given', () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true },
      slots: { default: () => '正文' },
    })
    expect(wrapper.find('.lh-dialog__header').exists()).toBe(false)
  })

  it('emits update:modelValue=false and close on mask click when closeOnClickModal', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, closeOnClickModal: true },
      slots: { default: () => '正文' },
    })
    await wrapper.find('.lh-dialog__wrapper').trigger('click')
    // 关闭动画用 setTimeout 对齐 SCSS transition 时长（MP 端 transitionend 不可靠）
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('does not close on mask click when closeOnClickModal is false', async () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, closeOnClickModal: false },
      slots: { default: () => '正文' },
    })
    await wrapper.find('.lh-dialog__wrapper').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('does not close when clicking the dialog body', async () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, closeOnClickModal: true },
      slots: { default: () => '正文' },
    })
    await wrapper.find('.lh-dialog').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('exposes the close method to the footer slot', async () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true },
      slots: {
        default: () => '正文',
        footer: ({ close }: { close: () => void }) =>
          h('view', { class: 'my-footer' }, `close 类型：${typeof close}`),
      },
    })
    const footer = wrapper.find('.my-footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('function')
  })

  it('adds the bottom safe-area class for bottom position', async () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, position: 'center' },
      slots: { default: () => '正文' },
    })
    expect(wrapper.find('.lh-dialog--bottom-safe').exists()).toBe(false)

    await wrapper.setProps({ position: 'bottom' })
    await nextTick()
    expect(wrapper.find('.lh-dialog--bottom-safe').exists()).toBe(true)
  })

  it('applies fullscreen class', () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, fullscreen: true },
      slots: { default: () => '正文' },
    })
    expect(wrapper.find('.lh-dialog--fullscreen').exists()).toBe(true)
  })

  it('applies the width prop to the dialog body', () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, width: '80%' },
      slots: { default: () => '正文' },
    })
    expect(wrapper.find('.lh-dialog').attributes('style')).toContain('width: 80%')
  })

  it('omits the width style when fullscreen takes precedence', () => {
    const wrapper = mount(LhDialog, {
      props: { modelValue: true, width: '80%', fullscreen: true },
      slots: { default: () => '正文' },
    })
    expect(wrapper.find('.lh-dialog').attributes('style') ?? '').not.toContain('width')
  })
})
