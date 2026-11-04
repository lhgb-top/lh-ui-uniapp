import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhPagination from '../../src/components/lh-pagination/lh-pagination.vue'

/**
 * uni 事件载荷形态：input / picker change / blur 的值在 event.detail.value
 * （与浏览器事件不重叠）。jsdom 下 VTU trigger 不接受 Event 实例、detail 只读，
 * 只能直接在 DOM 上派发 CustomEvent（input-number 同款 helper）。
 */
function dispatchUniEvent(element: Element, type: string, value: unknown) {
  element.dispatchEvent(new CustomEvent(type, { detail: { value } }))
}

function mountPagination(props = {}) {
  return mount(LhPagination, { props })
}

describe('LhPagination', () => {
  it('渲染根节点与页码区间（首末常驻 + 右侧省略号）', () => {
    // total 200 / 每页 10 → 20 页，当前页 1 靠左：[1..5, …, 20]
    const wrapper = mountPagination({ total: 200 })
    const root = wrapper.find('.lh-pagination')
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('lh-pagination--full')
    const pages = wrapper.findAll('.lh-pagination__page')
    expect(pages.map((page) => page.text())).toEqual(['1', '2', '3', '4', '5', '20'])
    expect(wrapper.findAll('.lh-pagination__ellipsis')).toHaveLength(1)
    expect(pages[0].classes()).toContain('lh-pagination__page--active')
  })

  it('当前页居中时双侧省略号，靠近右缘时左侧省略号', () => {
    const middle = mountPagination({ total: 200, current: 10 })
    expect(middle.findAll('.lh-pagination__page').map((page) => page.text())).toEqual([
      '1',
      '9',
      '10',
      '11',
      '20',
    ])
    expect(middle.findAll('.lh-pagination__ellipsis')).toHaveLength(2)

    const right = mountPagination({ total: 200, current: 20 })
    expect(right.findAll('.lh-pagination__page').map((page) => page.text())).toEqual([
      '1',
      '16',
      '17',
      '18',
      '19',
      '20',
    ])
    expect(right.findAll('.lh-pagination__ellipsis')).toHaveLength(1)
    expect(
      right.findAll('.lh-pagination__page')[5].classes(),
    ).toContain('lh-pagination__page--active')
  })

  it('点击页码触发 update:current 与 change，aria 契约由 share core 决定', async () => {
    const wrapper = mountPagination({ total: 200, current: 2 })
    const pages = wrapper.findAll('.lh-pagination__page')
    // 当前页 aria-current="page"，其余页带 aria-label（zh-CN 语言包「第 {page} 页」）
    expect(pages[0].attributes('aria-label')).toBe('第 1 页')
    expect(pages[1].attributes('aria-current')).toBe('page')
    expect(pages[2].attributes('aria-current')).toBeUndefined()
    // 内部值驱动渲染：点击后选中态立即移动
    await pages[3].trigger('click')
    expect(wrapper.emitted('update:current')).toEqual([[4]])
    expect(wrapper.emitted('change')).toEqual([[4]])
    // 点击后页码区间按 current=4 重排（core 的 getPaginationRange：
    // current=4 时窗口为 [1,…,3,4,5,…,20]），不按固定下标断言，按文本找
    const page4 = wrapper.findAll('.lh-pagination__page').find((el) => el.text() === '4')
    expect(page4?.classes()).toContain('lh-pagination__page--active')
    // 受控 watch：父组件先跟随 emit 回写 4，再受控切回 2，选中态跟着回去
    // （setProps 传同值不会触发 watch，必须先到达 4 再回 2）
    await wrapper.setProps({ current: 4 })
    await wrapper.setProps({ current: 2 })
    const pagesAfterReset = wrapper.findAll('.lh-pagination__page')
    const page2 = pagesAfterReset.find((el) => el.text() === '2')
    expect(page2?.classes()).toContain('lh-pagination__page--active')
  })

  it('v-model:current 双向绑定', async () => {
    const wrapper = mount(LhPagination, {
      props: {
        total: 95,
        current: 2,
        'onUpdate:current': (value: number) => wrapper.setProps({ current: value }),
      },
    })
    await wrapper.find('.lh-pagination__btn--next').trigger('click')
    expect(wrapper.props('current')).toBe(3)
    await wrapper.find('.lh-pagination__btn--prev').trigger('click')
    expect(wrapper.props('current')).toBe(2)
  })

  it('prev / next 越界禁用（类名 + aria-disabled + 不发事件）', async () => {
    const wrapper = mountPagination({ total: 95, current: 1 })
    const prev = wrapper.find('.lh-pagination__btn--prev')
    expect(prev.classes()).toContain('lh-pagination__btn--disabled')
    expect(prev.attributes('aria-disabled')).toBe('true')
    await prev.trigger('click')
    expect(wrapper.emitted('update:current')).toBeUndefined()

    const last = mountPagination({ total: 95, current: 10 })
    const next = last.find('.lh-pagination__btn--next')
    expect(next.classes()).toContain('lh-pagination__btn--disabled')
    expect(next.attributes('aria-disabled')).toBe('true')
    await next.trigger('click')
    expect(last.emitted('update:current')).toBeUndefined()

    // 中间位置 prev / next 都可用，步进 ±1（current=5 → next=6 → prev=5）
    const middle = mountPagination({ total: 95, current: 5 })
    await middle.find('.lh-pagination__btn--next').trigger('click')
    expect(middle.emitted('update:current')).toEqual([[6]])
    await middle.find('.lh-pagination__btn--prev').trigger('click')
    expect(middle.emitted('update:current')![1]).toEqual([5])
  })

  it('simple 模式：不渲染页码区，显示「当前页 / 总页数」', () => {
    const wrapper = mountPagination({ total: 95, simple: true })
    expect(wrapper.find('.lh-pagination').classes()).toContain('lh-pagination--simple')
    expect(wrapper.find('.lh-pagination__pages').exists()).toBe(false)
    expect(wrapper.find('.lh-pagination__simple-text').text()).toBe('1 / 10')
  })

  it('showTotal 显示总条数（语言包模板插值）', () => {
    const wrapper = mountPagination({ total: 95, showTotal: true })
    expect(wrapper.find('.lh-pagination__total').text()).toBe('共 95 条')
  })

  it('跳页：输入草稿 + confirm 提交，成功后清空输入框', async () => {
    const wrapper = mountPagination({ total: 95, showJumper: true })
    const input = wrapper.find('.lh-pagination__jumper-input')
    // label 的 for 与输入框 id 关联（等价 plus 的 <label for>）
    expect(wrapper.find('.lh-pagination__jumper-label').attributes('for')).toBe(
      input.attributes('id'),
    )
    await input.trigger('input', { detail: { value: '4' } })
    expect(wrapper.emitted('update:current')).toBeUndefined()
    dispatchUniEvent(input.element, 'confirm', '4')
    expect(wrapper.emitted('update:current')).toEqual([[4]])
    expect(wrapper.emitted('change')).toEqual([[4]])
    // 提交后草稿复位，输入框回到空态（:value 的 patch 在下一 tick）
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('跳页：失焦提交、越界钳制、空串与非法数字不跳页', async () => {
    const blur = mountPagination({ total: 95, showJumper: true })
    const blurInput = blur.find('.lh-pagination__jumper-input')
    dispatchUniEvent(blurInput.element, 'input', '6')
    dispatchUniEvent(blurInput.element, 'blur', '6')
    expect(blur.emitted('update:current')).toEqual([[6]])

    const clamp = mountPagination({ total: 95, showJumper: true })
    const clampInput = clamp.find('.lh-pagination__jumper-input')
    dispatchUniEvent(clampInput.element, 'input', '99')
    dispatchUniEvent(clampInput.element, 'confirm', '99')
    // 越出末页钳到第 10 页（core 的 clampPage）
    expect(clamp.emitted('update:current')).toEqual([[10]])

    const invalid = mountPagination({ total: 95, showJumper: true })
    const invalidInput = invalid.find('.lh-pagination__jumper-input')
    // 未输入直接失焦：空串不跳页
    dispatchUniEvent(invalidInput.element, 'blur', '')
    // 非法数字不跳页
    dispatchUniEvent(invalidInput.element, 'input', 'abc')
    dispatchUniEvent(invalidInput.element, 'blur', 'abc')
    expect(invalid.emitted('update:current')).toBeUndefined()
  })

  it('条数切换（picker）：change 取选项下标，同值不重发', async () => {
    const wrapper = mountPagination({ total: 95, showSizeChanger: true })
    const picker = wrapper.find('.lh-pagination__size')
    expect(picker.exists()).toBe(true)
    expect(wrapper.find('.lh-pagination__size-select').text()).toBe('10 条/页')
    dispatchUniEvent(picker.element, 'change', '1')
    expect(wrapper.emitted('update:pageSize')).toEqual([[20]])
    expect(wrapper.emitted('size-change')).toEqual([[20]])
    // 条数文本的渲染更新在下一 tick
    await nextTick()
    expect(wrapper.find('.lh-pagination__size-select').text()).toBe('20 条/页')
    // 同值不重发（picker 只在实际变化时触发，守卫兜底）
    dispatchUniEvent(picker.element, 'change', '1')
    expect(wrapper.emitted('update:pageSize')).toHaveLength(1)
  })

  it('条数变化后当前页越界自动钳制并通知', async () => {
    const wrapper = mountPagination({
      total: 95,
      current: 10,
      pageSizes: [10, 100],
      showSizeChanger: true,
    })
    dispatchUniEvent(wrapper.find('.lh-pagination__size').element, 'change', '1')
    // 每页 100 条后只剩 1 页，当前页钳回 1
    expect(wrapper.emitted('update:pageSize')).toEqual([[100]])
    expect(wrapper.emitted('size-change')).toEqual([[100]])
    expect(wrapper.emitted('update:current')).toEqual([[1]])
    expect(wrapper.emitted('change')).toEqual([[1]])
  })

  it('total 变小后当前页自动钳制（watch pageCount）', async () => {
    const wrapper = mountPagination({ total: 95, current: 10 })
    await wrapper.setProps({ total: 50 })
    expect(wrapper.emitted('update:current')).toEqual([[5]])
    expect(wrapper.emitted('change')).toEqual([[5]])
  })

  it('disabled 整体禁用：根节点带修饰类，点击 / 切条数 / 跳页均不发事件', async () => {
    const wrapper = mountPagination({
      total: 95,
      disabled: true,
      showSizeChanger: true,
      showJumper: true,
    })
    expect(wrapper.find('.lh-pagination').classes()).toContain('lh-pagination--disabled')
    expect(wrapper.findAll('.lh-pagination__page')[1].attributes('aria-disabled')).toBe('true')
    await wrapper.findAll('.lh-pagination__page')[1].trigger('click')
    await wrapper.find('.lh-pagination__btn--next').trigger('click')
    dispatchUniEvent(wrapper.find('.lh-pagination__size').element, 'change', '1')
    dispatchUniEvent(wrapper.find('.lh-pagination__jumper-input').element, 'blur', '4')
    expect(wrapper.emitted('update:current')).toBeUndefined()
    expect(wrapper.emitted('update:pageSize')).toBeUndefined()
  })

  it('prev / next 的 aria-label 取语言包，省略号 aria-hidden 纯展示', () => {
    const wrapper = mountPagination({ total: 200 })
    expect(wrapper.find('.lh-pagination__btn--prev').attributes('aria-label')).toBe('上一页')
    expect(wrapper.find('.lh-pagination__btn--next').attributes('aria-label')).toBe('下一页')
    expect(wrapper.find('.lh-pagination__ellipsis').attributes('aria-hidden')).toBe('true')
    // 页码按钮带 button 语义
    expect(wrapper.findAll('.lh-pagination__page')[0].attributes('role')).toBe('button')
  })

  it('sx 快速布局透传到根节点', () => {
    const wrapper = mountPagination({ total: 95, sx: { mt: 1 } })
    expect(wrapper.find('.lh-pagination').attributes('style')).toContain('margin-top: 8px')
  })
})
