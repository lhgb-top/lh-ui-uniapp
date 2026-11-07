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
  { name: 'Layout 布局容器', desc: '上中下 / 侧栏 / 方向', path: '/pages/layout/layout' },
  { name: 'Button 按钮', desc: '类型 / 尺寸 / 状态 / 图标', path: '/pages/button/button' },
  { name: 'Icon 图标', desc: '37 个内置图标 + 自定颜色尺寸', path: '/pages/icon/icon' },
  { name: 'Tag 标签', desc: '类型 / 可关闭 / 圆角', path: '/pages/tag/tag' },
  { name: 'Input 输入框', desc: '类型 / 字数统计 / 清除', path: '/pages/input/input' },
  { name: 'Switch 开关', desc: '受控 / 禁用 / 加载', path: '/pages/switch/switch' },
  { name: 'InputNumber 计数器', desc: '范围 / 步长 / 精度 / 严格步进', path: '/pages/input-number/input-number' },
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
  { name: 'Breadcrumb 面包屑', desc: '分隔符 / 跳转 / 折叠', path: '/pages/breadcrumb/breadcrumb' },
  { name: 'Skeleton 骨架屏', desc: '加载占位 / 头像 / 动画', path: '/pages/skeleton/skeleton' },
  { name: 'Alert 警告', desc: '语义类型 / 图标 / 可关闭', path: '/pages/alert/alert' },
  { name: 'Avatar 头像', desc: '图片 / 文字 / 图标回退', path: '/pages/avatar/avatar' },
  { name: 'Empty 空状态', desc: '默认插画 / 自定义图片 / 插槽', path: '/pages/empty/empty' },
  { name: 'Card 卡片', desc: '封面 / 阴影 / 可点击 / 加载', path: '/pages/card/card' },
  { name: 'Progress 进度条', desc: '状态 / 颜色 / 格式化', path: '/pages/progress/progress' },
  { name: 'Statistic 统计数值', desc: '精度 / 千分位 / 前后缀', path: '/pages/statistic/statistic' },
  { name: 'Descriptions 描述列表', desc: '列数 / 跨列 / 边框 / 插槽', path: '/pages/descriptions/descriptions' },
  { name: 'Spinner 加载圈', desc: '尺寸 / 颜色 / 双端载体', path: '/pages/spinner/spinner' },
  { name: 'Tabs 标签页', desc: '外观 / 位置 / 禁用 / 可关闭', path: '/pages/tabs/tabs' },
  { name: 'Segmented 分段器', desc: '数据驱动 / 禁用项 / 块级宽度', path: '/pages/segmented/segmented' },
  { name: 'Grid 栅格', desc: '24 栅格 / 间距 / 偏移 / 响应式', path: '/pages/grid/grid' },
  { name: 'Collapse 折叠面板', desc: '手风琴 / 受控 / 禁用 / 插槽', path: '/pages/collapse/collapse' },
  { name: 'Timeline 时间线', desc: '时间戳 / 语义类型 / 空心 / 交替', path: '/pages/timeline/timeline' },
  { name: 'Steps 步骤条', desc: '当前步骤 / 竖向 / 图标 / 可点击', path: '/pages/steps/steps' },
  { name: 'Rate 评分', desc: '半星 / 只读 / 分数文本 / 自定义字符', path: '/pages/rate/rate' },
  { name: 'Pagination 分页', desc: '页码 / 省略 / 跳页 / 条数切换', path: '/pages/pagination/pagination' },
  { name: 'Image 图片', desc: '填充模式 / 懒加载 / 失败占位 / 预览', path: '/pages/image/image' },
  { name: 'Dropdown 下拉菜单', desc: '触发方式 / 禁用项 / 受控 / 最大高度', path: '/pages/dropdown/dropdown' },
  { name: 'Drawer 抽屉', desc: '四方向 / 尺寸 / 遮罩关闭 / 底部安全区', path: '/pages/drawer/drawer' },
  { name: 'Popover 弹出框', desc: '富内容 / 触发方式 / 方位 / 宽度', path: '/pages/popover/popover' },
  { name: 'Notification 通知', desc: '命令式通知 / 四角 / 自动关闭', path: '/pages/notification/notification' },
  { name: 'Popconfirm 气泡确认', desc: '三种语气 / 自定义文案 / 受控 / 图标', path: '/pages/popconfirm/popconfirm' },
  { name: 'Calendar 日历', desc: '单选 / 一段时间 / 多选 / 范围约束', path: '/pages/calendar/calendar' },
  { name: 'Menu 导航菜单', desc: '竖向 / 横向 / 手风琴 / 折叠 / 分组', path: '/pages/menu/menu' },
  { name: 'Cascader 级联选择器', desc: '多列面板 / 多选 / 过滤 / 路径回显', path: '/pages/cascader/cascader' },
  { name: 'TimePicker 时间选择器', desc: '时/分/秒面板 / 范围 / 步进 / 确认', path: '/pages/time-picker/time-picker' },
  { name: 'Slider 滑块', desc: '范围 / 步长吸附 / 刻度 / 禁用', path: '/pages/slider/slider' },
  { name: 'DatePicker 日期选择器', desc: '日历面板 / 月年模式 / 格式化 / 区间回显', path: '/pages/date-picker/date-picker' },
  { name: 'Tree 树形控件', desc: '展开收起 / 复选级联 / 懒加载 / 虚拟化', path: '/pages/tree/tree' },
  { name: 'TreeSelect 树形选择器', desc: '树面板选择 / 多选级联 / 回显', path: '/pages/tree-select/tree-select' },
  { name: 'Transfer 穿梭框', desc: '双列勾选穿梭 / 搜索过滤 / 禁用', path: '/pages/transfer/transfer' },
  { name: 'Upload 上传', desc: '图片 / 视频 / 进度 / 限制 / 拖拽仅 H5', path: '/pages/upload/upload' },
  { name: 'Affix 固定', desc: '吸顶 / 吸底 / scroll-view 变体', path: '/pages/affix/affix' },
  { name: 'BackTop 返回顶部', desc: '阈值 / 平滑 / scroll-view 变体', path: '/pages/backtop/backtop' },
  { name: 'Anchor 锚点导航', desc: '联动 / 纵横 / scroll-view 变体', path: '/pages/anchor/anchor' },
  { name: 'VirtualList 虚拟列表', desc: '定高 / 动态高度 / 万条渲染', path: '/pages/virtual-list/virtual-list' },
  { name: 'Table 表格', desc: '排序 / 筛选 / 虚拟滚动 / 固定列仅 H5', path: '/pages/table/table' },
  { name: 'Result 结果页', desc: '四态 / 自定义图标 / 插槽', path: '/pages/result/result' },
  { name: 'Text 排版文本', desc: '级别 / 语义 / 省略 / 复制', path: '/pages/text/text' },
  { name: 'Link 链接', desc: '类型 / 下划线 / 禁用 / 前后缀', path: '/pages/link/link' },
  { name: 'InputTag 标签输入', desc: '触发键 / 上限 / 去重 / 点删', path: '/pages/input-tag/input-tag' },
  { name: 'Autocomplete 自动补全', desc: '过滤 / 键盘导航 / 选中回调', path: '/pages/autocomplete/autocomplete' },
  { name: 'Mentions 提及', desc: '@ 触发 / 过滤 / 多行', path: '/pages/mentions/mentions' },
  { name: 'ColorPicker 颜色选择器', desc: '色板 / 滑杆 / 透明度 / 预设', path: '/pages/color-picker/color-picker' },
  { name: 'ConfigProvider 全局配置', desc: '主题变量 / 暗色 / 组件级主题 / 尺寸', path: '/pages/config-provider/config-provider' },
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
