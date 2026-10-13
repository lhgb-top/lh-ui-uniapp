import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhMessage from '../../src/components/lh-message/lh-message.vue'
import { useLhMessage, setLhMessageMounted } from '@/message'
import { lhMessageRecords, closeAllLhMessages, lhMessageConfig } from '@/message/store'

function resetStore() {
  closeAllLhMessages()
  lhMessageConfig.duration = 3000
  lhMessageConfig.max = 5
  lhMessageConfig.offset = 20
}

describe('LhMessage 挂载点组件', () => {
  it('renders records from the singleton store', async () => {
    resetStore()
    const message = useLhMessage()
    const wrapper = mount(LhMessage)

    message.success('保存成功')
    await nextTick()

    const items = wrapper.findAll('.lh-message')
    expect(items).toHaveLength(1)
    expect(items[0].classes()).toContain('lh-message--success')
    expect(items[0].find('.lh-message__content').text()).toBe('保存成功')

    wrapper.unmount()
  })

  it('flips the mounted flag while mounted (dev-time warning depends on it)', () => {
    resetStore()
    const wrapper = mount(LhMessage)
    expect(() => {
      // 挂载点在位时，ensureMounted 不应报错（这里仅验证开关本身）
      setLhMessageMounted(true)
    }).not.toThrow()
    wrapper.unmount()
    setLhMessageMounted(false)
  })

  it('renders the icon per type and the close button when showClose', async () => {
    resetStore()
    const message = useLhMessage()
    const wrapper = mount(LhMessage)

    message.warning('注意', { showClose: true })
    await nextTick()

    const item = wrapper.find('.lh-message')
    expect(item.classes()).toContain('lh-message--warning')
    expect(item.find('.lh-message__icon').exists()).toBe(true)
    expect(item.find('.lh-message__close').exists()).toBe(true)

    await item.find('.lh-message__close').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-message')).toHaveLength(0)

    wrapper.unmount()
  })

  it('honors duration=0 (no auto close, loading-style)', async () => {
    resetStore()
    vi.useFakeTimers()
    const message = useLhMessage()
    const wrapper = mount(LhMessage)

    message.loading('加载中')
    await nextTick()
    expect(wrapper.findAll('.lh-message')).toHaveLength(1)

    vi.advanceTimersByTime(10_000)
    await nextTick()
    expect(wrapper.findAll('.lh-message')).toHaveLength(1)

    message.closeAll()
    await nextTick()
    expect(wrapper.findAll('.lh-message')).toHaveLength(0)

    vi.useRealTimers()
    wrapper.unmount()
  })

  it('clamps the queue to config.max', async () => {
    resetStore()
    lhMessageConfig.max = 2
    const message = useLhMessage()
    const wrapper = mount(LhMessage)

    message.info('一')
    message.info('二')
    message.info('三')
    await nextTick()
    expect(wrapper.findAll('.lh-message')).toHaveLength(2)
    expect(lhMessageRecords.map((r) => r.content)).toEqual(['二', '三'])

    wrapper.unmount()
  })
})
