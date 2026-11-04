import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhRow from '../../src/components/lh-row/lh-row.vue'
import LhCol from '../../src/components/lh-col/lh-col.vue'

function mountGrid(rowProps = {}, slots = '<lh-col :span="12"><view class="cell">A</view></lh-col>') {
  return mount({
    components: { LhRow, LhCol },
    data: () => ({ rowProps }),
    template: `<lh-row v-bind="rowProps">${slots}</lh-row>`,
  })
}

describe('LhRow / LhCol', () => {
  it('渲染 row 与 col 容器', () => {
    const wrapper = mountGrid()
    expect(wrapper.find('.lh-row').exists()).toBe(true)
    expect(wrapper.find('.lh-col').exists()).toBe(true)
  })

  it('默认 wrap=true 不发不换行类', () => {
    const wrapper = mountGrid()
    expect(wrapper.find('.lh-row').classes()).not.toContain('lh-row--nowrap')
  })

  it('wrap=false 发 lh-row--nowrap', () => {
    const wrapper = mountGrid({ wrap: false })
    expect(wrapper.find('.lh-row').classes()).toContain('lh-row--nowrap')
  })

  it('justify / align 各自发对应修饰类（显式映射表，两轴不撞类）', () => {
    const wrapper = mountGrid({ justify: 'center', align: 'middle' })
    const classes = wrapper.find('.lh-row').classes()
    expect(classes).toContain('lh-row--center')
    expect(classes).toContain('lh-row--middle')
  })

  it('未知 align 值不产脏类（直接拼接会撞出无样式定义的类名）', () => {
    const wrapper = mountGrid({ align: 'center' as never })
    const classes = wrapper.find('.lh-row').classes()
    // align=center 是 middle 的兼容别名，映射到 lh-row--middle
    expect(classes).toContain('lh-row--middle')
  })

  it('gutter 数字发负横向外边距（抵消列内边距）', () => {
    const wrapper = mountGrid({ gutter: 16 })
    expect(wrapper.find('.lh-row').attributes('style')).toContain('margin-inline: -8px')
  })

  it('gutter 数组 [横向, 纵向] 取横向值', () => {
    const wrapper = mountGrid({ gutter: [16, 24] })
    expect(wrapper.find('.lh-row').attributes('style')).toContain('margin-inline: -8px')
  })

  it('纯 span 走 auto-placement：发 grid-column: span N（24 栅格制）', () => {
    const wrapper = mountGrid({}, '<lh-col :span="8"><view class="cell" /></lh-col>')
    expect(wrapper.find('.lh-col').attributes('style')).toContain('grid-column: span 8')
  })

  it('offset 发显式起点：offset 6 + span 6 → 7 / span 6', () => {
    const wrapper = mountGrid({}, '<lh-col :span="6" :offset="6"><view class="cell" /></lh-col>')
    expect(wrapper.find('.lh-col').attributes('style')).toContain('grid-column: 7 / span 6')
  })

  it('push / pull 在 offset 基础上平移起点', () => {
    const wrapper = mountGrid(
      {},
      '<lh-col :span="9" :push="6"><view class="cell" /></lh-col>',
    )
    expect(wrapper.find('.lh-col').attributes('style')).toContain('grid-column: 7 / span 9')
  })

  it('响应式声明在无 matchMedia 的测试环境降级到 xs 档', () => {
    // jsdom 无 matchMedia，useLhBreakpoint 固定降级 xs
    const wrapper = mountGrid({}, '<lh-col :xs="24" :sm="12"><view class="cell" /></lh-col>')
    expect(wrapper.find('.lh-col').attributes('style')).toContain('grid-column: span 24')
  })

  it('col 无任何响应式声明时回退到 span', () => {
    const wrapper = mountGrid({}, '<lh-col :span="6"><view class="cell" /></lh-col>')
    expect(wrapper.find('.lh-col').attributes('style')).toContain('grid-column: span 6')
  })

  it('span 类名 lh-col--N 与 offset 类名 lh-col--offset-N', () => {
    const wrapper = mountGrid({}, '<lh-col :span="8" :offset="4"><view class="cell" /></lh-col>')
    const classes = wrapper.find('.lh-col').classes()
    expect(classes).toContain('lh-col--8')
    expect(classes).toContain('lh-col--offset-4')
  })

  it('customClass 透传到根节点', () => {
    const wrapper = mountGrid({}, '<lh-col :span="12" custom-class="my-col" />')
    expect(wrapper.find('.lh-col').classes()).toContain('my-col')
  })
})
