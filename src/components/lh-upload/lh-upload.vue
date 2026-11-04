<template>
  <view
    class="lh-upload"
    :class="[uploadModifiers, props.customClass]"
    :style="uploadStyle"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 触发区：点击拉起原生选择（chooseImage / chooseMedia / chooseVideo），
         drag 模式下整个根容器同时是 H5 拖放目标（MP 无 HTML5 拖放，见文档平台差异） -->
    <view
      class="lh-upload__trigger"
      :role="triggerRole"
      :tabindex="triggerTabindex"
      :aria-disabled="triggerAriaDisabled"
      :aria-label="triggerHint"
      @click="openChooser"
      @keydown="handleTriggerKeydown"
    >
      <slot>
        <text class="lh-upload__hint">{{ triggerHint }}</text>
      </slot>
    </view>

    <view
      v-if="files.length > 0"
      class="lh-upload__list"
      :aria-label="listLabel"
    >
      <view
        v-for="file in files"
        :key="file.uid"
        :class="fileClasses(file.status)"
      >
        <text class="lh-upload__file-name">{{ file.name }}</text>
        <text class="lh-upload__file-size">{{ formatFileSize(file.size) }}</text>

        <view
          v-if="file.status === 'uploading'"
          class="lh-upload__progress"
          role="progressbar"
          :aria-valuenow="file.percent"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <view
            class="lh-upload__progress-bar"
            :style="{ width: file.percent + '%' }"
          />
        </view>
        <text
          v-else-if="file.status === 'fail'"
          class="lh-upload__file-error"
        >
          {{ file.error || failLabel }}
        </text>
        <text
          v-else-if="file.status === 'success'"
          class="lh-upload__file-success"
        >✓</text>

        <view
          class="lh-upload__file-remove"
          :aria-label="removeLabel + ' ' + file.name"
          @click="remove(file.uid)"
        >
          <text>✕</text>
        </view>
      </view>
    </view>

    <text
      v-if="errorMessage"
      class="lh-upload__error"
      role="alert"
    >{{ errorMessage }}</text>
  </view>
</template>

<script lang="ts" setup>
import { LH_UPLOAD_MAX_SIZE } from '@lh-ui/share/core/upload'
import { useLhUpload } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhUploadFile } from '@lh-ui/share/core/upload'
import type { LhUploadProps } from './types'

defineOptions({
  name: 'LhUpload',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhUploadProps>(), {
  multiple: false,
  drag: false,
  disabled: false,
  accept: () => [],
  maxSize: LH_UPLOAD_MAX_SIZE,
  maxCount: 0,
  request: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  change: [files: LhUploadFile[]]
  success: [file: LhUploadFile]
  error: [file: LhUploadFile, reason: string]
  remove: [uid: string]
}>()

const {
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
  remove,
  handleDragOver,
  handleDragLeave,
  handleDrop,
} = useLhUpload(props, emit as LhEmitFn<'change' | 'success' | 'error' | 'remove'>)
</script>

<style src="./style.css"></style>
