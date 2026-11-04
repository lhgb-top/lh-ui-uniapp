import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhUploadFile, LhUploadFileStatus } from '@lh-ui/share/core/upload'
import type { LhUniUploadRequest } from '@/adapter/upload'

/**
 * Upload 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - plus 的 `request` 收 DOM File；uni 端选择产物只有临时路径，request 改收
 *   `LhUniFile`（path / name / size / type，见 src/adapter/upload.ts）。
 *   想直接用 `uni.uploadFile` 上传时，用 adapter 的 createLhUploadRequest
 *   生成 request 函数（H5 端自动走 XHR）
 * - `accept` 只能映射到媒体类型：`image/*` → chooseMedia/chooseImage，
 *   `video/*` / `.mp4` 等 → chooseMedia/chooseVideo；扩展名规则（如 `.png`）
 *   在原生选择面板上无法过滤，由选择后的 isFileRejected 兜底校验
 * - `drag` 仅 H5 有效（小程序无 HTML5 拖放，见文档「平台差异」）
 * - plus 没有的能力（action / headers / fileList / before-upload 等）不新增；
 *   上传地址等配置经 request 函数由使用方持有
 * - 增加 `customClass`：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 */
export interface LhUploadProps {
  /** 允许多选 */
  multiple?: boolean
  /** 拖拽上传区（仅 H5：MP 无 HTML5 拖放） */
  drag?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 允许的扩展名 / MIME：数组 `['.png', 'image/*']` 或逗号字符串 `'.png,.jpg'` */
  accept?: string[] | string
  /** 单个文件大小上限（字节） */
  maxSize?: number
  /** 数量上限（0 为不限） */
  maxCount?: number
  /** 上传请求函数（不传则只做本地选择与校验） */
  request?: LhUniUploadRequest
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhUploadResolvedProps = LhUploadProps & {
  multiple: boolean
  drag: boolean
  disabled: boolean
  maxSize: number
  maxCount: number
}

// 文件项类型真源在 share core，同名透传再导出（名字由 share 决定，跟随发版）
export type { LhUploadFile, LhUploadFileStatus }
