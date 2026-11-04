<template>
  <demo-page title="Image 图片">
    <demo-block title="基础用法">
      <!-- uni image 默认 320×240，尺寸用 sx 显式给出 -->
      <lh-image
        :src="imgSrc"
        alt="示例图片"
        :sx="{ w: '240px', h: '140px' }"
      />
    </demo-block>

    <demo-block title="fit 填充模式">
      <!-- fit 映射 uni image 的 mode：none / scale-down 为近似映射（见文档平台差异） -->
      <lh-image
        v-for="fit in fits"
        :key="fit"
        :src="imgSrc"
        :alt="`fit=${fit}`"
        :fit="fit"
        :sx="{ w: '110px', h: '80px' }"
      />
    </demo-block>

    <demo-block title="内置圆角">
      <!-- 圆角由 share 样式源内置（--lh-border-radius-small），无需配置 -->
      <lh-image
        :src="imgSrc"
        alt="内置小圆角"
        :sx="{ w: '240px', h: '140px' }"
      />
    </demo-block>

    <demo-block title="懒加载">
      <!-- 微信端 lazy-load 仅对 page 与 scroll-view 下的 image 生效，演示放 scroll-view 里 -->
      <scroll-view
        scroll-y
        class="lazy-scroll"
      >
        <lh-image
          v-for="i in 4"
          :key="i"
          :src="`${imgSrc}?random=${i}`"
          :alt="`懒加载图片 ${i}`"
          lazy
          :sx="{ w: '240px', h: '120px', mb: 1 }"
        />
      </scroll-view>
    </demo-block>

    <demo-block title="加载失败">
      <lh-image
        :src="badSrc"
        alt="默认失败占位"
        :sx="{ w: '240px', h: '140px' }"
      />
      <lh-image
        :src="badSrc"
        alt="自定义失败占位"
        :sx="{ w: '240px', h: '140px' }"
      >
        <template #error>
          自定义失败占位
        </template>
      </lh-image>
    </demo-block>

    <demo-block title="点击预览">
      <!-- preview 开启后点击拉起 uni.previewImage 原生预览（全端可用） -->
      <lh-image
        :src="imgSrc"
        alt="可预览图片"
        preview
        :preview-src-list="previewList"
        :sx="{ w: '240px', h: '140px' }"
      />
      <lh-image
        :src="imgSrc"
        alt="单图预览（未传预览列表时退化为 [src]）"
        preview
        :sx="{ w: '140px', h: '140px' }"
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhImageFit } from '../../components/lh-image/types'

const fits: LhImageFit[] = ['fill', 'contain', 'cover', 'none', 'scale-down']
// 演示用占位图（实际项目换成自己的资源地址；小程序开发工具需勾选
// 「不校验合法域名」或把域名加入 downloadFile 合法域名后才能加载外链图）
const imgSrc = 'https://picsum.photos/240/140'
const badSrc = 'https://invalid.example.com/not-found.png'
const previewList = [
  'https://picsum.photos/600/400?random=1',
  'https://picsum.photos/600/400?random=2',
  'https://picsum.photos/600/400?random=3',
]
</script>

<style>
.lazy-scroll {
  width: 100%;
  height: 140px;
}
</style>
