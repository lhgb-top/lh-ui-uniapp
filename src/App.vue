<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  // 应用启动完成
})

onShow(() => {
  // 应用从后台进入前台
})

onHide(() => {
  // 应用从前台进入后台
})
</script>

<style>
/* 全局令牌（:root 已净化为 page）与图标字体（base64 内嵌） */
@import './theme/index.css';
@import './icon/iconfont.css';
</style>
