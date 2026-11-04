import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import LhUpload from '../../src/components/lh-upload/lh-upload.vue'
import type { LhUniUploadRequest } from '../../src/adapter/upload'

/** uni 回调式选择 API 的最小选项形态（success / fail 回调式，与真实 API 一致） */
interface UniChooseOptions {
  count?: number
  mediaType?: Array<'image' | 'video' | 'mix'>
  sourceType?: Array<'album' | 'camera'>
  success?: (result: unknown) => void
  fail?: (result: { errMsg?: string }) => void
}

/**
 * tests/setup.ts 的 uni 桩没有 chooseImage / chooseVideo / chooseMedia
 * （此前没有组件用到它们），这里按 image.spec.ts 同款方式补上。jsdom 下
 * 各桩只关心调用与否与入参形态，success / fail 由用例按场景驱动。
 */
const chooseImageMock = vi.fn()
const chooseVideoMock = vi.fn()
;(globalThis as Record<string, unknown>).uni = {
  ...((globalThis as Record<string, unknown>).uni as Record<string, unknown> | undefined),
  chooseImage: chooseImageMock,
  chooseVideo: chooseVideoMock,
}

/** 让下一次 chooseImage 调用同步返回给定的临时文件项 */
function pickImage(entries: Array<{ tempFilePath?: string; path?: string; size?: number }>): void {
  chooseImageMock.mockImplementationOnce((options: UniChooseOptions) =>
    options.success?.({ tempFiles: entries }),
  )
}

/** 让下一次 chooseVideo 调用同步返回一个临时视频文件 */
function pickVideo(tempFilePath: string, size = 2048): void {
  chooseVideoMock.mockImplementationOnce((options: UniChooseOptions) =>
    options.success?.({ tempFilePath, size }),
  )
}

/** 微任务 + 定时器冲刷：openChooser / startUpload 都是异步，保证 Promise 链走完 */
function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

beforeEach(() => {
  chooseImageMock.mockReset()
  chooseVideoMock.mockReset()
})

afterEach(() => {
  // chooseMedia 仅个别用例按需注入，清理掉避免污染后续用例
  const uniGlobal = (globalThis as Record<string, unknown>).uni as
    | Record<string, unknown>
    | undefined
  if (uniGlobal && 'chooseMedia' in uniGlobal) {
    delete uniGlobal.chooseMedia
  }
})

describe('LhUpload', () => {
  it('renders the trigger with the default hint and button semantics', () => {
    const wrapper = mount(LhUpload)
    expect(wrapper.find('.lh-upload').exists()).toBe(true)
    // 默认提示文案走 share locales 的 upload.select（中文真源）
    expect(wrapper.find('.lh-upload__hint').text()).toBe('选择文件')
    expect(wrapper.find('.lh-upload__trigger').attributes('role')).toBe('button')
    expect(wrapper.find('.lh-upload__trigger').attributes('tabindex')).toBe('0')
    // 组件按 APG 显式输出 aria-disabled="false"（Boolean 化的 aria 属性不省略）
    expect(wrapper.find('.lh-upload__trigger').attributes('aria-disabled')).toBe('false')
  })

  it('shows the drag hint when drag is set', () => {
    const wrapper = mount(LhUpload, { props: { drag: true } })
    expect(wrapper.find('.lh-upload__hint').text()).toBe('将文件拖到此处，或点击上传')
  })

  it('renders the custom trigger slot and drops the default hint', () => {
    const wrapper = mount(LhUpload, { slots: { default: '点我选图' } })
    expect(wrapper.find('.lh-upload__trigger').text()).toBe('点我选图')
    expect(wrapper.find('.lh-upload__hint').exists()).toBe(false)
  })

  it('applies customClass and sx to the root node', () => {
    const wrapper = mount(LhUpload, {
      props: { customClass: 'my-upload', sx: { w: '240px' } },
    })
    expect(wrapper.classes()).toContain('my-upload')
    expect(wrapper.attributes('style')).toContain('width: 240px')
  })

  it('opens chooseImage on trigger click and appends the picked file', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'image/*' } })
    pickImage([{ tempFilePath: 'wxfile://tmp/a.png', size: 1024 }])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()

    // 单选：count 固定 1；sourceType 相册 + 相机
    expect(chooseImageMock).toHaveBeenCalledWith(
      expect.objectContaining({ count: 1, sourceType: ['album', 'camera'] }),
    )
    // 文件项：类名按 ready 状态落值，名称由临时路径派生，大小走 formatFileSize
    const item = wrapper.find('.lh-upload__file')
    expect(item.classes()).toContain('lh-upload__file--ready')
    expect(wrapper.find('.lh-upload__file-name').text()).toBe('a.png')
    expect(wrapper.find('.lh-upload__file-size').text()).toBe('1.0 KB')
    expect(wrapper.find('.lh-upload__list').attributes('aria-label')).toBe('文件列表')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect((wrapper.emitted('change')?.[0]?.[0] as Array<{ name: string }>)).toHaveLength(1)
  })

  it('requests count = maxCount when multiple is set', async () => {
    const wrapper = mount(LhUpload, {
      props: { accept: 'image/*', multiple: true, maxCount: 3 },
    })
    pickImage([])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(chooseImageMock).toHaveBeenCalledWith(expect.objectContaining({ count: 3 }))
  })

  it('routes video accept to chooseVideo', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'video/*' } })
    pickVideo('wxfile://tmp/v.mp4')
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(chooseVideoMock).toHaveBeenCalledTimes(1)
    expect(chooseImageMock).not.toHaveBeenCalled()
    expect(wrapper.find('.lh-upload__file-name').text()).toBe('v.mp4')
    expect(wrapper.find('.lh-upload__file-size').text()).toBe('2.0 KB')
  })

  it('prefers chooseMedia when available and maps accept to mediaType', async () => {
    const chooseMediaMock = vi.fn((options: UniChooseOptions) =>
      options.success?.({ tempFiles: [{ tempFilePath: 'wxfile://tmp/a.png', size: 100 }], type: 'image' }),
    )
    ;(globalThis as Record<string, unknown>).uni = {
      ...((globalThis as Record<string, unknown>).uni as Record<string, unknown>),
      chooseMedia: chooseMediaMock,
    }

    const wrapper = mount(LhUpload, { props: { accept: 'image/*' } })
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(chooseMediaMock).toHaveBeenCalledWith(
      expect.objectContaining({ mediaType: ['image'], count: 1 }),
    )
    expect(wrapper.find('.lh-upload__file-name').text()).toBe('a.png')

    // 图片 + 视频混合规则 → mediaType ['image', 'video']
    chooseMediaMock.mockClear()
    const mixed = mount(LhUpload, { props: { accept: ['image/*', 'video/*'] } })
    await mixed.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(chooseMediaMock).toHaveBeenCalledWith(
      expect.objectContaining({ mediaType: ['image', 'video'] }),
    )
  })

  it('rejects files beyond maxSize and shows the locale error', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'image/*', maxSize: 100 } })
    pickImage([{ tempFilePath: 'wxfile://tmp/big.png', size: 1024 }])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(wrapper.find('.lh-upload__file').exists()).toBe(false)
    expect(wrapper.find('.lh-upload__error').text()).toBe('文件超出大小限制')
    expect(wrapper.find('.lh-upload__error').attributes('role')).toBe('alert')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('stops appending beyond maxCount and shows the locale error', async () => {
    const wrapper = mount(LhUpload, {
      props: { accept: 'image/*', multiple: true, maxCount: 1 },
    })
    pickImage([
      { tempFilePath: 'wxfile://tmp/a.png', size: 100 },
      { tempFilePath: 'wxfile://tmp/b.png', size: 100 },
    ])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    // 第一张进列表，第二张触发数量限制
    expect(wrapper.findAll('.lh-upload__file')).toHaveLength(1)
    expect(wrapper.find('.lh-upload__error').text()).toBe('超出数量限制')
  })

  it('falls back to isFileRejected for extension rules the native picker cannot enforce', async () => {
    const wrapper = mount(LhUpload, { props: { accept: '.png' } })
    pickImage([{ tempFilePath: 'wxfile://tmp/a.txt', size: 100 }])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    // .txt 不在 .png 规则内，选择后被兜底拒绝
    expect(wrapper.find('.lh-upload__file').exists()).toBe(false)
    expect(wrapper.find('.lh-upload__error').text()).toBe('文件类型不允许')
  })

  it('stays silent when the native picker is cancelled', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'image/*' } })
    chooseImageMock.mockImplementationOnce((options: UniChooseOptions) =>
      options.fail?.({ errMsg: 'chooseImage:fail cancel' }),
    )
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(wrapper.find('.lh-upload__error').exists()).toBe(false)
    expect(wrapper.find('.lh-upload__file').exists()).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('drives the request lifecycle: uploading progress → success', async () => {
    let release!: (value: { url: string }) => void
    const request: LhUniUploadRequest = ({ onProgress }) => {
      onProgress(50)
      return new Promise<{ url: string }>((resolve) => {
        release = resolve
      })
    }
    const wrapper = mount(LhUpload, { props: { request, accept: 'image/*' } })
    pickImage([{ tempFilePath: 'wxfile://tmp/a.png', size: 1024 }])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()

    // uploading 中间态：进度条语义与百分比，change 已触发一次（change 随每次列表变化）
    expect(wrapper.find('.lh-upload__file').classes()).toContain('lh-upload__file--uploading')
    const bar = wrapper.find('.lh-upload__progress')
    expect(bar.attributes('role')).toBe('progressbar')
    expect(bar.attributes('aria-valuenow')).toBe('50')
    expect(bar.attributes('aria-valuemin')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('100')
    expect(wrapper.find('.lh-upload__progress-bar').attributes('style')).toContain('width: 50%')

    release({ url: 'https://cdn.example.com/a.png' })
    await flush()
    expect(wrapper.find('.lh-upload__file').classes()).toContain('lh-upload__file--success')
    expect(wrapper.find('.lh-upload__file-success').text()).toBe('✓')
    const done = wrapper.emitted('success')?.[0]?.[0] as { url?: string }
    expect(done.url).toBe('https://cdn.example.com/a.png')
    expect(wrapper.emitted('change')?.length).toBeGreaterThanOrEqual(2)
  })

  it('marks the file as fail and emits error when the request rejects', async () => {
    const request: LhUniUploadRequest = () => Promise.reject(new Error('网络错误'))
    const wrapper = mount(LhUpload, { props: { request, accept: 'image/*' } })
    pickImage([{ tempFilePath: 'wxfile://tmp/a.png', size: 1024 }])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(wrapper.find('.lh-upload__file').classes()).toContain('lh-upload__file--fail')
    expect(wrapper.find('.lh-upload__file-error').text()).toBe('网络错误')
    const error = wrapper.emitted('error')?.[0]
    expect((error?.[0] as { name: string }).name).toBe('a.png')
    expect(error?.[1]).toBe('网络错误')
  })

  it('removes a file and emits remove / change', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'image/*' } })
    pickImage([{ tempFilePath: 'wxfile://tmp/a.png', size: 1024 }])
    await wrapper.find('.lh-upload__trigger').trigger('click')
    await flush()
    expect(wrapper.find('.lh-upload__file-remove').attributes('aria-label')).toBe('移除 a.png')

    await wrapper.find('.lh-upload__file-remove').trigger('click')
    expect(wrapper.find('.lh-upload__file').exists()).toBe(false)
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(typeof (wrapper.emitted('remove')?.[0]?.[0] as string)).toBe('string')
    // 移除同样触发 change（列表变化）
    const lastChange = wrapper.emitted('change')?.at(-1)?.[0] as Array<unknown>
    expect(lastChange).toHaveLength(0)
  })

  it('blocks chooser and keyboard activation when disabled', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'image/*', disabled: true } })
    expect(wrapper.classes()).toContain('lh-upload--disabled')
    expect(wrapper.find('.lh-upload__trigger').attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('.lh-upload__trigger').attributes('tabindex')).toBe('-1')

    await wrapper.find('.lh-upload__trigger').trigger('click')
    await wrapper.find('.lh-upload__trigger').trigger('keydown', { key: 'Enter' })
    expect(chooseImageMock).not.toHaveBeenCalled()
    expect(wrapper.find('.lh-upload__file').exists()).toBe(false)
  })

  it('opens the chooser via Enter / Space (H5 only) and ignores other keys', async () => {
    const wrapper = mount(LhUpload, { props: { accept: 'image/*' } })
    await wrapper.find('.lh-upload__trigger').trigger('keydown', { key: 'Escape' })
    expect(chooseImageMock).not.toHaveBeenCalled()

    pickImage([{ tempFilePath: 'wxfile://tmp/a.png', size: 100 }])
    await wrapper.find('.lh-upload__trigger').trigger('keydown', { key: 'Enter' })
    await flush()
    expect(chooseImageMock).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.lh-upload__file-name').text()).toBe('a.png')
  })

  it('toggles the dragover modifier on dragover / dragleave (H5 only)', async () => {
    const wrapper = mount(LhUpload, { props: { drag: true } })
    // jsdom 无 DragEvent 构造器，VTU trigger 回退到 Event，直触发即可
    await wrapper.find('.lh-upload').trigger('dragover')
    expect(wrapper.classes()).toContain('lh-upload--dragover')
    await wrapper.find('.lh-upload').trigger('dragleave')
    expect(wrapper.classes()).not.toContain('lh-upload--dragover')
  })

  it('feeds dropped Files through the unified pipeline (H5 only)', async () => {
    const wrapper = mount(LhUpload, { props: { drag: true } })
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    // jsdom 无 DataTransfer：dataTransfer 以普通对象挂在 Event 上（VTU 的 createDOMEvent
    // 在无 DragEvent 的环境回退 Event，自定义属性可赋值）
    await wrapper.find('.lh-upload').trigger('drop', { dataTransfer: { files: [file] } })
    await flush()
    // 未传 request：文件停在 ready，大小按字节格式化（File 内容 1 字节 → 1 B）
    expect(wrapper.find('.lh-upload__file-name').text()).toBe('a.png')
    expect(wrapper.find('.lh-upload__file-size').text()).toBe('1 B')
    expect(wrapper.find('.lh-upload__file').classes()).toContain('lh-upload__file--ready')
  })
})
