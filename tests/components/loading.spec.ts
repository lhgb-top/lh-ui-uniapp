import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhLoading from '../../src/components/lh-loading/lh-loading.vue'
import { useLhLoading } from '@/loading'
import { lhLoadingInstances, closeAllLhLoading } from '@/loading/store'

describe('LhLoading 挂载点组件', () => {
  it('renders nothing when there are no instances', () => {
    closeAllLhLoading()
    const wrapper = mount(LhLoading)
    expect(wrapper.findAll('.lh-loading')).toHaveLength(0)
    wrapper.unmount()
  })

  it('renders a fullscreen mask with text via the service', async () => {
    closeAllLhLoading()
    const loading = useLhLoading()
    const wrapper = mount(LhLoading)

    const handle = loading.show({ text: '加载中…' })
    await nextTick()

    const masks = wrapper.findAll('.lh-loading')
    expect(masks).toHaveLength(1)
    expect(masks[0].find('.lh-loading__text').text()).toBe('加载中…')
    expect(masks[0].find('.lh-loading__icon').exists()).toBe(true)

    handle.close()
    await nextTick()
    expect(wrapper.findAll('.lh-loading')).toHaveLength(0)

    wrapper.unmount()
  })

  it('renders multiple masks stacked by open order', async () => {
    closeAllLhLoading()
    const loading = useLhLoading()
    const wrapper = mount(LhLoading)

    const a = loading.show({ text: '一' })
    const b = loading.show({ text: '二' })
    await nextTick()

    expect(wrapper.findAll('.lh-loading__text').map((n) => n.text())).toEqual(['一', '二'])
    expect(lhLoadingInstances).toHaveLength(2)

    a.close()
    await nextTick()
    expect(wrapper.findAll('.lh-loading__text').map((n) => n.text())).toEqual(['二'])

    b.close()
    await nextTick()
    expect(lhLoadingInstances).toHaveLength(0)

    wrapper.unmount()
  })

  it('closeAll removes every instance', async () => {
    closeAllLhLoading()
    const loading = useLhLoading()
    const wrapper = mount(LhLoading)

    loading.show()
    loading.show()
    await nextTick()
    expect(wrapper.findAll('.lh-loading')).toHaveLength(2)

    loading.closeAll()
    await nextTick()
    expect(wrapper.findAll('.lh-loading')).toHaveLength(0)

    wrapper.unmount()
  })
})
