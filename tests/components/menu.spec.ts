import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { h, nextTick } from 'vue'
import LhMenu from '../../src/components/lh-menu/lh-menu.vue'
import LhMenuItem from '../../src/components/lh-menu-item/lh-menu-item.vue'
import LhSubMenu from '../../src/components/lh-sub-menu/lh-sub-menu.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证横向模式「点标题 → 飞出面板定位 → 点遮罩收起」的时序（computePosition 本身在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger / popper 的 id 带实例 uid 后缀（useLhPopperIds 唯一化），用前缀匹配
    if (selector.startsWith('#lh-sub-menu-trigger')) {
      return { top: 100, left: 10, width: 200, height: 40, right: 210, bottom: 140 }
    }
    return { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160 }
  },
}))

vi.mock('@/adapter/platform', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>
  return {
    ...original,
    getLhWindowInfo: () => ({ top: 0, left: 0, width: 375, height: 667, right: 375, bottom: 667 }),
  }
})

// 直接挂载 LhMenu（根组件即被测组件，emitted 可断言 update:modelValue / select）；
// 子组件由 mount helper 的全局注册解析（对齐 easycom 语义）
/** 挂到 document 的 wrapper 登记：键盘用例需要 focus 生效，用例结束统一卸载，
 * 避免残留 Vue 实例与后续用例的调度 / activeElement 竞争 */
const attachedWrappers: ReturnType<typeof mount>[] = []

function mountMenu(
  props: Record<string, unknown> = {},
  defaultSlot: string | (() => unknown) = '',
) {
  // VTU 默认渲染在脱离文档的 DOM 上，focus() 对未连接元素无效；键盘用例需要挂到 document
  const wrapper = mount(LhMenu, {
    props,
    slots: { default: defaultSlot },
    attachTo: document.body,
  })
  attachedWrappers.push(wrapper)
  return wrapper
}

const BASIC_SLOT = `
  <lh-menu-item index="1">首页</lh-menu-item>
  <lh-menu-item index="2">作品</lh-menu-item>
  <lh-menu-item index="3">禁用项</lh-menu-item>
`

const DISABLED_SLOT = `
  <lh-menu-item index="1">首页</lh-menu-item>
  <lh-menu-item index="2" disabled>禁用项</lh-menu-item>
`

const SUB_MENU_SLOT = `
  <lh-menu-item index="1">首页</lh-menu-item>
  <lh-sub-menu index="2" title="我的创作">
    <lh-menu-item index="2-1">水墨画</lh-menu-item>
    <lh-menu-item index="2-2">工笔画</lh-menu-item>
  </lh-sub-menu>
`

const ACCORDION_SLOT = `
  <lh-sub-menu index="2" title="第一组">
    <lh-menu-item index="2-1">选项 2-1</lh-menu-item>
  </lh-sub-menu>
  <lh-sub-menu index="3" title="第二组">
    <lh-menu-item index="3-1">选项 3-1</lh-menu-item>
  </lh-sub-menu>
`

const GROUP_SLOT = `
  <lh-menu-item-group title="基础内容">
    <lh-menu-item index="1">文章</lh-menu-item>
  </lh-menu-item-group>
  <lh-menu-item-group title="高级功能">
    <lh-menu-item index="3">数据分析</lh-menu-item>
  </lh-menu-item-group>
`

// 嵌套子菜单（VNode 构造，验证 select 路径冒泡）
function nestedSlot() {
  return [
    h(LhMenuItem, { index: '1' }, () => '首页'),
    h(
      LhSubMenu,
      { index: '2', title: '设置' },
      () => [
        h(
          LhSubMenu,
          { index: '2-1', title: '外观' },
          () => [h(LhMenuItem, { index: '2-1-1' }, () => '主题')],
        ),
      ],
    ),
  ]
}

describe('LhMenu', () => {
  // 统一卸载挂到 document 的实例，替代清空 body（innerHTML='' 会留下悬空 Vue 实例，
  // 其异步调度会干扰后续用例的 focus / activeElement 断言）
  afterEach(() => {
    while (attachedWrappers.length) {
      attachedWrappers.pop()?.unmount()
    }
  })

  it('渲染容器与全部叶子项，容器 role 为 menu', () => {
    const wrapper = mountMenu({}, BASIC_SLOT)
    const root = wrapper.find('.lh-menu')
    expect(root.exists()).toBe(true)
    // 类名由 share 的 getMenuClassNames 产出（mode 默认 vertical）
    expect(root.classes()).toContain('lh-menu--vertical')
    expect(root.attributes('role')).toBe('menu')
    expect(wrapper.findAll('.lh-menu-item')).toHaveLength(3)
  })

  it('点击叶子项激活并抛 select / update:modelValue，落 active 类', async () => {
    const wrapper = mountMenu({}, BASIC_SLOT)
    const items = wrapper.findAll('.lh-menu-item')
    await items[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('select')?.[0]).toEqual(['2', ['2']])
    await nextTick()
    expect(items[1].classes()).toContain('lh-menu-item--active')
    expect(items[0].classes()).not.toContain('lh-menu-item--active')
  })

  it('受控 modelValue 直接决定激活项', async () => {
    const wrapper = mountMenu({ modelValue: '2' }, BASIC_SLOT)
    const items = wrapper.findAll('.lh-menu-item')
    await nextTick()
    expect(items[1].classes()).toContain('lh-menu-item--active')
  })

  it('禁用项带 disabled 类与 aria-disabled，点击不触发 select', async () => {
    const wrapper = mountMenu({}, DISABLED_SLOT)
    const items = wrapper.findAll('.lh-menu-item')
    expect(items[1].classes()).toContain('lh-menu-item--disabled')
    expect(items[1].attributes('aria-disabled')).toBe('true')
    expect(items[1].attributes('tabindex')).toBe('-1')
    await items[1].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('子菜单标题点击切换展开：opened 类、aria-expanded、open/close 事件', async () => {
    const wrapper = mountMenu({}, SUB_MENU_SLOT)
    const title = wrapper.find('.lh-sub-menu__title')
    expect(title.attributes('aria-expanded')).toBe('false')

    await title.trigger('click')
    const subMenu = wrapper.find('.lh-sub-menu')
    expect(subMenu.classes()).toContain('lh-sub-menu--opened')
    expect(title.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('open')?.[0]).toEqual(['2', ['2']])

    await title.trigger('click')
    expect(wrapper.find('.lh-sub-menu').classes()).not.toContain('lh-sub-menu--opened')
    expect(wrapper.emitted('close')?.[0]).toEqual(['2', ['2']])
  })

  it('内联面板始终渲染，aria-hidden 随展开态翻转', async () => {
    const wrapper = mountMenu({}, SUB_MENU_SLOT)
    const panel = wrapper.find('.lh-sub-menu__inline')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('aria-hidden')).toBe('true')
    await wrapper.find('.lh-sub-menu__title').trigger('click')
    expect(wrapper.find('.lh-sub-menu__inline').attributes('aria-hidden')).toBe('false')
  })

  it('点击子菜单内叶子项冒泡完整 indexPath', async () => {
    const wrapper = mountMenu({}, SUB_MENU_SLOT)
    await wrapper.find('.lh-sub-menu__title').trigger('click')
    await wrapper.findAll('.lh-menu-item')[1].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['2-1', ['2', '2-1']])
  })

  it('嵌套子菜单的 select 路径包含每级 index', async () => {
    const wrapper = mountMenu({}, () => nestedSlot())
    // 展开第一级子菜单
    const titles = wrapper.findAll('.lh-sub-menu__title')
    await titles[0].trigger('click')
    // 展开第二级子菜单（此时第一级已开，第二级标题出现在内联面板里）
    const titlesAfter = wrapper.findAll('.lh-sub-menu__title')
    await titlesAfter[1].trigger('click')
    // 点击最深层叶子项
    const items = wrapper.findAll('.lh-menu-item')
    await items[items.length - 1].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['2-1-1', ['2', '2-1', '2-1-1']])
  })

  it('手风琴模式同时只展开一个子菜单', async () => {
    const wrapper = mountMenu({ uniqueOpened: true }, ACCORDION_SLOT)
    const titles = wrapper.findAll('.lh-sub-menu__title')
    await titles[0].trigger('click')
    await titles[1].trigger('click')
    await nextTick()
    const opened = wrapper.findAll('.lh-sub-menu').filter((el) =>
      el.classes().includes('lh-sub-menu--opened'),
    )
    expect(opened).toHaveLength(1)
    expect(wrapper.emitted('open')?.[1]).toEqual(['3', ['3']])
  })

  it('defaultOpeneds 初始展开指定子菜单（非受控）', async () => {
    const wrapper = mountMenu({ defaultOpeneds: ['2'] }, SUB_MENU_SLOT)
    await nextTick()
    expect(wrapper.find('.lh-sub-menu').classes()).toContain('lh-sub-menu--opened')
  })

  it('openeds 受控时以 props 为准', async () => {
    const wrapper = mountMenu({ openeds: ['2'] }, SUB_MENU_SLOT)
    await nextTick()
    expect(wrapper.find('.lh-sub-menu').classes()).toContain('lh-sub-menu--opened')
  })

  it('分组渲染标题与 role=group，类名由 share 产出', () => {
    const wrapper = mountMenu({}, GROUP_SLOT)
    const groups = wrapper.findAll('.lh-menu-item-group')
    expect(groups).toHaveLength(2)
    expect(groups[0].attributes('role')).toBe('presentation')
    expect(wrapper.findAll('.lh-menu-item-group__title')[0].text()).toContain('基础内容')
    expect(wrapper.findAll('.lh-menu-item-group__list')[0].attributes('role')).toBe('group')
  })

  it('横向模式容器为 menubar，子菜单走飞出面板（root-portal 定位）', async () => {
    vi.useFakeTimers()
    const wrapper = mountMenu({ mode: 'horizontal' }, SUB_MENU_SLOT)
    const root = wrapper.find('.lh-menu')
    expect(root.classes()).toContain('lh-menu--horizontal')
    expect(root.attributes('role')).toBe('menubar')

    // 飞出模式未打开前不渲染面板
    expect(wrapper.find('.lh-sub-menu__popper').exists()).toBe(false)

    await wrapper.find('.lh-sub-menu__title').trigger('click')
    await nextTick()
    // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
    await vi.runAllTimersAsync()
    await nextTick()

    const panel = wrapper.find('.lh-sub-menu__popper')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('menu')
    // 默认方位 bottom-start：computePosition 在 375×667 视口内把面板放到触发器下方左侧
    expect(panel.attributes('style')).toContain('position: fixed')
    expect(panel.attributes('style')).toContain('top: 148px')
    expect(panel.attributes('style')).toContain('left: 10px')

    // 标题的 aria-expanded 与 aria-controls 指向面板
    const title = wrapper.find('.lh-sub-menu__title')
    expect(title.attributes('aria-expanded')).toBe('true')
    expect(title.attributes('aria-controls')).toBe(panel.attributes('id'))

    // 点击遮罩收起（MP 端的主要关闭通道）
    await wrapper.find('.lh-sub-menu__mask').trigger('click')
    expect(wrapper.find('.lh-sub-menu__popper').exists()).toBe(false)
    expect(wrapper.emitted('close')?.[0]).toEqual(['2', ['2']])

    vi.useRealTimers()
  })

  it('子菜单标题键盘交互：Enter 展开并把焦点移入面板', async () => {
    const wrapper = mountMenu({ mode: 'horizontal' }, SUB_MENU_SLOT)
    const title = wrapper.find('.lh-sub-menu__title')
    // 用 focus 间谍断言「焦点移入面板首项」：jsdom 在元素的 tabindex 因 roving
    // 更新翻回 -1 时会强制 blur（真实浏览器保持焦点），activeElement 断言不稳定
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')
    await title.trigger('keydown', { key: 'Enter' })
    // 面板由 v-if 打开，focusFirstPanelItem 的 nextTick 回调比 trigger 的 await
    // 晚一拍调度（组件内 nextTick 排在 VTU trigger 的 promise 之后），多等一拍
    await nextTick()
    expect(wrapper.find('.lh-sub-menu__title').attributes('aria-expanded')).toBe('true')
    // 焦点已移入飞出面板的第一个叶子项（面板首项「水墨」）
    const panel = wrapper.find('.lh-sub-menu__popper')
    expect(panel.exists()).toBe(true)
    const focusedTexts = focusSpy.mock.instances.map(
      (el) => (el as HTMLElement).textContent?.trim(),
    )
    expect(focusedTexts).toContain('水墨画')
    focusSpy.mockRestore()
  })

  it('竖向模式根容器 ↑/↓ 键盘遍历跳过禁用项', async () => {
    const wrapper = mountMenu({}, DISABLED_SLOT)
    const root = wrapper.find('.lh-menu')
    await root.trigger('keydown', { key: 'ArrowDown' })
    // 禁用项 tabindex=-1 被跳过（moveMenuFocus 的内核语义），首项获得焦点
    const items = wrapper.findAll('.lh-menu-item')
    expect(document.activeElement).toBe(items[0].element)
  })
})
