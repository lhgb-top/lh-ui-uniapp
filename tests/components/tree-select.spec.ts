import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTreeSelect from '../../src/components/lh-tree-select/lh-tree-select.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 展开 → 选中 / 勾选 → 关」的时序与事件流（computePosition / core 纯函数在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger / popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-tree-select-trigger')) {
      return { top: 200, left: 20, width: 220, height: 32, right: 240, bottom: 232 }
    }
    return { top: 232, left: 20, width: 220, height: 240, right: 240, bottom: 472 }
  },
}))

vi.mock('@/adapter/platform', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>
  return {
    ...original,
    getLhWindowInfo: () => ({ top: 0, left: 0, width: 375, height: 667, right: 375, bottom: 667 }),
  }
})

const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]

const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
    ],
  },
]

async function openPanel(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-tree-select__trigger').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

/** 在面板树里找 label 对应的节点（含其「展开箭头 / 勾选框」子节点） */
function findNode(wrapper: ReturnType<typeof mount>, label: string) {
  const node = wrapper.findAll('.lh-tree-node').find((el) =>
    el.find('.lh-tree-node__label').text().includes(label),
  )
  expect(node, `树面板没有「${label}」节点`).toBeTruthy()
  return node!
}

describe('LhTreeSelect', () => {
  it('renders the placeholder and hides the panel by default', () => {
    const wrapper = mount(LhTreeSelect, { props: { data } })
    expect(wrapper.find('.lh-tree-select__value').exists()).toBe(false)
    expect(wrapper.find('.lh-tree-select__placeholder').text()).toBe('请选择')
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(false)
  })

  it('opens on trigger click, renders root nodes and positions the panel', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data } })
    await openPanel(wrapper)

    const panel = wrapper.find('.lh-tree-select__panel')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('listbox')
    // 定位由 useLhPopper 异步两帧度量写入（fixed 定位）
    expect(panel.attributes('style')).toContain('position: fixed')
    // 只渲染根节点（未展开）
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(2)
    const arrow = wrapper.find('.lh-tree-select__arrow')
    expect(arrow.classes()).toContain('lh-tree-select__arrow--open')

    vi.useRealTimers()
  })

  it('expands children via the arrow without selecting, then selects a leaf on click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data } })
    await openPanel(wrapper)

    // 点「指南」的展开箭头：只展开不选中（click.stop 隔离节点点击）
    await findNode(wrapper, '指南').find('.lh-tree-node__arrow').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(4)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // 展开「设计指南」
    await findNode(wrapper, '设计指南').find('.lh-tree-node__arrow').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(6)

    // 点击叶子「颜色」选中（单选选中后自动关闭面板）
    await findNode(wrapper, '颜色').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yuansze'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['yuansze'])
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('selects a non-leaf node on click and closes (expandOnClickNode semantics)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data } })
    await openPanel(wrapper)

    await findNode(wrapper, '指南').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['zhinan'])
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('echoes the selected label from a preset value', () => {
    const wrapper = mount(LhTreeSelect, { props: { data, modelValue: 'yuansze' } })
    expect(wrapper.find('.lh-tree-select__value').text()).toBe('颜色')
  })

  it('checks nodes with parent-child cascade in multiple mode', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data, multiple: true } })
    await openPanel(wrapper)

    // 多选模式渲染勾选框；点节点标签只展开不勾选
    expect(wrapper.find('.lh-tree-node__checkbox').exists()).toBe(true)
    await findNode(wrapper, '组件').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(4)

    // 勾选「基础」
    await findNode(wrapper, '基础').find('.lh-tree-node__checkbox').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['jiben']])
    // （面板保持打开，多选不关闭）
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(true)

    // 勾选「组件」父节点 → 级联带上「基础」「反馈」全部后代（受控：先回写再操作）
    await wrapper.setProps({ modelValue: ['jiben'] })
    await findNode(wrapper, '组件').find('.lh-tree-node__checkbox').trigger('click')
    const last = wrapper.emitted('update:modelValue')?.[1] as string[][]
    expect(last[0].slice().sort()).toEqual(['fankui', 'jiben', 'zujian'])

    // 再点一次取消整棵子树（受控：回写级联结果后再取消）
    await wrapper.setProps({ modelValue: ['fankui', 'jiben', 'zujian'] })
    await findNode(wrapper, '组件').find('.lh-tree-node__checkbox').trigger('click')
    const cancelled = wrapper.emitted('update:modelValue')?.[2] as string[][]
    expect(cancelled[0]).toEqual([])

    vi.useRealTimers()
  })

  it('reflects a preset multi value in checkboxes and trigger text', async () => {
    const wrapper = mount(LhTreeSelect, {
      props: { data, multiple: true, modelValue: ['jiben', 'fankui'] },
    })
    // 触发器回显已选键的 label（「、」拼接，对齐 plus）
    expect(wrapper.find('.lh-tree-select__value').text()).toBe('基础、反馈')

    vi.useFakeTimers()
    await openPanel(wrapper)
    // 展开「组件」后，「基础」「反馈」的勾选态由 modelValue 受控驱动
    // （本端修正 plus 未把 checked-keys 传给内嵌树的预设值回显缺口）
    await findNode(wrapper, '组件').find('.lh-tree-node__arrow').trigger('click')
    await nextTick()
    expect(findNode(wrapper, '基础').find('.lh-tree-node__checkbox').classes()).toContain(
      'lh-tree-node__checkbox--checked',
    )
    // 全部后代勾选时父节点为全选态
    expect(findNode(wrapper, '组件').find('.lh-tree-node__checkbox').classes()).toContain(
      'lh-tree-node__checkbox--checked',
    )

    vi.useRealTimers()
  })

  it('skips disabled nodes but keeps the panel open', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data: disabledData } })
    await openPanel(wrapper)

    // 展开「指南」后「设计指南」被禁用，点击不选中
    await findNode(wrapper, '指南').find('.lh-tree-node__arrow').trigger('click')
    await nextTick()
    await findNode(wrapper, '设计指南').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(true)

    // 「设计规则」兄弟节点可用：注意本数据集没有设计规则，用「颜色」叶子验证可用路径
    await findNode(wrapper, '设计指南').find('.lh-tree-node__arrow').trigger('click')
    await nextTick()
    await findNode(wrapper, '颜色').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yuansze'])

    vi.useRealTimers()
  })

  it('never opens when the whole selector is disabled', async () => {
    const wrapper = mount(LhTreeSelect, { props: { data, disabled: true } })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(false)
    expect(wrapper.find('.lh-tree-select').classes()).toContain('lh-tree-select--disabled')
  })

  it('closes on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data } })
    await openPanel(wrapper)
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(true)

    await wrapper.find('.lh-tree-select__mask').trigger('click')
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('shows the locale empty text for an empty tree', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTreeSelect, { props: { data: [] } })
    await openPanel(wrapper)

    expect(wrapper.find('.lh-tree__empty').exists()).toBe(true)
    expect(wrapper.find('.lh-tree__empty').text()).toContain('暂无数据')

    vi.useRealTimers()
  })

  it('honors a custom placeholder', () => {
    const wrapper = mount(LhTreeSelect, {
      props: { data, placeholder: '自定义占位文案' },
    })
    expect(wrapper.find('.lh-tree-select__placeholder').text()).toBe('自定义占位文案')
  })
})
