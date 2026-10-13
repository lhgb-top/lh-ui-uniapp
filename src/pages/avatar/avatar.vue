<template>
  <demo-page title="Avatar 头像">
    <demo-block title="形状与尺寸">
      <lh-avatar
        v-for="size in sizes"
        :key="size"
        :size="size"
        text="水"
        class="avatar-item"
      />
      <lh-avatar
        v-for="size in sizes"
        :key="`${size}-square`"
        :size="size"
        shape="square"
        text="墨"
        class="avatar-item"
      />
    </demo-block>

    <demo-block title="图片">
      <lh-avatar
        :src="badSrc"
        class="avatar-item"
      />
      <lh-avatar
        :src="imgSrc"
        class="avatar-item"
      />
    </demo-block>

    <demo-block title="图片加载失败回退">
      <lh-avatar
        :src="badSrc"
        icon="user"
        class="avatar-item"
      />
      <lh-avatar
        :src="badSrc"
        text="水墨"
        class="avatar-item"
      />
    </demo-block>

    <demo-block title="fit 裁剪模式">
      <lh-avatar
        v-for="fit in fits"
        :key="fit"
        :src="imgSrc"
        :fit="fit"
        shape="square"
        class="avatar-item"
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhAvatarFit } from '../../components/lh-avatar/types'

const sizes = ['mini', 'small', 'medium', 'large', 'x-large'] as const
const fits: LhAvatarFit[] = ['fill', 'contain', 'cover', 'none', 'scale-down']
// 演示用占位图（实际项目换成自己的资源地址）
const imgSrc = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4d8.png'
const badSrc = 'https://invalid.example.com/not-found.png'
</script>

<style>
.avatar-item {
  margin-right: 16px;
  margin-bottom: 8px;
}
</style>
