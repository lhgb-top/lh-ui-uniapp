/**
 * 上传适配 —— 封装 uni 的文件选择与上传 API（组件层不直接调 uni API，红线 4）
 *
 * plus 的上传跑在浏览器 DOM 环境里：`<input type="file">` 选文件、request prop
 * 由使用方用 XHR / fetch 实现。小程序没有 File 与 input：选择只能走
 * uni.chooseImage / uni.chooseMedia / uni.chooseVideo（回调式，返回临时文件路径，
 * 不返回 File 对象），上传走 uni.uploadFile（multipart，只认 filePath）。
 * 本模块把这两块平台差异收成 Promise 接口：
 *
 * - chooseLhFiles(options) —— 统一文件选择，accept 归一到 image / video / 混合
 * - createLhUploadRequest(action, config) —— 生成可直接喂组件 request prop 的
 *   上传函数（小程序端走 uni.uploadFile，H5 端走 XHR，条件编译双端分发）
 *
 * 【chooseMedia 存在性守卫】chooseMedia（图片视频混合选择）只在微信基础库
 * 2.10+ 与新版 uni 运行时上存在，且 @dcloudio/types 未收录其类型。所有调用
 * 先 `typeof uni.chooseMedia === 'function'` 守卫再按本地最小类型调用，
 * 不可用时回退 chooseImage / chooseVideo（chooseVideo 全端可用）。
 *
 * 【上传错误语义】uni 回调式 API 的 fail 只给 errMsg，统一归一成 Error；
 * 用户取消（errMsg 含 cancel）由 isLhChooseCancelled 单独识别，不算错误。
 *
 * 注意：本文件里的条件编译指令必须独占一行；注释正文不要出现指令字面量。
 */

/** uni 端文件句柄：选择类 API 返回的临时文件（小程序无 File 对象，只有临时路径） */
export interface LhUniFile {
  /** 临时文件路径（H5 为 blob / data URL；微信端为 wxfile:// 临时路径） */
  path: string
  /** 文件名（底层 API 不返回时由路径派生） */
  name: string
  /** 字节大小（部分端不返回，0 表示未知） */
  size: number
  /** MIME 类型（底层 API 不返回，由扩展名推断） */
  type: string
}

/** 统一上传结果（与 share 的 LhUploadRequest 出参同构） */
export interface LhUploadResult {
  /** 服务端返回的文件地址 */
  url?: string
  /** 服务端返回的原始响应体（透传，url 缺失时供使用方自行解析） */
  data?: string
}

/** uni 端上传请求函数签名（对齐 share 的 LhUploadRequest，file 换成 LhUniFile） */
export type LhUniUploadRequest = (options: {
  file: LhUniFile
  onProgress: (percent: number) => void
}) => Promise<LhUploadResult>

/** chooseMedia 的最小类型契约（@dcloudio/types 未收录该 API，按微信文档声明子集） */
interface LhChooseMediaSuccess {
  tempFiles: Array<{
    tempFilePath: string
    size?: number
    fileType?: 'image' | 'video'
  }>
  type: 'image' | 'video' | 'mix'
}
interface LhChooseMediaOptions {
  count?: number
  mediaType?: Array<'image' | 'video' | 'mix'>
  sourceType?: Array<'album' | 'camera'>
  camera?: 'back' | 'front'
  success?: (result: LhChooseMediaSuccess) => void
  fail?: (result: { errMsg?: string }) => void
}
type LhChooseMedia = (options: LhChooseMediaOptions) => void

/** uni.uploadFile 返回的任务句柄（最小契约） */
interface LhUploadTaskLike {
  onProgressUpdate?(callback: (result: { progress: number }) => void): void
  abort?(): void
}
type LhUploadFileFn = (options: Record<string, unknown>) => LhUploadTaskLike

/** 底层选择 API 的数量上限（微信 chooseMedia count 封顶 99） */
const LH_UNI_CHOOSE_MAX_COUNT = 99

/** 图片扩展名（用于 accept 归一与 MIME 推断） */
const LH_IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg']

/** 视频扩展名（accept 含 video/* 或这些扩展名时走视频选择） */
const LH_VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp']

/** 扩展名 → MIME 映射（chooseImage / chooseVideo 均不返回 MIME，统一由此推断） */
const LH_MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.m4v': 'video/mp4',
  '.3gp': 'video/3gpp',
}

function getUni(): Record<string, unknown> | undefined {
  return typeof uni === 'undefined' ? undefined : (uni as unknown as Record<string, unknown>)
}

/** 把 uni 回调式 fail（只给 errMsg）归一成 Error */
function toLhError(reason: unknown): Error {
  if (reason instanceof Error) return reason
  const errMsg = (reason as { errMsg?: string })?.errMsg
  return new Error(errMsg ?? String(reason))
}

/**
 * 用户取消选择不算错误（uni 的 fail 回调里 errMsg 含 cancel）。
 * 组件层据此静默，而不是往 errorMessage 里写「选择失败」。
 */
export function isLhChooseCancelled(reason: unknown): boolean {
  const message = toLhError(reason).message
  return /cancel/i.test(message)
}

/** 由临时路径派生文件名（去查询串 / 哈希、取最后一段目录） */
function deriveLhFileName(path: string): string {
  const clean = path.split('?')[0].split('#')[0]
  const segs = clean.split(/[\\/]/)
  return segs[segs.length - 1] || 'file'
}

/** 由文件名扩展名推断 MIME（未知扩展名回退 application/octet-stream） */
export function inferLhMimeType(name: string): string {
  const dot = name.lastIndexOf('.')
  if (dot < 0) return 'application/octet-stream'
  return LH_MIME_BY_EXT[name.slice(dot).toLowerCase()] ?? 'application/octet-stream'
}

/**
 * 选择结果项 → LhUniFile。chooseImage / chooseMedia 各端字段不一
 * （path / tempFilePath / H5 端的真实 File），统一在这里归一：
 * 缺路径（且造不出 blob URL）的项直接丢弃，避免脏数据进列表。
 */
function toLhUniFile(entry: unknown): LhUniFile | null {
  if (entry instanceof File) {
    // H5：chooseImage 的 tempFiles 项可能是真实 File（无 path 字段），造 blob URL 给上传用
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return null
    return {
      path: URL.createObjectURL(entry),
      name: entry.name,
      size: entry.size,
      type: entry.type || inferLhMimeType(entry.name),
    }
  }
  const raw = entry as { path?: string; tempFilePath?: string; size?: number; name?: string }
  const path = raw.path ?? raw.tempFilePath
  if (!path) return null
  const name = raw.name || deriveLhFileName(path)
  return { path, name, size: raw.size ?? 0, type: inferLhMimeType(name) }
}

type LhChooseKind = 'image' | 'video' | 'media'

/**
 * accept 归一：uni 的选择 API 只认媒体类型（image / video），扩展名与 MIME
 * 规则按语义映射到 image / video / 混合。非媒体规则（如 .txt）映射为 image，
 * 选择后由组件层的 isFileRejected 兜底拒绝（uni 无任意文件选择能力）。
 */
function classifyLhAccept(accept: string[]): LhChooseKind {
  if (accept.length === 0) return 'media'
  let image = false
  let video = false
  for (const rule of accept) {
    const r = rule.toLowerCase().trim()
    if (r.startsWith('image/') || LH_IMAGE_EXTS.includes(r)) image = true
    if (r.startsWith('video/') || LH_VIDEO_EXTS.includes(r)) video = true
  }
  if (image && video) return 'media'
  if (video) return 'video'
  return 'image'
}

export interface LhChooseOptions {
  /** 归一后的 accept 规则（string[]，空数组表示不限，映射到媒体类型） */
  accept?: string[]
  /** 允许多选（false 时固定 count=1） */
  multiple?: boolean
  /** 数量上限（0 / 未传视为不限，仍受底层 API 上限约束） */
  maxCount?: number
}

/**
 * 拉起原生文件选择（统一 Promise 接口）。
 *
 * - 图片类 → chooseMedia（可用时，mediaType ['image']）否则 chooseImage
 * - 视频类 → chooseMedia（可用时，mediaType ['video']）否则 chooseVideo
 * - 混合 / 不限 → chooseMedia（可用时，mediaType ['image', 'video']）
 *   否则 chooseImage 兼容回退（accept 含视频规则的场景见上方归一说明）
 *
 * @throws Error 底层 API 不存在（存在性守卫，明确报错不静默）/ 用户取消 / 调用失败
 */
/** uni 选择 API 的最小调用契约（options + success/fail 回调，返回 void） */
type LhChooseFn = (options: Record<string, unknown>) => void

export function chooseLhFiles(options: LhChooseOptions = {}): Promise<LhUniFile[]> {
  const u = getUni()
  if (!u) return Promise.reject(new Error('uni 运行时不存在，无法拉起文件选择'))

  const kind = classifyLhAccept(options.accept ?? [])
  const multiple = options.multiple ?? false
  const limit = (options.maxCount ?? 0) > 0 ? (options.maxCount as number) : LH_UNI_CHOOSE_MAX_COUNT
  const count = multiple ? Math.min(limit, LH_UNI_CHOOSE_MAX_COUNT) : 1

  const chooseMedia = typeof u.chooseMedia === 'function' ? (u.chooseMedia as LhChooseMedia) : undefined
  const chooseImage = typeof u.chooseImage === 'function' ? (u.chooseImage as LhChooseFn) : undefined
  const chooseVideo = typeof u.chooseVideo === 'function' ? (u.chooseVideo as LhChooseFn) : undefined

  // 存在性守卫：目标 API 不可用时明确报错（不静默降级，便于使用方排查）
  if (kind === 'video' && !chooseMedia && !chooseVideo) {
    return Promise.reject(new Error('当前端不支持 uni.chooseVideo / uni.chooseMedia，无法选择视频'))
  }
  if (kind !== 'video' && !chooseMedia && !chooseImage) {
    return Promise.reject(new Error('当前端不支持 uni.chooseImage / uni.chooseMedia，无法选择文件'))
  }

  return new Promise<LhUniFile[]>((resolve, reject) => {
    const fail = (reason: unknown) => reject(toLhError(reason))
    const done = (entries: unknown[]) =>
      resolve(entries.map(toLhUniFile).filter((file): file is LhUniFile => file !== null))

    if (chooseMedia) {
      const mediaType: Array<'image' | 'video'> =
        kind === 'media' ? ['image', 'video'] : kind === 'video' ? ['video'] : ['image']
      chooseMedia({
        count,
        mediaType,
        sourceType: ['album', 'camera'],
        success: (result) => done(result.tempFiles),
        fail,
      })
      return
    }

    if (kind === 'video' && chooseVideo) {
      chooseVideo({
        sourceType: ['album', 'camera'],
        success: (result: { tempFilePath: string; size?: number }) =>
          done([{ path: result.tempFilePath, size: result.size }]),
        fail,
      })
      return
    }

    // 存在性守卫：chooseImage 由上方 typeof 收敛，此处兜底明确报错（TS 需显式收窄）
    if (!chooseImage) {
      reject(new Error('当前运行时不支持 chooseImage，无法拉起文件选择'))
      return
    }
    chooseImage({
      count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result: { tempFiles: unknown[] }) => done(result.tempFiles),
      fail,
    })
  })
}

/**
 * 把 H5 拖拽落下的真实 File 包成 LhUniFile（blob URL 作为上传路径）。
 * 小程序无 HTML5 拖放，本函数只会在 H5 分支被调用。
 */
export function wrapLhNativeFile(file: File): LhUniFile {
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return { path: '', name: file.name, size: file.size, type: file.type || inferLhMimeType(file.name) }
  }
  return {
    path: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    type: file.type || inferLhMimeType(file.name),
  }
}

/** 上传传输层配置（createLhUploadRequest 与两个传输函数共用） */
export interface LhUploadConfig {
  /** 文件表单字段名（默认 file） */
  name?: string
  /** 额外请求头（小程序端由 uni.uploadFile 的 header 携带） */
  header?: Record<string, string>
  /** 额外表单字段 */
  formData?: Record<string, string>
}

/** 服务端响应归一：JSON 且含字符串 url 时取出，其余整体作 data 透传 */
function parseLhUploadResult(raw: string): LhUploadResult {
  const data = String(raw ?? '')
  try {
    const parsed = JSON.parse(data)
    if (parsed && typeof parsed === 'object' && typeof parsed.url === 'string') {
      return { url: parsed.url, data }
    }
  } catch {
    // 非 JSON 响应：交给使用方按 data 自行解析
  }
  return { data }
}

/**
 * H5 端上传：XHR + FormData。
 * 底层选择/拖拽产出的临时路径是 blob / data URL，先取回二进制再 multipart 发送，
 * 与小程序端 uni.uploadFile 的 multipart 语义对齐（服务端收到的字段名同为 name）。
 */
export function uploadLhFileViaXhr(
  action: string,
  file: LhUniFile,
  config: LhUploadConfig = {},
  onProgress?: (percent: number) => void,
): Promise<LhUploadResult> {
  return (async () => {
    const blob = await fetch(file.path).then((response) => response.blob())
    return new Promise<LhUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', action)
      for (const [key, value] of Object.entries(config.header ?? {})) {
        xhr.setRequestHeader(key, value)
      }
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(parseLhUploadResult(String(xhr.response ?? '')))
        } else {
          reject(new Error(`上传失败：HTTP ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error('上传失败：网络错误'))
      xhr.onabort = () => reject(new Error('上传失败：请求被中止'))

      const form = new FormData()
      for (const [key, value] of Object.entries(config.formData ?? {})) {
        form.append(key, value)
      }
      form.append(config.name ?? 'file', blob, file.name)
      xhr.send(form)
    })
  })()
}

/**
 * 小程序端上传：uni.uploadFile（multipart，只接收临时文件路径）。
 *
 * 【域名白名单】uploadFile 的目标域名必须在微信公众平台「开发管理 - 服务器
 * 域名」的 uploadFile 合法域名里登记，否则真机请求会被拦截；H5 端无此限制。
 */
export function uploadLhFileViaUni(
  action: string,
  file: LhUniFile,
  config: LhUploadConfig = {},
  onProgress?: (percent: number) => void,
): Promise<LhUploadResult> {
  const u = getUni()
  if (!u || typeof u.uploadFile !== 'function') {
    return Promise.reject(new Error('当前端不支持 uni.uploadFile'))
  }
  return new Promise<LhUploadResult>((resolve, reject) => {
    const task = (u.uploadFile as LhUploadFileFn)({
      url: action,
      filePath: file.path,
      name: config.name ?? 'file',
      header: config.header,
      formData: config.formData,
      success: (result: unknown) => {
        const res = result as { statusCode?: number; data?: string }
        if ((res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300) {
          resolve(parseLhUploadResult(res.data ?? ''))
        } else {
          reject(new Error(`上传失败：HTTP ${res.statusCode}`))
        }
      },
      fail: (reason: unknown) => reject(toLhError(reason)),
    })
    task?.onProgressUpdate?.((progress) => {
      onProgress?.(progress.progress)
    })
  })
}

/**
 * 统一上传入口：条件编译双端分发（H5 → XHR，小程序 → uni.uploadFile）。
 * 组件层与使用方一般经 createLhUploadRequest 间接调用。
 */
export function uploadLhFile(
  action: string,
  file: LhUniFile,
  config: LhUploadConfig = {},
  onProgress?: (percent: number) => void,
): Promise<LhUploadResult> {
  // #ifdef H5
  return uploadLhFileViaXhr(action, file, config, onProgress)
  // #endif
  // #ifndef H5
  return uploadLhFileViaUni(action, file, config, onProgress)
  // #endif
}

/**
 * 生成上传请求函数（直接作为组件 request prop 使用）。
 *
 * @example
 * const request = createLhUploadRequest('https://upload.example.com/file', {
 *   name: 'file',
 *   header: { Authorization: 'Bearer xxx' },
 * })
 */
export function createLhUploadRequest(
  action: string,
  config: LhUploadConfig = {},
): LhUniUploadRequest {
  return ({ file, onProgress }) => uploadLhFile(action, file, config, onProgress)
}
