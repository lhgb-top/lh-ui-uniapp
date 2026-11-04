import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhNotification from '../../src/components/lh-notification/lh-notification.vue'
import { useLhNotification, setLhNotificationMounted } from '@/notification'
import { lhNotificationRecords, closeAllLhNotifications, lhNotificationConfig } from '@/notification/store'

function resetStore() {
  closeAllLhNotifications()
  lhNotificationConfig.duration = 4500
  lhNotificationConfig.offset = 20
}

describe('LhNotification 挂载点组件', () => {
  it('renders records from the singleton store (title + content + type modifier)', async () => {
    resetStore()
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    notification.success({ title: '已保存', content: '文档已写入云端' })
    await nextTick()

    const items = wrapper.findAll('.lh-notification__item')
    expect(items).toHaveLength(1)
    expect(items[0].classes()).toContain('lh-notification__item--success')
    expect(items[0].find('.lh-notification__title').text()).toBe('已保存')
    expect(items[0].find('.lh-notification__content').text()).toBe('文档已写入云端')
    // 语义图标 + 默认显示关闭按钮（与 plus 同构）
    expect(items[0].find('.lh-notification__icon').exists()).toBe(true)
    expect(items[0].find('.lh-notification__close').exists()).toBe(true)

    wrapper.unmount()
  })

  it('defaults to top-right and groups records by position', async () => {
    resetStore()
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    notification.info({ title: '右上' })
    notification.warning({ title: '左下', position: 'bottom-left' })
    await nextTick()

    const containers = wrapper.findAll('.lh-notification')
    expect(containers).toHaveLength(2)
    expect(containers[0].classes()).toContain('lh-notification--top-right')
    expect(containers[1].classes()).toContain('lh-notification--bottom-left')

    const topRightItems = containers[0].findAll('.lh-notification__item')
    const bottomLeftItems = containers[1].findAll('.lh-notification__item')
    expect(topRightItems).toHaveLength(1)
    expect(bottomLeftItems).toHaveLength(1)

    wrapper.unmount()
  })

  it('applies config.offset to top containers as margin-top', async () => {
    resetStore()
    lhNotificationConfig.offset = 32
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    notification.info({ title: '偏移' })
    await nextTick()

    const container = wrapper.find('.lh-notification')
    expect(container.attributes('style')).toContain('margin-top: 32px')

    wrapper.unmount()
  })

  it('closes via the close button only (body click does not close)', async () => {
    resetStore()
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    notification.info({ title: '手动关' })
    await nextTick()

    const item = wrapper.find('.lh-notification__item')
    await item.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-notification__item')).toHaveLength(1)

    await item.find('.lh-notification__close').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-notification__item')).toHaveLength(0)

    wrapper.unmount()
  })

  it('hides the close button when showClose is false', async () => {
    resetStore()
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    notification.info({ title: '不可关', showClose: false })
    await nextTick()

    const item = wrapper.find('.lh-notification__item')
    expect(item.find('.lh-notification__close').exists()).toBe(false)

    wrapper.unmount()
  })

  it('emits onClick when the card is clicked and marks it clickable', async () => {
    resetStore()
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    const onClick = vi.fn()
    notification.info({ title: '点我', onClick })
    await nextTick()

    const item = wrapper.find('.lh-notification__item')
    expect(item.classes()).toContain('lh-notification__item--clickable')
    await item.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('honors duration=0 (no auto close) and auto-closes otherwise', async () => {
    resetStore()
    vi.useFakeTimers()
    const notification = useLhNotification()
    const wrapper = mount(LhNotification)

    notification.info({ title: '常驻', duration: 0 })
    await nextTick()
    expect(wrapper.findAll('.lh-notification__item')).toHaveLength(1)

    vi.advanceTimersByTime(10_000)
    await nextTick()
    expect(wrapper.findAll('.lh-notification__item')).toHaveLength(1)

    notification.info({ title: '自动关' })
    await nextTick()
    vi.advanceTimersByTime(4_500)
    await nextTick()
    expect(wrapper.findAll('.lh-notification__item')).toHaveLength(1)
    expect(lhNotificationRecords.map((r) => r.title)).toEqual(['常驻'])

    vi.useRealTimers()
    wrapper.unmount()
  })

  it('flips the mounted flag while mounted (dev-time warning depends on it)', () => {
    resetStore()
    const wrapper = mount(LhNotification)
    expect(() => {
      // 挂载点在位时，ensureMounted 不应报错（这里仅验证开关本身）
      setLhNotificationMounted(true)
    }).not.toThrow()
    wrapper.unmount()
    setLhNotificationMounted(false)
  })
})
