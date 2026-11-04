import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import LhDrawer from '../../src/components/lh-drawer/lh-drawer.vue'
import { mount } from '../mount'

/** 打开后的抽屉根节点（teleport 已 stub，弹层内容在原位可断言） */
function findRoot(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.lh-drawer')
}

describe('LhDrawer', () => {
  it('renders nothing when closed', () => {
    const wrapper = mount(LhDrawer, { props: { modelValue: false, title: '详情' } })
    expect(findRoot(wrapper).exists()).toBe(false)
  })

  it('renders title / body / footer when open', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, title: '订单详情' },
      slots: {
        default: () => '主体内容',
        footer: () => '底部操作',
      },
    })
    expect(findRoot(wrapper).exists()).toBe(true)
    expect(wrapper.find('.lh-drawer__title').text()).toBe('订单详情')
    expect(wrapper.find('.lh-drawer__body').text()).toBe('主体内容')
    expect(wrapper.find('.lh-drawer__footer').text()).toBe('底部操作')
  })

  it('omits the header when no title and showClose is false', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, showClose: false },
      slots: { default: () => '内容' },
    })
    expect(wrapper.find('.lh-drawer__header').exists()).toBe(false)
  })

  it('keeps the header for the close button even without title', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, showClose: true },
      slots: { default: () => '内容' },
    })
    expect(wrapper.find('.lh-drawer__header').exists()).toBe(true)
    expect(wrapper.find('.lh-drawer__title').text()).toBe('')
  })

  it('renders the header slot instead of the title', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, title: '兜底标题' },
      slots: { header: () => '自定义头部', default: () => '内容' },
    })
    expect(wrapper.find('.lh-drawer__title').text()).toBe('自定义头部')
  })

  it('applies direction modifier and size to width for horizontal drawers', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, direction: 'right', size: '40%' },
      slots: { default: () => '内容' },
    })
    expect(wrapper.find('.lh-drawer__panel--right').exists()).toBe(true)
    expect(wrapper.find('.lh-drawer__panel').attributes('style')).toContain('width: 40%')
    expect(wrapper.find('.lh-drawer__panel').attributes('style') ?? '').not.toContain('height')
  })

  it('applies size to height for vertical drawers', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, direction: 'top', size: 200 },
      slots: { default: () => '内容' },
    })
    expect(wrapper.find('.lh-drawer__panel--top').exists()).toBe(true)
    // 数字尺寸归一化为 px（share 的 normalizeDrawerSize）
    expect(wrapper.find('.lh-drawer__panel').attributes('style')).toContain('height: 200px')
  })

  it('emits open and update:modelValue=true when modelValue turns true', async () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: false },
      slots: { default: () => '内容' },
    })
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(findRoot(wrapper).exists()).toBe(true)
    expect(wrapper.emitted('open')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('closes through the enter/leave transition classes on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDrawer, {
      props: { modelValue: false, maskClosable: true },
      slots: { default: () => '内容' },
    })

    // 进入动画：v-model 打开后先挂「起始态 + 动画态」，隔帧移除起始态
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(findRoot(wrapper).classes()).toContain('lh-drawer-fade-enter-from')
    expect(findRoot(wrapper).classes()).toContain('lh-drawer-fade-enter-active')
    await vi.runAllTimersAsync()
    expect(findRoot(wrapper).classes()).not.toContain('lh-drawer-fade-enter-from')
    expect(findRoot(wrapper).classes()).not.toContain('lh-drawer-fade-enter-active')

    // 离开动画：遮罩点击挂离开态类，setTimeout 对齐 SCSS transition 时长后再卸载
    await wrapper.find('.lh-drawer__mask').trigger('click')
    expect(findRoot(wrapper).classes()).toContain('lh-drawer-fade-leave-active')
    expect(findRoot(wrapper).classes()).toContain('lh-drawer-fade-leave-to')
    await vi.runAllTimersAsync()
    expect(findRoot(wrapper).exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('does not close on mask click when maskClosable is false', async () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, maskClosable: false },
      slots: { default: () => '内容' },
    })
    await wrapper.find('.lh-drawer__mask').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('closes via the close button and exposes open/close', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true },
      slots: { default: () => '内容' },
    })
    // defineExpose：isVisible 为显示状态（ref 经 expose 代理可能解包为裸值），open / close 为编程式开关
    const exposed = wrapper.vm as unknown as {
      isVisible: boolean | { value: boolean }
      open: () => void
      close: () => void
    }
    const isVisible =
      typeof exposed.isVisible === 'object' ? exposed.isVisible.value : exposed.isVisible
    expect(isVisible).toBe(true)

    await wrapper.find('.lh-drawer__close').trigger('click')
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('close')).toHaveLength(1)

    exposed.open()
    await nextTick()
    expect(findRoot(wrapper).exists()).toBe(true)
    exposed.close()
    await vi.runAllTimersAsync()
    expect(findRoot(wrapper).exists()).toBe(false)
    vi.useRealTimers()
  })

  it('closes on document Escape and respects closeOnEsc=false (H5 only)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, closeOnEsc: true },
      slots: { default: () => '内容' },
    })
    // Esc 走文档级监听（仅 H5；测试环境即 H5 语义）
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()

    const locked = mount(LhDrawer, {
      props: { modelValue: true, closeOnEsc: false },
      slots: { default: () => '内容' },
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await vi.runAllTimersAsync()
    expect(locked.emitted('close')).toBeUndefined()
    locked.unmount()
    vi.useRealTimers()
  })

  it('passes through customClass on the root node', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, customClass: 'my-drawer' },
      slots: { default: () => '内容' },
    })
    expect(findRoot(wrapper).classes()).toContain('my-drawer')
  })

  it('exposes dialog semantics via aria attributes', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, title: '详情' },
      slots: { default: () => '内容' },
    })
    const root = findRoot(wrapper)
    // 无障碍属性包由 share 的 getDrawerAria 产出、摊开绑定
    expect(root.attributes('role')).toBe('dialog')
    expect(root.attributes('aria-modal')).toBe('true')
    expect(root.attributes('aria-labelledby')).toBeTruthy()
    expect(root.attributes('aria-label')).toBeUndefined()
  })

  it('falls back to the locale drawer.title as aria-label when no title', () => {
    const wrapper = mount(LhDrawer, {
      props: { modelValue: true, showClose: false },
      slots: { default: () => '内容' },
    })
    expect(findRoot(wrapper).attributes('aria-label')).toBe('抽屉')
  })
})
