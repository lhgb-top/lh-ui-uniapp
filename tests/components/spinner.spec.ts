import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhSpinner from '../../src/components/lh-spinner/lh-spinner.vue'

/** 挂载助手：模板写法与 easycom 页面一致（mount.ts 已全局注册全部 SFC） */
function mountSpinner(props = {}) {
  return mount({
    components: { LhSpinner },
    data: () => ({ props }),
    template: `<lh-spinner v-bind="props" />`,
  })
}

describe('LhSpinner', () => {
  it('渲染根节点并标注尺寸变体类名（类名由 share core 产出）', () => {
    const wrapper = mountSpinner()
    const root = wrapper.find('.lh-spinner')
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('lh-spinner--medium')
    // 纯装饰图形，读屏器跳过（与 plus 一致）
    expect(root.attributes('aria-hidden')).toBe('true')
  })

  it('H5 分支渲染与 plus 同构的 svg 描边环', () => {
    const wrapper = mountSpinner()
    const svg = wrapper.find('.lh-spinner__circle')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 50 50')
    const circle = wrapper.find('circle')
    expect(circle.exists()).toBe(true)
    expect(circle.attributes('stroke')).toBe('currentColor')
    expect(circle.attributes('stroke-linecap')).toBe('round')
  })

  it('每个尺寸档映射为对应直径（share 的 LH_SPINNER_SIZE_PX）', () => {
    const diameters: Record<string, number> = {
      mini: 12,
      small: 16,
      medium: 24,
      large: 32,
      'x-large': 40,
    }
    for (const [size, px] of Object.entries(diameters)) {
      const wrapper = mountSpinner({ size })
      const style = wrapper.find('.lh-spinner').attributes('style') ?? ''
      expect(style).toContain(`width: ${px}px`)
      expect(style).toContain(`height: ${px}px`)
    }
  })

  it('color prop 落到根节点内联样式，未传时不输出 color 声明', () => {
    const wrapper = mountSpinner({ color: '#C4A35A' })
    // jsdom 会把十六进制色规范化为 rgb()，按 color 声明存在与否断言
    const style = wrapper.find('.lh-spinner').attributes('style') ?? ''
    expect(style).toContain('color: rgb(196, 163, 90)')
    const plain = mountSpinner()
    expect(plain.find('.lh-spinner').attributes('style') ?? '').not.toContain('color:')
  })

  it('customClass 透传到根节点', () => {
    const wrapper = mountSpinner({ customClass: 'my-spinner' })
    expect(wrapper.find('.lh-spinner').classes()).toContain('my-spinner')
  })

  it('sx 快速布局属性摊到根节点内联样式', () => {
    const wrapper = mountSpinner({ sx: { mt: 2 } })
    expect(wrapper.find('.lh-spinner').attributes('style')).toContain('margin-top: 16px')
  })

  it('小程序分支（非 H5 条件编译段）不渲染 view 圆环', () => {
    // vitest 按 H5 语义裁剪条件编译段（见 vitest.config.ts 的 uniConditionalPlugin），
    // 与真实 H5 构建一致：MP 专用的 .lh-spinner__ring 不应出现在 H5 产物里
    const wrapper = mountSpinner()
    expect(wrapper.find('.lh-spinner__ring').exists()).toBe(false)
  })
})
