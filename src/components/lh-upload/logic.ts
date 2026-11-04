import { computed, ref } from 'vue'
import {
  createUploadUid,
  exceedsMaxCount,
  exceedsMaxSize,
  formatFileSize,
  getUploadClassNames,
  getUploadDropzoneAria,
  getUploadFileClassNames,
  isFileRejected,
  normalizeUploadAccept,
  patchUploadFile,
  removeUploadFile,
} from '@lh-ui/share/core/upload'
import { isActivationKey, sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import { chooseLhFiles, isLhChooseCancelled, wrapLhNativeFile } from '@/adapter/upload'
import type { LhEmitFn } from '@/types/emit'
import type { LhUniFile, LhUploadResult } from '@/adapter/upload'
import type { LhUploadFile, LhUploadFileStatus } from '@lh-ui/share/core/upload'
import type { LhUploadResolvedProps } from './types'

/**
 * Upload 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 文件选择走 adapter 的 chooseLhFiles（chooseImage / chooseMedia / chooseVideo
 *   原生 API），plus 的 `<input type="file">` 在小程序无等价物
 * - request 的出参仍是 url（与 plus 同口径），入参 file 换成 LhUniFile
 * - 拖拽上传仅 H5：dragover / dragleave / drop 处理体由条件编译守卫，
 *   小程序产物里不调用（MP 无 HTML5 拖放，AGENTS 坑 5）
 * - 键盘激活（Enter / Space 唤起选择）仅 H5
 * - 选择取消（errMsg 含 cancel）静默，不写 errorMessage
 * - 文案走 share locales 的 upload.* 键（十语言齐备，仓内不持有文案）
 */
export function useLhUpload(
  props: LhUploadResolvedProps,
  emit: LhEmitFn<'change' | 'success' | 'error' | 'remove'>,
) {
  const files = ref<LhUploadFile[]>([])
  const errorMessage = ref('')
  const dragOver = ref(false)

  /** accept 入口归一：字符串（'.png,.jpg'）与数组统一成 string[]，下游只面对一种形态 */
  const acceptList = computed(() => normalizeUploadAccept(props.accept))

  /** 触发区文案：drag 模式给拖拽提示，否则给选择提示 */
  const triggerHint = computed(() =>
    props.drag
      ? lhlocale.t('upload.drag', '将文件拖到此处，或点击上传')
      : lhlocale.t('upload.select', '选择文件'),
  )

  const listLabel = computed(() => lhlocale.t('upload.list', '文件列表'))
  const failLabel = computed(() => lhlocale.t('upload.fail', '上传失败'))
  const removeLabel = computed(() => lhlocale.t('upload.remove', '移除'))

  /**
   * 触发区无障碍属性包摊开（MP 模板不支持 v-bind 对象，AGENTS 坑 16）：
   * 契约由 share 的 getUploadDropzoneAria 决定，这里只逐项绑定。
   */
  const triggerRole = computed(() => {
    const role = getUploadDropzoneAria(props.disabled).role
    return typeof role === 'string' ? role : undefined
  })
  const triggerAriaDisabled = computed(() =>
    Boolean(getUploadDropzoneAria(props.disabled)['aria-disabled']),
  )
  const triggerTabindex = computed(() => (props.disabled ? -1 : 0))

  /** 根修饰类（lh-upload 基类在模板写死，这里滤掉只留修饰类） */
  const uploadModifiers = computed(() =>
    getUploadClassNames({ dragOver: dragOver.value, disabled: !!props.disabled }).filter(
      (name) => name !== 'lh-upload',
    ),
  )

  const uploadStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** 文件项类名（base 类不在模板写死，这里整体返回） */
  function fileClasses(status: LhUploadFileStatus): string[] {
    return getUploadFileClassNames(status)
  }

  /** 点击触发区：拉起原生选择（chooseImage / chooseMedia / chooseVideo） */
  async function openChooser(): Promise<void> {
    if (props.disabled) return
    try {
      const picked = await chooseLhFiles({
        accept: acceptList.value,
        multiple: props.multiple,
        maxCount: props.maxCount,
      })
      addFiles(picked)
    } catch (reason) {
      if (!isLhChooseCancelled(reason)) {
        errorMessage.value = reason instanceof Error ? reason.message : String(reason)
      }
    }
  }

  /** 键盘激活仅 H5（MP 无键盘事件；条件编译守卫，MP 产物不调用） */
  function handleTriggerKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.disabled) return
    if (isActivationKey(event)) {
      event.preventDefault()
      void openChooser()
    }
    // #endif
  }

  function addFiles(incoming: LhUniFile[]): void {
    errorMessage.value = ''
    for (const file of incoming) {
      if (exceedsMaxCount(files.value.length, props.maxCount)) {
        errorMessage.value = lhlocale.t('upload.exceedCount', '超出数量限制')
        break
      }
      // share 的 exceedsMaxSize 签名收 DOM File，函数内部只读 size；
      // uni 端选择产物没有 File 对象，按结构断言传入（core 不拷贝、直接消费）
      const asFile = { size: file.size } as File
      if (exceedsMaxSize(asFile, props.maxSize)) {
        errorMessage.value = lhlocale.t('upload.exceedSize', '文件超出大小限制')
        continue
      }
      // LhUniFile 带 { name, type }，直接喂 share 的 accept 校验
      if (isFileRejected(file, acceptList.value)) {
        errorMessage.value = lhlocale.t('upload.rejectType', '文件类型不允许')
        continue
      }
      const record: LhUploadFile = {
        uid: createUploadUid(),
        name: file.name,
        size: file.size,
        status: 'ready',
        percent: 0,
      }
      files.value = [...files.value, record]
      emit('change', files.value)
      void startUpload(record, file)
    }
  }

  async function startUpload(record: LhUploadFile, file: LhUniFile): Promise<void> {
    if (!props.request) return
    files.value = patchUploadFile(files.value, record.uid, { status: 'uploading', percent: 0 })
    try {
      const result: LhUploadResult = await props.request({
        file,
        onProgress: (percent) => {
          files.value = patchUploadFile(files.value, record.uid, { percent })
        },
      })
      files.value = patchUploadFile(files.value, record.uid, {
        status: 'success',
        percent: 100,
        url: result.url,
      })
      const done = files.value.find((item) => item.uid === record.uid)
      if (done) emit('success', done)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      files.value = patchUploadFile(files.value, record.uid, { status: 'fail', error: reason })
      const failed = files.value.find((item) => item.uid === record.uid)
      if (failed) emit('error', failed, reason)
    }
    emit('change', files.value)
  }

  function remove(uid: string): void {
    files.value = removeUploadFile(files.value, uid)
    emit('remove', uid)
    emit('change', files.value)
  }

  /** dragover 仅 H5：MP 无 HTML5 拖放（条件编译守卫，MP 产物不调用） */
  function handleDragOver(): void {
    // #ifdef H5
    if (props.disabled) return
    dragOver.value = true
    // #endif
  }

  function handleDragLeave(): void {
    // #ifdef H5
    dragOver.value = false
    // #endif
  }

  function handleDrop(event: DragEvent): void {
    // #ifdef H5
    dragOver.value = false
    if (props.disabled) return
    const dropped = event.dataTransfer?.files
    if (!dropped) return
    // H5 拖拽落下的是真实 File：包成 LhUniFile（blob URL 作上传路径）再走统一流程
    addFiles(Array.from(dropped).map(wrapLhNativeFile))
    // #endif
  }

  return {
    files,
    errorMessage,
    triggerHint,
    listLabel,
    failLabel,
    removeLabel,
    triggerRole,
    triggerAriaDisabled,
    triggerTabindex,
    uploadModifiers,
    uploadStyle,
    fileClasses,
    formatFileSize,
    openChooser,
    handleTriggerKeydown,
    addFiles,
    remove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
