import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhCascader from '../../src/components/lh-cascader/lh-cascader.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 展开列 → 选中 → 关」的时序与事件流（computePosition / core 纯函数在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger / popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-cascader-trigger')) {
      return { top: 200, left: 20, width: 220, height: 32, right: 240, bottom: 232 }
    }
    return { top: 232, left: 20, width: 380, height: 200, right: 400, bottom: 432 }
  },
}))

vi.mock('@/adapter/platform', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>
  return {
    ...original,
    getLhWindowInfo: () => ({ top: 0, left: 0, width: 375, height: 667, right: 375, bottom: 667 }),
  }
})

const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]

const cityOptions = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
    ],
  },
]

const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈', disabled: true },
    ],
  },
]

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-cascader').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

/** 在 panelIndex 列中找 label 对应的列项并点击 */
async function clickItem(wrapper: ReturnType<typeof mount>, panelIndex: number, label: string) {
  const columns = wrapper.findAll('.lh-cascader-panel__column')
  const item = columns[panelIndex].findAll('.lh-cascader-panel__item').find((el) =>
    el.find('.lh-cascader-panel__item-label').text().includes(label),
  )
  expect(item, `第 ${panelIndex} 列没有「${label}」项`).toBeTruthy()
  await item!.trigger('click')
  await nextTick()
}

describe('LhCascader', () => {
  it('renders the placeholder and hides the panel by default', () => {
    const wrapper = mount(LhCascader, { props: { options } })
    expect(wrapper.find('.lh-cascader').text()).toContain('请选择')
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(false)
    // 占位符取语言包 cascader.placeholder（修饰类在 SFC 内联样式块补色）
    expect(wrapper.find('.lh-cascader__input-inner--placeholder').exists()).toBe(true)
  })

  it('opens on click, renders the first column and positions the panel', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options } })
    await openPopper(wrapper)

    const panel = wrapper.find('.lh-cascader-panel')
    expect(panel.exists()).toBe(true)
    // 第一列是顶层选项；含子级的项带展开箭头图标
    const firstItems = panel.findAll('.lh-cascader-panel__column')[0].findAll('.lh-cascader-panel__item')
    expect(firstItems).toHaveLength(2)
    expect(firstItems[0].find('.lh-cascader-panel__item-label').text()).toBe('指南')
    // 定位由 useLhPopper 异步两帧度量写入（fixed 定位）
    expect(panel.attributes('style')).toContain('position: fixed')
    expect(panel.attributes('role')).toBe('dialog')
    // 触发器 aria 属性包由 share 纯函数产出，摊开绑定
    expect(wrapper.find('.lh-cascader').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-cascader').attributes('aria-haspopup')).toBe('listbox')
    expect(wrapper.find('.lh-cascader').attributes('aria-controls')).toBeTruthy()

    vi.useRealTimers()
  })

  it('expands the child column and selects a leaf, emitting the full path', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options } })
    await openPopper(wrapper)

    // 点击「组件」展开第二列（首次点击只展开）
    await clickItem(wrapper, 0, '组件')
    expect(wrapper.findAll('.lh-cascader-panel__column')).toHaveLength(2)
    // 展开链上的项带 active 修饰类（share scss 的选中态底色来源）
    expect(
      wrapper.findAll('.lh-cascader-panel__column')[1].findAll('.lh-cascader-panel__item'),
    ).toHaveLength(2)

    // 点击叶节点「基础」选中
    await clickItem(wrapper, 1, '基础')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zujian', 'jiben']])
    const change = wrapper.emitted('change')?.[0] as [(string | number)[], unknown[]]
    expect(change[0]).toEqual(['zujian', 'jiben'])
    // change 的第二参数是完整节点路径（share 的 findPathByValues 产出）
    expect((change[1] as { value: string }[]).map((n) => n.value)).toEqual(['zujian', 'jiben'])
    // 单选选中叶节点后关闭面板
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('echoes the selected path joined by the separator', async () => {
    const wrapper = mount(LhCascader, {
      props: { options, modelValue: ['zhinan', 'sheji', 'yuansze'] },
    })
    expect(wrapper.find('.lh-cascader__input-inner').text()).toBe('指南/设计指南/颜色')

    await wrapper.setProps({ showAllLevels: false })
    expect(wrapper.find('.lh-cascader__input-inner').text()).toBe('颜色')

    await wrapper.setProps({ separator: ' > ', showAllLevels: true })
    expect(wrapper.find('.lh-cascader__input-inner').text()).toBe('指南 > 设计指南 > 颜色')
  })

  it('echoes the full path when emitPath is false (bound value is the leaf only)', async () => {
    const wrapper = mount(LhCascader, {
      props: { options, emitPath: false, modelValue: ['yuansze'] },
    })
    // 输入框仍回显完整路径，v-model 只绑定末级值
    expect(wrapper.find('.lh-cascader__input-inner').text()).toBe('指南/设计指南/颜色')
  })

  it('supports multiple selection with tags and last-level values', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options, multiple: true } })
    await openPopper(wrapper)

    await clickItem(wrapper, 0, '组件')
    await clickItem(wrapper, 1, '基础')
    // 多选不关闭面板
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(true)
    await clickItem(wrapper, 1, '反馈')

    // 已选标签渲染
    expect(wrapper.find('.lh-cascader__tags').exists()).toBe(true)
    expect(wrapper.findAll('.lh-cascader__tag')).toHaveLength(2)
    // v-model 绑定各选中路径的末级值
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['jiben', 'fankui']])

    // 受控清空同步内部态
    await wrapper.setProps({ modelValue: [] })
    expect(wrapper.findAll('.lh-cascader__tag')).toHaveLength(0)

    vi.useRealTimers()
  })

  it('collapses tags when collapseTags is set', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, {
      props: { options: cityOptions, multiple: true, collapseTags: true },
    })
    await openPopper(wrapper)

    await clickItem(wrapper, 0, '浙江省')
    await clickItem(wrapper, 1, '杭州市')
    await clickItem(wrapper, 2, '西湖区')
    await clickItem(wrapper, 2, '滨江区')

    // 折叠标签只显示首个 + 计数
    expect(wrapper.findAll('.lh-cascader__tag')).toHaveLength(1)
    expect(wrapper.find('.lh-cascader__tag-more').text()).toBe('+1')

    vi.useRealTimers()
  })

  it('clears the value when clearable', async () => {
    const wrapper = mount(LhCascader, {
      props: { options, modelValue: ['zhinan', 'shejiguize'] },
    })
    expect(wrapper.find('.lh-cascader__clear').exists()).toBe(true)

    await wrapper.find('.lh-cascader__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect((wrapper.emitted('change')?.[0] as unknown[])[0]).toEqual([])
    // 纯受控：显示文本跟随 props，父组件回写后才回到占位态
    await wrapper.setProps({ modelValue: [] })
    expect(wrapper.find('.lh-cascader__input-inner').text()).toBe('请选择')
  })

  it('never opens when disabled or readonly', async () => {
    const disabled = mount(LhCascader, { props: { options, disabled: true } })
    await disabled.find('.lh-cascader').trigger('click')
    await nextTick()
    expect(disabled.find('.lh-cascader-panel').exists()).toBe(false)
    expect(disabled.find('.lh-cascader').classes()).toContain('lh-cascader--disabled')

    const readonly = mount(LhCascader, { props: { options, readonly: true } })
    await readonly.find('.lh-cascader').trigger('click')
    await nextTick()
    expect(readonly.find('.lh-cascader-panel').exists()).toBe(false)
  })

  it('skips disabled nodes when clicking but echoes programmatic values', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options: disabledOptions } })
    await openPopper(wrapper)

    // 顶层「指南」节点被禁用，点击不展开
    await clickItem(wrapper, 0, '指南')
    expect(wrapper.findAll('.lh-cascader-panel__column')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // 子级「反馈」被禁用
    await clickItem(wrapper, 0, '组件')
    await clickItem(wrapper, 1, '反馈')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 禁用项带修饰类
    const second = wrapper.findAll('.lh-cascader-panel__column')[1].findAll('.lh-cascader-panel__item')
    expect(second[1].classes()).toContain('lh-cascader-panel__item--disabled')

    vi.useRealTimers()
  })

  it('closes on mask click without emitting change', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(true)

    await wrapper.find('.lh-cascader__mask').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(false)
    // 点击遮罩只关闭，不发 change（对齐 plus 的点击外部关闭）
    expect(wrapper.emitted('change')).toBeUndefined()

    vi.useRealTimers()
  })

  it('filters options by keyword with full path labels (filterable)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options, filterable: true } })
    await openPopper(wrapper)

    // 过滤输入框在弹层内（MP 无触发器内 input 聚焦语义）
    expect(wrapper.find('.lh-cascader__filter').exists()).toBe(true)
    const filterInput = wrapper.find('.lh-cascader__filter').find('.lh-input__inner')
    // uni 的 input 事件载荷在 event.detail.value，不能用 setValue
    await filterInput.trigger('input', { detail: { value: '颜色' } })
    await nextTick()

    // 搜索面板替代级联列，结果按完整路径展示
    expect(wrapper.findAll('.lh-cascader-panel__column')).toHaveLength(0)
    const results = wrapper.findAll('.lh-cascader-panel__search-item')
    expect(results).toHaveLength(1)
    expect(results[0].text()).toContain('指南')
    expect(results[0].text()).toContain('设计指南')
    expect(results[0].text()).toContain('颜色')

    // 点击搜索结果直接选中完整路径
    await results[0].trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zhinan', 'sheji', 'yuansze']])

    vi.useRealTimers()
  })

  it('shows the no-match state when nothing matches', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options, filterable: true } })
    await openPopper(wrapper)

    await wrapper.find('.lh-cascader__filter').find('.lh-input__inner').trigger('input', {
      detail: { value: '不存在' },
    })
    await nextTick()

    expect(wrapper.find('.lh-cascader-panel__empty').exists()).toBe(true)
    // 空态文案取语言包 cascader.noMatch
    expect(wrapper.find('.lh-cascader-panel__empty').text()).toBe('无匹配数据')

    vi.useRealTimers()
  })

  it('resolves node fields via itemConfig aliases', async () => {
    vi.useFakeTimers()
    const aliased = [
      {
        id: 'zhejiang',
        name: '浙江省',
        sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
      },
    ]
    const wrapper = mount(LhCascader, {
      props: {
        options: aliased as unknown as (typeof options)[number][],
        itemConfig: { value: 'id', label: 'name', children: 'sub' },
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
      },
    })
    // 别名结构经 normalizeCascaderNodes 归一化后路径回显正常
    expect(wrapper.find('.lh-cascader__input-inner').text()).toBe('浙江省/杭州市/西湖区')

    vi.useRealTimers()
  })

  it('closes on Escape via the document-level listener (H5 only)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()

    vi.useRealTimers()
  })

  it('toggles on repeated clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhCascader, { props: { options } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(true)

    await wrapper.find('.lh-cascader').trigger('click')
    expect(wrapper.find('.lh-cascader-panel').exists()).toBe(false)

    vi.useRealTimers()
  })
})
