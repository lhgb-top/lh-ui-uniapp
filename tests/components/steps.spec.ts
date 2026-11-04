import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '../mount'
import LhSteps from '../../src/components/lh-steps/lh-steps.vue'
import LhStep from '../../src/components/lh-step/lh-step.vue'

const TITLES = ['第一步', '第二步', '第三步']

function mountSteps(
  props: Record<string, unknown> = {},
  steps: Array<Record<string, unknown>> = TITLES.map((title) => ({ title })),
  options: Record<string, unknown> = {},
) {
  const slots = steps
    .map((step) => {
      const attrs = Object.entries(step)
        .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
        .join(' ')
      return `<lh-step ${attrs} />`
    })
    .join('\n')
  // 直接挂载被测组件（LhSteps 为根）：宿主模板挂载时 emitted() 拿不到子组件事件；
  // lh-step 走字符串 slot 由 mount.ts 的全局注册解析
  return mount(
    LhSteps,
    {
      props,
      slots: { default: slots },
      ...options,
    },
  )
}

describe('LhSteps', () => {
  it('渲染步骤容器与全部步骤项（横向为默认方向）', () => {
    const wrapper = mountSteps()
    expect(wrapper.find('.lh-steps').exists()).toBe(true)
    expect(wrapper.find('.lh-steps').classes()).toContain('lh-steps--horizontal')
    expect(wrapper.findAll('.lh-steps__item')).toHaveLength(3)
  })

  it('按 current 派生 wait / process / finish 状态并标注当前步骤', () => {
    const wrapper = mountSteps({ current: 1 })
    const items = wrapper.findAll('.lh-steps__item')
    expect(items[0].classes()).toContain('lh-steps__item--finish')
    expect(items[1].classes()).toContain('lh-steps__item--process')
    expect(items[1].attributes('aria-current')).toBe('step')
    expect(items[2].classes()).toContain('lh-steps__item--wait')
    expect(items[2].attributes('aria-current')).toBeUndefined()
  })

  it('渲染标题与可选描述（默认插槽 / 描述仅在传入时渲染）', () => {
    const wrapper = mountSteps({ current: 0 }, [
      { title: '研墨', description: '墨分五色' },
      { title: '落墨' },
    ])
    const titles = wrapper.findAll('.lh-steps__title')
    expect(titles.map((title) => title.text())).toEqual(['研墨', '落墨'])
    expect(wrapper.findAll('.lh-steps__description')).toHaveLength(1)
    expect(wrapper.find('.lh-steps__description').text()).toBe('墨分五色')
  })

  it('未传 icon 时圆圈回退到序号字符（finish 显示勾）', () => {
    const wrapper = mountSteps({ current: 1 })
    const icons = wrapper.findAll('.lh-steps__icon')
    expect(icons[0].text()).toBe('✓')
    expect(icons[1].text()).toBe('2')
    expect(icons[2].text()).toBe('3')
  })

  it('icon prop 渲染图标字体节点（不再回退序号）', () => {
    const wrapper = mountSteps({ current: 1 }, [
      { title: '注册', icon: 'user' },
      { title: '验证', icon: 'email' },
      { title: '完成', icon: 'check' },
    ])
    expect(wrapper.findAll('.lh-steps__icon .lh-iconfont')).toHaveLength(3)
    expect(wrapper.findAll('.lh-steps__icon')[0].find('.lh-iconfont--user').exists()).toBe(true)
    // 图标在位时不再输出序号字符
    expect(wrapper.findAll('.lh-steps__icon')[1].text()).toBe('')
  })

  it('icon 插槽可覆盖默认回退', () => {
    const wrapper = mount(
      {
        components: { LhSteps, LhStep },
        template: `<lh-steps :current="0">
          <lh-step title="第一步">
            <template #icon>
              <text class="custom-step-icon">壹</text>
            </template>
          </lh-step>
        </lh-steps>`,
      },
      {},
    )
    expect(wrapper.find('.lh-steps__icon .custom-step-icon').exists()).toBe(true)
    expect(wrapper.find('.lh-steps__icon .lh-iconfont').exists()).toBe(false)
  })

  it('clickable 时已完成 / 进行中的步骤渲染为可点击头部并按序抛 update:current 与 change', async () => {
    const wrapper = mountSteps({ current: 1, clickable: true })
    const heads = wrapper.findAll('.lh-steps__head')
    // 等待中的步骤不渲染按钮语义
    expect(heads[0].attributes('role')).toBe('button')
    expect(heads[1].attributes('role')).toBe('button')
    expect(heads[2].attributes('role')).toBeUndefined()
    expect(heads[0].attributes('aria-label')).toBe('已完成')
    expect(heads[1].attributes('aria-label')).toBe('第 2 步')

    await heads[0].trigger('click')
    expect(wrapper.emitted('update:current')).toEqual([[0]])
    expect(wrapper.emitted('change')).toEqual([[0]])
  })

  it('点击当前步骤不抛事件', async () => {
    const wrapper = mountSteps({ current: 0, clickable: true })
    await wrapper.findAll('.lh-steps__head')[0].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('update:current')).toBeUndefined()
  })

  it('非 clickable 时头部为纯展示（无按钮语义、无 --clickable 类）', () => {
    const wrapper = mountSteps({ current: 1 })
    const items = wrapper.findAll('.lh-steps__item')
    expect(wrapper.findAll('.lh-steps__head').every((head) => head.attributes('role') === undefined)).toBe(true)
    expect(items.every((item) => !item.classes().includes('lh-steps__item--clickable'))).toBe(true)
  })

  it('status 整体覆盖所有步骤的状态', () => {
    const wrapper = mountSteps({ current: 0, status: 'error' })
    const items = wrapper.findAll('.lh-steps__item')
    expect(items.every((item) => item.classes().includes('lh-steps__item--error'))).toBe(true)
  })

  it('direction="vertical" 输出纵向根类名', () => {
    const wrapper = mountSteps({ direction: 'vertical' })
    expect(wrapper.find('.lh-steps').classes()).toContain('lh-steps--vertical')
  })

  it('纵向标记全局末项隐藏连接线（WXSS 不支持 :not(:last-child)，由 --line-last 接管）', async () => {
    const wrapper = mountSteps({ direction: 'vertical' })
    // 子项注册收敛（同 breadcrumb / timeline 的 effect 队列时序）
    await nextTick()
    const items = wrapper.findAll('.lh-steps__item')
    expect(items[0].classes()).not.toContain('lh-steps__item--line-last')
    expect(items[1].classes()).not.toContain('lh-steps__item--line-last')
    expect(items[2].classes()).toContain('lh-steps__item--line-last')
  })

  it('横向折行度量后行末项（含全局末项）标 --line-last', async () => {
    // jsdom 无真实布局：getBoundingClientRect 的 top 全为 0，等价于「同一行」，
    // getStepsLineLastIndices 仅标记全局末项；需挂载到 document 才能被度量查询命中
    const wrapper = mountSteps({}, undefined, { attachTo: document.body })
    await nextTick()
    await nextTick()
    const items = wrapper.findAll('.lh-steps__item')
    expect(items[0].classes()).not.toContain('lh-steps__item--line-last')
    expect(items[1].classes()).not.toContain('lh-steps__item--line-last')
    expect(items[2].classes()).toContain('lh-steps__item--line-last')
    wrapper.unmount()
  })

  it('无父上下文的独立步骤不渲染（必须置于 lh-steps 内，与 plus 一致）', () => {
    const wrapper = mount(LhStep, { props: { title: '独立' } })
    expect(wrapper.find('.lh-steps__item').exists()).toBe(false)
  })

  it('customClass 透传到根节点与项节点', () => {
    const wrapper = mountSteps(
      { customClass: 'root-extra' },
      TITLES.map((title, index) => ({ title, customClass: index === 0 ? 'item-extra' : title })),
    )
    expect(wrapper.find('.lh-steps').classes()).toContain('root-extra')
    expect(wrapper.findAll('.lh-steps__item')[0].classes()).toContain('item-extra')
  })
})
