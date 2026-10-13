import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhProgress from '../../src/components/lh-progress/lh-progress.vue'

describe('LhProgress', () => {
  it('renders line bar and default text', () => {
    const wrapper = mount(LhProgress, { props: { percentage: 42 } })
    expect(wrapper.classes()).toContain('lh-progress')
    expect(wrapper.classes()).toContain('lh-progress--line')
    expect(wrapper.find('.lh-progress__bar').exists()).toBe(true)
    expect(wrapper.find('.lh-progress__bar-inner').attributes('style')).toContain('width: 42%')
    expect(wrapper.find('.lh-progress__text').text()).toBe('42%')
  })

  it('clamps percentage into 0-100', () => {
    expect(
      mount(LhProgress, { props: { percentage: 250 } })
        .find('.lh-progress__bar-inner')
        .attributes('style'),
    ).toContain('width: 100%')
    expect(
      mount(LhProgress, { props: { percentage: -30 } })
        .find('.lh-progress__bar-inner')
        .attributes('style'),
    ).toContain('width: 0%')
  })

  it('derives success status at 100', () => {
    expect(mount(LhProgress, { props: { percentage: 100 } }).classes()).toContain(
      'lh-progress--success',
    )
    expect(mount(LhProgress, { props: { percentage: 99 } }).classes()).not.toContain(
      'lh-progress--success',
    )
  })

  it('applies explicit status classes', () => {
    expect(mount(LhProgress, { props: { percentage: 50, status: 'warning' } }).classes()).toContain(
      'lh-progress--warning',
    )
    expect(
      mount(LhProgress, { props: { percentage: 50, status: 'exception' } }).classes(),
    ).toContain('lh-progress--exception')
  })

  it('hides text when showText is false', () => {
    const wrapper = mount(LhProgress, {
      props: { percentage: 50, showText: false },
    })
    expect(wrapper.classes()).toContain('lh-progress--no-text')
    expect(wrapper.find('.lh-progress__text').exists()).toBe(false)
  })

  it('applies strokeWidth as bar height', () => {
    expect(
      mount(LhProgress, { props: { percentage: 50, strokeWidth: 12 } })
        .find('.lh-progress__bar')
        .attributes('style'),
    ).toContain('height: 12px')
  })

  it('uses string color and overrides status color', () => {
    // jsdom 会把内联样式里的 hex 归一化成 rgb()，断言按归一化形式比对
    expect(
      mount(LhProgress, { props: { percentage: 100, color: '#C4A35A' } })
        .find('.lh-progress__bar-inner')
        .attributes('style'),
    ).toContain('background-color: rgb(196, 163, 90)')
  })

  it('uses functional color', () => {
    expect(
      mount(LhProgress, { props: { percentage: 80, color: (p: number) => `rgb(${p}, 0, 0)` } })
        .find('.lh-progress__bar-inner')
        .attributes('style'),
    ).toContain('background-color: rgb(80, 0, 0)')
  })

  it('formats text via format prop', () => {
    expect(
      mount(LhProgress, { props: { percentage: 42, format: (p: number) => `进度 ${p}` } })
        .find('.lh-progress__text')
        .text(),
    ).toBe('进度 42')
  })

  it('renders text slot with percentage scope', () => {
    const wrapper = mount(LhProgress, {
      props: { percentage: 42 },
      slots: { text: '<template #text="{ percentage }">{{ percentage }} / 100</template>' },
    })
    expect(wrapper.find('.lh-progress__text').text()).toBe('42 / 100')
  })

  it('declares progressbar semantics with the clamped value', () => {
    const wrapper = mount(LhProgress, { props: { percentage: 42 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('42')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
    expect(wrapper.attributes('aria-valuetext')).toBe('42%')
  })

  it('downgrades circle type to line with a dev-time warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(LhProgress, { props: { percentage: 50, type: 'circle' } })
    expect(wrapper.classes()).toContain('lh-progress--line')
    expect(wrapper.find('.lh-progress__bar').exists()).toBe(true)
    expect(warn).toHaveBeenCalledTimes(1)
    // 告警只报一次
    mount(LhProgress, { props: { percentage: 50, type: 'circle' } })
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('passes customClass through to root', () => {
    expect(
      mount(LhProgress, { props: { percentage: 0, customClass: 'my-progress' } }).classes(),
    ).toContain('my-progress')
  })
})
