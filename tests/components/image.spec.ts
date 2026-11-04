import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import LhImage from '../../src/components/lh-image/lh-image.vue'

const SRC = 'https://example.com/a.png'
const ALT = '示例图片'

/**
 * tests/setup.ts 的 uni 桩没有 previewImage（此前没有组件用到它）：
 * 图片预览走 uni.previewImage 原生 API（经 src/adapter/preview-image 适配层），
 * jsdom 无该 API，补一个空桩，断言只看调用与否与入参形态。
 */
const previewImageMock = vi.fn()
;(globalThis as Record<string, unknown>).uni = {
  ...((globalThis as Record<string, unknown>).uni as Record<string, unknown> | undefined),
  previewImage: previewImageMock,
}

beforeEach(() => {
  previewImageMock.mockReset()
})

describe('LhImage', () => {
  it('renders the uni image with alt and default cover mode', () => {
    const wrapper = mount(LhImage, { props: { src: SRC, alt: ALT } })
    const img = wrapper.find('.lh-image__inner')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(SRC)
    expect(img.attributes('alt')).toBe(ALT)
    expect(img.attributes('mode')).toBe('aspectFill')
    expect(wrapper.classes()).not.toContain('lh-image--error')
  })

  it('maps fit to uni image mode', () => {
    const cases: Record<string, string> = {
      fill: 'scaleToFill',
      contain: 'aspectFit',
      cover: 'aspectFill',
      none: 'center',
      'scale-down': 'aspectFit',
    }
    for (const [fit, mode] of Object.entries(cases)) {
      expect(
        mount(LhImage, { props: { src: SRC, alt: ALT, fit } })
          .find('.lh-image__inner')
          .attributes('mode'),
      ).toBe(mode)
      expect(
        mount(LhImage, { props: { src: SRC, alt: ALT, fit } })
          .find('.lh-image__inner')
          .attributes('class'),
      ).toContain(`lh-image__inner--${fit}`)
    }
  })

  it('passes lazy-load to the uni image only when lazy is set', () => {
    const on = mount(LhImage, { props: { src: SRC, alt: ALT, lazy: true } })
    expect(on.find('.lh-image__inner').attributes('lazy-load')).toBe('true')
    const off = mount(LhImage, { props: { src: SRC, alt: ALT } })
    expect(off.find('.lh-image__inner').attributes('lazy-load')).toBe('false')
  })

  it('switches to the error placeholder and emits error on load failure', async () => {
    const wrapper = mount(LhImage, { props: { src: SRC, alt: ALT } })
    await wrapper.find('.lh-image__inner').trigger('error')
    expect(wrapper.find('.lh-image__inner').exists()).toBe(false)
    expect(wrapper.find('.lh-image__error').exists()).toBe(true)
    // 默认文案走 share locales 的 image.error
    expect(wrapper.find('.lh-image__error').text()).toBe('加载失败')
    expect(wrapper.classes()).toContain('lh-image--error')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('supports the error slot', async () => {
    const wrapper = mount(LhImage, {
      props: { src: SRC, alt: ALT },
      slots: { error: '自定义失败占位' },
    })
    await wrapper.find('.lh-image__inner').trigger('error')
    expect(wrapper.find('.lh-image__error').text()).toBe('自定义失败占位')
  })

  it('error 后整棵图片卸载并换失败占位（与 plus 的 v-if=!error 同口径）', async () => {
    const wrapper = mount(LhImage, { props: { src: SRC, alt: ALT } })
    await wrapper.find('.lh-image__inner').trigger('error')
    expect(wrapper.classes()).toContain('lh-image--error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    // 图片整棵卸载（不再挂载 inner，无法在同一 src 上再触发 load）
    expect(wrapper.find('.lh-image__inner').exists()).toBe(false)
    expect(wrapper.find('.lh-image__error').exists()).toBe(true)
  })

  it('opens native preview with the given preview list on click', async () => {
    const previewSrcList = ['https://example.com/1.png', 'https://example.com/2.png']
    const wrapper = mount(LhImage, {
      props: { src: SRC, alt: ALT, preview: true, previewSrcList },
    })
    await wrapper.find('.lh-image__inner').trigger('click')
    expect(previewImageMock).toHaveBeenCalledTimes(1)
    expect(previewImageMock).toHaveBeenCalledWith({ urls: previewSrcList, current: 0 })
  })

  it('falls back the preview list to [src] when previewSrcList is absent', async () => {
    const wrapper = mount(LhImage, { props: { src: SRC, alt: ALT, preview: true } })
    await wrapper.find('.lh-image__inner').trigger('click')
    expect(previewImageMock).toHaveBeenCalledWith({ urls: [SRC], current: 0 })
  })

  it('does not open preview without the preview prop', async () => {
    const wrapper = mount(LhImage, { props: { src: SRC, alt: ALT } })
    await wrapper.find('.lh-image__inner').trigger('click')
    expect(previewImageMock).not.toHaveBeenCalled()
  })

  it('applies the previewable modifier, customClass and sx style', () => {
    const wrapper = mount(LhImage, {
      props: {
        src: SRC,
        alt: ALT,
        preview: true,
        customClass: 'my-image',
        sx: { w: '240px', h: '140px' },
      },
    })
    expect(wrapper.classes()).toContain('lh-image--previewable')
    expect(wrapper.classes()).toContain('my-image')
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.attributes('style')).toContain('height: 140px')
  })
})
