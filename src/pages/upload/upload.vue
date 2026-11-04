<template>
  <demo-page title="Upload 上传">
    <demo-block title="基础用法（图片上传）">
      <!-- request 由 adapter 的 createLhUploadRequest 生成：
           微信端走 uni.uploadFile、H5 端走 XHR；目标域名需在微信后台
           「服务器域名 - uploadFile」登记，开发工具可勾选「不校验合法域名」 -->
      <lh-upload
        :request="imageRequest"
        accept="image/*"
      />
    </demo-block>

    <demo-block title="多选与数量 / 大小限制">
      <!-- multiple 开启底层选择的多选；maxCount 3 张、maxSize 2MB，
           超限文件被跳过并在下方给出 errorMessage（文案走语言包 upload.*） -->
      <lh-upload
        :request="imageRequest"
        accept="image/*"
        multiple
        :max-count="3"
        :max-size="2 * 1024 * 1024"
      />
    </demo-block>

    <demo-block title="accept 类型限制">
      <!-- 扩展名规则（.png/.jpg）在 uni 端无法传给原生选择面板，
           由选择后的校验兜底拒绝不合规则的文件（见文档「平台差异」） -->
      <lh-upload
        :request="imageRequest"
        accept=".png,.jpg"
      />
    </demo-block>

    <demo-block title="视频上传">
      <!-- accept 含 video/* 或 .mp4 等视频规则时走 chooseMedia(视频) / chooseVideo -->
      <lh-upload
        :request="videoRequest"
        accept="video/*"
      />
    </demo-block>

    <demo-block title="拖拽上传（仅 H5）">
      <!-- 小程序无 HTML5 拖放：drag 在 MP 端不生效，触发区退化为点击上传 -->
      <lh-upload
        :request="imageRequest"
        drag
        accept="image/*"
        multiple
      />
    </demo-block>

    <demo-block title="仅选择不上传">
      <!-- 不传 request：只做本地选择与校验，文件列表停在 ready 状态，
           由使用方自行处理（例如配合自己的上传通道） -->
      <lh-upload accept="image/*" />
    </demo-block>

    <demo-block title="禁用">
      <lh-upload
        :request="imageRequest"
        accept="image/*"
        disabled
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import { createLhUploadRequest } from '../../adapter/upload'

// 演示用接口地址（换成自己的服务；真机需在微信后台配置 uploadFile 合法域名）
const imageRequest = createLhUploadRequest('https://upload.example.com/image', { name: 'file' })
const videoRequest = createLhUploadRequest('https://upload.example.com/video', { name: 'file' })
</script>
