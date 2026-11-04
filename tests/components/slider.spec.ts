import { describe, expect, it, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '../mount'
import LhSlider from '../../src/components/lh-slider/lh-slider.vue'

/**
 * jsdom 无真实布局：getBoundingClientRect 全为 0，轨道宽度 0 会让位移计算产生
 * 0 除而被跳过（同 rate / steps 的 jsdom 处理方式）。这里把轨道矩形 mock 成
 * left=0 / width=100 的可计算形态，位移换算等价于「百分比即像素」
 */
function mockTrackRect(width = 100, left = 0) {
  return vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    left,
    top: 0,
    right: left + width,
    bottom: 2,
    width,
    height: 2,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('LhSlider', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('渲染根类名与轨道 / 填充条 / 触点', () => {
    const wrapper = mount(LhSlider, { props: { modelValue: 30 } })
    expect(wrapper.find('.lh-slider').exists()).toBe(true)
    expect(wrapper.find('.lh-slider__track').exists()).toBe(true)
    expect(wrapper.find('.lh-slider__bar').exists()).toBe(true)
    expect(wrapper.findAll('.lh-slider__button-wrapper')).toHaveLength(1)
  })

  it('modelValue 为空时按 min 初始化', async () => {
    const wrapper = mount(LhSlider, { props: { modelValue: null } })
    await nextTick()
    expect(wrapper.find('.lh-slider__bar').attributes('style')).toContain('width: 0%')
  })

  it('受控回显：外部改 modelValue 后滑块跟随', async () => {
    const wrapper = mount(LhSlider, { props: { modelValue: 30 } })
    await wrapper.setProps({ modelValue: 80 })
    expect(wrapper.find('.lh-slider__bar').attributes('style')).toContain('width: 80%')
    expect(wrapper.find('.lh-slider__button-wrapper').attributes('aria-valuenow')).toBe('80')
  })

  it('范围模式渲染双触点，填充条取两端百分比', () => {
    const wrapper = mount(LhSlider, { props: { modelValue: [20, 60], range: true } })
    const wrappers = wrapper.findAll('.lh-slider__button-wrapper')
    expect(wrappers).toHaveLength(2)
    const style = wrapper.find('.lh-slider__bar').attributes('style')
    expect(style).toContain('left: 20%')
    expect(style).toContain('width: 40%')
  })

  it('marks 刻度按数值排序并落 left 定位', () => {
    const wrapper = mount(LhSlider, {
      props: { marks: { 0: '0', 50: '半程', 100: '满' } },
    })
    const marks = wrapper.findAll('.lh-slider__mark')
    expect(marks).toHaveLength(3)
    expect(marks[1].attributes('style')).toContain('left: 50%')
    expect(marks[1].text()).toBe('半程')
  })

  it('show-input 回显当前值（范围模式为 [起, 止]）', () => {
    const plain = mount(LhSlider, { props: { modelValue: 30, showInput: true } })
    expect(plain.find('.lh-slider__input-text').text()).toBe('30')
    const ranged = mount(LhSlider, {
      props: { modelValue: [20, 60], range: true, showInput: true },
    })
    expect(ranged.find('.lh-slider__input-text').text()).toBe('[20, 60]')
  })

  it('touch 拖动：吸附到 step 并在松手时提交', async () => {
    const rectMock = mockTrackRect()
    const wrapper = mount(LhSlider, { props: { modelValue: 0 } , attachTo: document.body })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    await thumb.trigger('touchstart')
    await thumb.trigger('touchmove', { touches: [{ clientX: 55 }] })
    await nextTick()
    // 拖动中只改内部态、不提交
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.lh-slider__bar').attributes('style')).toContain('width: 55')
    await thumb.trigger('touchend')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([55])
    expect(wrapper.emitted('change')?.[0]).toEqual([55])
    rectMock.mockRestore()
    wrapper.unmount()
  })

  it('step 步长吸附（step=10，55 → 60）', async () => {
    const rectMock = mockTrackRect()
    const wrapper = mount(LhSlider, { props: { modelValue: 0, step: 10 } , attachTo: document.body })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    await thumb.trigger('touchstart')
    await thumb.trigger('touchmove', { touches: [{ clientX: 55 }] })
    await thumb.trigger('touchend')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([60])
    rectMock.mockRestore()
    wrapper.unmount()
  })

  it('touch 越界钳制到 [min, max]', async () => {
    const rectMock = mockTrackRect()
    const wrapper = mount(LhSlider, { props: { modelValue: 0, min: 0, max: 100 } , attachTo: document.body })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    await thumb.trigger('touchstart')
    await thumb.trigger('touchmove', { touches: [{ clientX: 150 }] })
    await thumb.trigger('touchend')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([100])
    rectMock.mockRestore()
    wrapper.unmount()
  })

  it('范围模式：拖动端越过另一端时交换，保持 [早, 晚]', async () => {
    const rectMock = mockTrackRect()
    const wrapper = mount(LhSlider, { props: { modelValue: [20, 60], range: true } , attachTo: document.body })
    const thumbs = wrapper.findAll('.lh-slider__button-wrapper')
    // 拴住起始端（index 0）一路拖到 80（> 60）：两端交换
    await thumbs[0].trigger('touchstart')
    await thumbs[0].trigger('touchmove', { touches: [{ clientX: 80 }] })
    await nextTick()
    expect(wrapper.find('.lh-slider__bar').attributes('style')).toContain('left: 60%')
    await thumbs[0].trigger('touchend')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[60, 80]])
    rectMock.mockRestore()
    wrapper.unmount()
  })

  it('鼠标拖动（H5 路径）：document 级 move / up 完成提交', async () => {
    const rectMock = mockTrackRect()
    const wrapper = mount(LhSlider, { props: { modelValue: 10 } , attachTo: document.body })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    await thumb.trigger('mousedown')
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 40 }))
    // ensureTrackRect 的 promise 链 + 渲染调度需跨一拍宏任务（真实浏览器中
    // mousedown 已预热度量，mousemove 近乎同步落值；这里等链路收敛）
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
    expect(wrapper.find('.lh-slider__bar').attributes('style')).toContain('width: 40')
    document.dispatchEvent(new MouseEvent('mouseup'))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([40])
    rectMock.mockRestore()
    wrapper.unmount()
  })

  it('禁用：类名 / tabindex=-1 / touch 与键盘均不响应', async () => {
    const rectMock = mockTrackRect()
    const wrapper = mount(LhSlider, { props: { modelValue: 30, disabled: true } })
    expect(wrapper.find('.lh-slider').classes()).toContain('lh-slider--disabled')
    expect(wrapper.find('.lh-slider__button-wrapper').attributes('tabindex')).toBe('-1')
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    await thumb.trigger('touchstart')
    await thumb.trigger('touchmove', { touches: [{ clientX: 80 }] })
    await thumb.trigger('touchend')
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    rectMock.mockRestore()
    wrapper.unmount()
  })

  it('键盘步进（H5 行为）：方向键 / Home / End', async () => {
    const wrapper = mount(LhSlider, { props: { modelValue: 30 } , attachTo: document.body })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([31])
    await wrapper.setProps({ modelValue: 30 })
    await thumb.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
    await wrapper.setProps({ modelValue: 30 })
    await thumb.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([100])
  })

  it('范围模式键盘不交换两端：起始端钳在 [min, 结束端]', async () => {
    const wrapper = mount(LhSlider, { props: { modelValue: [20, 60], range: true } , attachTo: document.body })
    const thumbs = wrapper.findAll('.lh-slider__button-wrapper')
    await thumbs[0].trigger('keydown', { key: 'End' })
    // 直达极值被结束端（60）钳住，不交换
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[60, 60]])
  })

  it('aria 契约：role=slider + 值域（share getSliderThumbAria）', () => {
    const wrapper = mount(LhSlider, { props: { modelValue: 30, min: 0, max: 100 } })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    expect(thumb.attributes('role')).toBe('slider')
    expect(thumb.attributes('aria-valuemin')).toBe('0')
    expect(thumb.attributes('aria-valuemax')).toBe('100')
    expect(thumb.attributes('aria-valuenow')).toBe('30')
    expect(thumb.attributes('aria-valuetext')).toBe('30')
    expect(thumb.attributes('aria-label')).toBe('滑块')
  })

  it('范围模式 aria-label 区分起始 / 结束两端', () => {
    const wrapper = mount(LhSlider, { props: { modelValue: [20, 60], range: true } })
    const thumbs = wrapper.findAll('.lh-slider__button-wrapper')
    const labels = thumbs.map((t) => t.attributes('aria-label'))
    expect(labels).toEqual(['起始滑块', '结束滑块'])
  })
})
