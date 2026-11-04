import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '../mount'
import LhLayout from '../../src/components/lh-layout/lh-layout.vue'
import LhHeader from '../../src/components/lh-header/lh-header.vue'
import LhAside from '../../src/components/lh-aside/lh-aside.vue'
import LhMain from '../../src/components/lh-main/lh-main.vue'
import LhFooter from '../../src/components/lh-footer/lh-footer.vue'

function mountLayout(props = {}, slots = '') {
  return mount({
    components: { LhLayout, LhHeader, LhAside, LhMain, LhFooter },
    data: () => ({ props }),
    template: `<lh-layout v-bind="props">
      ${slots}
    </lh-layout>`,
  })
}

describe('LhLayout', () => {
  it('默认渲染为水平方向容器', () => {
    const wrapper = mountLayout()
    expect(wrapper.find('.lh-layout').exists()).toBe(true)
    expect(wrapper.find('.lh-layout').classes()).toContain('lh-layout--horizontal')
  })

  it('direction="vertical" 切换垂直方向', async () => {
    const wrapper = mountLayout({ direction: 'vertical' })
    await nextTick()
    expect(wrapper.find('.lh-layout').classes()).toContain('lh-layout--vertical')
  })

  it('customClass 透传到根节点', async () => {
    const wrapper = mountLayout({ customClass: 'my-layout' })
    await nextTick()
    expect(wrapper.find('.lh-layout').classes()).toContain('my-layout')
  })

  it('sx 求值为内联样式（数值按 8px 间距倍率）', async () => {
    const wrapper = mountLayout({ sx: { h: '240px' } })
    await nextTick()
    expect(wrapper.find('.lh-layout').attributes('style')).toContain('height: 240px')
  })
})

describe('LhLayout 五件套组装', () => {
  it('上中下布局渲染全部子组件与类名', async () => {
    const wrapper = mountLayout(
      { direction: 'vertical' },
      `<lh-header>页头</lh-header><lh-main>内容区</lh-main><lh-footer>页脚</lh-footer>`,
    )
    await nextTick()
    expect(wrapper.find('.lh-layout-header').exists()).toBe(true)
    expect(wrapper.find('.lh-layout-main').exists()).toBe(true)
    expect(wrapper.find('.lh-layout-footer').exists()).toBe(true)
    expect(wrapper.find('.lh-layout-header').text()).toBe('页头')
    // landmark 语义：语义标签换成 view 后由 role 补回
    expect(wrapper.find('.lh-layout-header').attributes('role')).toBe('banner')
    expect(wrapper.find('.lh-layout-main').attributes('role')).toBe('main')
    expect(wrapper.find('.lh-layout-footer').attributes('role')).toBe('contentinfo')
  })

  it('含 Aside 时父级自动切换为垂直方向（无需显式 direction）', async () => {
    const wrapper = mountLayout(
      {},
      `<lh-aside :width="140" aria-label="侧边导航">侧栏</lh-aside><lh-main>内容区</lh-main>`,
    )
    await nextTick()
    expect(wrapper.find('.lh-layout').classes()).toContain('lh-layout--vertical')
    expect(wrapper.find('.lh-layout-aside').exists()).toBe(true)
    expect(wrapper.find('.lh-layout-aside').attributes('role')).toBe('complementary')
    expect(wrapper.find('.lh-layout-aside').attributes('aria-label')).toBe('侧边导航')
  })

  it('Aside 的 width 支持数字（px）与字符串（带单位）', async () => {
    const wrapper = mountLayout({}, `<lh-aside :width="140">侧栏</lh-aside>`)
    await nextTick()
    expect(wrapper.find('.lh-layout-aside').attributes('style')).toContain('width: 140px')

    const wrapper2 = mountLayout({}, `<lh-aside width="30%">侧栏</lh-aside>`)
    await nextTick()
    expect(wrapper2.find('.lh-layout-aside').attributes('style')).toContain('width: 30%')
  })

  it('子组件 customClass 透传且 sx 求值', async () => {
    const wrapper = mountLayout(
      {},
      `<lh-main custom-class="my-main" :sx="{ p: 2 }">内容区</lh-main>`,
    )
    await nextTick()
    const main = wrapper.find('.lh-layout-main')
    expect(main.classes()).toContain('my-main')
    // sx p: '2' → 数值按 8px 倍率 = 16px
    expect(main.attributes('style')).toContain('padding: 16px')
  })

  it('Aside 不在 LhLayout 内时上下文注入为空也不报错', () => {
    const wrapper = mount(LhAside, { props: { width: 100 }, slots: { default: '独立侧栏' } })
    expect(wrapper.find('.lh-layout-aside').exists()).toBe(true)
    expect(wrapper.find('.lh-layout-aside').attributes('style')).toContain('width: 100px')
  })
})
