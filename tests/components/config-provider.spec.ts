import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { h, nextTick } from 'vue'
import LhConfigProvider from '../../src/components/lh-config-provider/lh-config-provider.vue'
import LhButton from '../../src/components/lh-button/lh-button.vue'
import LhCard from '../../src/components/lh-card/lh-card.vue'
import LhCheckbox from '../../src/components/lh-checkbox/lh-checkbox.vue'
import LhRadio from '../../src/components/lh-radio/lh-radio.vue'
import { lhlocale } from '@/adapter/locale'

function mountWithButton() {
  return mount({
    components: { LhConfigProvider, LhButton },
    data: () => ({ size: 'small', theme: 'light' as const }),
    template: `<lh-config-provider :size="size" :theme="theme"><lh-button>按钮</lh-button></lh-config-provider>`,
  })
}

describe('LhConfigProvider', () => {
  it('provides a reactive size context to children', () => {
    const wrapper = mountWithButton()
    expect(wrapper.findComponent(LhButton).classes()).toContain('lh-button--small')
  })

  it('adds the dark class when theme is dark', () => {
    const wrapper = mount(LhConfigProvider, {
      props: { theme: 'dark' },
      slots: { default: () => h('view', '内容') },
    })
    expect(wrapper.classes()).toContain('dark')
  })

  it('emits themeVars as CSS custom properties', () => {
    const wrapper = mount(LhConfigProvider, {
      props: { themeVars: { '--lh-primary-color': '#c8a45c' } },
      slots: { default: () => h('view', '内容') },
    })
    expect(wrapper.attributes('style')).toContain('--lh-primary-color')
    expect(wrapper.attributes('style')).toContain('#c8a45c')
  })

  it('propagates size changes reactively', async () => {
    const wrapper = mountWithButton()
    expect(wrapper.findComponent(LhButton).classes()).toContain('lh-button--small')

    await wrapper.setData({ size: 'large' })
    expect(wrapper.findComponent(LhButton).classes()).toContain('lh-button--large')
  })

  it('syncs locale to the global emitter', async () => {
    const wrapper = mount(LhConfigProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h('view', '内容') },
    })
    expect(lhlocale.getLocale()).toBe('zh-CN')

    await wrapper.setProps({ locale: 'en-US' })
    expect(lhlocale.getLocale()).toBe('en-US')

    // 复位，避免污染其他测试
    lhlocale.setLocale('zh-CN')
  })
})

describe('locale 响应式适配层', () => {
  it('version bumps when the global locale changes', async () => {
    const before = lhlocale.version.value
    lhlocale.setLocale('en-US')
    await nextTick()
    expect(lhlocale.version.value).toBe(before + 1)

    lhlocale.setLocale('zh-CN')
    await nextTick()
    expect(lhlocale.getLocale()).toBe('zh-CN')
  })
})

/**
 * 组件级主题优先级链：组件 props themeVars > componentTheme[组件名] > 全局 themeVars
 * （card 是 themeable 名单内已消费组件，顺带覆盖 checkbox / radio 的回归）
 */
describe('componentTheme 优先级链', () => {
  function mountCard(providerProps: Record<string, unknown>, cardProps: Record<string, unknown> = {}) {
    return mount({
      components: { LhConfigProvider, LhCard },
      data: () => ({ providerProps, cardProps }),
      template: `<lh-config-provider v-bind="providerProps"><lh-card v-bind="cardProps" title="卡片" /></lh-config-provider>`,
    })
  }

  function cardStyle(wrapper: ReturnType<typeof mountCard>) {
    return wrapper.findComponent(LhCard).attributes('style') ?? ''
  }

  it('falls back to global themeVars', () => {
    const wrapper = mountCard({ themeVars: { 'card-bg': '#aaaaaa' } })
    expect(cardStyle(wrapper)).toContain('--lh-card-bg: #aaaaaa')
  })

  it('componentTheme[name] overrides global themeVars', () => {
    const wrapper = mountCard({
      themeVars: { 'card-bg': '#aaaaaa' },
      componentTheme: { card: { 'card-bg': '#bbbbbb' } },
    })
    expect(cardStyle(wrapper)).toContain('--lh-card-bg: #bbbbbb')
  })

  it('component props themeVars win over componentTheme and global', () => {
    const wrapper = mountCard(
      {
        themeVars: { 'card-bg': '#aaaaaa' },
        componentTheme: { card: { 'card-bg': '#bbbbbb' } },
      },
      { themeVars: { 'card-bg': '#cccccc' } },
    )
    expect(cardStyle(wrapper)).toContain('--lh-card-bg: #cccccc')
  })

  it('supports prefixed keys idempotently', () => {
    const wrapper = mountCard({ themeVars: { '--lh-card-bg': '#dddddd' } })
    expect(cardStyle(wrapper)).toContain('--lh-card-bg: #dddddd')
    expect(cardStyle(wrapper)).not.toContain('--lh---lh-card-bg')
  })

  it('applies componentTheme to checkbox and radio too', () => {
    const wrapper = mount({
      components: { LhConfigProvider, LhCheckbox, LhRadio },
      data: () => ({
        providerProps: {
          componentTheme: {
            checkbox: { 'checkbox-color': '#111111' },
            radio: { 'radio-color': '#222222' },
          },
        },
      }),
      template: `<lh-config-provider v-bind="providerProps">
        <lh-checkbox>多选</lh-checkbox>
        <lh-radio>单选</lh-radio>
      </lh-config-provider>`,
    })
    expect(wrapper.findComponent(LhCheckbox).attributes('style') ?? '').toContain(
      '--lh-checkbox-color: #111111',
    )
    expect(wrapper.findComponent(LhRadio).attributes('style') ?? '').toContain(
      '--lh-radio-color: #222222',
    )
  })
})
