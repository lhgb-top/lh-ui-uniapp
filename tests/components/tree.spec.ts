import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTree from '../../src/components/lh-tree/lh-tree.vue'

/** scroll-view 的 scroll 事件载荷在 event.detail.scrollTop；VTU trigger 创建的是 UIEvent
 * （detail 只读且恒 0），只能像 pagination 的 jumper 一样直接在 DOM 上派发 CustomEvent */
function dispatchUniScroll(element: Element, scrollTop: number) {
  element.dispatchEvent(new CustomEvent('scroll', { detail: { scrollTop } }))
}
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: '前端',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: '后端', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: '运维', disabled: true },
]

/** 层级缩进 = level * 18 + 8（px） */
function indentOf(wrapper: ReturnType<typeof mount>, key: string): string {
  const node = wrapper.find(`[data-tree-key="${key}"]`)
  return node.attributes('style') ?? ''
}

/** 点击某键对应的整行 */
async function clickRow(wrapper: ReturnType<typeof mount>, key: string) {
  await wrapper.find(`[data-tree-key="${key}"]`).trigger('click')
  await nextTick()
}

/** 点击某键的展开箭头 */
async function clickArrow(wrapper: ReturnType<typeof mount>, key: string) {
  const arrow = wrapper.find(`[data-tree-key="${key}"] .lh-tree-node__arrow`)
  await arrow.trigger('click')
  await nextTick()
}

/** 键盘事件委托到根节点（与 H5 端事件委托一致） */
async function keydown(wrapper: ReturnType<typeof mount>, key: string) {
  await wrapper.find('.lh-tree').trigger('keydown', { key })
  await nextTick()
}

describe('LhTree', () => {
  it('renders the tree with expanded children and level indentation', () => {
    const wrapper = mount(LhTree, { props: { data: treeData, defaultExpandedKeys: ['a'] } })
    const root = wrapper.find('.lh-tree')
    expect(root.attributes('role')).toBe('tree')
    // aria-multiselectable 仅在 showCheckbox 时输出
    expect(root.attributes('aria-multiselectable')).toBeUndefined()

    // 展开态决定扁平化：a 的子节点可见，b 的子节点不可见
    expect(wrapper.findAll('.lh-tree-node')).toHaveLength(5)
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(false)

    // 层级缩进：根 8px，二级 26px
    expect(indentOf(wrapper, 'a')).toContain('padding-left: 8px')
    expect(indentOf(wrapper, 'a-1')).toContain('padding-left: 26px')

    // 语义：树项层级、展开态、选中态、禁用态
    const a = wrapper.find('[data-tree-key="a"]')
    expect(a.attributes('aria-level')).toBe('1')
    expect(a.attributes('aria-expanded')).toBe('true')
    expect(a.attributes('aria-selected')).toBe('false')
    expect(wrapper.find('[data-tree-key="b"]').attributes('aria-expanded')).toBe('false')
    // 叶子节点不输出 aria-expanded
    expect(wrapper.find('[data-tree-key="a-1"]').attributes('aria-expanded')).toBeUndefined()
    expect(wrapper.find('[data-tree-key="c"]').attributes('aria-disabled')).toBe('true')
  })

  it('toggles expand on the arrow click and emits update:expandedKeys / expand', async () => {
    const wrapper = mount(LhTree, { props: { data: treeData } })
    await clickArrow(wrapper, 'b')
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(true)
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['b']])
    expect(wrapper.emitted('expand')?.[0]).toEqual(['b', true])

    await clickArrow(wrapper, 'b')
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(false)
    expect(wrapper.emitted('update:expandedKeys')?.[1]).toEqual([[]])
    expect(wrapper.emitted('expand')?.[1]).toEqual(['b', false])
  })

  it('selects a node on row click and expands non-leaf (expandOnClickNode default)', async () => {
    const wrapper = mount(LhTree, { props: { data: treeData } })
    await clickRow(wrapper, 'b')
    // 点击整行既选中也展开（expandOnClickNode 默认 true）
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['b']])
    const select = wrapper.emitted('select')?.[0] as [string, LhTreeNode]
    expect(select[0]).toBe('b')
    expect(select[1].label).toBe('后端')
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(true)

    // 多选模式下点击切换选中而非替换
    const multi = mount(LhTree, { props: { data: treeData, multiple: true } })
    await clickRow(multi, 'b')
    await clickRow(multi, 'a')
    expect(multi.emitted('update:selectedKeys')?.[1]).toEqual([['b', 'a']])
  })

  it('does not expand on row click when expandOnClickNode is false', async () => {
    const wrapper = mount(LhTree, { props: { data: treeData, expandOnClickNode: false } })
    await clickRow(wrapper, 'b')
    expect(wrapper.emitted('select')).toBeTruthy()
    // 箭头仍然可以展开
    await clickArrow(wrapper, 'b')
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(true)
  })

  it('skips disabled nodes and a disabled tree', async () => {
    const wrapper = mount(LhTree, { props: { data: treeData } })
    await clickRow(wrapper, 'c')
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.find('[data-tree-key="c"]').classes()).toContain('lh-tree-node--disabled')

    const disabled = mount(LhTree, { props: { data: treeData, disabled: true } })
    await clickRow(disabled, 'a')
    expect(disabled.emitted('select')).toBeUndefined()
    await clickArrow(disabled, 'a')
    expect(disabled.emitted('update:expandedKeys')).toBeUndefined()
  })

  it('cascades checkbox checks with indeterminate parents', async () => {
    const wrapper = mount(LhTree, {
      props: { data: treeData, showCheckbox: true, defaultExpandedKeys: ['a', 'b'] },
    })
    expect(wrapper.find('.lh-tree').attributes('aria-multiselectable')).toBe('true')
    expect(wrapper.findAll('.lh-tree-node__checkbox')).toHaveLength(6)

    // 勾选父级 a → 级联全部后代
    await wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox').trigger('click')
    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['a', 'a-1', 'a-2']])
    expect(wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox--checked').exists()).toBe(true)
    expect(wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox').attributes('aria-checked')).toBe(
      'true',
    )

    // 取消一个子级 → 父级变半选
    await wrapper.find('[data-tree-key="a-1"] .lh-tree-node__checkbox').trigger('click')
    expect(wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox--indeterminate').exists()).toBe(
      true,
    )
    expect(wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox').attributes('aria-checked')).toBe(
      'mixed',
    )
    const check = wrapper.emitted('check')?.[1] as [string[], LhTreeNode]
    expect(check[0]).toEqual(['a-2'])
    expect(check[1].key).toBe('a-1')
  })

  it('checks only the node itself under checkStrictly', async () => {
    const wrapper = mount(LhTree, {
      props: { data: treeData, showCheckbox: true, checkStrictly: true, defaultExpandedKeys: ['a'] },
    })
    await wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox').trigger('click')
    // 父子不联动：只增删自身键，无半选态
    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['a']])
    expect(wrapper.find('[data-tree-key="a-1"] .lh-tree-node__checkbox--checked').exists()).toBe(false)
  })

  it('lazy-loads children on expand and emits nodeLoad', async () => {
    const load = vi.fn(
      (
        node: LhTreeNode,
        resolve: (children: LhTreeNode[]) => void,
        _reject: (reason?: unknown) => void,
      ) => {
        resolve([
          { key: 'lazy-1', label: '子节点一', isLeaf: true },
          { key: 'lazy-2', label: '子节点二', isLeaf: true },
        ])
        void node
      },
    )
    const wrapper = mount(LhTree, {
      props: { data: [{ key: 'lazy', label: '点我加载', isLeaf: false }], lazy: true, load },
    })
    await clickArrow(wrapper, 'lazy')
    expect(load).toHaveBeenCalledTimes(1)
    // resolve 后子节点挂载并自动展开
    expect(wrapper.find('[data-tree-key="lazy-1"]').exists()).toBe(true)
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['lazy']])
    const nodeLoad = wrapper.emitted('nodeLoad')?.[0] as [LhTreeNode, LhTreeNode[]]
    expect(nodeLoad[0].key).toBe('lazy')
    expect(nodeLoad[1]).toHaveLength(2)
    // 重复点击已加载节点不再触发 load
    await clickArrow(wrapper, 'lazy')
    expect(wrapper.find('[data-tree-key="lazy-1"]').exists()).toBe(false)
    await clickArrow(wrapper, 'lazy')
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('cancels loading on reject without expanding', async () => {
    const load = vi.fn(
      (
        node: LhTreeNode,
        _resolve: (children: LhTreeNode[]) => void,
        reject: (reason?: unknown) => void,
      ) => {
        reject(new Error('nothing to load'))
        void node
      },
    )
    const wrapper = mount(LhTree, {
      props: { data: [{ key: 'lazy', label: '点我加载', isLeaf: false }], lazy: true, load },
    })
    await clickArrow(wrapper, 'lazy')
    expect(wrapper.emitted('nodeLoad')).toBeUndefined()
    expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    // loading 态已清除，箭头可再次点击重新触发 load
    await clickArrow(wrapper, 'lazy')
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('shows the empty state from locale and the empty slot', () => {
    const wrapper = mount(LhTree, { props: { data: [] } })
    expect(wrapper.find('.lh-tree__empty').text()).toBe('暂无数据')

    const slotted = mount(LhTree, {
      props: { data: [] },
      slots: { empty: '自定义空态' },
    })
    expect(slotted.find('.lh-tree__empty').text()).toBe('自定义空态')
  })

  it('renders the node scoped slot', () => {
    const wrapper = mount(LhTree, {
      props: { data: treeData, defaultExpandedKeys: ['a'] },
      slots: {
        node: '<template #node="{ node, level }"><text class="slot-node">{{ level }}-{{ node.label }}</text></template>',
      },
    })
    expect(wrapper.findAll('.slot-node')).toHaveLength(5)
    expect(wrapper.find('[data-tree-key="a-1"] .slot-node').text()).toBe('1-Vue')
  })

  it('applies roving tabindex (H5 only)', () => {
    const wrapper = mount(LhTree, { props: { data: treeData, defaultExpandedKeys: ['a'] } })
    const tabs = wrapper.findAll('.lh-tree-node').map((el) => el.attributes('tabindex'))
    // 首个可用项 tabindex 0，其余 -1；禁用项恒为 -1
    expect(tabs[0]).toBe('0')
    expect(tabs.slice(1)).toEqual(expect.arrayContaining(['-1']))
    expect(wrapper.find('[data-tree-key="c"]').attributes('tabindex')).toBe('-1')
  })

  it('navigates by keyboard (H5 only): arrows / Enter / Space', async () => {
    const wrapper = mount(LhTree, { props: { data: treeData } })
    // ↑↓ 在可见项间移动（跳过禁用项），roving tabindex 跟随焦点
    await keydown(wrapper, 'ArrowDown')
    expect(wrapper.find('[data-tree-key="b"]').attributes('tabindex')).toBe('0')
    // → 展开未展开的节点
    await keydown(wrapper, 'ArrowRight')
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['b']])
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(true)
    // ← 收起已展开的节点
    await keydown(wrapper, 'ArrowLeft')
    expect(wrapper.find('[data-tree-key="b-1"]').exists()).toBe(false)
    // Enter 等价点击节点：选中
    await keydown(wrapper, 'Enter')
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('b')

    // Home / End 落到首 / 末可用项
    await keydown(wrapper, 'Home')
    expect(wrapper.find('[data-tree-key="a"]').attributes('tabindex')).toBe('0')
    await keydown(wrapper, 'End')
    // Enter 已把 b 展开，末位可用项是 b-1；禁用项 c 被跳过
    expect(wrapper.find('[data-tree-key="b-1"]').attributes('tabindex')).toBe('0')
  })

  it('toggles a checkbox on Space when showCheckbox (H5 only)', async () => {
    const wrapper = mount(LhTree, {
      props: { data: treeData, showCheckbox: true, defaultExpandedKeys: ['a'] },
    })
    await keydown(wrapper, 'ArrowDown')
    await keydown(wrapper, ' ')
    // 焦点在 a-1（a 展开后的可见顺序：a, a-1, a-2, b）
    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['a-1']])
  })

  it('keeps keyboard events inert when the tree is disabled', async () => {
    const wrapper = mount(LhTree, { props: { data: treeData, disabled: true } })
    await keydown(wrapper, 'ArrowDown')
    await keydown(wrapper, 'Enter')
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.find('[data-tree-key="b"]').attributes('tabindex')).toBe('-1')
  })

  it('windows rendering under virtual mode and follows scroll', async () => {
    // 3 根 × 60 子，全展开共 183 行；默认高度 300px → 可见区 + 缓冲 17 行
    const bigData: LhTreeNode[] = Array.from({ length: 3 }, (_, i) => ({
      key: `big-${i}`,
      label: `分组 ${i + 1}`,
      children: Array.from({ length: 60 }, (_, j) => ({
        key: `big-${i}-${j}`,
        label: `节点 ${i + 1}-${j + 1}`,
      })),
    }))
    const wrapper = mount(LhTree, {
      props: { data: bigData, virtual: true, defaultExpandedKeys: ['big-0', 'big-1', 'big-2'] },
    })
    const scroll = wrapper.find('.lh-tree__scroll')
    expect(scroll.exists()).toBe(true)
    expect(scroll.attributes('style')).toContain('height: 300px')
    // 等高骨架撑开总高度，开窗只渲染首屏片段
    const phantom = scroll.find('view')
    expect(phantom.attributes('style')).toContain('height: 6222px')
    const rendered = () => scroll.findAll('.lh-tree-node')
    expect(rendered()).toHaveLength(17)
    expect(rendered()[0].attributes('data-tree-key')).toBe('big-0')

    // 滚动事件推移开窗窗口
    await dispatchUniScroll(scroll.element, 340)
    await nextTick()
    expect(rendered()).toHaveLength(17)
    expect(rendered()[0].attributes('data-tree-key')).toBe('big-0-5')
    expect(phantom.attributes('style')).toContain('padding-top: 204px')

    // 虚拟高度数字按 px，字符串原样
    const custom = mount(LhTree, {
      props: { data: bigData, virtual: true, virtualHeight: '50vh', defaultExpandedKeys: [] },
    })
    expect(custom.find('.lh-tree__scroll').attributes('style')).toContain('height: 50vh')
  })

  it('scrolls a keyboard-focused node into view under virtual mode', async () => {
    const bigData: LhTreeNode[] = [
      {
        key: 'big',
        label: '分组',
        children: Array.from({ length: 60 }, (_, j) => ({
          key: `big-${j}`,
          label: `节点 ${j + 1}`,
        })),
      },
    ]
    const wrapper = mount(LhTree, {
      props: { data: bigData, virtual: true, defaultExpandedKeys: ['big'], virtualHeight: 200 },
    })
    const scroll = wrapper.find('.lh-tree__scroll')
    // End 聚焦末位可见项（big-59，索引 60），当前窗口看不见 → 锚定 scroll-top
    await keydown(wrapper, 'End')
    // 60 * 34 - 2 * 34 = 1972
    expect(scroll.attributes('scroll-top')).toBe('1972')
    // 聚焦点不在首屏开窗内时行不渲染，但焦点键已记录（滚回来即恢复）
    expect(wrapper.find('[data-tree-key="big-59"]').exists()).toBe(false)
  })
})

describe('LhTree controlled keys', () => {
  it('honors controlled expandedKeys / selectedKeys / checkedKeys', async () => {
    const wrapper = mount(LhTree, {
      props: {
        data: treeData,
        expandedKeys: ['a'],
        selectedKeys: ['a-1'],
        checkedKeys: ['a-1'],
        showCheckbox: true,
      },
    })
    expect(wrapper.find('[data-tree-key="a-1"]').exists()).toBe(true)
    expect(wrapper.find('[data-tree-key="a-1"]').classes()).toContain('lh-tree-node--selected')
    // 受控勾选 a-1：父级 a 半选
    expect(wrapper.find('[data-tree-key="a"] .lh-tree-node__checkbox--indeterminate').exists()).toBe(
      true,
    )

    // 受控模式下外部更新 props 即反映，内部态不再自行写入
    await wrapper.setProps({ expandedKeys: [] })
    expect(wrapper.find('[data-tree-key="a-1"]').exists()).toBe(false)
  })
})
