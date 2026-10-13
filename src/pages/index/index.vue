<template>
  <demo-page title="lh-ui uniapp">
    <view
      v-for="item in list"
      :key="item.path"
      class="index-item"
      @click="go(item.path)"
    >
      <text class="index-item__name">{{ item.name }}</text>
      <text class="index-item__desc">{{ item.desc }}</text>
      <lh-icon
        name="arrow-right"
        :size="16"
        class="index-item__arrow"
      />
    </view>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'

const list = [
  { name: 'Button 按钮', desc: '类型 / 尺寸 / 状态 / 图标', path: '/pages/button/button' },
  { name: 'Icon 图标', desc: '37 个内置图标 + 自定颜色尺寸', path: '/pages/icon/icon' },
  { name: 'Tag 标签', desc: '类型 / 可关闭 / 圆角', path: '/pages/tag/tag' },
  { name: 'Input 输入框', desc: '类型 / 字数统计 / 清除', path: '/pages/input/input' },
  { name: 'Switch 开关', desc: '受控 / 禁用 / 加载', path: '/pages/switch/switch' },
  { name: 'Checkbox 多选', desc: '单选框 / 多选组', path: '/pages/checkbox/checkbox' },
  { name: 'Radio 单选', desc: '单选 / 单选组', path: '/pages/radio/radio' },
  { name: 'Form 表单', desc: '校验 / 标签位置 / 重置', path: '/pages/form/form' },
  { name: 'Select 选择器', desc: '单选 / 可过滤 / 方位', path: '/pages/select/select' },
  { name: 'Tooltip 提示', desc: 'click 触发 / 方位 / 延迟', path: '/pages/tooltip/tooltip' },
  { name: 'Dialog 对话框', desc: '定位 / 全屏 / 遮罩关闭', path: '/pages/dialog/dialog' },
  { name: 'Message / Loading 服务', desc: '命令式消息与加载遮罩', path: '/pages/services/services' },
  { name: 'Space 间距', desc: '方向 / 档位 / 对齐 / 换行', path: '/pages/space/space' },
  { name: 'Divider 分割线', desc: '方向 / 文案 / 虚线', path: '/pages/divider/divider' },
  { name: 'Badge 徽标', desc: '类型 / 数值 / 小红点', path: '/pages/badge/badge' },
  { name: 'Skeleton 骨架屏', desc: '加载占位 / 头像 / 动画', path: '/pages/skeleton/skeleton' },
  { name: 'Avatar 头像', desc: '图片 / 文字 / 图标回退', path: '/pages/avatar/avatar' },
  { name: 'Empty 空状态', desc: '默认插画 / 自定义图片 / 插槽', path: '/pages/empty/empty' },
  { name: 'Card 卡片', desc: '封面 / 阴影 / 可点击 / 加载', path: '/pages/card/card' },
  { name: 'Progress 进度条', desc: '状态 / 颜色 / 格式化', path: '/pages/progress/progress' },
]

function go(path: string) {
  uni.navigateTo({ url: path })
}
</script>

<style>
.index-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 40px 14px 14px;
  background-color: #ffffff;
  border-radius: 8px;
}
.demo-page--dark .index-item {
  background-color: #262626;
}
.index-item__name {
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
}
.demo-page--dark .index-item__name {
  color: #e8e6e1;
}
.index-item__desc {
  font-size: 12px;
  color: #8a867d;
}
.index-item__arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  color: #b5b1a8;
  transform: translateY(-50%);
}
</style>
