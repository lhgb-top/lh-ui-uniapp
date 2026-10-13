import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { useLhMessage } from '@/message'
import { lhMessageRecords, closeAllLhMessages } from '@/message/store'
import LhMessage from '@/components/lh-message/lh-message.vue'
import { useLhLoading } from '@/loading'
import { lhLoadingInstances, closeAllLhLoading } from '@/loading/store'
import LhLoading from '@/components/lh-loading/lh-loading.vue'

/**
 * 命令式服务的「挂载点未放置」告警路径（R7 对策）与挂载点卸载清理。
 * store 是模块级单例，同一文件内的用例共享一份队列，
 * 故每个用例收尾都清空，避免前序用例的残留记录污染断言。
 */
afterEach(() => {
  closeAllLhMessages()
  closeAllLhLoading()
})
describe('挂载点未放置时的告警', () => {
  it('useLhMessage 告警且仍入队（不静默降级）', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    useLhMessage().info('你好')
    expect(error).toHaveBeenCalled()
    expect(String(error.mock.calls[0][0])).toContain('<lh-message />')
    expect(lhMessageRecords).toHaveLength(1)

    closeAllLhMessages()
    expect(lhMessageRecords).toHaveLength(0)
    error.mockRestore()
  })

  it('useLhLoading 告警且仍入队', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    useLhLoading().show('加载中')
    expect(error).toHaveBeenCalled()
    expect(String(error.mock.calls[0][0])).toContain('<lh-loading />')
    expect(lhLoadingInstances).toHaveLength(1)
    error.mockRestore()
  })
})

describe('放置挂载点后', () => {
  it('useLhMessage 不再告警', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount(LhMessage)
    useLhMessage().success('你好')
    expect(error).not.toHaveBeenCalled()
    expect(lhMessageRecords).toHaveLength(1)
    error.mockRestore()
  })

  it('useLhLoading 不再告警', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount(LhLoading)
    useLhLoading().show('加载中')
    expect(error).not.toHaveBeenCalled()
    expect(lhLoadingInstances).toHaveLength(1)
    error.mockRestore()
  })
})

describe('挂载点卸载时的清理', () => {
  it('摘除残留消息记录，避免切页后仍往新页面渲染', () => {
    const wrapper = mount(LhMessage)
    useLhMessage().info('你好')
    expect(lhMessageRecords).toHaveLength(1)

    wrapper.unmount()
    expect(lhMessageRecords).toHaveLength(0)
  })

  it('摘除残留加载遮罩', () => {
    const wrapper = mount(LhLoading)
    useLhLoading().show('加载中')
    expect(lhLoadingInstances).toHaveLength(1)

    wrapper.unmount()
    expect(lhLoadingInstances).toHaveLength(0)
  })
})
